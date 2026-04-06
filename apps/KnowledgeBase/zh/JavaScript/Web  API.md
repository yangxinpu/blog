# 工具API

## Ascll码API

###  获取字符编码：charCodeAt()

参数为字符在字符串中的索引，返回 指定位置字符的编码值

```
let str = "A";

console.log(str.charCodeAt(0)); 
```

### String.fromCharCode()

用于将数字ASCLL码转换为字符

```
String.fromCharCode(65) // 'a'
console.log(String.fromCharCode(72,101,108,108,111)); //Hello
```

## Math数学API：

### 求最大值：`max()`

```
let arr = [1,2,3];
Math.max(...arr)//结果为3,数组一定要用展开运算符
Math.max(1,2,3,4,5,6);//结果为6
```

### 求最小值：`min()`

和max一样

### 求绝对值：`abs()`

```
let a = -100;
Math.abs(a);//结果为100
```

### 四舍五入：`round()`

```
let a = 3.5;
Math.round(a);//结果为4
```

### 随机数：`random()`

```
Math.random();//返回0~1的小数
```

的到max与min之间的小数：

```
Math.floor(Math.random()*(max-min+1)+min);
```

### 向下取整：`floor()`

表示向下取整，返回不大于x的最大整数，4.9=>4    -3.1=>-4

```
Math.floor();
```

### 向上取整：`ceil()`

```
Math.ceil()
```



## Date日期API

```
let date = new Date();
```

```
let date = new Date('2005-10-14 08:23:12')//指定返回时间
```

### 分别返回年月日星期时分秒：

```
let date = new Date();
date.getFullYear();//年
date.getMonth();//只会返回0~11月，即月份-1
date.getDate();//日
date.getDay();//星期，返回0~6的数字，可用数组转为大写
date.Hours();
date.Minutes();
date.Seconds();
```

### 获得当地时间：`toLocaleString()`

```
let date = new Date();
date.toLocaleString();
```

### 时间戳：

距1970.1.1的总毫秒数

```
let date = new Date();
date.getTime();//获得时间戳
```

静态方法：直接获取时间戳

```
let time = Date.now();
```

时间戳转化为当天的时分秒算法：

```
let time = Date.now()/1000;//将毫秒转化为秒钟
let hour = time/60/60%24;//除第一个60代表转为分钟，除第二个60代表转为小时，再相距的小时数24取余得结果
let minute = time/60%60;
let second = time%60;
```

## 交叉观察器API

用于异步检测（由浏览器后台线程监听交叉状态）目标元素与根元素是否发生交叉（即目标元素进入 / 离开视口，或与根元素重叠达到指定比例）；

使用IntersectionOberver构造函数创建交叉观察器，第一个参数交叉状态变化时触发的回调，第二个参数为交叉观察器配置对象；

**回调函数**：

第一个参数entries：为包含被观察元素交叉变化状态对象的数组，包含属性：

target：被观察的元素；

isIntersecting：目标元素是否与根元素交叉（进入 / 达到阈值）；

intersectionRatio：交叉比例（0~1），等于intersectionRect 面积 / 目标元素 boundingRect 面积；

intersectionRect：提供交叉区域的具体位置和尺寸，如交叉区域有多宽、在根元素的哪个位置）；

time：交叉状态发生时的时间戳；

第二个参数observer：为IntersectionOberver实例对象本身，有：`observe()`方法（增加观察的dom元素），`unobserve()`方法（停止观察某个dom元素），`disconnect()`方法（停止观察所有元素）；

**配置对象**：

root：用于指定视口元素，为null时表示根元素，视口元素必须是滚动元素；

rootMargin：扩展 / 缩小观察区域；

threshold：多触发点配置，如`threshold: [0, 0.5, 1]`表示目标元素刚进入（0%）、重叠 50%、完全进入（100%）时各触发一次回调；

delay：交叉时触发回调的延迟时间（单位ms）；

**实例属性和方法**

root：观察的根元素；

rootMargin：根元素的边距（扩大或缩小的范围）；

thresholds：触发回调的阈值数组；

delay：延迟时间

observe(target)：开始观测的目标元素；

unobserve(target)：停止观测的元素；

disconnect()：停止所有观测；

```
const lazyImg = document.querySelector('.lazyImg');
//回调函数
function callback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry, '进入了');
        } else {
            //元素离开会怎么样
        }
    })
}
//配置
const option = {
    root: null,//设置根元素，null代表为视口
    rootMargin: '10px',//是否提前触发，这里代表距离提前10px触发
}
const observer = new IntersectionObserver(callback,option);

observer.observe(lazyImg);//设置观察的对象
```

## 取色器API

EyeDropper，通过调用open方法，返回一个Promise，Promise对象成功后携带`{sRGBHex}`对象，sRGBHex就是颜色只；

```
    const btn = document.querySelector('button');
    const color = document.querySelector('#color');
    const dropper = new EyeDropper();
    console.log(dropper)

    btn.addEventListener('click', async () => {
        const {sRGBHex} = await dropper.open()
        color.style.backgroundColor = sRGBHex
    })
```

## 画中画API

画中画（PiP）允许网页内容在一个独立悬浮窗口中播放，脱离浏览器标签页存在，例如视频播放器，在线会议，小工具（计时器 / 股票 / 聊天）等；

### 传统视频画中画

只支持对视频进行画中画；

-  video.requestPictureInPicture()：开启画中画模式；
- document.exitPictureInPicture()：退出画中画模式；

```
<video id="video" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls></video>
<button id="btn">画中画</button>

<script>
const video = document.getElementById('video');
const btn = document.getElementById('btn');

btn.onclick = async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else {
    await video.requestPictureInPicture();
  }
};
</script>
```

**事件监听**

```
video.addEventListener('enterpictureinpicture', () => {
  console.log('进入 PiP');
});

video.addEventListener('leavepictureinpicture', () => {
  console.log('退出 PiP');
});
```

### Document PiP

允许你把整个 HTML 页面放进 PiP 窗口；

- documentPictureInPicture.requestWindow：返回一个新的 `Window` 对象（不会继承主页面样式），可以对这个 `Window` 对象进行DOM操作；

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Document PiP Demo</title>
  <style>
    body { font-family: sans-serif; }
    button { margin: 8px; }
  </style>
</head>
<body>

<h2>Main Page</h2>
<button id="open">打开 PiP</button>
<button id="send">发送消息到 PiP</button>

<script>
let pipWindow = null;
const channel = new BroadcastChannel('pip-channel');

document.getElementById('open').onclick = async () => {
  pipWindow = await documentPictureInPicture.requestWindow({
    width: 400,
    height: 300,
  });

  // 1. 写入基础 HTML
  pipWindow.document.body.innerHTML = `
    <div id="app">
      <h3>PiP Window</h3>
      <p id="msg">等待消息...</p>
      <button id="close">关闭</button>
    </div>
  `;

  // 2. 样式同步（关键）
  copyStyles(document, pipWindow.document);

  // 3. 绑定事件
  pipWindow.document.getElementById('close').onclick = () => {
    pipWindow.close();
  };

  // 4. 接收主页面消息
  const pipChannel = new BroadcastChannel('pip-channel');
  pipChannel.onmessage = (e) => {
    pipWindow.document.getElementById('msg').textContent = e.data;
  };

  // 5. 生命周期
  pipWindow.addEventListener('pagehide', () => {
    console.log('PiP 关闭');
    pipWindow = null;
  });
};

// 主页面发送消息
document.getElementById('send').onclick = () => {
  channel.postMessage('来自主页面的消息: ' + Date.now());
};

// 样式复制函数
function copyStyles(srcDoc, targetDoc) {
  [...srcDoc.styleSheets].forEach(sheet => {
    try {
      const rules = [...sheet.cssRules].map(r => r.cssText).join('');
      const style = document.createElement('style');
      style.textContent = rules;
      targetDoc.head.appendChild(style);
    } catch (e) {
      console.warn('无法访问跨域样式');
    }
  });
}
</script>

</body>
</html>
```



# 文件处理API

## FormData文件API

用于构造并表示一组键值对，这些键值对可以直接作为fetch或者XMLHttpRequest的请求体发送，主要用于表单提交和文件上传，本质：`multipart/form-data` 请求体的 JS 抽象；

原生支持文件上传，浏览器自动处理请求头（Content-Type: multipart/form-data; boundary=...， 永远不要手动设置 Content-Type）

### FormData实例

append(name, value, filename?)：添加字段（可重复，不会覆盖）；

```
formData.append('username', 'Alice');
```

set(name, value, filename?)：设置字段（覆盖），若已存在同名字段，会删除旧值，只保留新值

```
formData.set('username', 'Bob');
```

get(name)：根据键获取值，若有多个同名字段，只返回第一个

```
formData.get('username'); // 'Bob'
```

getAll(name)：根据键获取多个同名的值

```
formData.getAll('hobby'); // ['music', 'game']
```

has(name)：检测是否有该键

delete(name)：删除键值对

### 接收的值

不支持对象类型，要先序列化；

| 类型      | 行为                 |
| --------- | -------------------- |
| `string`  | 原样发送             |
| `number`  | **自动转为字符串**   |
| `boolean` | `"true"` / `"false"` |
| `File`    | 二进制文件           |
| `Blob`    | 二进制数据           |

**表单提交：**

自动读取name属性和表单控件当前值，disabled 的字段不会被包含，只会收集成功控件（successful controls）

```
<form id="myForm">
    <input name="username" value="Tom" />
    <input type="file" name="avatar" />
</form>
<script>
    const form = document.getElementById('myForm');
    const formData = new FormData(form);
</script>
```

**文件提交**：

```
const fileInput = document.querySelector('input[type=file]');
formData.append('file', fileInput.files[0]);
formData.append('file', file, 'custom-name.png');//指定文件名

fetch('/upload', {
  method: 'POST',
  body: formData
});
```



## Blob二进制API

Binary Large Object，是一种用于存储不可变的二进制数据对象，可用于以二进制表示任意类型的文件数据（如文本、图片、音频、视频等）；

**MIME类型：**多用途互联网邮件扩展，最初是为解决早期电子邮件仅能传输纯文本的局限而设计，后来逐渐扩展到整个互联网领域，成为标识文件类型、定义数据传输格式的标准，如text/plain，text/html，application/json，application/pdf等；

Blob()：第一个参数是需要存储的数据数组，第二个参数为可选的配置对象（可以配置MIME类型）；

```
const blob = new Blob(["Hello World"], { type: "text/plain"});
```

### blob实例：

**type**：返回MIME类型，如果无法确定其类型，则返回空字符串；

```
const blob = new Blob(["Hello World"], { type: "text/plain"})
console.log(blob.type);
```

**size**：返回数据的字节数；

```
const blob = new Blob(["Hello World"], { type: "text/plain"})
console.log(blob.size);
```

**分割：`slice()`**

切割旧的Blob，返回一个新的Blob；第一个和第二个参数分别是起始位置和终止位置，第三个参数为MIME类型；

```
const blob1 = new Blob(["Hello World"], { type: "text/plain;charset=utf-8" });
const blob2 = blob1.slice(0, 5, "text/plain;charset=utf-8");
```

**读取为文本：`text()`**

返回一个Promise对象，通过then的参数可获得文本内容；

```
const blob = new Blob(["<div>aaaa</div>"], { type: "text/html;charset=utf-8" });

blob.text().then((data) => {
    console.log(data);
})
```

**读取为二进制对象：`arrayBuffer()`**

返回一个Promise对象；arrayBuffer是一个固定长度的原始二进制数组；

```
const blob = new Blob(["<div>aaaa</div>"], { type: "text/html;charset=utf-8" });

blob.arrayBuffer().then(buffer => {
    console.log(buffer);
})
```



## File文件API

File的父类为Blob，可以使用Blob的所有方法，专门用来处理用户设备上的本地文件；

```
<input type="file" id="file">

//js代码
let file = document.querySelector('#file')

file.addEventListener('change',function(event){
    const file = event.target.files[0];//获得文件对象
})
```

### File实例：

name：文件名称；

type：MIME类型；

size：字节数；

lastModified：文件最后一次修改的时间戳；

```
file.name
file.type
file.size
file.lastModified
```

## FileReader读取文件API

用于异步读取File对象或Blob对象内容的API；

```
let file = document.querySelector('#file')

file.addEventListener('change',function(event){
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = (event)=>{
    console.log(event.target.result);
  }
  reader.onerror = () =>{
    console.log("文件读取失败")
  }
  reader.onprogress = (event)=>{
    console.log(event);
  }
})
```

### FileReader实例

**readAsText()**：读取为文本字符串；

**readAsDataURL()**：读取为Base64编码字符串；

**onload**：读取成功触发，结果存储在event.target.result中；

**onerror**：读取失败触发，比如文件损坏，无权限等；

**onprogress**：读取中实时触发，通过event.loaded（已读字节），event.total（总字节）可以制作进度条（loaded/total*100）；



## ReadableStream流式处理

ReadableStream是 Web Streams API的一部分，用于表示一个可持续分段产生数据（chunk）的数据源；数据可以边生成边输出，不需要等全部数据准备好才返回；

### 创建流对象

ReadableStream传入一个配置对象，配置各个回调函数：

start(controller)：ReadableStream 创建后立即调用，用于立即推送数据；

pull(controller)：当消费者需要更多数据时触发；

cancel(reason)：当读取者调用 `reader.cancel()` 或者流关闭时触发，用于清理资源；

**controller**：

controller.enqueue(chunk)：推入一个 chunk（可以是string / Uint8Array / object数据）进入队列；

controller.close()：关闭流，标记结束；

```
//创建流式对象
const stream = new ReadableStream({
    start(ctrl) {
      const texts = [
        "aaa",
        "bbb",
        "ccc",
      ]
      let i = 0;
      const send = () => {
        if (i < texts.length) {
          ctrl.enqueue(texts[i]);
          i++;
          send();
        } else {
          ctrl.close();
        }
      };
      send();
    },
});
```

### 读取流式数据：

通过流实例上的getReader()方法读取，一个 ReadableStream只能被一个reader消费，而getReader()用于锁定流，返回一个reader，数据源的所有流数据都只能通过整个reader读取；

reader.read()：读取下一段流中的数据（chunk）返回一个Promise，Promise包含 value（当前出队的流数据，类型可以为Uint8Array，String），done（是否读取完成）；

reader.releaseLock()：调用后这个 reader 就不再占用流了，流重新变为可被其他 reader 或管道使用的状态；

```
//读取流式对象
const decoder = new TextDecoder("utf-8");

const reader = stream.getReader();
let result = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  result += decoder.decode(value, { stream: true });
  console.log("收到文本: ", result);
}
```

## MediaSource媒体源

## URL API

用于构造和解析url，避免手动处理字符串时出现的错误（如参数拼接遗漏 `?`、特殊字符未编码等）；

使用URL构造函数创建url对象，可以只传一个url作为参数；也可以传两个参数，第一个参数为相对路径，第二个参数为基础路径；

```
const url = new URL("https://cn.vuejs.org/");

//两个参数
const baseURL= "https://cn.vuejs.org/";
const relativeURL = "guide/introduction.html";
const url = new URL(relativeURL,baseURL);
```

### URL实例：

hash：URL 中的 “锚点” 部分，以 `#` 开头；

protocol：协议，"https:"；

host：主机名+端口名，"cn.vuejs.org"；

href:：完成请求路径，"https://cn.vuejs.org/guide/introduction.html"

origin：基础url，包含协议 + 主机名 + 端口号，"https://cn.vuejs.org"

pathname：，URL 中的路径部分，从 `/` 开始，指向服务器上的具体资源，"/guide/introduction.html"

port: 端口号；

search：URL中查询参数部分，以？开头；

### searchParams对象：

searchParams 是 URL对象或 `window.location`的一个属性，它提供了一系列方法来添加、删除、修改、查询参数；

get：根据参数键获得值；

has：判断某个键是否存在；

set：更新键的值，如果键不存在则新增键；

delete：根据键删除值；

```
const url = new URL("https://example.com?name=张三&age=20");
console.log(url.searchParams.get("name"));//张三
console.log(url.searchParams.has("name"));//true

url.searchParams.set("city","北京");

url.searchParams.delete("age");
```

通过 entries()、keys()、values()方法遍历参数的键值对、键、值：

```
const url = new URL("https://example.com?name=张三&age=20");

// 遍历所有键值对
for (const [key, value] of url.searchParams.entries()) {
  console.log(`${key}: ${value}`); 
}

// 遍历所有键
for (const key of url.searchParams.keys()) {
  console.log(key);
}

// 遍历所有值
for (const value of url.searchParams.values()) {
  console.log(value);
}
```

### createObjectURL()

浏览器提供的 URL API中的一个方法，用于为File，Blob，MediaSource创建一个临时的url，让这些数据可以像普通 url 一样被引用，使用后要调用revokeObjectURL方法销毁URL，以防内存泄露；

参数为Blob或File对象，返回一个url；

```
let file = document.querySelector('#file');
let img = document.querySelector('#img');

//重新赋值图片路径
file.addEventListener('change',function(event){
    const file = event.target.files[0];
    const objectURL = createObjectURL(file);
    img.scr= objectURL;
})

//文件下载
const input = document.querySelector("#file");

input.addEventListener("change",(event)=>{
const objURL = URL.createObjectURL(event.target.files[0]);

const elink = document.createElement("a");
document.body.appendChild(elink);
elink.href=objURL;//下载url
elink.download = "文件名称";//可自定义文件名称
elink.click();
document.body.removeChild(elink);
URL.revokeObjectURL(objURL)
})
```

### revokeObjectURL()

每个createObjectURL都会在内存中新建一个URL引用，而revokeObjectURL能释放createObjectURL创建的URL引用的内存，当保证创建的URL引用不再被使用时可以调用此方法销毁（如图片加载后不再使用这个url时调用）；

```
let file = document.querySelector('#file')
file.addEventListener('change', function (event) {
    let img = document.querySelector('.img1')
    
    img.src = URL.createObjectURL(file.files[0])
    
    img.onload = function () {
        URL.revokeObjectURL(img.src)
    }
})
```







# 加密和解密API

## TextDecoder解码API

用于把二进制数据（如 Uint8Array / ArrayBuffer）解码成字符串，返回解码器，支持解码utf-8，utf-16le，gbk，windows-1252等；

网络、文件、流式通信发送的内容本质上都是字节，JS 的字符串是 UTF-16，而网络中常用 UTF-8，直接输出字节会乱码，可以使用解码器进行转换；

**编码方式**：将字符表示为机器识别的2进制的方式；

UTF-8：针对Unicode的可变长度（使用1到4个字节表示字符）字符编码，如A（01000001），中（11100100 10111000 10101101）；

UTF-16：和UTF-8相似，使用2或4个字节表示；

GBK：汉字内码扩展规范，主要覆盖中文的编码方式，使用16进制进行表示汉字或其他符号，如中（CE C4），A（41）；

```
const decoder = new TextDecoder('utf-8'); // 默认 utf-8

decoder.decode(uint8Array);//直接返回完整字符串
```

## TextEncoder编码API

用于将数据转化为二进制（UTF-8）一般转成Uint8Array类型；主要用于加密，流式传输等；

```
const encoder = new TextEncoder();
const result = encoder.encode("你好");
console.log(result);
```





## 加密和解密API

crypto是Web Crypto API（C++实现）中提供的安全、底层密码学、异步操作的核心对象，用于在客户端进行加密/解密，哈希，签名，密钥操作等；

### crypto.getRandomValues

安全随机数，根据传入的TypeArray（一般使用Uint8Array），调用操作系统内核的安全随机数生成器（CSPRNG）来生成随机数，返回一个相同的TypeArray，但是TypeArray中数组的每一个元素的值都是随机的；

用于生成密码学安全的随机数，如 IV（随机起始量，防止相同的明文得到相同的密文），nonce （一次性使用的随机数，用于对称加密）， salt（随机附加值，加 salt 后，即使密码相同，hash 也不同）等；

```
const random = crypto.getRandomValues(new Uint8Array(10));
```

### crypto.randomUUID

使用安全随机数直接返回一个UUID v4 固定格式的字符串（等价于getRandomValues + UUID 规则），用于生成唯一ID；不能用作为加密参数；

```
const crypto = window.crypto;
console.log(crypto.randomUUID());//e6149ce3-3670-44ff-8208-991d3d139b31
```

### crypto.subtle

是实现加密 / 解密（encrypt / decrypt），生成密钥（generateKey），生成哈希（digest），生成 / 验证签名（sign / verify）的主要模块；

**生成密钥**

使用crypto.subtle.generateKey生成密钥，三个参数分别为配置对象（配置算法名和密钥长度等），是否允许导出，密钥用途；返回一个Promise，含有CryptoKey配置对象（不能直接看到真实密钥数据，可以导出查看）；

```
const key = await crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256
  },
  true, // 是否允许导出
  ["encrypt", "decrypt"]
);
```

密钥导出：`crypto.subtle.exportKey(format, key)`，导出格式：

- 对称加密密钥（AES）：raw二进制数组，jwk JSON格式；
- 私钥：pkcs8二进制数组，jwk JSON格式；
- 公钥：pkcs8二进制数组，jwk JSON格式；

```
(async () => {
    const key = await crypto.subtle.generateKey(
        { 
            name:"AES-GCM", 
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    console.log(exportedKey);
})();
```

密钥导入：crypto.subtle.importKey()，用于将导出的密钥数据恢复成`CryptoKey` 对象；

```
crypto.subtle.importKey(
  format,       // 导入密钥的数据格式
  keyData,      // ArrayBuffer 或 JWK 对象
  algorithm,    // 密钥算法信息
  extractable,  // 是否允许再次导出
  keyUsages     // 允许用途 ["encrypt","decrypt","sign","verify",…]
)

//使用方法
(async () => {
    const key = await crypto.subtle.generateKey(
        { 
            name:"AES-GCM", 
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    
    //将导出的密钥重新变回key
    const importedKey = await crypto.subtle.importKey(
        "jwk",
        exportedKey,
        { 
            name:"AES-GCM", 
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    console.log(JSON.stringify(key) === JSON.stringify(importedKey));// true
})();
```

**加密/解密**

主要使用AES-GCM加密算法：先将明文TextEncoder为Uint8Array，再使用crypto.subtle.encrypt（只能接受ArrayBuffer / TypedArray类型二进制数据）变为ArrayBuffer密文，可以进一步将密文转化为Base64 / Hex来存储；

```
// 生成 AES-GCM 密钥
const getKey = async () => {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
};

//初始化解码和编码实例
const encoder = new TextEncoder();
const decoder = new TextDecoder();

//生成AES-GCM 的初始化向量
const iv = crypto.getRandomValues(new Uint8Array(12));

//加密方法
const encrypt = async (key, data) => {
    return await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(data)
    );
};

//解密方法
const decrypt = async (key, cipher) => {
    return await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipher
    );
};

(async () => {
    const key = await getKey();

    const cipher = await encrypt(key, "Hello World");
    console.log("Cipher:", new Uint8Array(cipher)); // 加密后的二进制

    const plain = await decrypt(key, cipher);
    console.log("Plain:", decoder.decode(plain)); // 解密后的文本
})();
```

**生成哈希**

哈希可以表示数据的唯一指纹，可以用于

- 在数据传输过程中，通过比较发送和接收生成 的两个哈希是否相等，从而判断数据传输过程中是否丢失，被修改等；
- 安全存储密码，虽然哈希不可逆，但是可以通过比较哈希是否相等进行判断密码正确性；

使用`crypto.subtle.digest(algorithm, data)`方法将二进制数据变成不可逆的固定长度的哈希值；

```
const encoder = new TextEncoder();

crypto.subtle.digest(
    "SHA-256", 
    encoder.encode("你好")
).then((digestBuffer) => {
    console.log(digestBuffer);
});
```

**数字签名**

用来证明这条数据是谁发的（私钥持有者），而且在传输过程中是否被修改；可以用于JWT身份验证，数据防篡改，电子合同等；

算法主要使用RSA-PSS（传统通用，较重）和ECDSA（现代，轻量）；

crypto.subtle.sign()：根据私钥和二进制数据生成签名，返回ArrayBuffer二进制数组；

crypto.subtle.verify()：根据公钥，签名，二进制数据进行验证数据是否被正确；

```
(async () => {
    // 生成 ECDSA 密钥对
    const keyPair = await crypto.subtle.generateKey(
        { 
            name:"ECDSA", 
            namedCurve:"P-256"// 椭圆曲线名称
        },
        true,
        ["sign", "verify"]
    );

    //用私钥签名
    const signature = await crypto.subtle.sign(
        {
            name:"ECDSA",
            hash:"SHA-256"// 哈希算法名称
        },
        keyPair.privateKey,
        new TextEncoder().encode("Hello, world!")
    );

    //用公钥验证签名
    const isVerified = await crypto.subtle.verify(
        {
            name:"ECDSA",
            hash:"SHA-256"// 哈希算法名称
        },
        keyPair.publicKey,
        signature,
        new TextEncoder().encode("Hello, world!")
    );
    console.log(isVerified);// true
})();
```

## 转化为base64

对于生成的二进制数组，如密钥，密钥对，签名，哈希都可转化为base64进行存储；

btoa(string)：字符串 → Base64；

atob(base64)：Base64 → 字符串；

fromCharCode()：用于把 Unicode 编码（数字）转换成字符；

charCodeAt() ：从字符串中取某个字符的Unicode 编码（数字）；

btoa / atob 只接受Latin-1字符串（8 bit），不能直接处理 Unicode 字符或 ArrayBuffer（二进制）；

```
//二进制转为base64
function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
}

//base64转为二进制
function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}
```
