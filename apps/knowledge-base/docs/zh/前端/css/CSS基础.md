## 选择器

选择器命名可以使用字母、下划线、数字、中划线来命名，但不能以数字开头；

一般规范使用 BEM（Block 独立功能模块，Element 元素，Modifier 修饰符）来规范命名：`.nav__item--active`（双下划线分隔块与元素，双中划线分隔修饰符）；

### 基础选择器

```
* { }              /* 通配符选择器：选择所有元素 */
  
div { }            /* 元素选择器：选择所有 div 元素 */

.box { }           /* 类选择器：选择 class 包含 box 的元素 */

#header { }        /* ID 选择器：选择 id 为 header 的元素（唯一） */
```

### 后代选择器

选择某个元素内部的所有后代元素（包括子代、孙代等）

```
ul li span {       /* 选择 ul 内部所有后代 span 元素 */

}
```

### 子选择器

选择某个元素的直接子元素（第一级）

```
div > span {       /* 只选择 div 的直接子元素 span */
}
```

### 相邻兄弟选择器

选择紧接在指定元素之后的第一个同级兄弟元素

```
h1 + p {           /* 选择紧跟在 h1 后面的第一个 p 元素 */
}
```

### 通用兄弟选择器

选择指定元素之后的所有同级兄弟元素

```
h1 ~ p {           /* 选择 h1 后面所有同级的 p 元素 */
}
```

### 并集选择器

同时选择多个元素，用逗号分隔

```
div, p, span {
}
```

### 伪类选择器

选择特定状态元素的样式

```
div:active {       /* 鼠标点击并且未弹起时的样式 */
}

div:hover {        /* 鼠标经过时的样式 */
}

div:empty {        /* 元素没有子元素（包括文本节点）时的样式 */
}

div:has(span) {    /* 含有 span 后代元素时的样式（CSS 新增） */
}

:root {            /* 根元素（即 html 元素），常用于声明全局 CSS 变量 */
}
```

**否定伪类**

```
div:not(.active) { /* 选择 class 不包含 active 的 div 元素 */
}

div:not(:hover):not(:focus) { /* 可以链式使用，支持多个参数（CSS 新增） */
}
```

**匹配伪类 :is() 和 :where()**

 `:is()` 会取参数中优先级最高的作为整体优先级；
 
 `:where()` 的优先级始终为 0，便于被覆盖；

```
:is(h1, h2, h3) p {  /* 等价于 h1 p, h2 p, h3 p，简化多层选择器书写 */
}

:where(h1, h2, h3) p { /* 与 :is() 语法相同，但优先级永远为 0 */
}
```

**表单元素特有**

```
button:disabled {   /* 元素被禁用时的样式（注意是 disabled 不是 disable） */
}

button:enabled {    /* 元素被启用时的样式 */
}

input:focus {       /* 输入框获得焦点时的样式 */
}

input:focus-within {/* 该元素本身或其内部任何子元素获得焦点时的样式（伪类用单冒号） */
}

input:checked {     /* 单选/复选框被选中后的样式 */
}

input:valid {       /* 表单输入有效值时的样式 */
}

input:invalid {     /* 表单输入无效值时的样式 */
}

input:user-invalid {/* 只有在用户进行交互后才开始匹配是否有效 */
}

input:required {    /* 带有 required 属性的表单元素 */
}

input:optional {    /* 不带 required 属性的表单元素 */
}

input:read-only {   /* 只读状态的表单元素 */
}

input:read-write {  /* 可编辑状态的表单元素 */
}
```

### 结构伪类选择器

基于元素在文档树中的位置关系来选择元素；

值可用 `n` 代替，n 表示从 0 增到无穷：
- `-n + 5`：前 5 个
- `n + 5`：从第 5 个开始的所有元素（不是后 5 个！后 5 个用 `nth-last-child(-n+5)`）
- `2n` 或 `even`：双数
- `2n + 1` 或 `odd`：单数

```
ul li:first-child { }       /* 第一个子元素且必须是 li */
ul li:last-child { }        /* 最后一个子元素且必须是 li */
ul li:only-child { }        /* 唯一的子元素 */

ul li:nth-child(1) { }      /* 所有类型子元素混合排序，选出第 1 个且为 li 的元素；
                                如果第 1 个不是 li 则该选择器不生效 */
ul :nth-child(1) { }        /* 所有类型子元素混合排序，选择第 1 个元素（不限类型） */

ul li:nth-of-type(1) { }    /* 同类型子元素单独排序，选择第 1 个 li */
ul li:nth-last-of-type(1) { }/* 同类型子元素倒序排序，选择倒数第 1 个 li */

ul li:first-of-type { }     /* 同类型中的第一个 li */
ul li:last-of-type { }      /* 同类型中的最后一个 li */
```

### 属性选择器

选择含有特定属性或属性值的元素；属性值的引号可选，但包含特殊字符或空格时建议加上；

```
[type] { }                   /* 选择含有 type 属性的元素 */

input[type='text'] { }       /* 选择 type 属性为 text 的 input 元素 */

[class^='a'] { }             /* class 属性值以 a 开头的元素 */
[class$='b'] { }             /* class 属性值以 b 结尾的元素 */
[class*='c'] { }             /* class 属性值包含 c 的元素 */

[class~='a'] { }             /* class 属性值包含以空格分隔的独立单词 a 的元素
                                （如 class="a b" 匹配，class="ab" 不匹配） */
[lang|='en'] { }             /* lang 属性值为 en 或以 en- 开头的元素（如 en-US） */

[type][disabled] { }         /* 同时含有 type 和 disabled 属性的元素 */
```


### 伪元素选择器

**::before 和 ::after**：在元素内容的前面或后面插入生成的内容；插入的内容不会出现在 DOM 树中，而是通过 CSS 渲染层插入虚拟内容，不能用 JS 直接交互；

替换元素不支持 ::before/::after，包括 `img`、`input`、`select`、`textarea`、`video`、`iframe`、`canvas` 等，因为它们的内容由外部资源决定，CSS 无法在其内部插入虚拟节点；

```
div::before {
   content: '';               /* 必须设置 content 属性，否则伪元素不生效 */
}
div::after {
   content: url('');          /* 内容可以是字符串、图片、计数器等 */
}
```

**::placeholder**：输入框占位符样式

```
input::placeholder {
    color: #999;
}
```

**::first-letter**：元素（包括嵌套的子元素）的第一个字符或字母；适用于区块容器（block container），包括 `block`、`inline-block`、`table-cell`、`list-item` 等，并非只能用于块级元素；

```
div::first-letter {
    font-size: 30px;
}
```

**::first-line**：元素的第一行文本样式，同样适用于区块容器；

```
p::first-line {
    font-weight: bold;
    color: red;
}
```

**::selection**：自定义该元素（包括子元素）内文本被选中的效果；只能修改 `color`、`background-color`、`text-decoration`、`text-shadow`、`stroke`、`fill` 等，不能修改字体、布局相关属性；

```
div::selection {
    background-color: black;
    color: aqua;
    text-shadow: 1px 1px 2px white;
}
```

### 选择器优先级

当多个选择器同时匹配同一个元素时，按优先级决定哪条规则生效：

1. **!important** > 内联样式 > ID 选择器 > 类/伪类/属性选择器 > 元素/伪元素选择器 > 通配符
2. 优先级相同时，后写的规则覆盖先写的
3. `:where()` 的优先级始终为 0；`:is()`、`:not()`、`:has()` 的优先级取其参数中最高的

```
内联样式:        1, 0, 0, 0
#id:             0, 1, 0, 0
.class:hover:    0, 0, 2, 0
div::before:     0, 0, 0, 2
```

## 颜色表示

### 常用颜色格式

```
color: red;                    /* 颜色关键字 */
color: #ff0000;                /* 十六进制（6位） */
color: #f00;                   /* 十六进制缩写（3位，等价于 #ff0000） */
color: #ff000080;              /* 十六进制带透明度（8位，最后两位 00-ff） */

color: rgb(255, 0, 0);         /* RGB：红、绿、蓝，取值 0-255 */
color: rgba(255, 0, 0, 0.5);   /* RGBA：带透明度，alpha 取值 0-1 */

color: hsl(0, 100%, 50%);      /* HSL：色相(0-360)、饱和度(%)、亮度(%) */
color: hsla(0, 100%, 50%, 0.5);/* HSLA：带透明度 */

color: transparent;             /* 完全透明，等价于 rgba(0,0,0,0) */
color: currentColor;            /* 当前元素的 color 属性值，常用于让其他属性继承文字颜色 */
```

注意：`rgb(255, 255, 255)` 是**白色**，不是透明！透明需要用 `rgba(255,255,255,0)` 或 `transparent`；

### color-mix() 颜色混合

将两种颜色按比例混合：

```
color: color-mix(in srgb, red 50%, blue);  /* 红色和蓝色各占 50% 混合 */
background-color: color-mix(in oklch, #ff0000 70%, #0000ff 30%);
```

## CSS 单位

### 绝对单位

```
px:    像素，最常用，相对于设备屏幕
pt:    磅，1pt = 1/72 英寸，常用于打印
cm:    厘米
mm:    毫米
in:    英寸，1in = 96px = 2.54cm
```

### 相对单位

```
em:     相对于当前元素的 font-size（自身未设置则继承父元素）
rem:    相对于根元素（html）的 font-size，不受父级影响，最常用
%:      百分比，相对于父元素的对应属性

vw:     视口宽度的 1%（1vw = 视口宽度 / 100）
vh:     视口高度的 1%
vmin:   vw 和 vh 中较小的值
vmax:   vw 和 vh 中较大的值

ex:     相对于当前字体小写字母 x 的高度
ch:     相对于当前字体数字 0 的宽度
lh:     相对于当前元素的 line-height
rlh:    相对于根元素的 line-height
```

## 基础属性

### 字体

**font-family 字体族**：可以设置多个字体类型，用逗号隔开，浏览器依次查找；字体名包含空格或特殊字符时需要加引号（不是"特殊字体"才加）；

浏览器会依次查找用户系统中已安装的字体来渲染，如果都没有，则回退到默认字体；最后通常加一个通用字体族（`serif`、`sans-serif`、`monospace`）作为兜底；

```
font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
```

**font-size 字体大小**：

```
font-size: 16px;
font-size: 1rem;
font-size: 1.2em;
```

**font-weight 字体粗细**：

```
font-weight: normal;     /* 正常，等价于 400 */
font-weight: bold;       /* 粗体，等价于 700 */
font-weight: 100;        /* 细体，取值 100-900，步长 100 */
font-weight: 900;        /* 最粗 */
```

**font-style 字体倾斜**：

```
font-style: normal;      /* 正常 */
font-style: italic;      /* 斜体（使用字体自带的斜体字形） */
font-style: oblique;     /* 倾斜（人为将文字倾斜一定角度） */
```

**font 简写**：依次为 font-style → font-variant → font-weight → font-size/line-height → font-family；其中 font-size 和 font-family 为必填项，顺序不能乱；

```
font: italic bold 16px/1.5 'Microsoft YaHei', sans-serif;
```

**@font-face 自定义字体**：引入外部字体文件，让用户即使没有安装该字体也能显示；

```
@font-face {
  font-family: 'MyFont';
  src: url('./fonts/myfont.woff2') format('woff2'),
       url('./fonts/myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;     /* 字体加载期间先用兜底字体显示，避免 FOIT */
}

body {
  font-family: 'MyFont', sans-serif;
}
```

### 文本

**text-decoration 文本装饰线**：可设置文本装饰线及其样式（可同时设置多个装饰线），使用 `text-underline-offset` 对下划线进行偏移，`text-decoration-thickness` 设置线的粗细；

值依次为：线的位置、线的样式、线的颜色、线的粗细；

- 线的位置：`none`（不设置）、`underline`（下划线）、`overline`（上划线）、`line-through`（删除线）
- 线的样式：`solid`（实线）、`dotted`（点线）、`dashed`（虚线）、`wavy`（波浪线）、`double`（双线）

```
text-decoration: underline wavy red 2px;   /* 红色 2px 波浪下划线 */
text-decoration: underline line-through;     /* 同时设置下划线和删除线 */
text-underline-offset: 4px;                  /* 下划线向下偏移 4px */
```

**text-indent 文本缩进**：设置块级、行内块元素的首行文本缩进距离；

```
text-indent: 2em;        /* 首行缩进两个字符 */
```

**text-align 文本水平对齐**：设置块元素或单元格框的行内内容的水平对齐方式；

```
text-align: left;        /* 左对齐 */
text-align: right;       /* 右对齐 */
text-align: center;      /* 居中 */
text-align: justify;     /* 两端对齐（最后一行除外） */
text-align: start;       /* 文档流起始方向对齐（逻辑属性） */
text-align: end;         /* 文档流结束方向对齐（逻辑属性） */
```

**vertical-align 垂直对齐**：设置行内、行内块元素相对于父元素基线的对齐方式（对块级元素无效）；

```
vertical-align: baseline;   /* 基线对齐（默认） */
vertical-align: middle;     /* 垂直居中 */
vertical-align: top;        /* 顶部对齐 */
vertical-align: bottom;     /* 底部对齐 */
vertical-align: sub;        /* 下标 */
vertical-align: super;      /* 上标 */
vertical-align: text-top;   /* 父元素文字顶部对齐 */
vertical-align: text-bottom;/* 父元素文字底部对齐 */
vertical-align: 5px;        /* 相对于基线向上偏移 5px（负值向下） */
vertical-align: 50%;        /* 相对于行高的百分比 */
```

常用场景：消除图片底部空白缝隙（`img { vertical-align: middle; }`）；

**line-height 行高**：上间距 + 字体大小 + 下间距；改变行高实际上是改变上下间距的大小，当行高等于块级盒子高度时，单行文字会垂直居中；

```
line-height: 1.5;        /* 无单位时相对于 font-size 计算，推荐写法 */
line-height: 24px;
line-height: 150%;
```

**letter-spacing 字符间距**：控制字符之间的间距；

```
letter-spacing: 2px;     /* 字符间距增加 2px */
letter-spacing: -1px;    /* 字符间距减少 1px */
```

**word-spacing 单词间距**：控制单词之间的间距（对中文无效，因为中文没有空格分词）；

```
word-spacing: 5px;
```

**text-transform 文本大小写转换**：

```
text-transform: none;         /* 不转换 */
text-transform: uppercase;    /* 全部大写 */
text-transform: lowercase;    /* 全部小写 */
text-transform: capitalize;   /* 每个单词首字母大写 */
```

**writing-mode 文本排列方式**：
- `horizontal-tb`：从上到下水平排列（默认）
- `vertical-rl`：从右到左垂直排列
- `vertical-lr`：从左到右垂直排列
- `sideways-rl` / `sideways-lr`：所有文字横向排列后整体旋转（CSS 新增）

```
writing-mode: vertical-rl;
```

**text-orientation 文字旋转**：当 `writing-mode` 设置为垂直排列时，文字默认会旋转 90 度，通过设置 `text-orientation: upright` 可以让文字不旋转保持竖直；

- `mixed`：自然排列（默认），拉丁文旋转，中日韩不旋转
- `upright`：所有文字竖直排列

```
text-orientation: upright;
```

**text-emphasis 文本标记**：将强调标记添加到文字上方，空格不可标记；

标记类型：自定义单字符、`circle`（圆形）、`double-circle`（双圆形）、`triangle`（三角形）、`sesame`（芝麻点），可搭配 `filled`（实心）/ `open`（空心）和颜色；

```
text-emphasis: filled red circle;
text-emphasis: '★';              /* 自定义单字符 */
text-emphasis-position: under;    /* 调整位置：over / under / left / right */
```

**text-shadow 文本阴影**：通过逗号分隔可以设置多个阴影效果；

参数依次是：水平偏移、垂直偏移、模糊半径、阴影颜色（没有扩散面积，这是与 box-shadow 的区别）；

```
text-shadow: 1px 1px 5px green;
text-shadow: 1px 1px 5px green, -3px 3px 5px blue;  /* 多个阴影 */
```

**white-space 空白处理**：控制元素内空格、制表符、换行符的处理方式；

| 值 | 连续空白 | 换行符 | 超出容器 |
|---|---|---|---|
| `normal` | 合并 | 忽略 | 自动换行 |
| `nowrap` | 合并 | 忽略 | 不换行，溢出 |
| `pre` | 保留 | 保留 | 不换行，溢出 |
| `pre-wrap` | 保留 | 保留 | 自动换行 |
| `pre-line` | 合并 | 保留 | 自动换行 |

```
white-space: nowrap;     /* 强制一行显示 */
```

**text-overflow 文本溢出**：指定当文本溢出容器时如何显示；**必须配合 `overflow: hidden` 和 `white-space: nowrap` 使用才会生效**；

```
text-overflow: clip;       /* 直接裁剪溢出部分（默认） */
text-overflow: ellipsis;   /* 溢出部分显示省略号 ... */
```

单行文本省略号常用写法：

```
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

**多行文本省略号（-webkit-line-clamp）**：

```
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;     /* 最多显示 2 行，超出显示省略号 */
overflow: hidden;
```

注意：`overflow-wrap`（旧称 `word-wrap`）是控制长单词/URL 是否可以在任意位置断行，值为 `normal` / `break-word` / `anywhere`，与文本溢出省略号无关，不要混淆；

### 背景

**background-color 背景颜色**：

```
background-color: transparent;  /* 透明背景 */
```

**background-clip 背景裁剪**：控制背景的绘制区域；

- `border-box`：背景延伸到边框外沿（默认，边框下方也有背景）
- `padding-box`：背景延伸到内边距外沿，不延伸到边框
- `content-box`：背景只在内容区域显示，不延伸到 padding 和 border
- `text`：背景只在文字部分显示（需要将文字颜色设为透明，实现渐变文字效果）

```
-webkit-background-clip: text;   /* 兼容老版 WebKit 浏览器 */
background-clip: text;
color: transparent;
```

**background-origin 背景定位原点**：控制 `background-position` 相对于哪个区域定位；

- `padding-box`：相对于内边距定位（默认）
- `border-box`：相对于边框定位
- `content-box`：相对于内容区域定位

```
background-origin: content-box;
```

**background-image 背景图片**：要设置盒子宽高才能显示；用逗号分隔可设置多张图片或渐变，先写的图片层级在上（覆盖在后面的图片和背景颜色之上）；

```
background-image: url('img/logo.png'), linear-gradient(green, red);
```

**background-repeat 背景图片重复方式**：

- `repeat`：水平和垂直都重复（默认）
- `no-repeat`：不重复
- `repeat-x`：只沿 x 轴重复
- `repeat-y`：只沿 y 轴重复
- `space`：均匀分布重复，图片之间留有空隙，不裁剪
- `round`：自动缩放图片以整数次铺满容器，不留空隙不裁剪

```
background-repeat: no-repeat;
```

**background-position 背景图片位置**：设置背景图片在容器中的起始位置；

```
background-position: center;          /* 居中 */
background-position: left top;        /* 左上角 */
background-position: 10px 20px;       /* 距左 10px，距上 20px */
background-position: right 10px bottom 20px;  /* 距右 10px，距下 20px */
background-position: 50% 50%;         /* 百分比定位 */
```

**background-size 背景图片大小**：

```
background-size: 100% 100%;   /* 宽高都 100%，不保留比例，拉伸填满 */
background-size: 100%;         /* 只写一个值时宽度 100%，高度 auto，保留图片比例 */
background-size: cover;        /* 保留比例放大覆盖整个盒子，可能裁剪超出部分 */
background-size: contain;      /* 保留比例缩放到完整显示在盒子内，可能有留白 */
```

**background-attachment 背景图片固定方式**：

- `scroll`：背景图像相对于元素本身固定，随页面滚动而滚动（默认）
- `fixed`：背景图像相对于视口固定（不随元素或页面滚动，实现视差效果）
- `local`：背景图像相对于元素内容固定，元素内容滚动时背景跟着滚动

```
background-attachment: fixed;
```

**background 简写**：依次为 color → image → repeat → attachment → position / size（size 前必须加 `/`）；

```
background: #fff url('img/bg.png') no-repeat center / cover;
```

**backdrop-filter 背景滤镜**：为一个元素**后面区域**（即元素下方被其覆盖的内容）添加模糊或颜色偏移效果；元素本身需要有透明度或半透明背景才能看到效果；

```
backdrop-filter: blur(10px);          /* 模糊后面的内容 */
backdrop-filter: blur(10px) saturate(150%);
```

### 替换元素内容适配

**object-fit 内容填充方式**：控制替换元素（`img`、`video`、`picture` 中的 img 等）的内容如何适应其容器的尺寸。类似于 `background-size`，但作用于元素内容而非背景。

- `fill`：拉伸内容填满容器，不保留比例（默认）
- `contain`：保留比例缩放，内容完整显示在容器内（可能有留白）
- `cover`：保留比例缩放，内容覆盖整个容器（可能被裁剪）
- `none`：保持内容原始尺寸，不缩放
- `scale-down`：取 `none` 和 `contain` 中较小的那个（内容比容器大时缩小，比容器小时保持原样）

```
img {
  width: 300px;
  height: 200px;
  object-fit: cover;       /* 图片覆盖整个 300x200 容器，超出部分裁剪 */
  object-fit: contain;     /* 图片完整显示，可能有上下或左右留白 */
  object-fit: fill;        /* 图片拉伸填满，可能变形 */
}
```

**object-position 内容位置**：控制内容在容器中的对齐位置，类似于 `background-position`。默认值为 `50% 50%`（居中）。

```
img {
  object-fit: cover;
  object-position: center;          /* 居中（默认） */
  object-position: top left;        /* 左上角对齐 */
  object-position: right bottom;    /* 右下角对齐 */
  object-position: 20% 80%;         /* 距左 20%，距上 80% */
  object-position: right 10px bottom 20px;  /* 距右 10px，距下 20px */
}
```

> 典型应用场景：用户头像（`object-fit: cover` + 圆形裁剪）、文章列表缩略图（固定尺寸容器 + cover 避免变形）、视频封面等。

### 边框

**border 元素边框**：依次为宽度、样式、颜色，样式为必填项（不写样式则边框不显示）；

```
border: 1px solid red;
border-left: 5px inset rgb(255, 0, 119);  /* 单独给左边框设置样式 */
border-top: none;                            /* 取消上边框 */
```

**border-width 边框宽度**：

```
border-width: 1px;                 /* 四边相同 */
border-width: 1px 2px;             /* 上下 1px，左右 2px */
border-width: 1px 2px 3px 4px;    /* 上、右、下、左（顺时针） */
```

**border-style 边框样式**：

- `none`：无边框（相当于 width 为 0）
- `hidden`：隐藏边框（与 none 类似，但在表格边框合并时优先级更高）
- `solid`：实线
- `dashed`：虚线
- `dotted`：点线
- `double`：双实线
- `groove`：雕刻效果（内凹）
- `ridge`：浮雕效果（外凸）
- `inset`：陷入效果
- `outset`：突出效果

```
border-style: solid dashed double groove;  /* 上、右、下、左四条边框不同样式 */
```

**border-color 边框颜色**：

```
border-color: red;
border-color: red green blue yellow;       /* 上、右、下、左不同颜色 */
```

**border-radius 圆角边框**：设置为 50% 且宽高 1:1 时为圆形；可以分别设置四个角，用 `/` 分隔水平半径和垂直半径实现椭圆角；

```
border-radius: 10px;                          /* 四角相同 */
border-radius: 10px 20px 30px 40px;          /* 左上、右上、右下、左下 */
border-radius: 50%;                           /* 圆形（宽高 1:1） */
border-radius: 50px / 20px;                   /* 水平半径 50px，垂直半径 20px（椭圆角） */
```

**border-image 边框图片**：用图片代替纯色边框；

```
border-image: url('border.png') 30 round;    /* 图片裁剪、拉伸或重复填充边框 */
border-image-slice: 30;                       /* 图片裁剪尺寸 */
border-image-repeat: round;                    /* 重复方式：stretch / repeat / round / space */
```

**border-collapse 表格边框合并**：决定表格元素（`<table>`）的边框是分开的还是合并的；

```
border-collapse: collapse;    /* 合并边框，相邻单元格共享边框 */
border-collapse: separate;    /* 分开边框（默认） */
```

**border-spacing 表格边框间距**：表格单元格之间的距离，只适用于 `border-collapse: separate` 模式；

```
border-spacing: 0;            /* 单元格间距为 0 */
border-spacing: 5px 10px;     /* 水平间距 5px，垂直间距 10px */
```

### 盒模型

**box-sizing 盒模型计算方式**：控制元素的宽高是否包含 padding 和 border，非常重要；

- `content-box`：宽高只包含内容区域，padding 和 border 会额外增加元素总尺寸（默认值，W3C 标准盒模型）
- `border-box`：宽高包含内容 + padding + border，padding 和 border 不会撑大元素（IE 盒模型，推荐全局设置）

```
* {
  box-sizing: border-box;    /* 全局设置为 IE 盒模型，布局更直观 */
}
```

### 轮廓

**outline 轮廓线**：不影响元素的尺寸，不会触发重排，绘制在边框之外，会覆盖其他元素；可以配合 `border-radius` 使用；常用于焦点可访问性样式（`:focus-visible`）；

```
outline: 10px solid red;     /* 和 border 语法相似 */
outline: none;                /* 清除默认轮廓（不推荐，会影响键盘可访问性） */
outline: 2px solid blue;
outline-offset: 4px;          /* 轮廓与边框之间的间距 */
```

**outline-offset 轮廓偏移**：设置轮廓距离盒子边框的大小，可以为负值（轮廓在边框内部）；

```
outline-offset: 30px;
outline-offset: -5px;         /* 负值，轮廓向内偏移 */
```

### 列表项标记

**list-style 列表样式简写**：依次为 list-style-type → list-style-position → list-style-image；

- `list-style-type`：标记类型，`none`（无）、`disc`（实心圆）、`circle`（空心圆）、`square`（方块）、`decimal`（数字）、`lower-roman`（小写罗马数字）、`upper-alpha`（大写字母）等
- `list-style-position`：标记位置，`outside`（在盒子外，默认）、`inside`（在盒子内）
- `list-style-image`：自定义标记图片

```
list-style: decimal inside;
list-style-type: disc;
list-style-position: inside;   /* 项标记设置在父盒子内 */
```

**list-style-image 自定义标记图片**：图片大小不可设置（如需控制大小，建议用 `::before` 伪元素 + background-image 代替）；

```
list-style-image: url('icon.png');
```

### 宽高

**width / height 宽高**：

```
width: 200px;
height: 100px;
width: auto;          /* 宽度由内容或父级决定（块级元素默认撑满父级） */
height: auto;         /* 高度由内容决定（默认） */
```

**min-width / max-width 最小/最大宽度**：

```
min-width: 100px;     /* 元素最小宽度，当 width 小于 min-width 时 min-width 覆盖 width */
max-width: 500px;     /* 元素最大宽度，当 width 大于 max-width 时 max-width 覆盖 width */
max-width: 100%;       /* 响应式常用，图片不超出容器 */
```

**min-height / max-height**：同理；

**内在尺寸关键字**：

- `fit-content`：尺寸自适应内容，在 `min-content` 和 `max-content` 之间，且不超过可用空间
- `min-content`：元素尺寸由内容的**最小固有宽度**决定（即最长不可断行单词/字符的宽度，文字会尽量换行）
- `max-content`：元素尺寸由内容的**最大固有宽度**决定（即所有内容不换行时的总宽度）

```
div {
   width: fit-content;
   height: fit-content;
}
```

注意：`min-content` 和 `max-content` 的含义不要搞反——`min-content` 是最小宽度（尽量换行），`max-content` 是最大宽度（不换行）；

**aspect-ratio 宽高比**：设置元素的宽高比例。

- 如果同时明确设置了 `width` 和 `height`，则 `aspect-ratio` 不生效
- 如果只设置其中一个，另一个按比例自动计算
- 值可以是 `auto`（默认，使用元素固有比例，如图片的原始宽高比）、`width / height`（如 `16 / 9`）、或单个数字（等价于 `数字 / 1`）
- 替换元素（如 img、video）默认有固有宽高比，设置 `aspect-ratio: auto` 时使用其固有比例
- 与 `min-width`/`max-width`/`min-height`/`max-height` 联用时，会受到最小/最大尺寸的约束

```
div {
   width: 50vw;
   aspect-ratio: 1 / 1;    /* 宽高比为 1:1 */
}

.video {
   aspect-ratio: 16 / 9;   /* 16:9 视频比例 */
}

.avatar {
   width: 100px;
   aspect-ratio: 1;         /* 等价于 1 / 1，正方形 */
}

img {
   aspect-ratio: auto;      /* 使用图片固有比例 */
}
```

**zoom 缩放**：非标准但被广泛支持的属性，用于缩放元素及其内容。与 `transform: scale()` 的区别：

- `zoom` 会影响元素在文档流中的实际尺寸（会改变布局，其他元素会响应缩放后的尺寸）
- `transform: scale()` 只改变视觉渲染，不影响布局，元素仍占据原始空间
- `zoom` 缩放后元素的左上角对齐原位置（从左上角开始缩放），`transform: scale()` 默认从中心缩放
- `zoom` 不是 W3C 标准属性，但 Chrome、Safari、Edge 均支持，Firefox 从 126 版本开始支持

```
.zoom-box {
  zoom: 0.5;       /* 缩小为原来的 50% */
  zoom: 1.5;       /* 放大为原来的 150% */
  zoom: 150%;       /* 百分比写法，等价于 1.5 */
  zoom: normal;     /* 不缩放（默认） */
}
```

注意：`zoom` 会触发重排（因为改变了布局尺寸），而 `transform: scale()` 只触发合成层重绘，性能更好。做动画时优先使用 `transform`。


## 高级属性

### 盒子阴影

**box-shadow**：参数依次为水平偏移、垂直偏移、模糊半径、扩散半径、阴影颜色、`inset`（内阴影）；用逗号分隔可以设置多个阴影；

```
box-shadow: 1px 1px 3px 5px black;
box-shadow: inset 0 0 10px rgba(0,0,0,0.5);   /* 内阴影 */
box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1);  /* 多层阴影 */
```

 与 `text-shadow` 的区别：box-shadow 有扩散半径（spread），text-shadow 没有；

### 溢出

**overflow 溢出处理**：对溢出盒子部分（文字、图片）的内容进行处理；可分别用 `overflow-x` 和 `overflow-y` 控制水平和垂直方向；

- `visible`：溢出内容可见（默认）
- `hidden`：溢出部分隐藏，禁止滚动，**会创建 BFC**
- `clip`：溢出部分裁剪，完全禁止滚动（包括编程式滚动），**不会创建 BFC**
- `scroll`：无论是否溢出都显示滚动条
- `auto`：溢出时才显示滚动条

```
overflow: hidden;
overflow-x: hidden;     /* 只隐藏水平方向溢出 */
overflow-y: auto;       /* 垂直方向溢出时显示滚动条 */
```

 除 `visible` 和 `clip` 外，其他 overflow 值都会创建新的块格式化上下文（BFC）；

**overflow-clip-margin**：当 `overflow: clip` 时，设置裁剪边界距离元素边缘的距离；

```
overflow: clip;
overflow-clip-margin: 10px;   /* 裁剪边界向外扩展 10px */
```

**overflow-wrap 长文本断行**：控制当一个长单词/URL 超出容器时，是否允许在单词内部任意位置断行；旧称 `word-wrap`；

- `normal`：只在允许的断行点断行，长单词可能溢出
- `break-word`：如果长单词溢出，允许在任意位置断行（先尝试正常断行）
- `anywhere`：允许在任意位置断行，且计算 `min-content` 时也考虑断行（CSS 新增）

```
overflow-wrap: break-word;
```

注意：`overflow-wrap` 与 `text-overflow` 是两个完全不同的属性——前者控制长单词断行，后者控制溢出时显示省略号；

**word-break 文本断行规则**：控制非 CJK（中文/日文/韩文）文本的断行方式；

- `normal`：默认断行规则
- `break-all`：允许在任意字符间断行（对英文也生效，可能截断单词）
- `keep-all`：CJK 文本不断行（只能在空格/标点处断行）

```
word-break: break-all;
```

### 滚动

**scroll-behavior 平滑滚动**：设置滚动行为，如使用锚点链接或 `scrollIntoView()` 时使滚动平滑；

```
html {
  scroll-behavior: smooth;
}
```

**scroll-margin 滚动外边距**：设置元素被滚动定位（如锚点跳转、`scrollIntoView`）时的外边距，使元素不会紧贴视口边缘；赋值和 margin 类似，也有 `scroll-margin-top` 等子属性；

```
div {
  scroll-margin: 20px;     /* 锚点跳转时元素距视口顶部留 20px 间距 */
}
```

**scroll-padding 滚动内边距**：设置滚动容器的内边距，用于滚动吸附和锚点定位时给容器内容留出安全区域；

```
.container {
  scroll-padding: 20px;
  scroll-padding-top: 60px;   /* 顶部留出固定导航栏高度 */
}
```

**scroll-snap-type 滚动捕捉**：控制滚动容器的滚动捕捉行为，决定父容器在滚动结束时是否自动吸附到子元素的捕捉点；

- 第一个参数：滚动方向（`x`、`y`、`both`、`block`、`inline`）
- 第二个参数：捕捉严格程度
  - `mandatory`：滚动一旦停止，容器必须吸附到最近的捕捉点
  - `proximity`：仅当滚动结束位置离捕捉点足够近时才吸附

**scroll-snap-align**：给子元素设置捕捉点的位置，`start`（起始边缘对齐）、`center`（中心对齐）、`end`（结束边缘对齐）；

```
.parent {
  width: 500px;
  height: 500px;
  overflow: auto;
  scroll-snap-type: y mandatory;
}
.child {
  width: 300px;
  height: 300px;
  scroll-snap-align: start;
}
```

### 鼠标与交互

**cursor 鼠标光标样式**：鼠标悬浮在元素上时光标的样式；

```
cursor: default;        /* 默认箭头 */
cursor: pointer;        /* 小手（可点击） */
cursor: move;           /* 移动拖拽 */
cursor: text;           /* I 型（文本选择） */
cursor: not-allowed;    /* 禁止 */
cursor: wait;           /* 等待（沙漏/转圈） */
cursor: help;           /* 帮助（问号） */
cursor: crosshair;      /* 十字准星 */
cursor: grab;            /* 可抓取 */
cursor: grabbing;        /* 抓取中 */
cursor: zoom-in;         /* 放大 */
cursor: zoom-out;        /* 缩小 */
cursor: url('custom.cur'), auto;  /* 自定义光标图片 */
```

**caret-color 输入光标颜色**：设置输入框、contenteditable 元素中文字插入光标的颜色；

```
input {
  caret-color: red;
}
```

**user-select 文本选择控制**：控制用户是否可以选中文本；

```
user-select: none;       /* 禁止选中文本（常用于按钮、标签） */
user-select: text;       /* 可以选中文本 */
user-select: all;        /* 点击即选中全部内容 */
user-select: auto;       /* 默认行为 */
```

**accent-color 表单控件强调色**：设置单选框、复选框、进度条等原生表单控件的主题色；

```
input[type='checkbox'] {
  accent-color: #4285f4;
}
```

**pointer-events 事件响应**：控制元素（包括其子元素）是否成为鼠标/触摸事件的目标；

- `auto`：默认，元素可以响应事件
- `none`：元素不响应任何鼠标事件（点击会穿透到下方元素），但子元素可以通过设置 `pointer-events: auto` 重新启用

```
pointer-events: none;
```

### 裁剪

**clip-path**：使用裁剪方式创建元素的可显示区域，其他部分隐藏；

- `circle()`：圆形（半径 + 圆心位置）
- `ellipse()`：椭圆（两个半径 + 圆心位置）
- `inset()`：矩形裁剪（上下左右内边距，可设圆角）
- `polygon()`：多边形（一组顶点坐标）

CSS 裁剪工具：https://css.bqrdh.com/clip-path/editor

```
clip-path: circle(50% at 50% 50%);                          /* 圆形 */
clip-path: ellipse(50% 40% at 50% 50%);                     /* 椭圆 */
clip-path: inset(10px 20px round 5px);                       /* 矩形内缩，带圆角 */
clip-path: polygon(50% 0%, 0% 100%, 100% 100%);            /* 三角形 */
```

### 滤镜

**filter 滤镜**：针对元素自身（包括其内容）添加滤镜效果，多个滤镜函数用空格分隔；

```
filter: blur(1px);              /* 模糊 */
filter: grayscale(100%);        /* 灰度（单位 % 或 0-1 小数） */
filter: brightness(1.5);        /* 亮度（1 为正常，0 全黑） */
filter: contrast(1.2);          /* 对比度 */
filter: saturate(1.5);          /* 饱和度 */
filter: sepia(100%);            /* 褐色（老照片效果） */
filter: hue-rotate(90deg);      /* 色相旋转 */
filter: invert(100%);           /* 反色 */
filter: opacity(50%);            /* 透明度（与 opacity 属性类似） */
filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));  /* 投影（跟随元素形状，不是矩形） */

filter: blur(2px) brightness(1.2) contrast(1.1);     /* 多个滤镜组合 */
```

`drop-shadow` 与 `box-shadow` 的区别：drop-shadow 的阴影跟随元素的实际形状（如透明 PNG 的轮廓），box-shadow 是元素盒子的矩形阴影；

### 背景渐变

只能给 `background`（或 `background-image`）添加，同一个背景可以添加多个渐变函数（用逗号隔开），第一个渐变函数层级最高，可以使用透明来实现多方向渐变；

**linear-gradient 线性渐变**：参数为旋转方向 + 颜色列表（可带色标位置）；

```
background: linear-gradient(to left, red 50%, blue);    /* 终止方向为左边 */
background: linear-gradient(45deg, red, blue, green);   /* 渐变线旋转 45 度 */
background: linear-gradient(red 0%, red 30%, blue 30%, blue 100%);  /* 硬边界渐变 */
```

**radial-gradient 径向渐变**：由中心向外辐射；参数为形状/大小 + 圆心位置 + 颜色列表；

```
background: radial-gradient(at center, red 50%, blue);
background: radial-gradient(circle at 30% 30%, red, blue);    /* 圆形渐变 */
background: radial-gradient(ellipse at center, red, blue);      /* 椭圆渐变（默认） */
```

**conic-gradient 锥形渐变**：围绕一个中心点以旋转方式实现颜色渐变，建议首尾相同颜色，不然会出现断层；

```
/* 从 40 度开始渐变，中心坐标 50% 50% */
background: conic-gradient(from 40deg at 50% 50%, red, blue, green, red);

/* 设置每个颜色的角度范围（饼图效果） */
background: conic-gradient(red 0deg 120deg, green 120deg 240deg, blue 240deg 360deg);
```

**repeating-linear-gradient 重复线性渐变**：

```
background: repeating-linear-gradient(to right, red, blue 100px);
```

**repeating-radial-gradient 重复径向渐变**：

```
background: repeating-radial-gradient(circle, red, blue 50px);
```

**repeating-conic-gradient 重复锥形渐变**：

```
background: repeating-conic-gradient(red 0deg 30deg, blue 30deg 60deg);
```

### 过渡

**transition**：为元素从一个状态到另一个状态的变化设置过渡效果，如 `:hover`、`:focus`、JS 引起的状态改变；

属性值依次是：过渡属性、持续时间、运动曲线、延迟时间；不同属性用逗号隔开可设置多组过渡；

```
div {
   width: 0px;
   height: 0px;
   border: 1px solid;
   transition: all 3s linear 1s;     /* 所有属性过渡，持续 3s，匀速，延迟 1s */
}

div:hover {
   width: 100px;
   height: 100px;
}
```

**transition 子属性**：

```
transition-property: width, height;    /* 指定过渡的属性，all 表示所有可动画属性 */
transition-duration: 0.3s;              /* 持续时间 */
transition-timing-function: ease;       /* 运动曲线 */
transition-delay: 0s;                    /* 延迟时间 */
```

**transition-timing-function 运动曲线**：

```
transition-timing-function: linear;             /* 匀速 */
transition-timing-function: ease;               /* 慢-快-慢（默认） */
transition-timing-function: ease-in;            /* 慢入快出 */
transition-timing-function: ease-out;           /* 快入慢出 */
transition-timing-function: ease-in-out;        /* 慢入慢出 */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);  /* 自定义贝塞尔曲线 */
transition-timing-function: steps(5, end);      /* 分步执行（逐帧动画） */
```

注意：`display`、`visibility` 等非数值属性不能平滑过渡（`visibility` 可以在 visible/hidden 间切换但没有中间态）；

### 关键帧动画

**animation**：属性值依次为：

1. `animation-name`：关键帧名
2. `animation-duration`：持续时间
3. `animation-timing-function`：速度曲线（`linear` 匀速、`steps(5)` 按步走、`cubic-bezier()` 自定义）
4. `animation-delay`：延迟时间
5. `animation-iteration-count`：播放次数（`infinite` 无限次）
6. `animation-direction`：播放方向（`normal` 正常、`reverse` 反向、`alternate` 交替、`alternate-reverse` 反向交替）
7. `animation-fill-mode`：结束后状态
8. `animation-play-state`：播放状态（`running` 播放、`paused` 暂停）

用逗号隔开可以设置多组动画；

```
@keyframes flex {
    0% {
        width: 100px;
        height: 100px;
    }
    50% {
        width: 500px;
        height: 500px;
    }
    100% {
        width: 100px;
        height: 100px;
    }
}
div {
    background-color: aqua;
    animation: flex 5s linear 1s infinite normal both;
}
```

**animation-fill-mode 填充模式**：控制动画在执行前后如何将样式应用于目标；

- `none`：默认，动画前后不应用任何关键帧样式
- `forwards`：动画结束后保持最后一帧的样式（最后一帧取决于 direction 和 iteration-count）
- `backwards`：在 `animation-delay` 延迟期间应用第一帧的样式（不是"回到初始状态"！）
- `both`：同时应用 forwards 和 backwards 的效果

```
animation-fill-mode: both;    /* 最常用，延迟期间显示第一帧，结束后保持最后一帧 */
```

**animation-play-state 动画暂停**：

```
animation-play-state: paused;     /* 暂停 */
animation-play-state: running;    /* 继续播放 */
```

常用技巧：`div:hover { animation-play-state: paused; }` 实现鼠标悬停暂停动画；

**will-change 性能优化**：告知浏览器元素即将发生哪些属性变化，让浏览器提前做好优化准备（如创建合成层）；不要滥用，用完后移除；

```
will-change: transform, opacity;   /* 即将变化 transform 和 opacity */
```

**animation-timeline 滚动驱动时间线**：将 CSS 动画与特定的时间线（如滚动进度、视图变化）绑定，无需 JS 即可实现滚动动画；

- `scroll()`：基于滚动容器的滚动进度
- `view()`：基于元素进入/离开视口的过程

```
animation-timeline: view();    /* 元素进入视口到离开视口的过程播放动画 */
```

**animation-range 动画执行区间**：精确控制动画在时间线进度中的执行区间；

- `cover`：元素边缘接触视口边缘时触发（默认）
- `entry` / `exit`：分别对应元素进入 / 离开视口的阶段

```
animation-range: entry 20% exit 50%;
```

### 尺寸调节

**resize**：允许用户调节盒子的大小；适用于块级元素、`inline-block`、`table-cell` 等，并且 `overflow` 不能设置为 `visible`，一般和 `textarea` 搭配使用；

- `none`：不能调节大小
- `both`：垂直和水平方向都可调节
- `horizontal`：只能调节水平方向
- `vertical`：只能调节垂直方向
- `block` / `inline`：逻辑属性方向（CSS 新增）

```
div {
   height: 100px;
   width: 100px;
   border: 1px solid;
   overflow: auto;
   resize: both;
}
```

### 外边距

**margin**：盒子与盒子之间的距离，可用于行内、行内块、块级元素；但是**行内元素的 margin-top 和 margin-bottom 不生效**（水平方向生效），表格的 `td` 元素使用 `border-spacing` 而非 margin；

```
div {
   margin: 上 右 下 左;     /* 四个值：上、右、下、左（顺时针） */
   margin: 上下 左右;         /* 两个值：上下、左右 */
   margin: 0 auto;            /* 块级元素水平居中（需设置 width） */
}
```

**上下兄弟元素外边距重叠（塌陷）**：上下相邻兄弟元素的 margin-bottom 和 margin-top 会重叠，实际间距取两者中的较大值（不是相加）；

**父子元素外边距重叠**：主要发生在父子都是块级元素且没有边框/内边距分隔时；解决方法：
- 给父元素设置 `border`
- 给父元素设置 `padding`
- 给父元素设置 `overflow: hidden`（或非 visible 的值）
- 给父元素设置 `display: flow-root`（推荐，专门用于创建 BFC）
- 使用 flex/grid 布局（子元素不会发生 margin 塌陷）

### 内边距

**padding**：父盒子与子盒子（内容）之间的距离，适用于行内、行内块、块级元素；对于行内元素，padding 在视觉上会显示但不会影响其垂直方向的布局高度（水平方向正常影响）；

```
div {
   padding: 上 右 下 左;
   padding: 上下 左右;
}
```

### 计数器

CSS 计数器可以自动给元素编号，无需 JS；

**counter-reset**：创建或重置计数器；
**counter-increment**：递增计数器值；
**counter()**：在 `content` 中显示计数器值；

```
ol {
  counter-reset: section;     /* 创建名为 section 的计数器，初始值 0 */
  list-style: none;
}
li {
  counter-increment: section;  /* 每个 li 使 section 计数器 +1 */
}
li::before {
  content: '第 ' counter(section) ' 章：';  /* 显示计数器值 */
}
```

计数器可以嵌套，使用 `counters(name, separator)` 显示嵌套编号（如 1.1、1.2）；

### WebKit 浏览器滚动条样式

`::-webkit-scrollbar` 是 WebKit 系浏览器（Chrome、Safari、Edge）的私有伪元素，用于自定义滚动条样式；一旦设置任何属性，默认滚动条样式就会消失，需要完整定义；标准方案正在制定中（`scrollbar-width`、`scrollbar-color`）；

**::-webkit-scrollbar 整个滚动条**：

```
div::-webkit-scrollbar {
    width: 10px;          /* 垂直滚动条的宽度 */
    height: 10px;         /* 水平滚动条的高度 */
    background-color: #f5f5f5;
}
```

**::-webkit-scrollbar-thumb 滚动条滑块**：

```
div::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
}

/* 只有滚动时才显示滑块（悬停才出现） */
div::-webkit-scrollbar-thumb {
    background-color: transparent;
}
div:hover::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 5px;
}
```

**::-webkit-scrollbar-track 滚动条轨道**：

```
div::-webkit-scrollbar-track {
    background-color: #f5f5f5;
}
```

**::-webkit-scrollbar-button 滚动条按钮（上下箭头）**：

```
div::-webkit-scrollbar-button {
    background-color: #ccc;
}
```

**::-webkit-scrollbar-corner 水平和垂直滚动条交叉部分**：

```
div::-webkit-scrollbar-corner {
    background-color: #f5f5f5;
}
```

## CSS 变量

使用 `--变量名` 的格式定义，通常在 `:root` 伪类中声明（全局可用），也可以在特定选择器中声明（仅该选择器及其子元素可用，支持作用域和覆盖）；

通过 `var(--变量名, 默认值)` 引用变量（默认值可选，变量未定义时使用）；

CSS 变量可以通过 JS 动态修改，也可以在媒体查询中重新赋值实现主题切换；**不能直接用于媒体查询条件**；

```
:root {
  --primary-color: #4285f4;
  --font-size: 16px;
  --spacing: 20px;
}

.card {
  --card-bg: white; /* 局部变量，仅在 .card 及其子元素中可用 */
}

.button {
  background-color: var(--primary-color);
  font-size: var(--font-size);
  padding: var(--spacing);
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-color, #ccc); /* 变量未定义时使用 #ccc 兜底 */
}

/* JS 动态修改变量 */
/* document.documentElement.style.setProperty('--primary-color', '#ff0000'); */
```


## CSS 值函数

### calc() 计算函数

可以进行 `+`、`-`、`*`、`/` 计算，支持不同单位混合运算；

注意：`+` 和 `-` 两边必须有空格，否则会被解析为负数或连字符；`*` 和 `/` 没有这个要求但建议也加空格；

```
width: calc(100px + 50%);
width: calc(100% - 80px);
width: calc(100vw - 2 * var(--sidebar-width));
font-size: calc(16px + 0.5vw);
```

### min() 取最小值

从多个值中取最小的那个作为最终值；

```
width: min(500px, 80%);    /* 取 500px 和 80% 中较小的 */
font-size: min(24px, 3vw); /* 响应式字体，不超过 24px */
```

### max() 取最大值

从多个值中取最大的那个作为最终值；

```
width: max(300px, 50%);    /* 取 300px 和 50% 中较大的 */
font-size: max(14px, 2vw); /* 响应式字体，不小于 14px */
```

### clamp() 值限制函数

将一个值约束在最小值和最大值之间，同时优先使用首选值；等价于 `max(min, min(preferred, max))`；

```
clamp(最小值, 首选值, 最大值);

.title {
  font-size: clamp(16px, 2vw, 24px);  /* 字体最小 16px，最大 24px，正常跟随 2vw */
}
```

### fit-content() 自适应函数

尺寸在 `min-content` 和 `max-content` 之间，且不超过指定的 `size`；

```
div {
  width: fit-content(500px); /* 内容宽若小于 500px 用内容宽，否则最大 500px */
}
```

### attr() 获取属性函数

根据 HTML 属性获取属性值，目前主要用于 `content` 属性中；

```
a::after {
  content: ' (' attr(href) ')';  /* 在链接后显示 URL */
}
```

`attr()` 在其他属性（如 width、color）中的使用仍处于实验阶段，浏览器支持有限；

## 层叠与继承

### 继承

某些 CSS 属性会自动从父元素继承到子元素，如 `color`、`font-size`、`font-family`、`line-height`、`text-align` 等；布局相关属性（如 `width`、`height`、`margin`、`padding`、`border`）默认不继承；

**继承关键字**：

```
color: inherit;     /* 强制继承父元素的值 */
color: initial;     /* 恢复为属性的初始值（默认值） */
color: revert;      /* 恢复为浏览器默认样式表的值（撤销作者样式） */
color: revert-layer;/* 恢复为上一层叠层的值 */
color: unset;       /* 如果属性可继承则 inherit，否则 initial */
```

### !important

`!important` 会覆盖所有优先级规则，但不建议滥用，会破坏层叠机制导致难以维护；应优先通过提高选择器优先级来覆盖样式；

```
color: red !important;
```

### @layer 层叠层级（CSS 新增）

通过 `@layer` 定义样式层级，后声明的层级优先级更高，可以更优雅地管理样式覆盖顺序，替代 `!important` 的滥用；

```
@layer base, components, utilities;  /* 声明层级顺序，越靠后优先级越高 */

@layer base {
  p { color: #333; }
}

@layer components {
  .text { color: blue; }    /* 优先级高于 base 层 */
}

@layer utilities {
  .text-red { color: red; } /* 优先级最高 */
}
```

### @supports 特性查询

检测浏览器是否支持某个 CSS 特性，根据支持情况应用不同样式；

```
@supports (display: grid) {
  .container { display: grid; }   /* 支持 grid 时使用 */
}

@supports not (backdrop-filter: blur(10px)) {
  .modal { background: rgba(255,255,255,0.9); }  /* 不支持时用半透明背景兜底 */
}

@supports (aspect-ratio: 1 / 1) and (display: flex) {
  /* 同时支持多个特性时 */
}
```


## 混合模式

**mix-blend-mode 元素混合模式**：控制元素内容与其下方元素的混合方式；

```
mix-blend-mode: normal;          /* 正常（默认） */
mix-blend-mode: multiply;        /* 正片叠底 */
mix-blend-mode: screen;          /* 滤色 */
mix-blend-mode: overlay;         /* 叠加 */
mix-blend-mode: darken;          /* 变暗 */
mix-blend-mode: lighten;         /* 变亮 */
mix-blend-mode: color-dodge;     /* 颜色减淡 */
mix-blend-mode: color-burn;      /* 颜色加深 */
mix-blend-mode: hard-light;      /* 强光 */
mix-blend-mode: soft-light;      /* 柔光 */
mix-blend-mode: difference;      /* 差值 */
mix-blend-mode: exclusion;       /* 排除 */
mix-blend-mode: hue;             /* 色相 */
mix-blend-mode: saturation;      /* 饱和度 */
mix-blend-mode: color;           /* 颜色 */
mix-blend-mode: luminosity;      /* 亮度 */
```

**background-blend-mode 背景层混合**：控制同一元素的多张背景图片/渐变之间的混合方式；

```
background-blend-mode: multiply;
```

**isolation 隔离**：创建新的堆叠上下文，使元素内部的混合模式只在元素内部生效，不与外部元素混合；

```
isolation: isolate;    /* 创建隔离，mix-blend-mode 不会影响外部元素 */
```
