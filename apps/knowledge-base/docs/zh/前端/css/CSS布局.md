## 标准（文档）流

元素在页面中按照默认规则布局：块级元素从上到下独占一行，行内元素从左到右排列，直到一行放不下才换行。

文档流是布局的基础，浮动、定位、flex、grid 都是在文档流基础上的偏离或替代。

BFC 与布局相关的核心作用：
- 包含内部浮动元素（解决父元素高度塌陷）
- 阻止与外部浮动元素重叠（可实现自适应两栏）
- 阻止内部与外部的 margin 塌陷

IFC 与布局相关的核心特点：
- 行内元素水平排列，垂直方向由 `line-height` 和 `vertical-align` 决定
- 行内元素的垂直 margin/padding 不影响布局高度
- 行框（line box）高度由行内最高元素决定
- 浮动元素会挤压行框，实现文字环绕效果


## 浮动

**float**：浮动最初是用来做文字环绕图片效果的。浮动元素脱离标准流，向左或向右移动，直到碰到父元素边界或另一个浮动元素。

浮动元素的特点：
- 脱离标准流，不占据原来的位置
- 浮动元素会变成块级框（类似 `inline-block`，可以设置宽高）
- 浮动元素不会压住标准流中的文字，而是使文字环绕
- 多个浮动元素会依次排列，一行放不下时换行
- 浮动元素的父元素如果没有设置高度，会发生高度塌陷（因为浮动脱离了文档流，父元素计算高度时不包含浮动子元素）

```
div {
   float: left;    /* 左浮动 */
   float: right;   /* 右浮动 */
   float: none;    /* 不浮动（默认） */
}
```

**clear 清除浮动**：指定元素的哪一侧不允许出现浮动元素。

```
clear: left;     /* 左侧不允许有浮动元素 */
clear: right;    /* 右侧不允许有浮动元素 */
clear: both;     /* 两侧都不允许有浮动元素（最常用） */
clear: none;     /* 允许浮动元素（默认） */
```

**解决父元素高度塌陷的方法**：

1. **给父元素设置固定高度**（不灵活，不推荐）

2. **父元素创建 BFC**：设置 `overflow: hidden/auto/scroll` 或 `display: flow-root`

3. **伪元素清除法**（最常用，无副作用）：

```
.fatherbox::after {
    content: '';
    display: block;
    clear: both;
}
```

4. **额外标签法**：在浮动元素末尾添加一个空块级元素并设置 `clear: both`（不推荐，增加无意义标签）

`display: flow-root` 是专门用于创建 BFC 的属性，没有 `overflow: hidden` 的内容裁剪副作用，是清除浮动的推荐方案。

## 定位

**position**：通过定位可以将元素摆放到页面的任意位置。行内元素设置定位（除 sticky 外）后会变成块级框，可以设置宽高。

### 定位类型

static 静态定位（默认）：元素在文档流中正常排列，`top/right/bottom/left/z-index` 无效。

relative 相对定位：
- 相对于自己原来在文档流中的位置偏移
- 原来的位置仍然保留（不脱离文档流）
- 不会影响其他元素的布局
- 常作为绝对定位的包含块（祖先）

absolute 绝对定位：
- 相对于最近的已定位祖先元素（position 不为 static）偏移
- 如果没有已定位的祖先，则相对于初始包含块（视口/页面）
- 脱离文档流，不占据原来的位置
- 原来的位置会被其他元素占据

fixed 固定定位：
- 相对于浏览器视口（viewport）偏移
- 脱离文档流，不占据原来的位置
- 页面滚动时元素位置不变
- 注意：如果祖先元素设置了 `transform`、`filter`、`perspective` 等属性，fixed 会相对于该祖先而非视口（这是一个常见坑）

sticky 粘性定位：
- 元素在进入视口之前表现为相对定位（relative）
- 当滚动到设定的临界值（如 `top: 0`）时，切换为类似固定定位（fixed）
- 活动范围限制在父元素内，不能脱离父元素
- 父元素不能设置 `overflow: hidden/scroll/auto`，否则 sticky 会失效（因为父元素变成了滚动容器，sticky 只在最近的滚动容器内生效）
- 必须设置 `top/right/bottom/left` 中的至少一个才会生效

```
div {
    position: sticky;
    top: 0;    /* 滚动到距顶部 0 时吸顶 */
}
```

### 定位偏移属性

**top / right / bottom / left**：设置定位元素的偏移量。

- 对于 `relative`：相对于自身原位置偏移
- 对于 `absolute/fixed`：相对于包含块的对应边缘偏移
- 取值可以是长度、百分比（相对于包含块的对应尺寸）、`auto`

**inset 简写**：同时设置四个方向的偏移，顺序为上、右、下、左（和 margin/padding 一致）。

```
div {
    position: absolute;
    inset: 20px;                  /* 四个方向都是 20px */
    inset: 20px 40px;             /* 上下 20px，左右 40px */
    inset: 10px 20px 30px 40px;   /* 上右下左 */
    inset: 0;                      /* 拉伸填满包含块（等价于 top:0;right:0;bottom:0;left:0;） */
}
```

### 绝对定位的拉伸与优先级

当绝对定位或固定定位元素同时设置了对立方向的偏移时：

- **如果元素没有设置宽度**（`width: auto`）：同时设置 `left` 和 `right` 会拉伸元素的宽度
- **如果元素设置了固定宽度**：`left` 优先级高于 `right`（水平方向），`top` 优先级高于 `bottom`（垂直方向）
- 高度同理：同时设置 `top` 和 `bottom` 且未设高度时会拉伸高度

```
/* 元素未设宽度，left 和 right 同时生效，元素被拉伸 */
div {
    position: absolute;
    left: 20px;
    right: 20px;
    /* 宽度 = 包含块宽度 - 40px */
}

/* 元素设了固定宽度，left 生效，right 被忽略 */
div {
    position: absolute;
    width: 200px;
    left: 20px;
    right: 20px;   /* 被忽略 */
}
```

### 包含块

定位元素的偏移和百分比是相对于其包含块计算的。

- `static/relative`：包含块是最近的块级祖先元素的内容区
- `absolute`：包含块是最近的 position 不为 static 的祖先元素的 padding 区（如果没有则为初始包含块）
- `fixed`：包含块是视口（viewport），除非祖先有 transform/filter 等属性
- 百分比宽度相对于包含块的宽度，百分比高度相对于包含块的高度


## 变换 transform

`transform` 对元素进行平移、旋转、缩放、倾斜等变换。

注意事项：
- 行内元素（`display: inline`）设置 `transform` 无效，需要先变为 `inline-block` 或块级元素
- `transform` 对元素的移动保留原来的位置（和相对定位类似），不影响文档流中其他元素
- 其取值由各种变换函数组成，多个函数用空格分隔，**从左到右依次执行**（顺序不同结果不同）
- 当盒子被旋转后，其坐标轴也会随之旋转（后续变换基于旋转后的坐标系）
- `transform` 会创建层叠上下文和包含块（影响内部 fixed 定位）

### 基本属性

**transform-origin**：变换的原点位置，默认为元素中心（`50% 50%`）。可以设置两个值（x, y）或三个值（x, y, z）。

```
transform-origin: top left;       /* 左上角 */
transform-origin: 50px 100px;     /* 距左 50px，距上 100px */
transform-origin: 50% 100%;        /* 底部中心 */
```

**backface-visibility**：控制元素旋转到背面时是否可见。

```
backface-visibility: visible;   /* 背面可见（默认） */
backface-visibility: hidden;    /* 背面隐藏（常用于翻转卡片效果） */
```

**transform-style**：给父元素设置，定义子元素是否在 3D 空间中呈现。

```
transform-style: flat;          /* 子元素被扁平化到父元素的平面（默认） */
transform-style: preserve-3d;   /* 子元素保持 3D 空间关系（3D 效果必须设置） */
```

**perspective**：给父元素设置，定义 3D 空间的透视效果（模拟人眼到元素的距离），值越小透视效果越强。

```
perspective: 800px;   /* 人眼距屏幕 800px */
```

**perspective-origin**：给父元素设置，定义透视点（观察者）的位置，默认在元素中心（`50% 50%`）。

```
perspective-origin: top left;
```

### 平面转换（2D）

**平移 translate**：

```
transform: translate(100px, 100px);   /* x 轴平移 100px，y 轴平移 100px */
transform: translateX(100px);           /* 只沿 x 轴平移 */
transform: translateY(100px);           /* 只沿 y 轴平移 */
```

 平移百分比是相对于元素自身尺寸计算的（`translateX(50%)` 是自身宽度的 50%），这是实现未知宽高元素居中的常用方法。

**旋转 rotate**：

```
transform: rotate(45deg);    /* 顺时针旋转 45 度，负值为逆时针 */
transform: rotate(0.5turn);   /* 旋转半圈（180度） */
```

**缩放 scale**：

```
transform: scale(2, 3);    /* x 轴放大 2 倍，y 轴放大 3 倍 */
transform: scale(2);        /* x 轴和 y 轴同时放大 2 倍 */
transform: scaleX(0.5);     /* 只沿 x 轴缩放 */
transform: scaleY(0.5);     /* 只沿 y 轴缩放 */
```

 缩放值为 1 是原始大小，0 是消失，负值会翻转元素。

**倾斜 skew**：

```
transform: skew(20deg, 40deg);   /* 沿 x 轴倾斜 20 度，沿 y 轴倾斜 40 度 */
transform: skewX(20deg);           /* 只沿 x 轴倾斜 */
transform: skewY(40deg);           /* 只沿 y 轴倾斜 */
```

**多个变换组合**：

```
/* 先平移再旋转（顺序很重要！） */
transform: translate(100px, 100px) rotate(45deg);

/* 先旋转再平移（坐标系已旋转，平移方向不同） */
transform: rotate(45deg) translate(100px, 100px);
```

### 3D 转换

**3D 平移**：

```
transform: translate3d(20px, 30px, -40px);   /* x, y, z 三个方向平移 */
transform: translateZ(50px);                     /* 只沿 z 轴平移（需要父元素设置 perspective） */
```

**3D 旋转**：

```
transform: rotateX(45deg);    /* 绕 x 轴旋转（上下翻转） */
transform: rotateY(45deg);    /* 绕 y 轴旋转（左右翻转） */
transform: rotateZ(45deg);    /* 绕 z 轴旋转（等同于 2D rotate） */

/* rotate3d(x, y, z, angle)：绕自定义矢量方向旋转 */
/* x, y, z 是矢量方向的分量，最后一个参数是角度 */
transform: rotate3d(1, 0, 0, 45deg);   /* 绕 x 轴旋转 45 度 */
transform: rotate3d(1, 1, 0, 45deg);   /* 绕 x=y 对角线旋转 45 度 */
```

**3D 缩放**：

```
transform: scale3d(0.8, 0.8, 1.5);   /* x, y, z 三个方向缩放 */
transform: scaleZ(1.5);                 /* 只沿 z 轴缩放 */
```

**perspective 透视函数**：为单个元素设置透视效果（写在 transform 中），与给父元素设置 `perspective` 属性效果类似但作用范围不同。

```
/* 先设置透视再沿 Y 轴旋转 */
transform: perspective(600px) rotateY(45deg);
```

 3D 变换的必要条件：父元素设置 `perspective`（透视），需要保留 3D 空间时父元素设置 `transform-style: preserve-3d`。


## Flex 布局

Flex（弹性盒子）是一维布局模型，擅长处理单行或单列的布局。任意盒子都能使用 flex 布局，设置 `display: flex` 或 `display: inline-flex`。

设置 flex 后：
- 子元素（flex item）的 `float`、`clear`、`vertical-align` 失效
- 子元素默认不会换行，会压缩以适应容器
- 子元素默认沿主轴排列，高度拉伸到容器高度（`align-items: stretch`）

### 父元素属性

**flex-direction 主轴方向**：

```
flex-direction: row;            /* 主轴为水平方向，从左到右（默认） */
flex-direction: row-reverse;    /* 主轴为水平方向，从右到左 */
flex-direction: column;         /* 主轴为垂直方向，从上到下 */
flex-direction: column-reverse; /* 主轴为垂直方向，从下到上 */
```

**flex-wrap 换行方式**：

```
flex-wrap: nowrap;     /* 不换行（默认），子元素超出时压缩 */
flex-wrap: wrap;       /* 换行，超出的子元素换到下一行 */
flex-wrap: wrap-reverse; /* 换行，新行在上方 */
```

**flex-flow 简写**：`flex-direction` 和 `flex-wrap` 的组合。

```
flex-flow: column wrap;   /* 等价于 flex-direction: column; flex-wrap: wrap; */
```

**justify-content 主轴对齐**：设置子元素在主轴方向的对齐和分布。

```
justify-content: flex-start;    /* 从主轴起点开始排列（默认） */
justify-content: flex-end;      /* 从主轴终点开始排列 */
justify-content: center;        /* 居中排列 */
justify-content: space-between; /* 两端对齐，首尾贴边，中间平均分配 */
justify-content: space-around;  /* 每个元素两侧空间相等，元素间间隔是两侧的两倍 */
justify-content: space-evenly;  /* 所有间隔完全相等（元素间和两侧都一样） */

/* 逻辑属性值（受 flex-direction 和 direction 影响） */
justify-content: start;
justify-content: end;
justify-content: left;
justify-content: right;
justify-content: stretch;       /* 拉伸子元素填满主轴（子元素主轴尺寸为 auto 时有效） */
```

**align-items 侧轴对齐（单行）**：设置子元素在侧轴（交叉轴）方向的对齐方式，适用于单行或每行单独对齐。

```
align-items: stretch;      /* 拉伸子元素填满侧轴（默认，子元素未设高度时有效） */
align-items: flex-start;   /* 侧轴起点对齐 */
align-items: flex-end;     /* 侧轴终点对齐 */
align-items: center;       /* 侧轴居中 */
align-items: baseline;     /* 文字基线对齐 */
```

**align-content 侧轴对齐（多行）**：当有多行子元素时，设置行与行之间在侧轴的分布方式（单行时无效）。

```
align-content: flex-start;
align-content: flex-end;
align-content: center;
align-content: space-between;
align-content: space-around;
align-content: space-evenly;
align-content: stretch;    /* 拉伸行填满侧轴（默认） */
```

**gap 间距**：设置子元素之间的间距（不是外边距，不会发生 margin 塌陷）。

```
gap: 15px;               /* 行间距和列间距都是 15px */
row-gap: 15px;           /* 行间距（侧轴方向） */
column-gap: 15px;        /* 列间距（主轴方向） */
```

### 子元素属性

**flex-grow 放大比例**：当父元素有剩余空间时，子元素按比例分配剩余空间。默认值为 0（不放大）。

```
flex-grow: 1;    /* 占 1 份剩余空间 */
flex-grow: 2;    /* 占 2 份剩余空间（是 grow:1 的两倍） */
```

 剩余空间 = 容器宽度 - 所有子元素基准宽度之和。flex-grow 是按比例分配剩余空间，不是按比例分配整个宽度。

**flex-shrink 收缩比例**：当父元素空间不足时，子元素按比例收缩。默认值为 1（等比收缩），设置为 0 表示不收缩。

```
flex-shrink: 0;    /* 不收缩，保持原始宽度 */
flex-shrink: 1;    /* 正常收缩（默认） */
flex-shrink: 2;    /* 收缩更多 */
```

收缩量的计算还会考虑子元素自身的基准宽度，不是简单的按比例平分不足空间。

**flex-basis 基准尺寸**：定义子元素在分配剩余空间或收缩之前的初始大小（主轴方向）。默认值为 `auto`（使用元素的 width/height）。

```
flex-basis: auto;     /* 使用元素自身的 width（默认） */
flex-basis: 200px;    /* 基准宽度 200px */
flex-basis: 50%;       /* 基准宽度为容器的 50% */
flex-basis: 0;         /* 基准宽度为 0，所有空间都参与分配（配合 flex-grow 实现等分布局） */
```

**flex 简写**：`flex-grow flex-shrink flex-basis` 的组合。

```
flex: 1;                  /* 等价于 flex: 1 1 0%（等分布局最常用） */
flex: auto;               /* 等价于 flex: 1 1 auto */
flex: none;               /* 等价于 flex: 0 0 auto（不放大不收缩） */
flex: 2 0.5 200px;        /* grow:2, shrink:0.5, basis:200px */
```

**常见 flex 简写值**：
- `flex: 1` → 等分剩余空间（导航栏、等分布局）
- `flex: 0 0 auto` → 固定尺寸不伸缩（侧边栏）
- `flex: 1 1 auto` → 自动伸缩填满

**align-self 单独对齐**：单独设置某个子元素在侧轴的对齐方式，覆盖父元素的 `align-items`。

```
align-self: auto;         /* 继承父元素的 align-items（默认） */
align-self: flex-start;
align-self: flex-end;
align-self: center;
align-self: baseline;
align-self: stretch;
```

**order 排列顺序**：设置子元素的排列顺序，数值越小越靠前，默认值为 0。可以为负数。

```
order: 0;     /* 默认顺序 */
order: 1;     /* 排在默认元素之后 */
order: -1;    /* 排在默认元素之前 */
```

**margin: auto 吸收剩余空间**：子元素在主轴方向的 `margin: auto` 会自动吸收剩余空间，可实现特殊对齐效果。

```
/* 第一个元素靠左，其余靠右 */
.item:first-child {
    margin-right: auto;
}

/* 单个元素 margin: auto 可实现水平垂直居中（容器需有剩余空间） */
.centered {
    margin: auto;
}
```

## Grid 布局

Grid（网格）是二维布局模型，可以同时处理行和列，是最强大的 CSS 布局系统。

设置 `display: grid` 或 `display: inline-grid` 后，子元素成为网格项（grid item）。

### 父元素属性

**grid-template-columns 定义列**：

```
grid-template-columns: 100px 100px 100px;   /* 3 列，每列 100px */
grid-template-columns: 1fr 1fr 1fr;           /* 3 列，等分剩余空间 */
grid-template-columns: repeat(3, 1fr);         /* 等价于上面，repeat 重复 */
grid-template-columns: 2fr repeat(3, 1fr);     /* 第 1 列 2fr，后 3 列各 1fr */
grid-template-columns: 200px 1fr 2fr;          /* 第 1 列固定 200px，剩余按 1:2 分配 */
```

**grid-template-rows 定义行**：语法与列完全相同。

```
grid-template-rows: 100px 100px 100px;
grid-template-rows: repeat(3, 1fr);
```

**repeat() 函数**：重复定义轨道。

```
repeat(3, 1fr);                    /* 重复 3 次 1fr */
repeat(2, 100px 200px);            /* 重复 100px 200px 两次 → 100px 200px 100px 200px */
repeat(auto-fill, 200px);          /* 自动填充，每行尽可能多地放 200px 的列 */
repeat(auto-fit, minmax(200px, 1fr)); /* 自动适配，列数随容器宽度变化，且列会拉伸填满 */
```

 `auto-fill` 和 `auto-fit` 的区别：当容器宽度大于所有列宽度之和时，`auto-fill` 会保留空列（内容不拉伸），`auto-fit` 会将空列折叠、现有列拉伸填满。

**minmax() 函数**：定义轨道的最小和最大尺寸。

```
grid-template-columns: minmax(200px, 1fr) 1fr;  /* 第 1 列最小 200px，最大 1fr */
grid-template-rows: minmax(100px, auto);          /* 行高最小 100px，内容多时自动撑开 */
```

**响应式网格（无需媒体查询）**：

```
/* 经典响应式卡片布局：每列最小 250px，自动适应列数 */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 20px;
```

**gap 间距**：

```
gap: 10px;                    /* 行间距和列间距都是 10px */
row-gap: 10px;                /* 行间距 */
column-gap: 10px;             /* 列间距 */
```

**grid-template-areas 命名网格区域**：用字符串定义网格区域布局，直观易懂。

```
.container {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 60px 1fr 40px;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    gap: 10px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

区域名称必须形成矩形，不能有 L 形或断开的区域。`.` 表示空单元格。

**命名网格线**：定义轨道时可以给网格线命名，方便子元素定位。

```
.container {
    display: grid;
    grid-template-columns: [start] 1fr [middle] 2fr [end];
    grid-template-rows: [top] 100px [center] 100px [bottom];
}

/* 子元素使用命名网格线定位 */
.item {
    grid-column: start / middle;   /* 从 start 线到 middle 线 */
    grid-row: top / bottom;        /* 从 top 线到 bottom 线 */
}
```

**justify-items 单元格内水平对齐**：设置网格项在单元格内的水平对齐方式。

```
justify-items: stretch;    /* 拉伸填满单元格（默认） */
justify-items: start;      /* 单元格左侧 */
justify-items: end;        /* 单元格右侧 */
justify-items: center;     /* 单元格水平居中 */
```

**align-items 单元格内垂直对齐**：设置网格项在单元格内的垂直对齐方式。

```
align-items: stretch;     /* 拉伸填满单元格（默认） */
align-items: start;       /* 单元格顶部 */
align-items: end;         /* 单元格底部 */
align-items: center;      /* 单元格垂直居中 */
```

**place-items 简写**：`align-items` / `justify-items` 的组合（先垂直后水平）。

```
place-items: center;            /* 水平垂直都居中 */
place-items: start center;      /* 垂直顶部，水平居中 */
```

**justify-content 网格整体水平对齐**：当网格总宽度小于容器宽度时，设置整个网格在容器内的水平分布。

```
justify-content: start;
justify-content: end;
justify-content: center;
justify-content: stretch;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;
```

**align-content 网格整体垂直对齐**：当网格总高度小于容器高度时，设置整个网格在容器内的垂直分布。

```
align-content: start;
align-content: end;
align-content: center;
align-content: stretch;
align-content: space-between;
align-content: space-around;
align-content: space-evenly;
```

**place-content 简写**：`align-content` / `justify-content` 的组合。

```
place-content: center;
place-content: start center;
```

**grid-auto-flow 自动排列方向**：当子元素没有明确指定位置时，控制自动排列的方向和密集填充。

```
grid-auto-flow: row;        /* 按行排列（默认），一行满了换下一行 */
grid-auto-flow: column;     /* 按列排列 */
grid-auto-flow: row dense;  /* 按行排列，且密集填充（前面的空格会被后面的元素填补） */
grid-auto-flow: column dense;
```

**grid-auto-rows / grid-auto-columns 隐式轨道尺寸**：当子元素超出显式定义的网格范围时，自动创建的隐式行/列的尺寸。

```
grid-auto-rows: 100px;          /* 自动创建的行高为 100px */
grid-auto-rows: minmax(100px, auto);  /* 自动行最小 100px，内容多则撑开 */
grid-auto-columns: 200px;        /* 自动创建的列宽为 200px */
```

### 子元素属性

**grid-column 列位置**：`grid-column-start / grid-column-end` 的简写。

```
grid-column: 1 / 3;          /* 从第 1 条列线到第 3 条列线（跨 2 列） */
grid-column: span 2;          /* 跨 2 列（自动确定起始位置） */
grid-column: 2 / span 3;      /* 从第 2 条列线开始，跨 3 列 */
grid-column: 1 / -1;           /* 从第 1 条列线到最后一条列线（跨所有列） */
```

**grid-row 行位置**：语法与 grid-column 相同。

```
grid-row: 1 / 3;
grid-row: span 2;
grid-row: 2 / -1;
```

**grid-area 区域位置**：`grid-row-start / grid-column-start / grid-row-end / grid-column-end` 的简写，或直接引用 `grid-template-areas` 定义的区域名。

```
/* 使用区域名（配合 grid-template-areas） */
grid-area: header;

/* 使用线编号：行起始 / 列起始 / 行结束 / 列结束 */
grid-area: 1 / 1 / 3 / 3;    /* 从第1行第1列到第3行第3列 */

/* 使用 span */
grid-area: span 2 / span 2;   /* 跨 2 行 2 列 */
```

**justify-self 单个项水平对齐**：覆盖容器的 `justify-items`，只对当前项生效。

```
justify-self: stretch;
justify-self: start;
justify-self: end;
justify-self: center;
```

**align-self 单个项垂直对齐**：覆盖容器的 `align-items`。

```
align-self: stretch;
align-self: start;
align-self: end;
align-self: center;
```

**place-self 简写**：`align-self` / `justify-self` 的组合。

```
place-self: center;
place-self: start center;
```

**order 排列顺序**：与 flex 的 order 相同，数值越小越靠前，默认 0。

## 多列布局

多列布局（Multi-column Layout）用于将内容分成多列显示，类似报纸排版，适合长文本阅读。

**column-count 列数**：

```
column-count: 3;    /* 分成 3 列 */
column-count: auto;  /* 由 column-width 决定列数（默认） */
```

**column-width 列宽**：每列的理想宽度，浏览器会根据容器宽度自动计算列数。

```
column-width: 200px;   /* 每列约 200px，列数随容器宽度自动变化 */
```

 同时设置 `column-count` 和 `column-width` 时，`column-count` 表示最大列数，实际列数取两者计算结果的较小值。

**columns 简写**：`column-width` / `column-count` 的组合。

```
columns: 200px 3;    /* 列宽 200px，最多 3 列 */
columns: 3;            /* 3 列，列宽自动 */
```

**column-gap 列间距**：

```
column-gap: 20px;     /* 列间距 20px */
column-gap: normal;    /* 默认间距（约 1em） */
```

**column-rule 列分隔线**：列之间的分隔线，语法与 border 类似，但不占据空间。

```
column-rule: 1px solid #ccc;     /* 1px 灰色实线 */
column-rule-width: 1px;
column-rule-style: solid;
column-rule-color: #ccc;
```

**column-span 跨列**：设置元素是否横跨所有列。

```
column-span: all;     /* 横跨所有列（常用于标题） */
column-span: none;    /* 不跨列（默认） */
```

**break-inside 避免内容被截断**：

```
break-inside: avoid;      /* 避免元素内部被分列截断（卡片、图片等） */
break-inside: avoid-page; /* 避免分页截断 */
```

```
/* 完整示例：新闻列表多列排版 */
.news-list {
    columns: 3;
    column-gap: 30px;
    column-rule: 1px solid #eee;
}
.news-list h2 {
    column-span: all;    /* 标题横跨所有列 */
}
.news-item {
    break-inside: avoid;  /* 每条新闻不被分列截断 */
    margin-bottom: 20px;
}
```
