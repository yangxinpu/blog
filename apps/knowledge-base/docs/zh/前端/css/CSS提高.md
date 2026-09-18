## 响应式方案

### viewport 视口

移动端页面必须设置 viewport meta 标签，否则浏览器会按桌面宽度缩放页面导致文字过小。

参数说明：
- `width=device-width`：视口宽度等于设备宽度
- `initial-scale=1.0`：初始缩放比例为 1
- `maximum-scale=1.0`：最大缩放比例（不建议禁止用户缩放，影响可访问性）
- `user-scalable=no`：禁止用户缩放（不推荐）

```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 媒体查询 @media

根据设备特性（视口宽度、方向、分辨率等）应用不同的样式，是响应式布局的核心手段。

```
/* 基础样式（移动端优先，先写小屏幕样式） */
.container {
  padding: 10px;
}

/* 视口宽度 >= 768px 时应用 */
@media (min-width: 768px) {
  .container {
    padding: 20px;
  }
}

/* 视口宽度 >= 1024px 时应用 */
@media (min-width: 1024px) {
  .container {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**常用断点参考**：
- `< 576px`：手机竖屏
- `>= 576px`：手机横屏 / 小平板
- `>= 768px`：平板
- `>= 1024px`：桌面
- `>= 1200px`：大桌面

### 媒体查询逻辑操作符

```
/* and：同时满足多个条件 */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 平板尺寸 */
}

/* ,（逗号）：或的关系，满足任一即可 */
@media (max-width: 767px), (min-width: 1200px) {
  /* 手机或大屏 */
}

/* not：取反，必须写在最前面，且会否定整条媒体查询 */
@media not all and (min-width: 768px) {
  /* 小于 768px */
}

/* only：防止旧浏览器不支持媒体查询时应用样式（现代浏览器可省略） */
@media only screen and (min-width: 768px) {
}
```

### 常用媒体特性

**尺寸相关**：
```
@media (width: 360px) { }       /* 精确宽度 */
@media (min-width: 768px) { }   /* 最小宽度 */
@media (max-width: 767px) { }   /* 最大宽度 */
@media (min-height: 600px) { }  /* 最小高度 */
```

**方向**：
```
@media (orientation: portrait) { }   /* 竖屏（高度 > 宽度） */
@media (orientation: landscape) { }  /* 横屏（宽度 > 高度） */
```

**分辨率 / 像素比**：
```
@media (min-resolution: 2dppx) { }  /* 设备像素比 >= 2（Retina屏） */
@media (-webkit-min-device-pixel-ratio: 2) { }  /* 兼容旧版 WebKit */
```

**颜色能力**：
```
@media (color-gamut: srgb) { }      /* 支持 sRGB 色域 */
@media (color-gamut: p3) { }        /* 支持 Display P3 广色域 */
@media (color-gamut: rec2020) { }   /* 支持 Rec. 2020 色域 */
```

**用户偏好（可访问性相关）**：
```
@media (prefers-color-scheme: dark) { }       /* 用户系统偏好深色模式 */

@media (prefers-color-scheme: light) { }      /* 用户系统偏好浅色模式 */

@media (prefers-reduced-motion: reduce) { }   /* 用户要求减少动画 */

@media (prefers-contrast: more) { }           /* 用户要求更高对比度 */

@media (prefers-reduced-transparency: reduce) { }  /* 用户要求减少透明效果 */

@media (forced-colors: active) { }            /* 强制颜色模式（Windows 高对比度） */
```

**交互能力**：
```
@media (hover: hover) { }        /* 设备支持悬停（有鼠标） */

@media (hover: none) { }         /* 设备不支持悬停（触屏） */

@media (pointer: fine) { }       /* 精确指针（鼠标） */

@media (pointer: coarse) { }     /* 粗糙指针（手指触摸） */
```

### 容器查询 @container

媒体查询是相对于视口的，而容器查询是相对于父容器的。组件可以根据自身所在容器的大小来调整样式，真正实现组件级响应式。

**第一步：给容器设置 container-type**

```
.card-wrapper {
  container-type: inline-size;  /* 容器查询基于行内方向（水平）尺寸 */
  container-name: card;          /* 可选，给容器命名，便于精准指定 */
}

/* 简写 */
.card-wrapper {
  container: card / inline-size;
}
```

`container-type` 取值：
- `normal`：不创建查询容器（默认）
- `size`：基于水平和垂直两个方向查询
- `inline-size`：只基于行内方向（水平）查询，最常用
- `normal` 之外的值都会创建包含上下文（containment context）

**第二步：使用 @container 写条件样式**

```
/* 容器宽度 >= 400px 时，卡片标题变大 */
@container card (min-width: 400px) {
  .card-title {
    font-size: 1.5rem;
  }
  .card-body {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

/* 不指定容器名时，匹配最近的祖先容器 */
@container (min-width: 300px) {
  .card {
    padding: 16px;
  }
}
```

**容器查询长度单位**：在 @container 内部可以使用 `cqw`（容器宽度的 1%）、`cqh`、`cqi`、`cqb`、`cqmin`、`cqmax` 等单位，类似于 vw/vh 但是相对于容器。

```
@container (min-width: 300px) {
  .card-title {
    font-size: clamp(1rem, 5cqi, 2rem);  /* 相对于容器内联尺寸 */
  }
}
```

**样式容器查询**：不仅可以查询尺寸，还可以查询容器的 CSS 变量/样式值。

```
.card-wrapper {
  container-type: style;  /* 声明为样式查询容器 */
  --theme: dark;
}

@container style(--theme: dark) {
  .card {
    background: #333;
    color: #fff;
  }
}
```

### 响应式图片

**srcset 和 sizes**：根据设备像素比或视口宽度加载不同分辨率的图片。

```
<!-- 根据像素比选择：1x 屏用 small.jpg，2x 屏用 large.jpg -->
<img src="small.jpg"
     srcset="small.jpg 1x, large.jpg 2x"
     alt="示例">

<!-- 根据视口宽度选择不同宽度的图片 -->
<img src="medium.jpg"
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 767px) 100vw, 50vw"
     alt="示例">
```

**picture 元素**：根据媒体查询加载完全不同的图片（如不同裁剪、不同格式）。

```
<picture>
  <!-- 宽屏用横图 -->
  <source media="(min-width: 768px)" srcset="wide.webp" type="image/webp">
  <!-- 窄屏用方图 -->
  <source media="(max-width: 767px)" srcset="square.webp" type="image/webp">
  <!-- 兜底 -->
  <img src="fallback.jpg" alt="示例">
</picture>
```

### 安全区域 env()

iPhone X 及以后的机型有刘海和底部小黑条，使用 `env()` 函数获取安全区域内边距，避免内容被遮挡。

```
/* 必须设置 viewport-fit=cover 才能使用安全区域 */
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

/* CSS 中使用 */
.page {
  padding-top: env(safe-area-inset-top);       /* 顶部刘海区域 */
  padding-bottom: env(safe-area-inset-bottom);  /* 底部小黑条区域 */
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 带默认值的写法（不支持的设备使用 20px 兜底） */
padding-bottom: env(safe-area-inset-bottom, 20px);
```


## 盒模型

### 标准盒模型

`box-sizing: content-box`（默认值），width 和 height 只包含内容区域，padding 和 border 会额外增加元素的总尺寸。

盒子总宽度（从左 margin 外沿到右 margin 外沿）：

`margin-left + border-left + padding-left + width + padding-right + border-right + margin-right`

盒子实际宽度（不含 margin，即 border 外沿之间的距离）：

`border-left + padding-left + width + padding-right + border-right`

### 怪异（IE）盒模型

设置 `box-sizing: border-box` 后，width 和 height **包含**内容 + padding + border。padding 和 border 不会撑大元素，而是向内挤压内容区域。

盒子总宽度：

`margin-left + width + margin-right`

盒子实际宽度（不含 margin）：`width`
```
*, *::before, *::after {
  box-sizing: border-box;
}
```

### BFC 块格式化上下文

BFC（Block Formatting Context）是页面中的一块独立渲染区域，内部元素的布局不会影响外部元素。

**创建 BFC 的常见方式**：
- 根元素 `<html>`
- 浮动元素（`float` 不为 `none`）
- 绝对定位元素（`position: absolute / fixed`）
- `display: inline-block / table-cell / table-caption / flex / grid / flow-root`
- `overflow` 不为 `visible` 和 `clip` 的块级元素（`hidden / auto / scroll`）
- `contain: layout / content / paint`
- 多列容器（`column-count` 或 `column-width` 不为 `auto`）

**BFC 的特性与应用**：

1. **包含浮动元素**：BFC 会计算内部浮动元素的高度，解决父元素高度塌陷。

```
.parent {
  overflow: hidden;  /* 或 display: flow-root（推荐，无副作用） */
}
.child {
  float: left;
}
```

2. **阻止外边距塌陷**：BFC 内部的元素与外部元素之间不会发生 margin 合并。

```
.outer {
  overflow: hidden;  /* 创建 BFC */
}
.inner {
  margin-top: 20px;  /* 不会与 outer 的 margin 塌陷 */
}
```

3. **阻止元素被浮动元素覆盖**：BFC 元素不会与浮动元素重叠，可实现两栏自适应布局。

```
.sidebar {
  float: left;
  width: 200px;
}
.content {
  overflow: hidden;  /* 创建 BFC，不会被 sidebar 覆盖 */
}
```

 `display: flow-root` 是专门用于创建 BFC 的属性值，没有 `overflow: hidden` 的裁剪内容等副作用，推荐使用。

### IFC 行内格式化上下文

IFC（Inline Formatting Context）由行内元素组成的渲染区域。

**特性**：
- 元素从左到右（或根据 direction）水平排列
- 行内元素的垂直对齐由 `vertical-align` 控制
- 当一行放不下时自动换行
- 行框（line box）的高度由行内最高的元素决定
- 行内块元素底部会有空白缝隙（因为基线对齐），用 `vertical-align: middle/top/bottom` 消除

### 外边距塌陷（Margin Collapse）

**什么是外边距塌陷**：相邻的两个垂直方向 margin 会合并为一个，取较大值，而不是相加。只有**块级元素**的 `margin-top` 和 `margin-bottom` 会发生塌陷，水平方向不会。

**三种场景**：

1. **相邻兄弟元素**：上元素的 margin-bottom 和下元素的 margin-top 塌陷，取较大值。

```
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 实际间距为 30px，不是 50px */
```

2. **父子元素**：父元素和第一个/最后一个子元素的 margin 会塌陷（父元素没有 border/padding 分隔时）。

```
.parent { margin-top: 20px; }
.child { margin-top: 30px; }
/* 实际父元素顶部 margin 为 30px，子元素的 margin 没有效果 */
```

3. **空块级元素**：元素自身的 margin-top 和 margin-bottom 塌陷。

**解决方法**：
- 父元素添加 `border` 或 `padding` 分隔
- 父元素创建 BFC（`overflow: hidden`、`display: flow-root` 等）
- 使用 `padding` 代替 `margin`
- 使用 flex/grid 布局（子元素不发生 margin 塌陷）
- 父子之间添加内联内容或 `::before` 伪元素分隔

### 层叠上下文（Stacking Context）

层叠上下文决定了元素在 Z 轴上的堆叠顺序。`z-index` 只在同一个层叠上下文中比较，不同层叠上下文的元素按上下文整体比较。

**创建层叠上下文的常见方式**：
- 根元素 `<html>`
- `position: absolute / relative` 且 `z-index` 不为 `auto`
- `position: fixed / sticky`
- `z-index` 不为 `auto` 的 flex / grid 子元素
- `opacity < 1`
- `transform / filter / backdrop-filter / perspective / clip-path / mask` 不为 `none`
- `mix-blend-mode` 不为 `normal`
- `isolation: isolate`
- `will-change` 指定了上述任一属性
- `contain: layout / paint / strict / content`
- `-webkit-overflow-scrolling: touch`

**同一层叠上下文内的层叠顺序（从下到上）**：
1. 层叠上下文的背景和边框
2. `z-index` 为负值的子元素
3. 块级元素（正常流，非定位）
4. 浮动元素
5. 行内元素（正常流，非定位）
6. `z-index: auto` 或 `z-index: 0` 的定位元素
7. `z-index` 为正值的子元素（值越大越靠上）

 注意：`z-index` 只对定位元素（position 不为 static）和 flex/grid 子元素生效，对普通块级元素无效。


## 模块化 CSS

### @import

`@import` 用于在一个样式表中引入另一个样式表，本质是"把别的 CSS 文件加载进来合并使用"。

**规则**：
- `@import` 必须声明在样式表的最顶部（除 `@charset` 和 `@layer` 声明外），否则不会生效
- `@import` 是串行加载：浏览器先加载主 CSS，解析后才请求子 CSS，会增加请求链路
- `<link>` 标签在 HTML 阶段并行发起请求，多个样式文件可同时下载，性能更优
- 现代构建工具（Vite、Webpack）会将 `@import` 的文件打包合并，不存在串行加载问题

```
@import url("style.css");
@import "style.css";                    /* 可省略 url() */

/* 带媒体查询条件 */
@import url("mobile.css") screen and (max-width: 768px);

/* 导入到指定层叠层 */
@import url("base.css") layer(base);

/* 带 supports 条件 */
@import url("modern.css") supports(display: grid);
```

### CSS 嵌套（Nesting）

原生 CSS 支持嵌套写法，无需预处理器。使用 `&` 表示父选择器。

**基础嵌套**：

```
.card {
  background: #fff;

  .card-title {          /* 等价于 .card .card-title */
    font-size: 1.2rem;
  }

  &:hover {               /* 等价于 .card:hover，& 必须用于伪类/组合选择器 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  &.active {              /* 等价于 .card.active */
    border-color: blue;
  }

  & > .card-body {        /* 等价于 .card > .card-body */
    padding: 16px;
  }

  /* 嵌套媒体查询 */
  @media (min-width: 768px) {
    padding: 24px;
  }
}
```

**& 的高级用法**：

```
/* & 可以出现在选择器的任意位置 */
.parent {
  .child & {              /* 等价于 .child .parent（父选择器在后面） */
    color: red;
  }
}

/* 多个 & 表示重复父选择器 */
.link {
  & + & {                 /* 等价于 .link + .link */
    margin-left: 8px;
  }
}

/* & 可以拼接类名 */
.btn {
  &--primary {            /* 等价于 .btn--primary */
    background: blue;
  }
}
```

**嵌套 @media 和 @supports**：

```
.card {
  padding: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }

  @supports (aspect-ratio: 1) {
    aspect-ratio: 16 / 9;
  }
}
```

注意：嵌套选择器的优先级等同于被 `:is()` 包裹，取参数中最高优先级。CSS 嵌套从 2023 年起主流浏览器均已支持。

### @layer 层叠层

通过 `@layer` 定义样式层级，后声明的层优先级更高。可以优雅地管理样式覆盖顺序，替代滥用 `!important`。

**声明层级顺序**：

```
/* 先声明层级顺序，越靠后优先级越高 */
@layer reset, base, components, utilities;
```

**写入各层样式**：

```
@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  body { font-family: system-ui, sans-serif; color: #333; }
}

@layer components {
  .btn {
    padding: 8px 16px;
    background: #eee;
  }
}

@layer utilities {
  .text-red { color: red; }  /* 优先级最高，可覆盖 components 层的颜色 */
}
```

**匿名层**：不命名的 `@layer` 块，优先级按出现顺序排在所有命名层之后。

```
@layer {
  .custom { color: green; }  /* 匿名层，优先级高于所有已声明的命名层 */
}
```

**未分层的样式**：没有写在任何 `@layer` 中的样式优先级最高，会覆盖所有层中的样式。

**嵌套层**：

```
@layer framework {
  @layer base {
    p { margin: 0; }
  }
  @layer components {
    .card { border: 1px solid; }
  }
}
/* 引用嵌套层用点号：framework.base */
```

### @scope 作用域

`@scope` 允许将样式限制在特定的 DOM 子树内，并且可以指定"作用域边界"（样式不渗透到边界内的特定元素）。无需写高优先级选择器，也不与 DOM 结构强耦合。

**基本用法**：

```
/* 将 .card 内的样式限制在 .card 作用域内 */
@scope (.card) {
  .title { font-size: 1.2rem; }   /* 只匹配 .card 内的 .title */
  p { line-height: 1.6; }
}
```

**指定作用域边界（scope limit）**：

```
/* 样式作用于 .article 内，但不渗透到 .article 内的 .blockquote */
@scope (.article) to (.blockquote) {
  p { color: #333; }    /* .article 内的 p 生效，但 .blockquote 内的 p 不生效 */
}
```

**& 表示作用域根**：

```
@scope (.card) {
  & { border: 1px solid #ddd; }   /* & 表示 .card 本身 */
  &:hover { border-color: blue; }
}
```

**@scope 的优先级**：作用域内的样式比普通样式多一个"作用域 proximity"（邻近度）权重，离作用域根越近优先级越高，但不会超过 `!important` 和内联样式。

 `@scope` 是较新的特性，Firefox 146+（2026年）起默认支持，Chrome/Safari 也已支持。生产环境使用时注意兼容性。

### CSS Modules

CSS Modules 不是 CSS 原生特性，而是构建工具层面的方案。通过构建工具将类名编译为唯一的哈希字符串，实现样式的局部作用域，避免全局类名冲突。

```
/* Button.module.css */
.title {
  font-size: 1.2rem;
  color: #333;
}

/* 编译后类名变为：Button_title__abc123 */
```

```
// JS 中使用
import styles from './Button.module.css';

function Button() {
  return <h1 className={styles.title}>标题</h1>;
}
```

**:global 声明全局样式**：

```
/* Button.module.css */
.title { color: blue; }

:global(.global-title) {   /* 这个类名不会被哈希化，是全局的 */
  color: red;
}
```

## 可访问性与用户偏好

### 深色模式 prefers-color-scheme

根据用户系统的深色/浅色模式自动切换主题。

```
/* 默认浅色模式样式 */
body {
  background: #fff;
  color: #333;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #eee;
  }
  .card {
    background: #2a2a2a;
    border-color: #444;
  }
}
```

**配合 CSS 变量实现主题切换**：

```
:root {
  --bg: #fff;
  --text: #333;
  --primary: #4285f4;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #eee;
    --primary: #8ab4f8;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### 减少动画 prefers-reduced-motion

部分用户（如前庭功能障碍患者）对动画敏感，系统会开启"减少动态效果"。应尊重该设置，禁用或减弱动画。

```
/* 默认有动画 */
.element {
  transition: transform 0.3s ease;
  animation: slideIn 0.5s ease;
}

/* 用户要求减少动画时 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

 最佳实践：默认提供动画，但在 `prefers-reduced-motion: reduce` 下禁用或简化动画，而不是完全没有反馈。

### 焦点样式 focus-visible

`:focus` 在鼠标点击时也会触发焦点环，影响视觉。`:focus-visible` 只在键盘导航（Tab 键）时显示焦点样式，兼顾美观和可访问性。

```
/* 清除默认焦点样式（不推荐，会影响键盘用户） */
button:focus { outline: none; }

/* 正确做法：只在键盘聚焦时显示焦点环 */
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid #4285f4;
  outline-offset: 2px;
}
```

 永远不要完全移除焦点样式而不提供替代方案，键盘用户依赖焦点样式导航。

### 强制颜色模式 forced-colors

Windows 高对比度模式下，系统会强制调整颜色。使用 `forced-colors` 媒体查询适配。

```
@media (forced-colors: active) {
  .button {
    border: 1px solid ButtonText;  /* 使用系统颜色关键字 */
    background: ButtonFace;
    color: ButtonText;
  }
}
```

常用系统颜色关键字：`Canvas`、`CanvasText`、`LinkText`、`VisitedText`、`ActiveText`、`ButtonFace`、`ButtonText`、`ButtonBorder`、`Field`、`FieldText`、`Highlight`、`HighlightText`、`Mark`、`MarkText`、`GrayText`。

### 对比度要求

WCAG（Web Content Accessibility Guidelines）标准：
- 普通文本对比度至少 **4.5:1**（AA 级）
- 大文本（18pt 或 14pt 加粗）对比度至少 **3:1**
- UI 组件和图形对比度至少 **3:1**

可以使用 `color-contrast()` 函数（实验性）自动选择对比度足够的颜色：

```
color: color-contrast(white vs red, green, blue);  /* 选择与白色对比度最高的颜色 */
```


## CSS 新特性

### 颜色新函数

**oklch / oklab**：基于人眼感知的均匀颜色空间，比 HSL 更直观，亮度变化更符合人眼感知。

```
color: oklch(70% 0.15 150);    /* 亮度 70%，色度 0.15，色相 150 度 */
color: oklab(70% -0.1 0.05);   /* L a b 颜色空间 */
```

**color-mix()**：混合两种颜色。

```
color: color-mix(in oklch, red 30%, blue);  /* 在 oklch 空间混合，红色占 30% */
background: color-mix(in srgb, #fff 80%, #000);  /* 得到浅灰色 */
```

**color-contrast()**：自动选择对比度最高的颜色（实验性）。

**light-dark()**：根据浅色/深色模式自动选择颜色。

```
color: light-dark(#333, #eee);  /* 浅色模式用 #333，深色模式用 #eee */
background: light-dark(#fff, #1a1a1a);
```


### 滚动驱动动画

通过 `animation-timeline` 将动画与滚动进度绑定，无需 JS 即可实现滚动动画。

```
/* 基于元素进入/离开视口的动画 */
.fade-in {
  animation: fadeIn linear both;
  animation-timeline: view();          /* 元素进入视口到离开视口 */
  animation-range: entry 0% entry 100%; /* 只在进入阶段播放 */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

```
/* 基于滚动容器滚动进度的动画 */
.progress-bar {
  animation: grow linear;
  animation-timeline: scroll(root);    /* 基于页面根滚动 */
}

@keyframes grow {
  from { width: 0%; }
  to { width: 100%; }
}
```

### 子网格 subgrid

子网格允许嵌套的 grid 容器继承父网格的轨道定义，实现跨层级对齐。

```
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.child {
  grid-column: span 3;
  display: grid;
  grid-template-columns: subgrid;  /* 继承父级的 3 列定义 */
}
```

### anchor 锚点定位

通过 `anchor-name` 和 `position-anchor` 实现元素相对于锚点元素的定位，无需 JS 计算位置。常用于 tooltip、弹出菜单、下拉框。

```
/* 锚点元素 */
.button {
  anchor-name: --my-anchor;
}

/* 定位元素 */
.tooltip {
  position: fixed;
  position-anchor: --my-anchor;
  inset-area: top center;        /* 显示在锚点上方居中 */
  margin-bottom: 8px;
}
```

anchor 定位是较新的特性，Chrome 125+ 支持，Firefox 和 Safari 支持有限。


## 字体优化

### font-display 字体显示策略

`@font-face` 中使用 `font-display` 控制自定义字体加载期间的文字显示方式，避免 FOIT（Flash of Invisible Text，文字不可见闪烁）。

```
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;    /* 最常用：先用兜底字体显示，字体加载完成后替换 */
}
```

| 值 | 行为 |
|---|---|
| `auto` | 浏览器默认（通常是 block） |
| `block` | 字体加载期间文字不可见（最多 3 秒），加载完成后显示。FOIT |
| `swap` | 立即用兜底字体显示，字体加载完成后替换。FOUT |
| `fallback` | 极短时间不可见（约 100ms），然后用兜底字体，字体在短时间内（约 3 秒）加载完成则替换，否则一直用兜底字体 |
| `optional` | 极短时间不可见，然后用兜底字体，字体是否替换由浏览器根据网络状况决定（弱网下不替换） |

推荐使用 `font-display: swap`，兼顾用户体验和自定义字体的使用。

### FOIT 与 FOUT

- **FOIT（Flash of Invisible Text）**：自定义字体加载期间文字完全不可见。`font-display: block` 会导致 FOIT。
- **FOUT（Flash of Unstyled Text）**：自定义字体加载期间先用兜底字体显示，加载完成后替换为自定义字体，可能产生布局跳动。`font-display: swap` 会导致 FOUT。

**减少 FOUT 布局跳动**：
- 使用 `size-adjust`、`ascent-override`、`descent-override`、`line-gap-override` 调整兜底字体的度量，使其与自定义字体接近

```
@font-face {
  font-family: 'FallbackFont';
  src: local('Arial');
  size-adjust: 110%;           /* 调整兜底字体大小以匹配自定义字体 */
  ascent-override: 90%;
  descent-override: 20%;
}
```

### 字体格式与兼容性

| 格式 | 扩展名 | 说明 |
|---|---|---|
| WOFF2 | `.woff2` | 压缩率最高，现代浏览器首选 |
| WOFF | `.woff` | 兼容性好，所有现代浏览器支持 |
| TTF/OTF | `.ttf/.otf` | 原始字体格式，体积大 |
| EOT | `.eot` | 仅 IE 支持，已淘汰 |
| SVG | `.svg` | 仅旧版 iOS Safari 支持，已淘汰 |

**推荐写法**：

```
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 字体子集化（Subsetting）

中文字体文件通常很大（几 MB 到几十 MB），全部加载会严重影响性能。字体子集化是只提取页面用到的字符，生成小体积的字体文件。

**工具**：
- `fonttools`（Python 库，命令行 `pyftsubset`）
- `glyphhanger`（Filament Group 出品）
- 在线工具：Font Squirrel、字蛛（font-spider）

```
# 使用 pyftsubset 提取常用字符
pyftsubset font.ttf --text="你好世界" --output-file=font-subset.woff2 --flavor=woff2

# 使用 Unicode 范围
pyftsubset font.ttf --unicodes="U+4E00-9FFF" --output-file=font-cjk.woff2
```

**动态子集化**：服务端根据页面内容动态生成字体子集，如 Google Fonts 的 `text=` 参数。

### 可变字体（Variable Fonts）

可变字体将多个字重、宽度、斜体等变体整合在一个文件中，通过 `font-variation-settings` 或对应属性控制，减少字体文件数量。

```
@font-face {
  font-family: 'MyVariableFont';
  src: url('myfont-variable.woff2') format('woff2-variations');
  font-weight: 100 900;   /* 支持的字重范围 */
  font-stretch: 75% 125%;  /* 支持的宽度范围 */
}

.title {
  font-family: 'MyVariableFont';
  font-weight: 650;        /* 可以使用任意中间值 */
  font-stretch: 110%;
  font-style: oblique 15deg;
}

/* 低级控制：直接设置变化轴 */
.custom {
  font-variation-settings: 'wght' 650, 'wdth' 110, 'slnt' -15;
}
```

常用变化轴：`wght`（字重）、`wdth`（宽度）、`slnt`（倾斜）、`ital`（斜体）、`opsz`（视觉尺寸）。
