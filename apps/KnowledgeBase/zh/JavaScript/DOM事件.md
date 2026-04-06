# DOM事件

## DOM事件：

触发js响应的操作，网页中的每个元素都可以产生某些触发js的事件

### 事件类型：

#### **鼠标事件：**

`click`：鼠标点击左键触发；

`dblclick`：鼠标双击触发；

`focus`：获得光标触发；

`blur`：没有光标触发；

`mouseover`:鼠标经过触发；

`mouseout`:鼠标离开时触发；

 `mousemove`:鼠标移动时触发，一般和document.addEventListen()用；

`contextmenu`:鼠标右击事件，默认触发显示菜单栏；

 `selectstart`：鼠标左键选取文本触发，默认触发选取文本；

`copy`：当用户执行赋值操作时触发（包括clr+c），默认将内容复制到系统剪切板；与其同类型的有cut剪切事件，paste粘贴事件；

```
document.addEventListener('copy', (event) => {
    console.log('触发了复制操作');
    event.preventDefault();//阻止将当前选中的内容复制到系统剪贴板；
    event.clipboardData.setData('text/plain', '纯文本文字');//设置剪切板的内容
})
```

#### **键盘事件：**

`keyup`:按键弹起时触发；

`keydown`:按键按下时触发；

`keypress`:按下时触发，但是不识别ctl、atl等功能键；执行循序先down再press再up；

#### 表单事件：

`input`：用户当有输入时触发；

`submit`：表单被点击提交时触发

`change`：表单元素的value值发生改变，并且失去焦点时触发；

#### 加载事件

`DOMContentLoaded`：当页面HTML文档完全加载和解析后触发，无需等待CSS文件，图片和子框架加载；

```
window.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded");
});
```

`load`：等待页面所有资源（比如图片、视频、JS文件，CSS文件）加载完毕触发；

```
window.addEventListener('load',function(){
     console.log('页面所有资源加载完毕');
})
```

#### 滚动事件：

当滚动条滚动时触发，一般给window添加，没有默认行为，不能通过此阻止滚动；

```
window.addEventListener('scroll',function(){
     document.documentElement.scrollTop;//获得整个页面滚动的距离
     document.documentElement.scrollTop=800;//让直接滚动到800px不用带单位
})
```

#### 页面尺寸事件：

浏览器窗口尺寸改变时触发；

```
window.addEventListener('resize',function(){
     console.log('页面大小改变了');
})
```

#### 拖拽事件：

通过在元素上设置draggable属性可以使元素被拖动；`<img>`、`<a>` 标签默认可拖动，大多数元素如 `<div>`、`<p>` 默认不可拖动；

```
//html
<div draggable="true" class="drag"></div>
<div class="target"></div>

//js代码
const dragDiv = document.querySelector('.drag');
const targetDiv = document.querySelector('.target');
//被拖拽盒子事件
dragDiv.addEventListener('dragstart', (event) => {
    console.log('盒子开始被拖拽了')
    event.preventDefault();//阻止初始化拖拽操作，创建拖动元素的半透明体副本跟随鼠标
    event.dataTransfer.setData('text/plain', dragDiv.outerHTML);//设置传输的数据字符串
})

dragDiv.addEventListener('drag', () => {
    console.log('盒子正在被拖拽');
})

//被拖拽盒子进入目标盒子事件
targetDiv.addEventListener('dragover', (event) => {
    console.log('拖动盒子悬停在目标盒子')
    event.preventDefault();//阻止拒绝放置盒子,不然不会触发drop事件
})

targetDiv.addEventListener('drop', (event) => {
    console.log('拖动盒子放在在目标盒子')
    event.preventDefault();//阻止拒绝盒子内容的放入
    targetDiv.innerHTML += event.dataTransfer.getData('text/plain');
})
```

#### DOMContentLoaded

用于监听HTML文档已完全加载并解析完成（DOM 树构建完毕），无需等待外部资源（如样式表、图片、脚本、iframe 等）加载完成；

```
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded");
})
```

#### load

在页面所有资源（包括 HTML、CSS、JavaScript、图片、视频、字体等）完全加载完成后才触发

```
window.addEventListener('load', function() {
  console.log('所有资源加载完成！');
});
```



### event对象

事件一系列相关数据的集合，比如鼠标点击坐标，或者键盘的哪个键

#### 基本事件对象

```
btn.onclick=funtion(event){
   console.log(event);
}
```

`event.target`:返回被点击的元素（不一定是添加事件的元素）；

`event.currentTarget`：添加事件的元素；

`event.type:`返回事件的类型；

`event.preventDefault()`;阻止默认行为，比如链接不跳转，表单不提交;

`event.stopPropagation();`停止事件流的传播；

#### **鼠标事件对象：**

可以获得鼠标的坐标数值，都不带单位要自己加px；

```
divs.addEventListener('click',function(event){
    event.clientX;//返回鼠标相对于可视窗口的x坐标
    event.clientY;
    event.pageX;//返回鼠标相对于整个页面的x坐标
    event.pageY;
    event.screenX;//返回鼠标相对于电脑屏幕的x坐标
    event.screenY;
})
```

#### **键盘事件对象：**

```
divs.addEventListener('keydown',function(event){
    event.keyCode;//返回按下键的ascll值,keyup和keydown不区分大小写，比如a，A都是65;keypress区分
    event.key;//返回按下的键的字符串如Enter（回车）、Space（空格）、ArrowLeft（左箭头）
})
```

### 注册事件：

#### 传统注册事件：

同一事件只能绑定一个处理函数，后绑定的会覆盖前面的；

```
btn.onclick=function(){
    console.log('元素被点击了');
}
```

#### **监听注册事件：**

格式：`element.addEventListener(事件类型,事件回调函数,事件流);`

```
btn.addEventListener('click',function(){
   alert('hi');
})

btn.addEventListener('click',function(){
   alert('aaaaa');
})
//这样会连续弹出两次alert
```

**事件流**

一个bool值，true为捕获，false为冒泡

当事件被触发时，会先开始捕获阶段，依次遍历window，document，父盒子，子盒子......如果发现有设置true的目标对象,就触发事件，再进行冒泡阶段,从子盒子依次遍历到window，如果发现有设置false(或则没有设置true)的目标对象，就触发事件。

**删除事件：**

```
传统方法：
btn.onclick=funtion(){
   alert('aa');
   btn.onclick=null;
}
```

```
监听方式：
function fn(){
   alert('a');
}
btn.addEventListener('click',fn);
btn.removeEventListener('click',fn);
```

#### 事件委托

将事件监听器设置在父节点上，然后利用冒泡原理影响子节点

```
uls.addEventListener('click',function(event){
   event.target.style...
})
```

