# BOM（Browser Object Model）

浏览器对象模型；涵盖了与浏览器窗口相关操作的所有对象和功能，包括navigato、location、document、history、screen、alert（）、console等API，BOM的所有操作都是通过window对象来访问和调用，调用时可以省略window；

### window对象

浏览器环境的顶级对象，代表浏览器窗口，所有全局变量和函数都是window对象的属性，window对象也内置的一些方法与属性；nodejs不存在window对象用global对象代替了，因此像alert（）对话框不起作用；

**视口尺寸**（仅包含UI页面，等于100vh/100vw）：window.innerHeight和window.innerWidth；

**整个浏览器窗口的尺寸**（包含地址栏，标签栏）：window.outerHeight和window.outerWidth；

### 定时器：

定时器的回调函数都是异步任务,不会阻塞文件的执行，定时器返回的是其唯一数字标识符，可通过此标识符删除定时器；

**间歇函数：setInterval**

间歇函数一定要记得清除；

```
let n = setInterval(function(){
   console.log('你好世界');
},1000);//一秒钟打印一次

setInterval返回的是数字型的序号，用来区分不同的间歇函数

clearInterval(n);//停止间歇函数
```

**延迟函数：setTimeout**

```
let n = setTimeout(function(){
   console.log('你好世界');
},1000);//一秒钟后输出，只执行一次

clearTimeout(n);//停止延迟函数
```

### location对象：

它拆分并保存当前浏览器url地址的各个组成部分

```
location.href='网址';//浏览器直接跳转到网址
```

```
location.search;//返回地址中携带的参数，即？后面的部分
```

```
location.hash;//返回#后面部分
```

```
location.reload();//刷新页面
location.reload(true);//强制刷新
```

### navigator对象：

浏览器相关信息对象；

#### clipboard剪切板API

剪切板操作是异步的，需要等待用户授权才能读取剪切板内容；

**读取剪切板内容：**

navigator.clipboard.readText()读取剪切板文本，返回一个Promise对象，如果被授权则Promise成功，传给then的参数即为剪切板字符串；

​ navigator.clipboard.read()读取任何类型的数字（如图片）

```
navigator.clipboard.readText().then(text => {
    console.log(text);
});

navigator.clipboard.read().then((clip) => {
    console.log(clip);
})
```

**写入剪切板内容：**

navigator.clipboard.writeText()返回一个Promise对象，没有参数传给then；

navigator.clipboard.write()一样；

```
navigator.clipboard.writeText('hello world')
```

**ClipbordItem**

剪切板数据对象，允许navigator.clipboard.read()，navigator.clipboard.write()写入的内容；参数为一个对象，以MIME类型作为键，Blob类型为数据；

```
const textItem = new ClipboardItem({
    'text/plain': new Blob(['Hello, world!'], { type: 'text/plain' })
});
navigator.clipboard.write([textItem]);
```

#### geolocation位置API

navigator.geolocation：根据GPS，Wi-Fi，基站定位，IP 获取用户位置信息（需要用户授权），但是由于桌面端上无GPS，Wi-Fi 数据库脏，代理等影响，获取的位置信息会有误；

**getCurrentPosition**：一次性获取当前位置，包括经纬度，海拔，速度，朝向等等；

```
navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback?,
  options?
);

//使用方法
const loc = navigator.geolocation.getCurrentPosition(
(pos) => {
    const { latitude, longitude } = pos.coords;
    console.log(latitude,longitude);
    fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=d129a4960217b3400a20c0eaa51bbc8a`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    })
},
() => {
    console.log("获取位置失败");
},
{
    enableHighAccuracy: true,//请求更高精度
});
```

**watchPosition**：持续追踪获取当前的位置信息；可以使用navigator.geolocation.clearWatch来停止获取位置

```
const id = navigator.geolocation.watchPosition(
  success,
  error,
  options
);

// 停止
navigator.geolocation.clearWatch(id);
```

### history对象：

主要管理历史记录，该对象与浏览器地址栏的操作相对应，如前进、后退、历史记录等

```
history.back();//后退一步
history.forward();//前进一步
history.go(参数);//参数为1前进一步，为-1后退一步
```

### 浏览器存储数据：

#### Web本地存储：

一种用户再浏览器存储数据的机制，存储在本地文件夹中

**localStorage：**

将数据永久存储在用户电脑中，除非手动删除，否则关闭浏览器数据也会存在

本地存储只能存储字符串，存进去的值会自动转化为字符串

在浏览器后台application选项卡中可以查找存储的值

```
localStorage.setItem('key',值);//存储一个key对应的值，可以用同样的方法修改key的值
localStorage.getItem('key');//根据key来查找对应的值
localStorage.removeItem('key');//删除
```

**sessionStorage：**关闭浏览器当前页面数据就被删除；

使用方法和localStorage一样

**存储复杂数据类型：**

需要将复杂数据类型转换城JSON字符串，读取时再转回对象

JSON（JavaScript on notation）一种轻量级的数据交互格式

```
localStorage.setItem('key',JSON.stringify(obj));//将obj对象转为字符串存储
localStorage.getItem('key');//打印obj对象的字符串
JSON.parse(localStorage.getItem('key'));//JSON.parse能将字符串转为对象
```

#### Cookie

存储在浏览器本地的一个很小的文本文件，用于在浏览器存储一些通用数据，比如登录信息，首选项，主题设置等；

内部以键值对的方式来存储信息（浏览器后台的Application可以查看）；

- name：名称，一个唯一确定的cookie的名称，cookie的名称必须经过URL编码。
- value：值，存储在cookie中的字符串值。值必须被URL编码。
- Domain：域，指明cookie对哪个域有效，所有向该域发送的请求都会包含这个信息。
- path：路径，对于指定域中的那个路径，应该向服务器发送cookie。
- Expires/Max-Age：有效期，表示cookie的有效期。
- HttpOnly：如果这个这个值设置为true，就不能通过JS脚本获取cookie的值。通过这个值可以有效防止XSS攻击。
- Secure：安全标志，指定后，cookie只有在使用SSL连接的时候才能发送到服务器。

在第一次访问网站时，浏览器发出请求，服务器响应请求后，会在响应头中添加一个Set-Cookie，并将Cookie放入响应请求中，Web服务器就会将一个加密的Cookie提供给浏览器

```
document.cookie = 'username=json;expires=Thu';//设置cookie
console.log(document.cookie);//读取cookie
```
