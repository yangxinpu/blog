## 安装与编译

Sass 有两种语法：
- **SCSS**（`.scss`）：CSS 超集，语法与 CSS 一致，最常用
- **Sass**（`.sass`）：缩进语法，省略大括号和分号，用缩进表示嵌套

当前主流使用的是 **Dart Sass**（`sass` npm 包），旧的 Node Sass（`node-sass`）已废弃。

### 项目安装

在终端中执行：

```
npm init -y                    # 初始化项目
npm i sass --save-dev           # 安装 Dart Sass 编译器
```

React、Vue 等框架会自动集成 Sass 编译器，只需安装 `sass` 包即可直接使用 `.scss` 文件。

打开 `package.json`，在 `scripts` 字段中添加编译命令：

```
{
  "scripts": {
    "sass:compile": "sass src/:dist/css/ --no-source-map",
    "sass:watch": "sass --watch src/:dist/css/ --no-source-map"
  }
}
```

- `src/` 是 SCSS 源文件目录，`dist/css/` 是编译后的 CSS 输出目录
- `--no-source-map` 去除 source map 文件
- `--watch` 实时监听文件变化并自动编译
- `--style=compressed` 输出压缩后的 CSS

运行：

```
npm run sass:compile    # 单次编译
npm run sass:watch      # 实时监听
```

### 命令行直接使用

```
npx sass input.scss output.css          # 单次编译
npx sass --watch input.scss output.css  # 监听编译
npx sass --style=compressed input.scss  # 压缩输出
```

### VSCode 插件

安装插件 Live Sass Compiler，在项目根目录创建 `.vscode/settings.json`：

```
{
  "liveSassCompile.settings.formats": [
    {
      "format": "expanded",
      "extensionName": ".css",
      "savePath": "/dist/css"
    }
  ],
  "liveSassCompile.settings.excludeList": ["**/node_modules/**", ".vscode/**"]
}
```


## 注释

Sass 支持两种注释：

```
// 单行注释，编译后不会出现在 CSS 中

/* 多行注释，编译后会保留在 CSS 中（压缩模式下会被去除） */

/*! 强制注释，即使压缩模式下也会保留（常用于版权声明） */
```


## 变量

以 `$` 开头，变量名可以使用字母、数字、下划线、中划线，不能以数字开头。中划线和下划线等价（`$font-size` 和 `$font_size` 是同一个变量）。

当变量同名时，后定义的会覆盖前面定义的。

```
$base-color: #333;          // 全局变量

div {
    $font-size: 20px;        // 局部变量，只在当前块内有效
    background-color: $base-color;
    font-size: $font-size;
}
```

### 变量标志

**!default 默认值**：如果变量已经被赋值（包括 null），则不覆盖；如果未赋值，则使用默认值。常用于可配置的库/模块。

```
$primary-color: blue !default;   // 如果外部已定义 $primary-color 则用外部的，否则用 blue

// 配合 @use with 使用（见导入章节）
@use 'variables' with (
    $primary-color: red
);
```

**!global 全局提升**：在局部作用域中修改全局变量。

```
$color: red;

div {
    $color: blue !global;   // 修改全局变量 $color 为 blue
}
// 此时全局 $color 已变为 blue
```

### 变量插值

变量不能直接用在选择器或属性名中，需要用 `#{}` 插值语法：

```
$theme: "dark";

.#{$theme}-theme {
    background-#{$theme}: #333;   // 插值用在属性名中
    color: white;
}
```


## 数据类型

SassScript 支持以下数据类型：

| 类型 | 示例 | 说明 |
|---|---|---|
| 数字 | `15px`、`2`、`1.5` | 可带单位 |
| 字符串 | `"宋体"`、`bold` | 有引号和无引号两种 |
| 颜色 | `#333`、`rgba(0,0,0,0.5)`、`red` | |
| 布尔值 | `true`、`false` | |
| 空值 | `null` | |
| 列表 List | `10px 20px 30px`、`a, b, c` | 用空格或逗号分隔 |
| 映射 Map | `("key1": value1, "key2": value2)` | 键值对 |

### 列表 List

列表元素之间用空格或逗号分隔，索引从 **1** 开始（不是 0）。

```
$spacings: 10px 20px 30px;        // 空格分隔的列表
$font-family: "宋体", "黑体", sans-serif;  // 逗号分隔的列表
```

### 映射 Map

键值对集合，类似于 JS 的对象。

```
$theme-colors: (
    "primary": #4285f4,
    "success": #34a853,
    "danger": #ea4335,
    "warning": #fbbc05
);
```


## 运算

### 数字运算

支持 `+`、`-`、`*`、`/`、`%`。

**加法/减法/乘法**：相同单位可直接运算，不同单位会报错（乘法会产生复合单位如 `px*px`，通常不使用）。

```
$width: 100px + 50px;     // 150px
$height: 200px - 50px;    // 150px
$size: 10px * 2;           // 20px
```

**除法（重要）**：在现代 Dart Sass 中，`/` 运算符**不再用于除法**（会被解析为 CSS 的斜杠分隔符，如 `font: 16px/1.5`）。除法必须使用 `math.div()` 函数。

```
@use 'sass:math';

$half: math.div(100px, 2);       // 50px
$ratio: math.div(100px, 2em);    // 50px/em（不同单位相除产生比例单位）
$percent: math.div(3, 4) * 100%; // 75%
```

旧代码中 `100px / 2` 的写法在 Dart Sass 1.x 中仍可工作但会报弃用警告，Dart Sass 2.x 中将完全作为列表分隔符。应尽快迁移到 `math.div()`。

### 颜色运算

颜色可以进行加减乘除运算（逐通道计算），但更推荐使用颜色函数（见函数章节）。

```
$color: #010203 + #040506;   // #050709
$color: #010203 * 2;           // #020406
```

### 字符串运算

`+` 可以拼接字符串。如果左操作数有引号，结果有引号；否则无引号。

```
$str: "foo" + bar;    // "foobar"
$str: foo + "bar";    // foobar（无引号）
```

### 布尔运算

`and`（与）、`or`（或）、`not`（非）。

```
$a: true and false;    // false
$b: true or false;     // true
$c: not true;           // false
```

### 比较运算

`==`、`!=`、`>`、`<`、`>=`、`<=`。

```
$a: 5 > 3;     // true
$b: 5 == 5;    // true
```


## 语句

### @if 条件判断

```
$is: 3;

div {
    @if $is >= 3 and $is <= 5 {
        background-color: aqua;
    } @else if $is == 2 {
        background-color: yellow;
    } @else {
        background-color: aquamarine;
    }
}
```

### @for 循环

```
// to：不包含结束值，$i 从 1 到 2
@for $i from 1 to 3 {
    .p#{$i} {
        font-size: $i * 10px;
    }
}

// through：包含结束值，$i 从 1 到 3
@for $i from 1 through 3 {
    .mt-#{$i} {
        margin-top: $i * 4px;
    }
}
```

### @while 循环

```
$i: 5;

@while $i > 0 {
    $i: $i - 1;
    .p#{$i} {
        font-size: $i * 10px;
    }
}
```

注意避免无限循环，确保条件最终会变为 false。

### @each 遍历

遍历列表：

```
$list: 1 2 3 4 5;

@each $value in $list {
    .p#{$value} {
        font-size: $value * 10px;
    }
}
```

遍历 Map：

```
$theme-colors: (
    "primary": #4285f4,
    "success": #34a853,
    "danger": #ea4335
);

@each $name, $color in $theme-colors {
    .text-#{$name} {
        color: $color;
    }
    .bg-#{$name} {
        background-color: $color;
    }
}
```

多变量遍历（解构）：

```
$icons: ("eye", "\f112"), ("heart", "\f004"), ("star", "\f005");

@each $name, $content in $icons {
    .icon-#{$name}::before {
        content: $content;
    }
}
```

### @at-root 跳出嵌套

`@at-root` 使嵌套内的规则跳出到根层级，不继承父选择器。

```
.parent {
    color: red;

    @at-root .child {
        color: blue;    // 编译为 .child，不是 .parent .child
    }

    @at-root {
        .sibling1 { color: green; }   // 都跳出到根
        .sibling2 { color: yellow; }
    }
}
```

编译结果：

```
.parent { color: red; }
.child { color: blue; }
.sibling1 { color: green; }
.sibling2 { color: yellow; }
```

### 调试指令

**@debug**：在终端打印调试信息。

```
@debug 10em + 12em;   // 终端输出: 22em
```

**@warn**：打印警告信息（带堆栈跟踪），不中断编译。

```
@mixin old-mixin {
    @warn "old-mixin 已弃用，请使用 new-mixin";
    color: red;
}
```

**@error**：抛出错误并中断编译。

```
@function valid-color($color) {
    @if type-of($color) != color {
        @error "参数必须是颜色类型，当前传入的是 #{type-of($color)}";
    }
    @return $color;
}
```


## 函数

Sass 提供了丰富的内置函数，也可以自定义函数。函数使用 `@return` 返回值。

### 颜色函数

需要引入 `sass:color` 模块。

**color.adjust()**：通过命名参数对颜色进行多种调整，每个参数是相对当前值的增减量。

- `$lightness`：亮度，正值调亮，负值调暗，单位 `%`
- `$saturation`：饱和度，正值更鲜艳，负值更灰暗，单位 `%`
- `$alpha`：不透明度，正值更不透明，负值更透明，取值 -1 到 1
- `$hue`：色相，单位 `deg`
- `$red` / `$green` / `$blue`：RGB 通道调整

```
@use 'sass:color';

$c1: #840808;

color: color.adjust($c1, $lightness: 50%);        // 调亮 50%
color: color.adjust($c1, $saturation: -20%);       // 降低饱和度 20%
color: color.adjust($c1, $alpha: -0.3);            // 降低不透明度 0.3
color: color.adjust($c1, $hue: 30deg);             // 色相旋转 30 度

// 组合调整
color: color.adjust(
    $c1,
    $lightness: -10%,
    $saturation: -20%,
    $alpha: -0.2
);
```

**其他常用颜色函数**：

```
@use 'sass:color';

color.lighten($color, 20%);        // 调亮（旧 API，推荐用 color.adjust）
color.darken($color, 20%);         // 调暗
color.saturate($color, 20%);        // 增加饱和度
color.desaturate($color, 20%);      // 降低饱和度
color.opacify($color, 0.3);          // 增加不透明度
color.transparentize($color, 0.3);   // 增加透明度
color.mix($color1, $color2, 50%);    // 混合两种颜色，50% 是 color1 的比例
color.invert($color);                  // 反色
color.complement($color);              // 互补色
color.grayscale($color);               // 灰度
```

### 数学函数

需要引入 `sass:math` 模块。

```
@use 'sass:math';

$round: math.round(3.7);          // 4（四舍五入）
$ceil: math.ceil(3.2);            // 4（向上取整）
$floor: math.floor(3.9);          // 3（向下取整）
$abs: math.abs(-15px);            // 15px（绝对值）
$min: math.min(1px, 2px, 3px);   // 1px（最小值）
$max: math.max(1px, 2px, 3px);   // 3px（最大值）
$pow: math.pow(2, 3);             // 8（2 的 3 次方）
$sqrt: math.sqrt(16);             // 4（平方根）
$div: math.div(100px, 2);         // 50px（除法，替代 / 运算符）
$random1: math.random();          // 0-1 之间的随机小数
$random2: math.random(10);        // 1-10 之间的随机整数
$percentage: math.percentage(0.5); // 50%
```

### 列表函数

需要引入 `sass:list` 模块。

```
@use 'sass:list';

$sizes: 10px 20px 30px;

list.length($sizes);              // 3（长度）
list.nth($sizes, 1);              // 10px（第 1 个元素，索引从 1 开始）
list.append($sizes, 40px);        // 10px 20px 30px 40px（末尾追加）
list.prepend($sizes, 5px);        // 5px 10px 20px 30px（开头插入）
list.slice($sizes, 2, 3);         // 20px 30px（截取第 2 到第 3 个）
list.index($sizes, 20px);         // 2（查找元素位置，找不到返回 null）
list.join((1, 2), (3, 4));        // 1, 2, 3, 4（合并两个列表）
list.separator($sizes);            // space（列表分隔符类型：space/comma）
list.is-bracketed($sizes);         // false（是否有方括号）
```

### Map 函数

需要引入 `sass:map` 模块。

```
@use 'sass:map';

$theme: (
    "primary": #4285f4,
    "success": #34a853,
    "danger": #ea4335
);

map.get($theme, "primary");        // #4285f4（根据键获取值）
map.has-key($theme, "primary");    // true（是否包含键）
map.keys($theme);                   // "primary", "success", "danger"（所有键）
map.values($theme);                 // #4285f4, #34a853, #ea4335（所有值）
map.merge($theme, ("warning": #fbbc05));  // 合并两个 Map
map.remove($theme, "danger");       // 移除指定键
map.deep-merge($map1, $map2);       // 深度合并（嵌套 Map 也会合并）
map.deep-get($map, "a", "b");       // 深度获取嵌套值
```

### 字符串函数

需要引入 `sass:string` 模块。

```
@use 'sass:string';

$str: "Hello World";

string.quote($str);              // "Hello World"（添加引号）
string.unquote($str);            // Hello World（去除引号）
string.length($str);             // 11（字符串长度）
string.insert($str, " Beautiful", 6);  // "Hello Beautiful World"（插入）
string.slice($str, 1, 5);        // "Hello"（截取，索引从 1 开始）
string.to-upper-case($str);      // "HELLO WORLD"
string.to-lower-case($str);      // "hello world"
string.index($str, "World");     // 7（查找子串位置）
string.unique-id();               // 随机唯一 ID（如 u01ab2c3d）
```

### 元信息函数

需要引入 `sass:meta` 模块。

```
@use 'sass:meta';

type-of(100px);               // number
type-of(#333);                 // color
type-of("hello");              // string
type-of(true);                 // bool
type-of(null);                 // null
type-of((a: 1));               // map
type-of(1 2 3);                // list

unit(100px);                   // px
unitless(100);                 // true（是否无单位）
comparable(100px, 200px);     // true（单位是否可比较）
feature-exists("bug");         // 检查 Sass 实现是否支持某特性
inspect($value);               // 返回值的字符串表示（调试用）
call($function, $args...);     // 动态调用函数
get-function("func-name");     // 获取函数引用
```

### 自定义函数

使用 `@function` 定义，`@return` 返回值。支持参数默认值和剩余参数。

```
@function px-to-rem($px, $base: 16px) {
    @return math.div($px, $base) * 1rem;
}

.title {
    font-size: px-to-rem(24px);       // 1.5rem
    font-size: px-to-rem(24px, 10px); // 2.4rem（自定义基准）
}
```

剩余参数（`$args...`）：

```
@function sum($numbers...) {
    $sum: 0;
    @each $num in $numbers {
        $sum: $sum + $num;
    }
    @return $sum;
}

.result {
    width: sum(10px, 20px, 30px);    // 60px
}
```


## 导入与模块系统

Sass 的模块系统经历了从 `@import` 到 `@use`/`@forward` 的演进。

### @import（已弃用）

`@import` 会将导入的文件内容全局合并到当前文件中，所有变量、mixin、函数都进入全局命名空间。

**问题**：
- 容易产生变量命名冲突
- 每次导入都会重复编译（即使同一文件被多次导入）
- 无法控制哪些内容被导出
- 已被官方标记为弃用，未来将被移除

```
@import '_variables.scss';
@import 'mixins';    // 可省略下划线和扩展名
```

以下划线 `_` 开头的文件（如 `_variables.scss`）称为局部文件（partial），不会被单独编译为 CSS，只能被导入。

### @use 模块化导入（推荐）

`@use` 是现代 Sass 的模块系统，每个文件只编译一次，导入的成员通过命名空间访问，避免全局污染。

```
@use 'variables';              // 默认命名空间为文件名（variables）
@use 'variables' as vars;     // 自定义命名空间
@use 'variables' as *;         // 无命名空间，可直接使用成员（不推荐，可能冲突）

.button {
    color: variables.$primary-color;    // 通过命名空间访问变量
    @include variables.flex-center;      // 通过命名空间访问 mixin
    font-size: variables.px-to-rem(24px); // 通过命名空间访问函数
}
```

**@use with 配置模块**：模块中用 `!default` 声明的变量可以在导入时配置。

```
// _variables.scss
$primary-color: #4285f4 !default;
$border-radius: 4px !default;
$spacing: 16px !default;
```

```
// main.scss
@use 'variables' with (
    $primary-color: #ea4335,    // 覆盖默认值
    $border-radius: 8px
);
// $spacing 未配置，使用默认值 16px
```

只有顶层用 `!default` 声明的变量才能被 `with` 配置。私有变量（以 `-` 或 `_` 开头）不能被配置。

**私有成员**：以 `-` 或 `_` 开头的变量、mixin、函数是模块私有的，不会被 `@use` 导出。

```
// _helpers.scss
$_internal-color: red;    // 私有变量，外部无法访问

@mixin public-mixin {     // 公开 mixin
    color: $_internal-color;
}
```

### @forward 转发模块

`@forward` 将另一个模块的成员通过当前文件转发出去，当前文件本身不引入这些成员（不能在当前文件中直接使用）。常用于创建统一的入口文件，聚合多个子模块。

```
// _index.scss（统一入口）
@forward 'variables';
@forward 'mixins';
@forward 'functions';
```

```
// 使用方只需导入入口文件
@use 'index' as lib;

.button {
    color: lib.$primary-color;
    @include lib.flex-center;
}
```

**控制转发内容**：

```
@forward 'variables' show $primary-color, $border-radius;  // 只转发指定成员
@forward 'variables' hide $_internal, debug-mixin;          // 隐藏指定成员
@forward 'variables' as var-*;                                // 转发时添加前缀（成员名变为 var-primary-color）
```

**@forward with 配置转发**：转发时可以预先配置模块的 `!default` 变量。

```
@forward 'variables' with (
    $primary-color: #ea4335 !default   // 加 !default 表示使用方还可以再次覆盖
);
```


## 混合 @mixin

`@mixin` 定义可复用的样式块，通过 `@include` 引入。

### 基本用法

```
@mixin reset-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

ul, ol {
    @include reset-list;
}
```

### 带参数

```
@mixin box($padding: 16px, $radius: 4px) {   // 带默认值
    padding: $padding;
    border-radius: $radius;
    border: 1px solid #ddd;
}

.card {
    @include box(20px, 8px);     // 按位置传参
    @include box($radius: 12px);  // 按名称传参（未传的用默认值）
}
```

### @content 内容块

`@content` 接收 `@include` 时传入的样式块，类似于插槽。常用于媒体查询、作用域包裹等。

```
@mixin respond-to($breakpoint) {
    @media (min-width: $breakpoint) {
        @content;    // 传入的样式插入到这里
    }
}

.sidebar {
    width: 100%;

    @include respond-to(768px) {
        width: 300px;    // 这部分样式会被插入到 @media 中
    }
}
```

编译结果：

```
.sidebar { width: 100%; }
@media (min-width: 768px) {
    .sidebar { width: 300px; }
}
```

`@content` 也可以接收参数：

```
@mixin theme($name) {
    [data-theme="#{$name}"] & {
        @content($name);
    }
}

.button {
    @include theme(dark) {
        background: #333;
    }
}
```

### 常用 Mixin 示例

**清除浮动**：

```
@mixin clearfix {
    &::after {
        content: '';
        display: table;
        clear: both;
    }
}
```

**单行文本省略**：

```
@mixin ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```

**多行文本省略**：

```
@mixin line-clamp($lines: 2) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $lines;
    overflow: hidden;
}
```

**水平垂直居中**：

```
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

**媒体查询断点**：

```
$breakpoints: (
    sm: 576px,
    md: 768px,
    lg: 1024px,
    xl: 1200px
);

@mixin bp($name) {
    $width: map.get($breakpoints, $name);
    @if $width {
        @media (min-width: $width) {
            @content;
        }
    } @else {
        @error "未找到断点 #{$name}";
    }
}

// 使用
.container {
    padding: 10px;
    @include bp(md) { padding: 20px; }
    @include bp(lg) { padding: 30px; }
}
```

## 继承 @extend

`@extend` 让一个选择器继承另一个选择器的所有样式，编译时会合并选择器（不是复制样式）。

### 占位符选择器 %

以 `%` 开头的选择器不会被单独编译输出，只有被 `@extend` 引用时才会出现在 CSS 中。推荐使用占位符进行继承。

```
%button-base {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
}

.btn-primary {
    @extend %button-base;
    background-color: #4285f4;
    color: white;
}

.btn-danger {
    @extend %button-base;
    background-color: #ea4335;
    color: white;
}
```

编译结果：

```
.btn-primary, .btn-danger {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
}
.btn-primary { background-color: #4285f4; color: white; }
.btn-danger { background-color: #ea4335; color: white; }
```

### 继承类选择器

也可以继承普通的类选择器，但该类选择器本身也会被编译输出。

```
.message {
    padding: 12px;
    border-radius: 4px;
}

.success {
    @extend .message;
    background: #d4edda;
    color: #155724;
}

.error {
    @extend .message;
    background: #f8d7da;
    color: #721c24;
}
```

编译结果：

```
.message, .success, .error {
    padding: 12px;
    border-radius: 4px;
}
.success { background: #d4edda; color: #155724; }
.error { background: #f8d7da; color: #721c24; }
```

### @extend 注意事项

1. **优先使用 `%` 占位符**，避免不需要的基类被输出到 CSS
2. **@extend 会继承所有关联选择器**，包括 `.message:hover`、`.message span` 等，可能产生意外的选择器
3. **@extend 不能在 @media 中继承外部选择器**（会报错）
4. **@mixin vs @extend 选择**：
   - 需要参数或动态样式 → 用 `@mixin`
   - 纯静态样式复用、且多个选择器共享 → 用 `@extend %placeholder`
   - `@extend` 产生的 CSS 体积更小（选择器合并），但可能产生复杂的选择器链
   - `@mixin` 更灵活，gzip 压缩后体积差异不大，现代开发更推荐 mixin

## 嵌套

Sass 嵌套是最常用的特性之一，可以减少重复书写父选择器。

### 选择器嵌套

```
.nav {
    background: #333;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        display: inline-block;

        a {
            color: white;
            text-decoration: none;

            &:hover {
                color: #4285f4;
            }
        }
    }
}
```

### & 父选择器引用

`&` 代表父选择器本身，常用于伪类、伪元素、拼接类名。

```
.button {
    background: #eee;

    &:hover { background: #ddd; }       /* .button:hover */
    &::before { content: ''; }           /* .button::before */
    &.active { background: blue; }       /* .button.active */
    &-primary { background: blue; }      /* .button-primary（拼接类名） */

    .theme-dark & { color: white; }      /* .theme-dark .button（& 在后面） */
}
```

### 属性嵌套

相同前缀的属性可以嵌套：

```
.box {
    border: {
        top: 1px solid red;
        right: 2px solid blue;
        bottom: 1px solid green;
        left: 2px solid yellow;
    }
    // 等价于 border-top, border-right, border-bottom, border-left

    margin: {
        top: 10px;
        bottom: 20px;
    }
}
```

### @media 嵌套

媒体查询可以嵌套在选择器内部，编译时会提到外部：

```
.container {
    width: 100%;

    @media (min-width: 768px) {
        width: 750px;
    }

    @media (min-width: 1024px) {
        width: 970px;
    }
}
```

编译结果：

```
.container { width: 100%; }
@media (min-width: 768px) {
    .container { width: 750px; }
}
@media (min-width: 1024px) {
    .container { width: 970px; }
}
```
