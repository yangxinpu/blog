
SVG（Scalable Vector Graphics）可缩放矢量图，是一种基于 XML 语法的图像格式，通过数学公式和几何指令（而非像素）来定义图形。它用"路径""线条""曲线""形状"等几何元素及其属性（颜色、填充、描边等）来描述图像，在放大、缩小、旋转时不会失真。

SVG 与 Canvas 的对比：

| 特性   | SVG            | Canvas       |
| ---- | -------------- | ------------ |
| 图形类型 | 矢量（数学描述）       | 位图（像素）       |
| 缩放   | 不失真            | 放大会模糊        |
| 事件处理 | 每个元素可单独绑定事件    | 需手动计算坐标      |
| 性能   | 大量元素时 DOM 开销大  | 大量元素时性能好     |
| 适用场景 | 图标、图表、可交互图形、动画 | 游戏、图像处理、复杂动画 |

SVG 的使用方式：

1. **内联 SVG**：直接写在 HTML 中，可被 CSS 和 JS 操作，适合图标和交互图形；
2. **`<img>` 引用**：`<img src="icon.svg">`，简单但无法用 CSS 控制内部样式；
3. **CSS 背景图**：`background-image: url('icon.svg')`，适合装饰性图形；
4. **`<object>` / `<iframe>`**：可交互但较少用；
5. **独立 .svg 文件**：需要 XML 声明和 svg 根标签。

## 图形标签：

### svg 标签

所有 SVG 相关标签都要包含在 `<svg>` 根标签内。SVG 元素默认是行内替换元素，可设置宽高。超出 SVG 视口的内容默认会被裁剪（`overflow: hidden`）。

常用属性：

- `width` / `height`：SVG 在页面中的显示尺寸；
- `viewBox="min-x min-y width height"`：定义用户坐标系的可见区域，四个参数分别是左上角坐标和宽高。浏览器会将 viewBox 区域映射（缩放）到 SVG 的显示区域，实现响应式缩放；
- `preserveAspectRatio`：控制 viewBox 与显示区域比例不一致时的对齐和缩放方式，默认 `xMidYMid meet`（居中、等比缩放、完整显示）；
- `xmlns="http://www.w3.org/2000/svg"`：XML 命名空间，独立 .svg 文件必须声明，HTML 内联时可省略。

```
<!-- 独立 .svg 文件需要 XML 声明 -->
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50"></circle>
</svg>
```

`preserveAspectRatio` 常用值：

- `xMidYMid meet`（默认）：等比缩放，完整显示，居中对齐；
- `xMidYMid slice`：等比缩放，填满容器，超出部分裁剪；
- `none`：拉伸填满，不保持比例。

### circle 圆标签

属性：`cx` / `cy`（圆心坐标），`r`（半径）。

 SVG2 中几何属性（cx、cy、r、x、y、width、height 等）可作为 CSS 属性设置，现代浏览器均支持。

```
/* CSS 样式 */
.myCircle {
    fill: red;
    stroke: aqua;        /* 描边颜色 */
    stroke-width: 3px;
}

<circle cx="50" cy="50" r="50" class="myCircle"></circle>
```

### line 直线标签

属性：`x1` / `y1`（起点坐标），`x2` / `y2`（终点坐标）。

```
/* CSS 样式 */
.myLine {
    stroke: aqua;        /* 线的颜色 */
    stroke-width: 3px;
}

<line x1="0" y1="0" x2="50" y2="50" class="myLine"/>
```

### polyline 折线标签

属性：`points`（各折点坐标，格式为 `x1,y1 x2,y2 x3,y3`，点之间用空格分隔）。

```
/* CSS 样式 */
.myPolyline {
    stroke: aqua;
    stroke-width: 3px;
    fill: none;           /* 设置围成的区域无填充 */
}

<polyline points="3,3 35,99 74,8" class="myPolyline"/>
```

### rect矩形标签

属性：x/y（左上角的坐标），width/height（宽高），rx/ry（x轴和y轴上的圆角半径）

```
<rect x="50" y="50" width="25" height="25" class="myRect"/>
```

### ellipse 椭圆标签

属性：`cx` / `cy`（椭圆圆心），`rx`（x 轴半径），`ry`（y 轴半径）。

```
<ellipse cx="50" cy="50" rx="50" ry="35" class="myEllipse"/>
```

### polygon 多边形标签

属性：`points`（各顶点坐标，与 polyline 格式相同）。与 polyline 的区别是 polygon 会自动闭合起点和终点。

```
<polygon points="50,0 0,100 100,100" class="myPolygon"/>
```

### path 路径标签

`d` 属性定义路径数据，由一系列命令和参数组成。命令大写表示绝对坐标，小写表示相对坐标。

常用命令：

- `M x y`：移动到起点（moveto）；
- `L x y`：画直线到指定点（lineto）；
- `H x`：水平直线（x 不变，y 移动到指定值）；
- `V y`：垂直直线（y 不变，x 移动到指定值）；
- `C x1 y1, x2 y2, x y`：三阶贝塞尔曲线，两个控制点和一个终点；
- `S x2 y2, x y`：平滑三阶贝塞尔曲线，第一个控制点由前一个 C/S 的控制点镜像推断；
- `Q x1 y1, x y`：二阶贝塞尔曲线，一个控制点和一个终点；
- `T x y`：平滑二阶贝塞尔曲线，控制点由前一个 Q/T 推断；
- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y`：椭圆弧线；
- `Z`：闭合路径，将终点与起点用直线连接。

**A 命令参数详解**（7 个参数）：

1. `rx`、`ry`：椭圆的 x 轴半径和 y 轴半径；
2. `x-axis-rotation`：椭圆 x 轴旋转角度；
3. `large-arc-flag`：`0` 取小弧，`1` 取大弧；
4. `sweep-flag`：`0` 逆时针绘制，`1` 顺时针绘制；
5. `x`、`y`：终点坐标。

```
<path d="M 0,0 L 50,50 V 80 Q 0 180 50 230 T 50 190" fill="none" stroke="red" stroke-width="3" />

<!-- 三阶贝塞尔曲线 -->
<path d="M 10,50 C 10,90 90,90 90,50" fill="none" stroke="blue" stroke-width="3" />

<!-- 椭圆弧线 -->
<path d="M 10,80 A 45,45 0 0,1 100,80" fill="none" stroke="green" stroke-width="3" />
```

### text 文本标签

属性：`x` / `y`（文本位置坐标，y 是文本基线的位置，不是左上角）。

常用属性：

- `text-anchor`：水平对齐方式，`start`（默认）/ `middle` / `end`；
- `dominant-baseline`：垂直基线对齐，`auto` / `middle` / `hanging` / `central`；
- `font-family`、`font-size`、`font-weight`：字体属性（也可用 CSS）；
- `fill`：文字填充颜色；
- `stroke`：文字描边颜色。

```
/* CSS 样式 */
.myText {
    stroke: aqua;
    stroke-width: 1px;
    fill: none;           /* 文字填充颜色，none 表示空心文字 */
    font-size: 16px;
}

<text x="0" y="50" class="myText">Hello World</text>

<!-- 居中文字 -->
<text x="100" y="50" text-anchor="middle" dominant-baseline="central">居中</text>
```

**tspan**：文本片段，可在 text 内设置不同样式或换行。

```
<text x="10" y="30">
  <tspan fill="red">第一行</tspan>
  <tspan x="10" dy="20" fill="blue">第二行</tspan>
</text>
```

### marker 标记标签

用于定义标记（如箭头、点、符号），可被其他图形的 `marker-start`、`marker-mid`、`marker-end` 属性引用。

属性：

- `id`：被引用的标识；
- `refX` / `refY`：标记对齐点坐标（标记的哪个点对准路径端点）；
- `markerWidth` / `markerHeight`：标记视口宽高；
- `orient`：标记朝向，`auto` 自动根据路径旋转，也可指定角度；
- `markerUnits`：`strokeWidth`（默认，标记随线宽缩放）/ `userSpaceOnUse`。

```
<!-- 创建一个箭头 -->
<marker id="arrow"
    refX="9" refY="5"
    markerWidth="10"
    markerHeight="10"
    orient="auto">
    <polygon points="0,0 10,5 0,10"/>
</marker>

<!-- 使用箭头 -->
<line class="xAxis" x1="100" y1="400" x2="700" y2="400" marker-end="url(#arrow)"/>
```

### transform 变换

`transform` 属性对元素进行坐标变换，多个变换用空格分隔，从左到右依次执行。

- `translate(x, y)`：平移；
- `rotate(angle, cx, cy)`：旋转（角度制，顺时针），可选旋转中心；
- `scale(sx, sy)`：缩放；
- `skewX(angle)` / `skewY(angle)`：倾斜；
- `matrix(a, b, c, d, e, f)`：矩阵变换。

```
<rect x="0" y="0" width="50" height="50" fill="blue"
      transform="translate(100, 50) rotate(45) scale(1.5)"/>

<!-- 绕指定点旋转 -->
<circle cx="100" cy="100" r="30" fill="red"
        transform="rotate(45, 100, 100)"/>
```

 变换顺序很重要：`translate(100) rotate(45)` 与 `rotate(45) translate(100)` 结果不同。SVG 的 transform 是右乘，先写的变换先执行。

### image 图片

嵌入位图图片（PNG、JPG、WebP 等）到 SVG 中。

属性：`href` / `xlink:href`（图片 URL），`x` / `y`（位置），`width` / `height`（尺寸），`preserveAspectRatio`（缩放方式）。

```
<image href="photo.jpg" x="0" y="0" width="200" height="150"
       preserveAspectRatio="xMidYMid slice"/>
```

跨域图片需要服务端支持 CORS，否则会污染画布（当 SVG 被绘制到 canvas 时）。

### symbol 符号

定义可复用的图形模板，放在 `<defs>` 中，通过 `<use>` 引用。与直接用 g 的区别是 symbol 本身不渲染，且可以有自己的 viewBox 和 preserveAspectRatio。

```
<defs>
    <symbol id="icon-heart" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </symbol>
</defs>

<use href="#icon-heart" width="24" height="24" fill="red"/>
<use href="#icon-heart" x="30" width="24" height="24" fill="pink"/>
```

 symbol 配合 use 是 SVG 图标系统（SVG sprite）的基础。

## 功能标签：

### use 复制标签

根据 id 引用并渲染一个已定义的元素（通常放在 `<defs>` 中），实现元素复用。use 元素是引用，不是独立的克隆节点，引用的元素样式会继承。

属性：

- `href`：指定要引用元素的 id（SVG2 推荐，现代浏览器支持）；
- `xlink:href`：SVG1.1 写法，需声明 `xmlns:xlink`，兼容旧浏览器；
- `x` / `y`：相对于引用元素原始位置的偏移量。

```
<circle id="circle1" cx="50" cy="50" r="50" class="myCircle"/>
<use href="#circle1" x="10" y="10" />
```

use 引用的元素本身不会渲染（除非不在 defs 中），use 元素按文档顺序参与层级。引用的元素的 fill/stroke 等样式可被 use 元素上的样式覆盖（使用 `currentColor` 或 CSS 变量可实现主题化）。

### g 组标签

创建图形组，可对组内所有图形统一设置样式、变换或事件。g 元素本身不渲染，只作为容器。

```
<g id="circle" fill="blue" stroke="white" stroke-width="2">
    <circle cx="50" cy="50" r="50"/>
    <circle cx="0" cy="0" r="50"/>
</g>

<use href="#circle" x="0" y="50" />
```

g 上设置的样式会被子元素继承，但子元素自身的样式优先级更高。transform 也可设置在 g 上，对组内所有元素生效。

### defs 定义标签

`<defs>` 内的所有元素不会直接渲染在页面中，只供其他元素通过 `url(#id)` 或 `<use>` 引用。常用于定义渐变、图案、标记、裁剪路径、蒙版、滤镜等可复用资源。

```
<defs>
    <!-- g 标签内容不会直接显示到页面 -->
    <g id="circle">
        <circle cx="50" cy="50" r="50" class="myCircle"/>
        <circle cx="0" cy="0" r="50" class="myCircle"/>
    </g>
</defs>

<use href="#circle" x="0" y="50" />
```

### linearGradient 线性渐变

定义线性渐变，放在 `<defs>` 中，通过 `fill="url(#id)"` 引用。

属性：`x1` / `y1`（起点），`x2` / `y2`（终点），`gradientUnits`（`objectBoundingBox` 默认 / `userSpaceOnUse`）。

```
<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff0000"/>
        <stop offset="50%" stop-color="#00ff00"/>
        <stop offset="100%" stop-color="#0000ff"/>
    </linearGradient>
</defs>

<rect width="200" height="100" fill="url(#bg)"/>
```

`<stop>` 属性：`offset`（位置 0%-100%），`stop-color`（颜色），`stop-opacity`（不透明度）。

### radialGradient 径向渐变

定义径向渐变，从内向外扩散。

属性：`cx` / `cy`（中心点），`r`（半径），`fx` / `fy`（焦点）。

```
<defs>
    <radialGradient id="ball" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="100%" stop-color="#333"/>
    </radialGradient>
</defs>

<circle cx="100" cy="100" r="80" fill="url(#ball)"/>
```

### clipPath 裁剪

定义裁剪路径，路径内的内容可见，路径外的被裁剪。

```
<defs>
    <clipPath id="circleClip">
        <circle cx="100" cy="100" r="80"/>
    </clipPath>
</defs>

<rect width="200" height="200" fill="blue" clip-path="url(#circleClip)"/>
```

### mask 蒙版

定义蒙版，蒙版中的黑色区域透明，白色区域不透明，灰色为半透明。与 clipPath 的区别是 mask 支持半透明过渡。

```
<defs>
    <mask id="fadeMask">
        <rect width="200" height="200" fill="white"/>
        <circle cx="100" cy="100" r="60" fill="black"/>
    </mask>
</defs>

<rect width="200" height="200" fill="blue" mask="url(#fadeMask)"/>
```

### filter 滤镜

定义滤镜效果，放在 `<defs>` 中，通过 `filter="url(#id)"` 引用。常用滤镜原语：

- `feGaussianBlur`：高斯模糊；
- `feDropShadow`：投影；
- `feColorMatrix`：颜色矩阵变换（可实现灰度、反色等）；
- `feOffset`：偏移；
- `feMerge`：合并多个滤镜层。

```
<defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
    </filter>

    <filter id="blur">
        <feGaussianBlur stdDeviation="3"/>
    </filter>
</defs>

<rect width="100" height="100" fill="blue" filter="url(#shadow)"/>
<circle cx="150" cy="150" r="50" fill="red" filter="url(#blur)"/>
```

### pattern填充标签

可将内部的元素填充到另一个元素中

属性：x/y（填充图案的起始偏移位置）；width/height（每一个填充图案的宽高）；patternUnits（填充图案的坐标系，userSpaceOnUse表示以svg标签为坐标，objectBoundingBox表示以被填充的图形为坐标）

```
<defs>
    <pattern id="circle" x="0" y="0" width="10" height="10"
        patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="5" style="fill: aqua;"/>
    </pattern>            
</defs>

<rect x="0" y="0" width="100" height="100" fill="url(#circle)"/>
```

### animate 动画标签

嵌套在图形标签中，给图形属性添加动画，可添加多个动画。复杂动画推荐使用 CSS 或 JS。

常用属性：

- `attributeName`：要动画的属性名（如 x、fill、opacity）；
- `attributeType`：属性类型，`CSS` / `XML` / `auto`（默认）；
- `from` / `to`：起始值 / 结束值；
- `values`：多个关键帧值，用分号分隔；
- `dur`：持续时间；
- `repeatCount`：播放次数，`indefinite` 无限循环；
- `begin`：延迟开始时间；
- `fill`：动画结束后状态，`freeze` 保持结束状态 / `remove` 恢复初始。

```
<svg>
    <rect x="0" y="0" width="50" height="50" fill="green">
        <animate attributeName="x" from="0" to="150" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="fill" values="green;red;blue;green" dur="3s" repeatCount="indefinite"/>
    </rect>
</svg>
```

**animateTransform**：动画 transform 属性（平移、旋转、缩放），普通 animate 无法动画 transform。

```
<rect width="50" height="50" fill="blue">
    <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 25 25"
        to="360 25 25"
        dur="2s"
        repeatCount="indefinite"/>
</rect>
```

`type` 可选：`translate`、`rotate`、`scale`、`skewX`、`skewY`。

## 常用样式：

### stroke

描边颜色

### stroke-width

描边宽度

### stroke-linecap

控制开放路径（直线、折线、曲线）两端的外观，闭合路径不可用。

值：

- `butt`（默认）：平端，不添加额外长度；
- `round`：圆端，添加半个线宽的半圆形；
- `square`：方端，添加半个线宽的方形。

### stroke-linejoin

用于决定了当路径改变方向时（如折线、多边形的角点），线段如何连接

值：miter（尖角连接，默认）；round（圆角连接，半径等于线宽的一半）；bevel （斜切连接）

### stroke-dasharray

定义描边为虚线,参数为实线-间隙-实线-间隙...

```
stroke-dasharray: 5;           /* 每条虚线长度和间隔都为 5 */
stroke-dasharray: 5,10;        /* 虚线长度为 5，间隔为 10 */
stroke-dasharray: 5,10,10,3;   /* 长度 5、间隔 10、长度 10、间隔 3，循环 */
```

圆形进度条：先把描边设置为长度为0，间距为周长的虚线，然后把长度增加到周长，间距减少为0；

```
/* CSS 样式 */
svg:hover #progress {
    stroke-linecap: round;
    stroke-dasharray: 250,0;
}
.myCircle {
    stroke: rgb(180, 187, 187);
    stroke-width: 7px;
    fill: none;
}
#progress {
    stroke-width: 7px;
    stroke-dasharray: 0,250;
    fill: none;
    transition: all 5s linear;
}

<circle cx="50" cy="50" r="40" class="myCircle"/>
<circle cx="50" cy="50" r="40" id="progress"/>
```

### stroke-dashoffset

描边虚线的偏移量，正值向左偏移，负值向右偏移。常与 stroke-dasharray 配合实现描边动画（如圆形进度条、路径绘制动画）。

```
stroke-dashoffset: 10;
```

### fill 填充

- `fill`：填充颜色，默认 `black`；
- `fill-opacity`：填充不透明度（0-1）；
- `fill-rule`：填充规则，`nonzero`（默认）/ `evenodd`（奇偶，适合空心图形）。

```
fill: red;
fill: url(#gradient);    /* 渐变填充 */
fill: none;               /* 不填充 */
fill-opacity: 0.5;
fill-rule: evenodd;
```

### opacity 不透明度

`opacity` 设置整个元素（包括填充和描边）的不透明度，与 `fill-opacity` / `stroke-opacity` 的区别是 opacity 作用于整个元素。

```
opacity: 0.5;             /* 整个元素半透明 */
fill-opacity: 0.5;        /* 仅填充半透明 */
stroke-opacity: 0.5;      /* 仅描边半透明 */
```

## 可访问性

- `<title>`：为 SVG 或图形元素提供可访问名称，屏幕阅读器会朗读；
- `<desc>`：提供更详细的描述；
- `role="img"`：将内联 SVG 声明为图像；
- `aria-label` / `aria-labelledby`：提供可访问名称；
- `aria-hidden="true"`：装饰性 SVG 对辅助技术隐藏。

```
<svg role="img" aria-label="公司Logo">
    <title>公司Logo</title>
    <desc>蓝色圆形背景，白色文字</desc>
    <circle cx="50" cy="50" r="50" fill="blue"/>
    <text x="50" y="55" text-anchor="middle" fill="white">LOGO</text>
</svg>

<!-- 装饰性图标 -->
<svg aria-hidden="true" focusable="false">...</svg>
```

## SVG Sprite 图标系统

将多个图标合并到一个 SVG 文件中，用 `<symbol>` 定义每个图标，通过 `<use href="sprite.svg#icon-name">` 引用。

```
<!-- icons.svg -->
<svg xmlns="http://www.w3.org/2000/svg">
    <defs>
        <symbol id="home" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </symbol>
        <symbol id="search" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </symbol>
    </defs>
</svg>
```

```
<!-- 页面中引用 -->
<svg class="icon"><use href="icons.svg#home"/></svg>
<svg class="icon"><use href="icons.svg#search"/></svg>
```

优点：一次请求加载所有图标，可通过 CSS `fill: currentColor` 控制颜色，支持任意尺寸不失真。
