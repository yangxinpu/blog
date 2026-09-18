

Canvas 是一个通过 JavaScript 动态绘制图形的 HTML 标签，它提供一个矩形的绘图区域，允许在这个区域上绘制 2D 图形、创建动画、处理图像等。

Canvas 本质上是一个由像素组成的位图（SVG 是矢量图形），绘制的内容是像素数据，无法像 DOM 元素那样单独选中或修改某个图形。

Canvas 与 SVG 的对比：

| 特性 | Canvas | SVG |
| --- | --- | --- |
| 图形类型 | 位图（像素） | 矢量（数学描述） |
| 缩放 | 放大会模糊 | 放大不失真 |
| 事件处理 | 需手动计算坐标 | 每个元素可绑定事件 |
| 性能 | 大量元素时性能好 | 大量元素时 DOM 开销大 |
| 适用场景 | 游戏、图表、图像处理、动画 | 图标、图表、可交互图形 |

## canvas元素对象

默认是行内块元素；

### width/height属性：

canvas标签上的width/height属性用于定义画布的实际像素尺寸（分辨率）；

其对应CSS样式的width/height是它在页面布局中的宽高；若宽高属性和CSS样式的宽高不一样，则会成比例的缩放拉伸画布；

### getContext()

用于获取绘图上下文对象，这个上下文对象提供了一系列 API，让开发者能够在 canvas 上绘制图形、文本、图像等。

```
<canvas class="canvas" width="600" height="600"></canvas>

<script>
    const canvas = document.querySelector('.canvas');

    // 获得 2D 渲染的上下文对象
    let ctx = canvas.getContext('2d');
</script>
```

`getContext()` 的第二个参数是上下文属性：

- `willReadFrequently: true`：提示会频繁调用 `getImageData()`，浏览器会使用软件渲染以加速像素读取，适合图像处理场景；
- `alpha: false`：提示画布没有透明度通道，可加速合成。

```
const ctx = canvas.getContext('2d', {
  willReadFrequently: true,
  alpha: false
});
```

其他上下文类型：`'webgl'`（3D 渲染）、`'webgl2'`、`'bitmaprenderer'`。

### 导出图片

- `toDataURL(type, quality)`：将画布导出为 base64 数据 URL，`type` 默认为 `image/png`，`quality` 用于 jpeg/webp 的质量（0-1）；
- `toBlob(callback, type, quality)`：将画布导出为 Blob 对象，异步回调，比 `toDataURL` 更省内存。

```
// 导出为 PNG（base64）
const dataUrl = canvas.toDataURL('image/png');

// 导出为 JPEG，质量 0.8
const jpegUrl = canvas.toDataURL('image/jpeg', 0.8);

// 导出为 Blob
canvas.toBlob((blob) => {
  const url = URL.createObjectURL(blob);
  // 下载或上传
}, 'image/png');
```

 跨域图片绘制到画布后会污染画布（tainted canvas），此时 `toDataURL()` 和 `getImageData()` 会抛出安全错误。需要在图片加载前设置 `crossorigin="anonymous"` 且服务端允许 CORS。

### 高清屏适配

Canvas 的 `width`/`height` 属性是像素尺寸，CSS 宽高是显示尺寸。在高分屏（devicePixelRatio > 1）上，直接按 CSS 尺寸设置画布会导致模糊。

```
const dpr = window.devicePixelRatio || 1;
const cssWidth = 600;
const cssHeight = 400;

// 设置画布像素尺寸为 CSS 尺寸 × dpr
canvas.width = cssWidth * dpr;
canvas.height = cssHeight * dpr;

// CSS 显示尺寸保持不变
canvas.style.width = cssWidth + 'px';
canvas.style.height = cssHeight + 'px';

// 缩放绘图上下文，之后所有坐标按 CSS 坐标书写即可
ctx.scale(dpr, dpr);
```

## 绘图上下文对象

### moveTo()：

让画笔抬起移动到特定坐标位置，使绘制的路径不再连续；参数为移动到的 x、y 坐标。

```
ctx.moveTo(50, 100);
```

### beginPath()：

用于开启一条新的绘图路径，让后续的绘图命令只作用于这条新路径，不与之前的路径产生关联；

```
ctx.beginPath(); 
ctx.moveTo(50, 50);
ctx.lineTo(200, 50);
ctx.strokeStyle = 'red';
ctx.stroke(); // 第一条线段为红色

ctx.beginPath(); 
ctx.moveTo(50, 80);
ctx.lineTo(200, 80);
ctx.strokeStyle = 'blue';
ctx.stroke(); // 第二条线段为蓝色（样式只作用于当前新路径）
```

### closePath()：

闭合当前路径，自动将路径的最后一个点与第一个点用一条直线连接起来，形成一个封闭的图形；

```
ctx.beginPath();
ctx.moveTo(100, 50); // 起点 A
ctx.lineTo(200, 150); // 从 A 到 B
ctx.lineTo(50, 150); // 从 B 到 C
ctx.closePath();

ctx.strokeStyle = 'blue';
ctx.stroke(); 
```

### clearRect()：

用于清除画布上指定矩形区域的像素内容；参数分别为清除区域的起始坐标和矩形宽高；

```
ctx.clearRect(x, y, width, height);
```

### fillStyle/strokeStyle：

设置**填充**或**描边**画笔的颜色/渐变/图案；

```
ctx.fillStyle = 'red';
ctx.strokeStyle = 'red';
```

### stroke()

用于绘制当前设置后的路径的轮廓

```
ctx.stroke();
```

### fill()

填充当前路径的内部区域。可接收填充规则参数：

- `nonzero`（默认）：非零环绕规则；
- `evenodd`：奇偶规则，适合绘制空心图形（如圆环、五角星镂空）。

```
ctx.fill();                 // 默认 nonzero
ctx.fill('evenodd');        // 奇偶填充
ctx.fill(path, 'evenodd');  // 填充指定 Path2D
```

### globalAlpha：

设置当前绘画的透明度；

```
// 设置全局透明度为 0.5（半透明）
ctx.globalAlpha = 0.5;
ctx.fillStyle = 'blue';
ctx.fillRect(100, 80, 100, 80);

// 继续修改全局透明度为 0.2（更透明）
ctx.globalAlpha = 0.2;
ctx.fillStyle = 'green';
ctx.fillRect(150, 110, 100, 80);

// 重置全局透明度为 1（取消透明）
ctx.globalAlpha = 1;
ctx.fillStyle = 'yellow';
ctx.fillRect(200, 140, 100, 80);
```

### 渐变：

**createLinearGradient()**：

创建一个**线性渐变对象**，接收两个坐标，表示线性渐变开始和结束的坐标；线性渐变对象使用addColorStop方法添加线性渐变的颜色，第一个参数为0-1的数字，第二个参数为颜色；

```
let gradient = context.createLinearGradient(0, 0, 600, 600);
gradient.addColorStop(0, 'blue');
gradient.addColorStop(0.5, 'yellow');
gradient.addColorStop(1, 'green');

//使用渐变颜色
context.fillStyle = gradient; 
```

**createRadialGradient()**：

创建一个**径向渐变对象**，接收六个参数，分别是开始圆的圆心和半径，结束圆的圆心和半径

```
let gradient =context.createRadialGradient(300, 300, 50, 300, 300, 200);
gradient.addColorStop(0, 'red'); //渐变起始颜色
gradient.addColorStop(1, 'blue'); //渐变结束颜色
```

**createConicGradient()**：

创建一个**锥形渐变对象**，接收三个参数，为渐变起始角度和渐变的中心坐标

```
let gradient = context.createConicGradient(0, 300, 300);
gradient.addColorStop(0, 'blue');
gradient.addColorStop(0.5, 'green');
gradient.addColorStop(1, 'red');
```

### 线条样式：

lineWidth；线条粗细；

```
context.lineWidth = 10;
```

lineCap：线条两端的形状；butt（默认值，正方形，不添加额外长度），round（圆形，会超出长度），square（正方形，会超出长度）

```
context.lineCap = 'round';
```

lineJoin：设置两条线连接处外侧的形状；miter（默认值，尖角），round（圆角），bevel（斜角）

```
context.lineJoin = 'round';
```

setLineDash：设置虚线，参数为一个数组，每两个数字分别代表虚线长度和间隔；

```
context.setLineDash([10, 20,5, 20]);
```

lineDashOffset：虚线偏移；

```
context.lineDashOffset = 10;
```

### 图形阴影：

```
context.shadowOffsetX = 10;//阴影x偏移量
context.shadowOffsetY = 10;//阴影y偏移量
context.shadowBlur = 10;//阴影模糊程度
context.shadowColor = 'rgba(0, 0, 0, 0.5)';//阴影颜色
```

### 坐标轴变换：

```
context.translate(100, 100);  // 平移坐标系到 (100, 100)
context.scale(2, 2);           // 缩放坐标系，x 轴和 y 轴都缩放 2 倍
context.rotate(Math.PI / 4);   // 旋转坐标系，顺时针旋转 45 度（Canvas 角度均为顺时针）
```

注意：Canvas 的 `rotate()` 是**顺时针**旋转（与数学坐标系的逆时针相反），因为 Canvas 的 y 轴向下。

**transform 矩阵写法**：`a, b` 是 x 轴 (1,0) 点变换后的点，`c, d` 是 y 轴 (0,1) 点变换后的点，`e, f` 是水平和垂直位移距离。

```
context.transform(a, b, c, d, e, f);
```

- `transform()`：在当前变换矩阵基础上**叠加**变换；
- `setTransform(a, b, c, d, e, f)`：**重置**变换矩阵后再设置，忽略之前的所有变换；
- `resetTransform()`：重置为单位矩阵（等价于 `setTransform(1, 0, 0, 1, 0, 0)`）。

```
context.setTransform(1, 0, 0, 1, 0, 0);  // 重置变换
context.resetTransform();                    // 同上，更简洁
```

变换操作通常配合 `save()` / `restore()` 使用，避免影响后续绘制。

### 图像合成：

`globalCompositeOperation` 设置新绘制的图形（source）与已有画布内容（destination）的合成方式。默认值为 `source-over`。

**基础合成模式**：

| 值 | 效果 |
| --- | --- |
| `source-over` | 新图形覆盖在旧内容上方（默认） |
| `destination-over` | 新图形绘制在旧内容下方 |
| `source-in` | 只显示新图形中与旧内容重叠的部分 |
| `destination-in` | 只显示旧内容中与新图形重叠的部分 |
| `source-out` | 只显示新图形中不与旧内容重叠的部分 |
| `destination-out` | 只显示旧内容中不与新图形重叠的部分（橡皮擦效果） |
| `source-atop` | 新图形只在旧内容区域内显示，旧内容正常 |
| `destination-atop` | 旧内容只在新图形区域内显示，新图形正常 |
| `lighter` | 重叠部分颜色相加（变亮） |
| `xor` | 重叠部分变为透明 |
| `copy` | 只显示新图形，忽略旧内容 |

**混合模式**（类似 Photoshop 图层混合）：

`multiply`、`screen`、`overlay`、`darken`、`lighten`、`color-dodge`、`color-burn`、`hard-light`、`soft-light`、`difference`、`exclusion`、`hue`、`saturation`、`color`、`luminosity`。

```
context.fillStyle = 'red';
context.fillRect(100, 100, 200, 200);

context.globalCompositeOperation = 'destination-over';
context.fillStyle = 'blue';
context.fillRect(150, 150, 200, 200);  // 蓝色矩形绘制在红色下方

context.globalCompositeOperation = 'source-over';  // 恢复默认
```

### 裁剪：

clip()裁剪出可视区域，可以接收一个Path2D封装图形为参数表示裁剪的区域

```
context.beginPath();
context.arc(150, 150, 50, 0, Math.PI * 2);
context.closePath();
context.clip();//设置裁剪区域为圆;

context.fillRect(100, 100, 200, 200);//矩形将被裁剪
```

### 状态保存：

save()将当前绘图状态（绘图样式，阴影，合成，裁剪等）压入栈中保存，restore()从栈中弹出最近保存的状态作为下一个图形绘制的状态；

```
context.fillStyle = 'red';
context.fillRect(100, 100, 200, 200);
context.save();

context.fillStyle = 'blue';
context.fillRect(200, 200, 200, 200);
context.save();

context.restore();//样式和第二个一样
context.fillRect(300, 300, 200, 200);
```

### 填充图案：

`createPattern()`：创建一个填充图案样式，最终赋值给 `fillStyle` 或 `strokeStyle` 来进行填充。第一个参数为填充的图案（可以是 Image 对象、另一个 canvas 对象、视频的帧、OffscreenCanvas），第二个参数为重复方式：

- `repeat`：水平和垂直都重复（默认）；
- `repeat-x`：仅水平重复；
- `repeat-y`：仅垂直重复；
- `no-repeat`：不重复。

```
const img = new Image();
img.src = 'img/PackageIcon.ico';
img.onload = function() {
    const pattern = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(100,100,300,300);            
};
```

### 像素操作：

getImageData：获得指定区域像素的数据对象，其中有一个data数组表示RGBA格式（每四个元素代表一个像素）的像素数据；

`putImageData()`：将修改后的像素数据写回画布。参数：
1. `imageData`：要绘制的像素数据对象；
2. `dx`、`dy`：绘制在画布上的目标坐标；
3. `dirtyX`、`dirtyY`（可选）：从 imageData 中裁剪的起始坐标；
4. `dirtyWidth`、`dirtyHeight`（可选）：裁剪的宽高。

只绘制 dirty 区域可以提升性能。

```
let img = new Image();
img.src = 'img/background-image.jpg';
img.onload = function() {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < imgData.data.length; i += 4) {
        let r = imgData.data[i];
        let g = imgData.data[i + 1];
        let b = imgData.data[i + 2];
        let gray = (r + g + b) / 3;//灰度，即rgb的平均值
        
        //循环修改每一个像素的RGB为灰度，不修改A
        imgData.data[i] = gray;     // Red
        imgData.data[i + 1] = gray; // Green
        imgData.data[i + 2] = gray; // Blue
        
        //将每个像素的rgb取反
        imgData.data[i] = 255-r;     // Red
        imgData.data[i + 1] = 255-g; // Green
        imgData.data[i + 2] = 255-b;
    }
    context.putImageData(imgData, 0, 0);
};
```

生成马赛克：

```
let img = new Image();
img.src = 'img/background-image.jpg';
img.onload = function() {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;
    let mosaicSize = 10; // 马赛克方块大小，可调整

    for (let y = 0; y < canvas.height; y += mosaicSize) {
        for (let x = 0; x < canvas.width; x += mosaicSize) {
            //计算出当前左上角像素的在一维数组的索引，由于有四个值所以乘四
            let i = (y * canvas.width + x) * 4;
            // 取每个方块左上角像素的颜色
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            let a = data[i + 3];

            // 将左上角的像素填充整个方块
            for (let dy = 0; dy < mosaicSize; dy++) {
                for (let dx = 0; dx < mosaicSize; dx++) {
                //计算马赛克方块中每一个像素相对于整个马赛克方块的位置
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx < canvas.width && ny < canvas.height) {
                        let ni = (ny * canvas.width + nx) * 4;
                        data[ni] = r;
                        data[ni + 1] = g;
                        data[ni + 2] = b;
                        data[ni + 3] = a;
                    }
                }
            }
        }
    }
    context.putImageData(imgData, 0, 0);

};
```

### 图像平滑：

控制图片缩放时的插值算法，影响缩放后的清晰度。

```
context.imageSmoothingEnabled = true;   // 启用平滑（默认），缩放时模糊但自然
context.imageSmoothingEnabled = false;  // 禁用平滑，像素风格（马赛克/像素艺术）
context.imageSmoothingQuality = 'high'; // 平滑质量：low / medium / high
```

### 碰撞检测：

- `isPointInPath(x, y)`：判断点是否在当前路径内部；
- `isPointInPath(path, x, y)`：判断点是否在指定 Path2D 内部；
- `isPointInStroke(x, y)`：判断点是否在当前路径的描边上。

```
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (ctx.isPointInPath(x, y)) {
    console.log('点击在图形内部');
  }
});
```

注意：`isPointInPath` 使用的是当前路径（最近一次 `beginPath` 后的路径），如果需要检测多个图形，应分别构建路径后检测，或使用 Path2D 保存每个图形的路径。

## 基本图形

包括矩形，圆弧，线段/多边形，文字，图片，视频等；

### 矩形

填充矩形和描边矩形，前两个参数是左上角坐标，后两个参数为宽高；

```
context.fillRect(100,100,100,100);//填充矩形

context.strokeRect(200, 200, 100, 100);//描边矩形
```

**分级写法：**

先使用rect在路径上绘制矩形的形状，前两个参数是左上角坐标，后两个参数为宽高；再使用fill或stroke方法绘制出矩形；

```
ctx.beginPath();
ctx.rect(10, 10, 100, 100);
ctx.closePath();
ctx.fillStyle = "red";
ctx.fill();
```

### 圆弧

使用 `arc()` 在路径上绘制圆弧形状，前三个参数为圆心和半径，第四、五个参数为起始角度和结束角度（弧度制），第六个参数 `anticlockwise` 为布尔值：`false`（默认）为**顺时针**，`true` 为**逆时针**。

 注意：Canvas 的角度方向是顺时针（y 轴向下），与数学坐标系相反。完整圆用 `0` 到 `2 * Math.PI`。

```
ctx.arc(200, 100, 60, 0, 2 * Math.PI);
ctx.fillStyle = 'pink';
ctx.fill();
```

**ellipse() 椭圆**：绘制椭圆，参数为圆心、x 半径、y 半径、旋转角度、起始角、结束角、方向。

```
ctx.ellipse(200, 100, 80, 50, 0, 0, 2 * Math.PI);
ctx.stroke();
```

**roundRect() 圆角矩形**：绘制圆角矩形（Chrome 99+ / Firefox 112+ / Safari 16+），参数为 x、y、宽、高、圆角半径（数字或数组）。

```
ctx.roundRect(100, 100, 200, 100, 20);           // 统一圆角 20px
ctx.roundRect(100, 100, 200, 100, [20, 5, 20, 5]); // 四个角分别设置
ctx.fill();
```

### 线段

包括直线，弧线，二阶贝塞尔曲线，三阶贝塞尔曲线；

**直线**：以moveTo或(0,0)做为起始点，使用lineTo确定下一点来绘制直线；lineTo也相当于下一个点的moveTo；

```
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(100, 100);
ctx.lineTo(200, 100);
ctx.lineTo(100, 200);
ctx.lineTo(0, 100);
ctx.stroke();
```

**弧线**：

使用arcTo，前四个参数为两个控制点，最后一个参数为半径；

arcTo会将起始点P0和第一个控制点P1画一条直线，再将第一个控制点和第二个控制点P2画一条直线，然后根据半径画一个和这两条直线相切的弧线，切点即为起始点和终止点P3（终点是自动计算的，它由两个控制点、半径以及两条切线的位置共同决定）；弧线要设置好起始点；

参数分别为两个控制点和半径；

```
context.moveTo(200,200);//起始点
context.arcTo(100, 100, 150, 100, 50);
```

**二阶贝塞尔曲线：**

quadraticCurveTo：前两个参数为控制点坐标，后两个参数为结束点坐标；

```
context.moveTo(100, 100);
context.quadraticCurveTo(50, 200, 200, 200);
```

**三阶贝塞尔曲线：**

bezierCurveTo：前四个参数为两个控制点，后两个参数为结束点坐标；

```
context.beginPath();

context.moveTo(100, 300); // 起点
context.bezierCurveTo(150, 100, 450, 500, 500, 300); // 两个控制点和终点

context.stroke();
context.closePath();
```

### 文字：

```
context.font = '30px Arial';          // 设置字体大小和字体（CSS font 语法）
context.textAlign = 'center';          // 水平对齐：start / end / left / right / center
context.textBaseline = 'middle';       // 垂直基线：top / hanging / middle / alphabetic / ideographic / bottom
context.direction = 'ltr';             // 文本方向：ltr / rtl / inherit

context.fillText('Hello World', 100, 100);    // 填充文字
context.strokeText('Hello World', 100, 150);   // 描边文字
```

`fillText()` 和 `strokeText()` 的第四个参数 `maxWidth` 可选，当文字宽度超过 maxWidth 时会自动压缩（仅水平缩放，不改变字号）。

**measureText()**：测量文本宽度，返回 TextMetrics 对象，包含 `width`、`actualBoundingBoxLeft`、`actualBoundingBoxRight`、`fontBoundingBoxAscent` 等属性。

```
const text = 'Hello World';
context.font = '30px Arial';
const metrics = context.measureText(text);
console.log(metrics.width);  // 文本宽度

// 文字居中绘制
const textWidth = context.measureText(text).width;
context.fillText(text, (canvas.width - textWidth) / 2, 100);
```

 `font` 属性使用 CSS font 简写语法，如 `'bold 24px "Microsoft YaHei", sans-serif'`。Canvas 文字无法自动换行，多行文本需手动按 `
` 分割后逐行绘制。

### 图片：

`Image` 对象是 canvas 中加载和绘制图像的基础。常用属性：

- `naturalWidth`、`naturalHeight`：图像的原始像素尺寸；
- `complete`：图片是否已加载完成；
- `src`：图片 URL。

`drawImage()` 有三种参数形式：

1. `drawImage(image, dx, dy)`：按原始尺寸绘制到 (dx, dy)；
2. `drawImage(image, dx, dy, dWidth, dHeight)`：绘制到 (dx, dy)，缩放到 dWidth × dHeight；
3. `drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`：从原图裁剪 (sx, sy, sWidth, sHeight) 区域，绘制到 (dx, dy) 并缩放到 dWidth × dHeight。

 绘制跨域图片前需要设置 `img.crossOrigin = 'anonymous'` 且服务端返回 CORS 头，否则图片会污染画布，导致 `getImageData()` 和 `toDataURL()` 抛出安全错误。

```
let img = new Image();
img.src = 'img/background-image.jpg';
img.onload = function() {//等待图片加载完毕后绘画出图片
    context.drawImage(img, 0, 0, 600, 600);
    context.drawImage(img, 200, 200, 200, 200,0, 0, 600, 600);
};
```

### 视频：

通过获得video的dom，监听其是否播放，播放时调用render函数绘制当前帧的视频图片，再在render中调用requestAnimationFrame绘制下一帧视频图片；

```
 <video class="video" width="500" height="700" controls preload="auto" muted src="./img/45f48d1e251934a3b400da44d0332c61.mp4"></video>


let context = canvas.getContext('2d');
let video = document.querySelector('.video');//获得视频的dom元素

let img = new Image();//水印图片
img.src = 'img/PackageIcon.ico';

video.addEventListener('play', function() {//监听当视频播放时，调用render函数绘制一帧视频图片
    render();
});

function render(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);//绘制当前帧图片
    context.drawImage(img, 0, 0, 100, 100);//绘制水印图片
    requestAnimationFrame(render);//请求下一帧的动画，即再调用 render 函数
}
```

## 动画与封装

Canvas 动画的基本流程是：清除画布（clear）→ 更新图形状态（update）→ 重新绘制（draw），循环执行。

### requestAnimationFrame

`requestAnimationFrame(callback)` 接收一个动画回调函数，浏览器会在每次重绘前（通常与屏幕刷新率同步，约 60fps）自动调用。返回一个唯一 ID，用 `cancelAnimationFrame(id)` 取消。

与 `setInterval` 相比，`requestAnimationFrame` 的优势：

- 与浏览器重绘同步，更流畅；
- 页面不可见时自动暂停，节省 CPU 和电量；
- 不会因标签页切换导致动画堆积。

**使用 delta time 实现帧率无关的动画**：

```
let lastTime = 0;

function animate(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000; // 转换为秒
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 使用 deltaTime 更新位置，不同帧率下速度一致
  ball.x += ball.speed * deltaTime;

  ball.draw();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**暂停与恢复**：

```
let animationId = null;
let isRunning = false;

function start() {
  if (!isRunning) {
    isRunning = true;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
  }
}

function stop() {
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
}
```

### 坐标转换

Canvas 事件坐标需要从视口坐标转换为画布坐标，考虑 CSS 缩放和高清屏适配。

```
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  console.log('画布坐标:', x, y);
});
```

 如果做了高清屏适配（`ctx.scale(dpr, dpr)`），事件坐标应除以 dpr 后再用于绘图逻辑，或直接使用 CSS 坐标体系。

### Path2D 封装路径

`Path2D` 对象允许封装一个路径（由直线、曲线等组成的形状），以便后续重复绘制、碰撞检测或裁剪。

```
let context = canvas.getContext('2d');
let path = new Path2D();
path.rect(100, 100, 200, 200);   // 绘制一个矩形
path.arc(300, 300, 100, 0, Math.PI * 2);  // 绘制一个圆形

context.stroke(path);  // 绘制 path 封装好的图形
context.fill(path);    // 填充 path
context.clip(path);    // 用 path 裁剪
```

Path2D 支持所有路径方法（`moveTo`、`lineTo`、`arc`、`rect`、`bezierCurveTo` 等），还可以从 SVG path 数据创建：

```
const path = new Path2D('M10 10 h 80 v 80 h -80 Z');
```

### 封装图形类：

```
const ctx = canvas.getContext('2d');
class Rectangle {
    constructor(x, y, width, height) {//构造函数写图形的数据
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {//调用draw方法绘制出图形
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
let rect = new Rectangle(50, 50, 200, 100);
rect.draw();
```

### 离屏 Canvas（OffscreenCanvas）

`OffscreenCanvas` 可以在后台线程（Web Worker）中渲染，不阻塞主线程，适合复杂动画和大量计算。

```
// 主线程
const canvas = document.querySelector('canvas');
const offscreen = canvas.transferControlToOffscreen();

const worker = new Worker('render-worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

```
// render-worker.js
self.onmessage = (e) => {
  const canvas = e.data.canvas;
  const ctx = canvas.getContext('2d');

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 100, 100);
    requestAnimationFrame(render);
  }
  render();
};
```

也可以在主线程中用 OffscreenCanvas 做离屏渲染（不显示），再用 `drawImage` 绘制到可见画布：

```
const offscreen = new OffscreenCanvas(500, 500);
const offCtx = offscreen.getContext('2d');
// 在离屏画布上绘制复杂内容...
ctx.drawImage(offscreen, 0, 0);  // 一次性绘制到可见画布
```

## 性能优化

- 只重绘变化区域：使用 `clearRect(x, y, w, h)` 清除局部区域，而不是每次清屏；
- 使用离屏 canvas 缓存静态内容：将不常变化的背景预渲染到离屏 canvas，每帧用 `drawImage` 复制；
- 减少状态切换：`fillStyle`、`strokeStyle`、`globalAlpha` 等状态切换有开销，尽量批量绘制相同样式的图形；
- 避免阴影：`shadowBlur` 性能开销大，动画中尽量避免或使用静态图片代替；
- 合理使用 `willReadFrequently`：频繁调用 `getImageData` 时设置此选项可加速像素读取；
- 使用 `requestAnimationFrame`：不要用 `setInterval` 做动画；
- 控制画布尺寸：过大的画布（尤其高分屏）会显著增加填充开销；
- 避免每帧创建对象：在动画循环中避免创建 `Path2D`、渐变对象等，尽量复用；
- 使用 `putImageData` 的 dirty 区域：只更新变化的像素区域。



