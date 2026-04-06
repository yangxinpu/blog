# DOM

DOM（文档对象模型，Document Object Model）是一个将HTML文档呈现为一个由节点和对象组成的**树形结构**的一个接口，以便使用JS对其进行操作；

### 获取元素：

通过document提供的方法来获取元素对象；

**通过Id**

不需要加#；

```
document.getElementById('id');
```

**通过标签名**

返回的是获得的元素的伪数组；通过数组索引可以访问元素

```
let ul = document.getElementBuTagName('ul')//获得ul的伪数组
```

**通过类名**

不用加. 返回的是相同类名的元素的伪数组（就算只有一个元素也是数组）；

```
document.getElementClassName('class');
```

**通过选择器**

通过css选择器来获取元素，类名要加. id要加#；

querySelector：返回查找到的第一个元素；

querySelectorAll：返回所有查找到的元素的伪数组（当处理成千上万的DOM节点时：类数组的内存占用比真数组少40%，Live Collection特性减少98%的重绘计算）；

```
document.querySelector('.class');//通过类选择器
document.querySelector("[type]");//通过属性选择器

document.querySelectorAll('#id');
```

**html和body**

```id
document.body;//获得body元素
document.documentElement;//获得html根元素
```

### 节点操作：

节点类型：包括元素节点（1）、文本节点（3）、注释节点（8）等；

通过元素上的nodeType方法可以返回对应的数字，从而判断节点的类型；

#### 获取节点

**获得父节点**

parentNode：获得最近一级所有类型的父节点；

parentElement：获得最近遗迹元素类型的父节点；

```
li.parentNode;
li.parentElement;
```

**获得子节点**

childNodes ：获得所有类型节点的伪数组，返回NodeList；

children：只获得子元素节点的伪数组，返回HTMLCollection；

firstElementChild：获得第一个子元素节点；

father.lastElementChild：获得最后一个子元素节点；

删除子节点：removeChild，参数为要删除的子元素（可以通过选择器或节点获取）；

```
ul.children

ul.childrenNods

ul.firstElementChild

ul.lastElementChild

ul.removeChild(ul.children[0]);
```

**获得兄弟节点**

获得下一个兄弟节点：nextSibling（所有类型的节点），nextElementSibling（元素类型的节点）；

获得上一个兄弟节点：previousSibling（所有类型的节点），previousElementSibling（元素类型的节点）；

```
div.nextSibling
div.nextElementSibling

div.previousSibling
div.previousElementSibling
```

#### **创建和增添节点：**

通过document.createElement方法来创建节点，参数为要创建的节点类型；创建的节点通过父元素上的appendChild或insertBefore方法可以添加到DOM中；

```
let li = document.createElement('li');
let uls = querySelector('ul');

uls.appendChild(li);//在后面添加子节点
uls.insertBefore(li,ul.children[0]);//在第一个子节点前插入元素
```

#### **复制和增添节点：**

通过元素上的cloneNode方法可以复制该元素，参数true代表深拷贝（包括子节点），false代表浅拷贝（不包括子节点）；克隆的节点通过父元素上的appendChild或insertBefore方法可以添加到DOM中；

```
let li = uls.children[0].cloneNode(true);

uls.appendChild(li);
```

### DOM元素：

#### 元素基本属性

##### 节点相关：

nodeType：节点的类型；

nodeName：节点名称，如DIV，#text等；

children：子元素节点的伪数组；

parentNode：父节点；

nextElementSibling / previousElementSibling：返回下一个 / 上一个兄弟元素节点；

innerHTML：元素内的 HTML 内容（包括标签）；

innerText：元素内的文本内容；

##### 样式相关：

**style**：元素的行内样式对象，使用小驼峰命名法，只能获取行内样式；

```
let div = document.querySelector('div');
 div.style.backgroundColor = 'red';
 div.style.display = 'none';
}
```

**className**：元素的类名字符串，通过空格可以添加多个类名；

```
//在CSS中：
.class1{
    font-family:'宋体';
}
.class2{
    backgroundcolor:red;
    color:black;
    font-size:14px;
}

//在JS中：
let div = document.querySelector('div');
div.className = 'class1';//将div的类名改为chang来修改div的样式
div.className = 'class1 class2'
```

**classList**：代表该元素的类名列表；可进行操作；

`classList.add('style1');`增加新的样式

`classList.remove('style1');`删除样式

`classList.toggle('style2');`切换样式，类名存在删除，类名没有则添上

`classList.contains('style1');`检查是否有某个类，返回bool值

```
.style1{
    font-family:'宋体';
}
.style2{
    backgroundcolor:red;
    color:black;
    font-size:14px;
}

//在JS中：
let div = document.querySelector('div');

div.classList.add('style1');//增加新的样式
```

**setProperty**：动态设置内联CSS 变量，修改后会实时反映到使用该变量的样式中；第一个参数为变量名，第二个参数为变量值；

```
const app = document.getElementById('app')
app.style.setProperty('background-color', 'blue')
```

**removeProperty**：移除已设置的 内联CSS（会恢复为定义时的默认值）

```
const app = document.getElementById('app')
app.style.setProperty('border-radius', '50%');
app.style.removeProperty('border-radius');
```

##### 尺寸与位置：

offsetTop/ offsetLeft：元素相对于定位祖先元素的顶部 / 左侧偏移量（像素）；

offsetWidth/ offsetHeight：元素的宽度 / 高度（包括内容、内边距、边框，不含外边距）

clientWidth/ clientHeight：元素的可视宽度 / 高度（包括内容、内边距，不含边框和滚动条）

scrollWidth/ scrollHeight：元素内容的总宽度 / 高度（包括滚动隐藏部分）

scrollTop/ scrollLeft：元素内部滚动条的垂直 / 水平滚动距离；

#### 属性操作

针对于元素标签上的属性；

hasAttribute()：判断元素是否有指定属性；

getAttribute()：获取元素的属性；

setAttribute()：设置元素的属性。

removeAttribute()：移除元素的指定属性

```
let div = document.querySelector('div');

console.log(div.hasAttribute("class"));
div.getAttribute("class")
div.setAttribute("class","class1");
div.removeAttribute("class")

//主题切换
//css
:root[data-theme="light"] {
  --bg-color: #fff;
  --text-color: #333;
}
:root[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #eee;
}
body {
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s;
}

//js操作
 const root = document.documentElement;
 root.dataset.theme = 'light' ? 'dark' : 'light';
```

#### 元素基本方法

##### getBoundingClientRect

用于获取元素的宽高和相对于视口的位置信息；而这些信息依赖于最新的布局计算结果，如果此时浏览器存在尚未处理的布局更新，为了返回准确的信息，**浏览器会强制进行一次重排**；

```
const app = document.getElementById('app')
const info =app.getBoundingClientRect()
console.log(info)

//输出
bottom: 31.13636302947998
height: 23.14049530029297
left: 7.995867729187012
right: 1389.0289487838745
top: 7.995867729187012
width: 1381.0330810546875
x: 7.995867729187012
y: 7.995867729187012
```

##### animate

用于直接通过 JavaScript 为 DOM 元素创建和运行关键帧动画；`animate()` 定义的动画，浏览器会优先将其交由合成线程（专门负责图层合成的独立线程）处理，避免占用主线程资源

第一个参数为关键帧数组（可以通过offset指定帧位置，值为0-1），第二个参数为动画配置（时长、循环次数、缓动函数等）；返回一个 Animation对象，含有：

`play()`：播放动画（从当前状态继续）；

`pause()`：暂停动画（保留当前进度）；

`reverse()`：反向播放动画；

`cancel()`：取消动画（重置元素到初始状态）；

`finish()`：直接跳转到动画结束状态；

`playState`：当前状态（`'idle'` 未开始、`'running'` 运行中、`'paused'` 暂停、`'finished'` 已结束）；

`currentTime`：当前动画进度（ms），可直接修改（如 `animation.currentTime = 1000` 跳转到 1 秒处）；

`effect`：动画效果（可修改关键帧或配置）；

```
const box = document.querySelector('#box');
const btn = document.querySelector('button');
let animateObj = box.animate([
    {transform: 'translateX(0px)',offset: 0.2},
    {transform: 'translateX(200px)',offset: 1}
], {
    duration: 1000,
    iterations: 1
});
btn.addEventListener('click', () => {
    animateObj.play();
})
```

#### **表单元素：**

##### 属性：

name：表单元素的名称；

value：表单元素的输入值；

type：表单元素的类型；

checked：选择器是否被选择；

disabled：是否被禁用；

readonly：是否只读；

autofocus：页面加载时是否自动获得焦点；

tabindex：控制元素在按 `Tab` 键时的聚焦顺序（数值越小越先聚焦，负值表示不能通过 `Tab` 聚焦）；

accept：限制可选择的文件类型（如 `accept="image/*"` 仅允许图片）。

multiple：布尔值，在type为file时表示是否允许选择多个文件；在select中表示是否支持多选；

##### 方法

focus()：该表单元素获得焦点；

blur()：使表单元素失去焦点。

click()：模拟点击（如触发按钮点击、复选框选中）

reset()：重置表单元素输入；

#### img元素：

src：图片的url地址；

width / height：图片的显示宽度和高度（以像素为单位，可直接修改）

```
img.width = 300; // 设置宽度为 300px
img.height = 200; // 设置高度为 200px
```

naturalWidth / naturalHeight：图片原始尺寸（未经缩放的宽度和高度，只读）

complete：图片是否已完全加载

#### 链接元素：

##### 属性：

href：链接的目标 URL；

target：指定链接打开的目标位置`_self`：当前窗口打开（默认）`_blank`：新窗口 / 标签页打开；

download：设置该属性时，点击链接会下载目标资源（而非跳转），值为可选的文件名；

disabled：链接是否被禁用；

##### 方法

click()：模拟点击链接；
