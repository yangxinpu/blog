
## HTML 概述

HTML（HyperText Markup Language）用于描述网页的内容和结构。CSS 负责表现，JavaScript 负责行为。

浏览器读取 HTML 字节后，会进行解码、分词和树构建，最终生成 DOM。浏览器具有错误恢复能力，错误标签也可能被“自动修复”，但修复结果不一定符合预期，因此不能依赖错误恢复。

HTML 元素由开始标签、内容和结束标签组成：

```
<p class="intro">这是一段内容</p>
```

- `p`：元素名；
- `class`：属性名；
- `"intro"`：属性值；
- 标签名和属性名不区分大小写，但统一使用小写；
- 属性值建议始终使用引号；
- HTML 注释使用 `<!-- 注释 -->`，不能使用 `//`；
- HTML 注释不能写在标签的开始标签内部。

### 文档基本结构

```
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="页面内容简介">
    <title>页面标题</title>
    <link rel="stylesheet" href="/styles/main.css">
    <script type="module" src="/scripts/main.js"></script>
  </head>
  <body>
    <header>页头</header>
    <main>主要内容</main>
    <footer>页脚</footer>
  </body>
</html>
```

- `<!doctype html>`：让浏览器使用标准模式渲染；
- `<html>`：文档根元素；
- `lang`：声明主要语言，帮助屏幕阅读器、搜索引擎和翻译工具；
- `<head>`：保存标题、字符集、样式表等元数据；
- `<body>`：保存页面可见内容；
- `<meta charset="UTF-8">`：应尽量靠前，避免浏览器使用错误编码；
- `<meta name="viewport">`：让移动端使用设备宽度布局；
- `<title>`：显示在浏览器标签、历史记录和搜索结果中，每个页面应有清晰且独立的标题；
- `description`：为搜索引擎等工具提供页面摘要，但不保证被搜索结果采用。

### 元素类型与语法

普通元素必须正确闭合：

```
<article>
  <h2>文章标题</h2>
  <p>文章内容</p>
</article>
```

空元素（void element）不能包含子节点，也没有结束标签：

```
<area>
<base>
<br>
<col>
<embed>
<hr>
<img>
<input>
<link>
<meta>
<source>
<track>
<wbr>
```

HTML 中可以写 `<img />`，但末尾 `/` 只是兼容写法，不会改变元素性质。不要把普通元素写成 `<div />`，它不会像 XML 那样自动闭合。

布尔属性只看是否存在：

```
<button disabled>不可点击</button>
<details open>默认展开</details>
```

`disabled="false"`、`open="false"` 仍然表示启用该布尔属性。要表示 `false`，必须移除属性。

### 字符实体

需要显示 HTML 保留字符时使用字符实体：

| 字符 | 实体 |
| --- | --- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| 不换行空格 | `&nbsp;` |

`&nbsp;` 不应被用来控制布局，布局应交给 CSS。

### 内容模型与嵌套

HTML 对元素嵌套有语义限制，常见规则：

- `<ul>`、`<ol>` 的直接子元素应为 `<li>`；
- `<dl>` 由 `<dt>` 和 `<dd>` 组成；
- `<table>` 应按表格结构嵌套；
- `<p>` 不能包含 `<div>`、标题、列表等块级结构，解析器会自动结束 `<p>`；
- `<form>` 不能嵌套另一个 `<form>`；
- `<a>` 内不能再嵌套 `<a>`；
- 通常不要嵌套按钮、链接等交互元素。

“块级元素”和“行内元素”主要是默认 CSS 表现。选择 HTML 元素时应优先考虑语义，而不是默认样式。

## 文档元数据与资源加载

### 常用 meta 标签

`<meta>` 描述文档的元数据，位于 `<head>`，不显示在页面中。

```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="页面内容简介，影响搜索结果摘要">
<meta name="keywords" content="HTML,CSS,JavaScript">
<meta name="author" content="作者名">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#4285f4">
<meta name="color-scheme" content="light dark">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

常用 `name` 属性：

- `description`：页面摘要，搜索引擎可能用于搜索结果；
- `keywords`：页面关键词，现代搜索引擎基本不使用；
- `author`：作者；
- `robots`：控制搜索引擎爬虫行为，如 `index`（索引）、`noindex`（不索引）、`follow`（跟踪链接）、`nofollow`（不跟踪链接）、`noarchive`（不保存快照）；
- `theme-color`：移动端浏览器地址栏/工具栏的主题色；
- `color-scheme`：声明页面支持的配色方案（`light`、`dark`），影响浏览器原生控件和滚动条样式；
- `referrer`：默认 Referrer 策略；
- `generator`：生成页面的工具（如框架版本）。

常用 `http-equiv` 属性：

- `X-Content-Type-Options: nosniff`：禁止浏览器猜测 MIME 类型，安全相关；
- `Content-Security-Policy`：内容安全策略，限制资源加载来源，防 XSS；
- `refresh`：定时刷新或跳转（不推荐用于跳转，应使用 HTTP 301/302）；
- `default-style`：默认样式表标题。

**Open Graph 标签**：控制社交平台分享时的标题、描述、图片等。

```
<meta property="og:type" content="website">
<meta property="og:title" content="页面标题">
<meta property="og:description" content="页面描述">
<meta property="og:image" content="https://example.com/cover.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:site_name" content="站点名称">
<meta property="og:locale" content="zh_CN">
```

**Twitter Card 标签**：控制 Twitter 分享样式。

```
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="页面标题">
<meta name="twitter:description" content="页面描述">
<meta name="twitter:image" content="https://example.com/cover.jpg">
```

 `charset` 应尽量放在 `<head>` 最前面，避免浏览器使用错误编码解析后续内容。

### link 标签

`<link>` 描述当前文档与外部资源的关系，通常位于 `<head>`。`rel` 决定关系类型：

```
<link rel="stylesheet" href="/styles/main.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://example.com/articles/html">
<link rel="alternate" hreflang="en" href="https://example.com/en/html">
```

- `stylesheet`：加载样式表；匹配当前媒体条件的样式表通常会阻塞首次渲染；
- `icon`：声明站点图标；
- `canonical`：声明内容的首选 URL；
- `alternate`：声明语言版本、Feed 或其他替代版本；
- `media`：限制资源适用的媒体条件；
- `crossorigin`：控制跨域请求凭据模式；
- `referrerpolicy`：控制请求携带的 Referrer 信息。

### 资源提示

资源提示应按真实性能瓶颈使用，添加过多提示会浪费带宽和连接：

```
<!-- 只进行 DNS 解析 -->
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- 提前建立 DNS、TCP 和 TLS 连接 -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- 高优先级获取当前页面很快会使用的资源 -->
<link
  rel="preload"
  href="/fonts/app.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>

<!-- 提前加载 ES Module -->
<link rel="modulepreload" href="/scripts/app.js">

<!-- 低优先级获取未来页面可能使用的资源 -->
<link rel="prefetch" href="/next-page-data.json">
```

- `dns-prefetch`：只提前解析域名；
- `preconnect`：提前建立跨域连接，只用于确定很快会访问的重要源；
- `preload`：获取当前导航需要的关键资源，必须设置正确的 `as`；它只获取，不会代替资源的实际使用标签；
- `modulepreload`：提前获取并解析模块及可能的依赖；
- `prefetch`：提示浏览器获取后续导航可能使用的资源，浏览器可以忽略；
- `rel="prerender"` 已被 Speculation Rules API 取代。

Speculation Rules 可以对可能访问的页面进行预取或预渲染，使用前应检查浏览器兼容性并避免产生登录、统计等副作用：

```
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/next-page"]
    }
  ]
}
</script>
```

### script 标签

普通外部脚本在下载和执行时会阻塞 HTML 解析：

```
<script src="/scripts/legacy.js"></script>
```

常用加载方式：

```
<!-- 并行下载，解析完成后按文档顺序执行 -->
<script defer src="/scripts/vendor.js"></script>
<script defer src="/scripts/app.js"></script>

<!-- 并行下载，下载完成立即执行，不保证顺序 -->
<script async src="/scripts/analytics.js"></script>

<!-- 模块脚本默认延迟执行 -->
<script type="module" src="/scripts/app.js"></script>
```

- `defer`：适合依赖 DOM 或有执行顺序要求的经典外部脚本，在文档解析完成后、`DOMContentLoaded` 前执行；
- `async`：适合相互独立的统计、广告等脚本，下载完成后立即执行；
- `type="module"`：启用 ES Module，默认延迟执行，并对跨域模块使用 CORS；
- 同时设置 `async` 和 `defer` 时，现代浏览器按 `async` 处理；
- `defer` 对经典内联脚本无效；
- JavaScript 脚本不需要写 `type="text/javascript"`；
- 第三方脚本可配合 `integrity` 和 `crossorigin` 使用子资源完整性校验。

```
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

### noscript

`<noscript>` 中的内容只在浏览器禁用 JavaScript 或不支持脚本时显示，用于提供降级方案或提示。

```
<noscript>
  <p>本页面需要启用 JavaScript 才能正常使用。</p>
  <a href="/static-version">查看静态版本</a>
</noscript>
```

- 可放在 `<head>` 或 `<body>` 中；
- 在 `<head>` 中时，内部只能包含 `<link>`、`<style>`、`<meta>` 等元素；
- 不要依赖 `<noscript>` 做安全控制，它只是用户体验降级。

### template

`<template>` 用于定义不在页面中渲染的 HTML 模板，内容可通过 JavaScript 克隆后插入文档，常用于组件复用和框架内部。

```
<template id="card-template">
  <article class="card">
    <h3 class="card-title"></h3>
    <p class="card-body"></p>
  </article>
</template>

<script>
  const template = document.querySelector('#card-template')
  const clone = template.content.cloneNode(true)
  clone.querySelector('.card-title').textContent = '标题'
  clone.querySelector('.card-body').textContent = '内容'
  document.body.appendChild(clone)
</script>
```

- `<template>` 内容不会被渲染，其中的图片不会加载、脚本不会执行；
- 通过 `template.content` 访问 DocumentFragment，使用 `cloneNode(true)` 深拷贝后插入；
- 与 Shadow DOM 配合可实现 Web Components。

### base 标签

`<base>` 为文档中的相对 URL 和默认 `target` 指定基准。一个文档只能有一个，应位于所有包含 URL 的元素之前：

```
<base href="https://example.com/docs/">
```

它会同时影响链接、图片、脚本和 `#fragment` 的解析，通常应谨慎使用。

## 文本与内联语义

### 标题与段落

`<h1>` 到 `<h6>` 表示六级标题。标题层级应反映内容结构，不要仅为改变字号而选择标题：

```
<h1>HTML 学习笔记</h1>

<section>
  <h2>文本语义</h2>
  <p>这是一个段落。</p>
</section>
```

- 一个页面通常有一个描述主要内容的 `<h1>`；
- 不要随意跳级，例如从 `<h2>` 直接跳到 `<h4>`；
- `<p>` 表示段落；
- `<br>` 表示内容中的强制换行，适合诗歌、地址等，不应用于制造间距；
- `<hr>` 表示段落级主题转换，不只是视觉上的横线。

### 强调与文本状态

| 标签 | 语义 |
| --- | --- |
| `<strong>` | 重要、严重或紧急的内容 |
| `<em>` | 语气强调 |
| `<b>` | 吸引注意，但不增加重要性 |
| `<i>` | 术语、外语、另一种语气等不同文本 |
| `<u>` | 非文本注释，例如专名或拼写标记 |
| `<s>` | 已不准确或不再相关的内容 |
| `<del>` | 被删除的内容 |
| `<ins>` | 新插入的内容 |
| `<mark>` | 与当前上下文相关而被高亮的内容 |
| `<small>` | 附注、版权等次要内容 |
| `<sub>` | 下标 |
| `<sup>` | 上标 |

```
<p><strong>警告：</strong>此操作无法撤销。</p>
<p>水的化学式是 H<sub>2</sub>O。</p>
<p>2<sup>10</sup> 等于 1024。</p>
<p>价格从 <del>¥99</del> 调整为 <ins>¥79</ins>。</p>
```

这些元素的默认粗体、斜体、删除线等样式不是主要目的，样式可以用 CSS 修改。

### 注音、双向文本与可选换行

```
<p>
  <ruby>
    汉 <rp>(</rp><rt>hàn</rt><rp>)</rp>
    字 <rp>(</rp><rt>zì</rt><rp>)</rp>
  </ruby>
</p>

<p>用户名：<bdi>张三</bdi></p>
<p><bdo dir="rtl">这段文字从右到左显示</bdo></p>
<p>这是一个非常长的英文单词：Super<wbr>cali<wbr>fragilistic</p>
```

- `<ruby>`：注音标注，用于东亚文字的读音标注；
- `<rt>`：注音文本，显示在 ruby 内容上方；
- `<rp>`：不支持 ruby 的浏览器中显示的括号回退；
- `<bdi>`：双向文本隔离，将内部文本的方向与周围文本隔离，适合显示用户名、阿拉伯语等不确定方向的内容；
- `<bdo dir="rtl|ltr">`：双向文本覆盖，强制内部文本按指定方向排列；
- `<wbr>`：可选换行点，提示浏览器可以在此处换行（但不强制），适合长 URL、长单词。

### 引用、代码和时间

```
<blockquote cite="https://example.com/article">
  <p>这是一段块级引用。</p>
</blockquote>

<p>作者说：<q>这是一段行内引用。</q></p>

<pre><code>const message = "hello"</code></pre>

<p>按 <kbd>Command</kbd> + <kbd>S</kbd> 保存。</p>
<p>程序输出：<samp>Done</samp></p>
<p><var>x</var> 表示未知数。</p>

<time datetime="2026-09-03">2026 年 9 月 3 日</time>
<abbr title="HyperText Markup Language">HTML</abbr>
```

- `<blockquote>`：块级引用；
- `<q>`：行内引用；
- `<cite>`：作品标题，不是普通的人名标签；
- `<pre>`：保留源码中的空白和换行；
- `<code>`：代码片段；
- `<kbd>`：用户输入；
- `<samp>`：程序输出；
- `<var>`：变量；
- `<time datetime>`：机器可读的日期或时间；
- `<abbr title>`：缩写及完整含义；
- `<address>`：与最近的文章或页面相关的联系信息，不用于任意邮政地址。

## 页面语义结构

优先使用与内容含义匹配的原生元素：

```
<header>
  <h1>站点名称</h1>
  <nav aria-label="主导航">
    <a href="/">首页</a>
    <a href="/docs">文档</a>
  </nav>
</header>

<main>
  <article>
    <header>
      <h2>文章标题</h2>
      <p><time datetime="2026-09-03">2026 年 9 月 3 日</time></p>
    </header>

    <section>
      <h3>章节标题</h3>
      <p>章节内容</p>
    </section>
  </article>

  <aside>相关内容</aside>
</main>

<footer>版权与联系信息</footer>
```

- `<header>`：页面或章节的页头；
- `<nav>`：主要导航链接区域；
- `<main>`：文档主要内容，页面通常只有一个可见的 `<main>`；
- `<article>`：可独立分发或复用的完整内容；
- `<section>`：有主题的通用章节，通常应有标题；
- `<aside>`：与主要内容间接相关的补充内容；
- `<footer>`：页面或章节的页脚；
- `<div>`：无合适语义时使用的通用块容器；
- `<span>`：无合适语义时使用的通用行内容器。

语义元素不会自动提升 SEO 排名，但能为浏览器、搜索引擎和辅助技术提供更清晰的结构。

### figure 与 figcaption

`<figure>` 表示可从正文单独引用的图片、图表、代码等内容，`<figcaption>` 提供标题：

```
<figure>
  <img
    src="/images/fiber-tree.webp"
    width="800"
    height="450"
    alt="Fiber 节点通过 child、sibling 和 return 指针连接"
  >
  <figcaption>Fiber 树结构</figcaption>
</figure>
```

## 链接与导航

### a 标签

`<a>` 在存在 `href` 时表示超链接：

```
<a href="https://example.com">外部页面</a>
<a href="/guide/start.html">站内页面</a>
<a href="#forms">跳转到表单章节</a>
<a href="mailto:user@example.com">发送邮件</a>
<a href="tel:+8613800000000">拨打电话</a>
```

目标章节需要对应 `id`：

```
<section id="forms">
  <h2>表单</h2>
</section>
```

常用属性：

- `href`：目标 URL；
- `target="_self"`：在当前浏览上下文打开，默认值；
- `target="_blank"`：通常在新标签页打开；
- `download`：建议浏览器下载资源，可指定文件名，但浏览器可以忽略，通常只适用于同源、`blob:` 或 `data:` URL；
- `hreflang`：目标文档语言；
- `referrerpolicy`：控制 Referrer；
- `rel`：定义与目标的关系。

```
<a
  href="https://external.example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  外部资料
</a>
```

- `noopener`：阻止新页面通过 `window.opener` 访问当前页面；现代浏览器对 `_blank` 已隐式应用该行为，显式声明仍更清晰；
- `noreferrer`：不发送 Referrer，并同时具有 `noopener` 效果；
- `nofollow`：表示发布者不认可或不希望搜索引擎跟踪该链接关系，不是浏览器隐私开关。

不要使用 `<a href="#">` 充当按钮。导航使用 `<a>`，执行页面操作使用 `<button type="button">`。

链接文本应独立描述目标，避免大量使用“点击这里”。

## 图片

### img 标签

```
<img
  src="/images/product.webp"
  alt="黑色机械键盘的正面图"
  width="1200"
  height="800"
  loading="lazy"
  decoding="async"
>
```

常用属性：

- `src`：图片 URL；
- `alt`：图片的文本替代，图片无法显示或被辅助技术读取时使用；
- `width`、`height`：图片固有尺寸，浏览器可提前计算宽高比并预留空间，减少布局偏移；
- `loading="lazy"`：延迟加载视口外图片；
- `decoding="async"`：提示浏览器异步解码；
- `fetchpriority="high"`：提示提高加载优先级，只适合首屏关键图片；
- `crossorigin`：使用 CORS 获取图片，例如需要读取 Canvas 像素时；
- `referrerpolicy`：控制图片请求的 Referrer。

`title` 是通用提示信息，不依赖 `alt`，也不能代替 `alt`。触屏、键盘和屏幕阅读器不一定能可靠访问 `title`。

`alt` 编写原则：

- 信息图片：描述图片传达的信息，而不是机械描述“这是一张图片”；
- 装饰图片：使用 `alt=""`，让屏幕阅读器忽略；
- 图片链接或按钮：描述操作目的；
- 与相邻文字完全重复时，避免重复朗读；
- 复杂图表：使用简短 `alt`，并在附近提供详细说明。

首屏 LCP 图片通常不应设置 `loading="lazy"`，可以设置尺寸并按需使用 `fetchpriority="high"`。

### 响应式图片

同一画面提供不同分辨率时使用 `srcset` 和 `sizes`：

```
<img
  src="/images/hero-1280.webp"
  srcset="
    /images/hero-640.webp 640w,
    /images/hero-960.webp 960w,
    /images/hero-1280.webp 1280w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1200px) 80vw,
    960px
  "
  width="1280"
  height="720"
  alt="团队成员在会议室讨论产品原型"
>
```

- `srcset`：候选图片及其固有宽度；
- `sizes`：不同媒体条件下图片预计占用的布局宽度；
- 浏览器结合布局宽度、设备像素比、网络等因素选择资源；
- 使用 `w` 描述符时应同时正确设置 `sizes`。

相同显示尺寸只切换像素密度时可使用 `x` 描述符：

```
<img
  src="/images/avatar.png"
  srcset="/images/avatar.png 1x, /images/avatar@2x.png 2x"
  width="96"
  height="96"
  alt="用户头像"
>
```

需要切换裁剪构图或图片格式时使用 `<picture>`：

```
<picture>
  <source
    media="(max-width: 640px)"
    srcset="/images/banner-mobile.avif"
    type="image/avif"
  >
  <source
    media="(max-width: 640px)"
    srcset="/images/banner-mobile.webp"
    type="image/webp"
  >
  <source srcset="/images/banner.avif" type="image/avif">
  <source srcset="/images/banner.webp" type="image/webp">
  <img
    src="/images/banner.jpg"
    width="1600"
    height="900"
    alt="产品团队在白板前讨论"
  >
</picture>
```

`<picture>` 内最后必须有 `<img>`，它提供默认资源、替代文本及不支持 `<picture>` 时的回退。

## 列表

### 无序列表

用于顺序不重要的项目：

```
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

### 有序列表

用于步骤、排名等顺序有意义的项目：

```
<ol start="3" reversed>
  <li>第三步</li>
  <li>第二步</li>
  <li>第一步</li>
</ol>
```

### 描述列表

用于术语与说明、键值信息等：

```
<dl>
  <dt>HTML</dt>
  <dd>描述网页结构的标记语言。</dd>

  <dt>CSS</dt>
  <dd>描述网页表现的样式语言。</dd>
</dl>
```

## 表格

表格用于二维数据，不应用于页面布局。

```
<table>
  <caption>2026 年商品销量</caption>

  <colgroup>
    <col>
    <col span="2" class="number-column">
  </colgroup>

  <thead>
    <tr>
      <th scope="col">商品</th>
      <th scope="col">单价</th>
      <th scope="col">销量</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">键盘</th>
      <td>¥399</td>
      <td>1900</td>
    </tr>
    <tr>
      <th scope="row">鼠标</th>
      <td>¥199</td>
      <td>2535</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row" colspan="2">总销量</th>
      <td>4435</td>
    </tr>
  </tfoot>
</table>
```

- `<caption>`：表格标题和用途说明；
- `<thead>`、`<tbody>`、`<tfoot>`：表头、主体和汇总区域；
- `<tr>`：一行；
- `<th>`：表头单元格；
- `<td>`：数据单元格；
- `scope="col"`、`scope="row"`：说明表头与列或行的关系；
- `colspan`：跨列；
- `rowspan`：跨行；
- `<colgroup>`、`<col>`：描述列或列组，只有部分 CSS 属性会对列生效。

复杂表格可使用表头的 `id` 和数据单元格的 `headers` 建立关联，但优先考虑把复杂表格拆成多个简单表格。

表格边框属于样式，应使用 CSS，而不是已废弃的 `border`、`cellpadding`、`cellspacing` 等 HTML 属性：

```
table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}
```

## 表单

### form 标签

原生表单仍是标准且可靠的提交方式，也可以被 JavaScript 拦截后使用 Fetch 提交：

```
<form action="/users" method="post" autocomplete="on">
  <label for="username">用户名</label>
  <input
    id="username"
    name="username"
    type="text"
    autocomplete="username"
    required
  >

  <button type="submit">提交</button>
</form>
```

常用属性：

- `action`：接收表单数据的 URL，默认是当前页面；
- `method="get"`：数据进入查询字符串，适合搜索、筛选等无副作用操作；
- `method="post"`：数据进入请求体，适合创建或修改数据；
- `enctype="application/x-www-form-urlencoded"`：POST 默认编码；
- `enctype="multipart/form-data"`：上传文件时必须使用；
- `autocomplete`：控制或描述自动填充；
- `novalidate`：提交时跳过浏览器约束校验；
- `target`：指定响应显示位置。

原生表单只直接支持 `get`、`post` 和 `dialog`。`put`、`patch`、`delete` 通常由 JavaScript 或服务端约定处理。

### 表单数据规则

提交时，成功控件按 `name=value` 组成数据：

- 没有 `name` 的控件不会提交；
- `disabled` 控件不会提交，也不能获得焦点；
- `readonly` 控件会提交，且仍能获得焦点；
- 未选中的 checkbox 和 radio 不会提交；
- 只有触发表单提交的按钮会提交自己的 `name` 和 `value`；
- 文件上传必须使用 POST 和 `multipart/form-data`；
- 浏览器校验不能替代服务端校验。

### label 标签

`<label>` 适用于大多数可标注表单控件，不仅是 radio 和 checkbox。

显式关联方式：

```
<label for="email">邮箱</label>
<input id="email" name="email" type="email">
```

隐式关联方式：

```
<label>
  邮箱
  <input name="email" type="email">
</label>
```

显式 `for` 与控件 `id` 相同，兼容性和布局灵活性通常更好。点击 label 会聚焦或切换关联控件，并为辅助技术提供可访问名称。

`placeholder` 不能代替 label，因为输入后提示会消失，而且通常对比度较低。

### fieldset 与 legend

使用 `<fieldset>` 和 `<legend>` 为一组相关控件提供分组名称：

```
<fieldset>
  <legend>通知方式</legend>

  <label>
    <input type="radio" name="channel" value="email" checked>
    邮件
  </label>

  <label>
    <input type="radio" name="channel" value="sms">
    短信
  </label>
</fieldset>
```

同一组 radio 必须使用相同 `name`，这样只能选择一个值。

### input 类型

常见 `type`：

| 类型 | 用途 |
| --- | --- |
| `text` | 单行文本 |
| `password` | 密码输入，界面遮挡不等于安全传输 |
| `email` | 邮箱，支持格式校验和适配键盘 |
| `url` | URL |
| `tel` | 电话号码，不自动校验全球号码格式 |
| `search` | 搜索词 |
| `number` | 可计算数值 |
| `range` | 范围滑块 |
| `date`、`time`、`datetime-local` | 日期和时间 |
| `month`、`week` | 月份和周 |
| `color` | 颜色选择 |
| `file` | 文件选择 |
| `checkbox` | 多选或布尔选择 |
| `radio` | 单选 |
| `hidden` | 隐藏提交值 |
| `submit`、`reset`、`button` | 表单按钮 |

电话号码、邮编、银行卡号等“看起来像数字但不参与计算”的值不应使用 `number`，否则可能丢失前导零。可以使用 `text` 或 `tel` 配合 `inputmode`。

### input 常用属性

- `name`：提交字段名；
- `value`：默认值或提交值；
- `placeholder`：简短格式提示；
- `required`：必填；
- `minlength`、`maxlength`：文本长度限制；
- `min`、`max`、`step`：数字或日期范围；
- `pattern`：正则约束，仍需服务端校验；
- `autocomplete`：自动填充用途，例如 `name`、`email`、`username`、`current-password`、`new-password`；
- `inputmode`：提示移动端键盘类型，不负责校验；
- `autofocus`：页面或 dialog 打开时自动聚焦，一个作用域内只应有一个；
- `multiple`：允许多个邮箱或文件；
- `accept`：提示文件类型，不是安全校验；
- `checked`：checkbox 或 radio 的初始选中状态；
- `list`：关联 `<datalist>` 建议列表。

```
<label for="phone">手机号</label>
<input
  id="phone"
  name="phone"
  type="tel"
  inputmode="numeric"
  autocomplete="tel"
  pattern="1[3-9][0-9]{9}"
  required
>
```

### checkbox

```
<fieldset>
  <legend>兴趣</legend>

  <label>
    <input type="checkbox" name="hobby" value="reading">
    阅读
  </label>

  <label>
    <input type="checkbox" name="hobby" value="sports">
    运动
  </label>
</fieldset>
```

多个 checkbox 可以使用同一个 `name`，提交时形成多个同名值。

### 文件上传

```
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="photos">选择图片</label>
  <input
    id="photos"
    name="photos"
    type="file"
    accept="image/png,image/jpeg,image/webp"
    multiple
  >
  <button type="submit">上传</button>
</form>
```

`accept` 只是文件选择提示，服务端必须重新检查 MIME、文件签名、大小和内容。

### select、option 与 optgroup

```
<label for="city">城市</label>
<select id="city" name="city" required>
  <option value="" selected disabled>请选择</option>

  <optgroup label="华北">
    <option value="beijing">北京</option>
    <option value="tianjin">天津</option>
  </optgroup>

  <optgroup label="华南">
    <option value="guangzhou">广州</option>
    <option value="shenzhen">深圳</option>
  </optgroup>
</select>
```

- `<option value>`：提交值；省略 `value` 时使用文本内容；
- `selected`：初始选中；
- `<select multiple>`：允许多选；
- `<optgroup>`：给选项分组；
- 占位 option 常用空值、`selected` 和 `disabled`，不要依赖 `hidden` 作为唯一方案。

### textarea

```
<label for="message">留言</label>
<textarea
  id="message"
  name="message"
  rows="6"
  cols="40"
  maxlength="500"
  placeholder="请输入留言"
></textarea>
```

`<textarea>` 的初始值写在开始和结束标签之间。为了避免意外空格和换行，通常让两个标签紧邻。

### datalist、output、progress 与 meter

```
<label for="browser">浏览器</label>
<input id="browser" name="browser" list="browser-options">

<datalist id="browser-options">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>

<output for="price quantity">¥199</output>

<progress value="65" max="100">65%</progress>

<meter min="0" max="100" low="40" high="80" optimum="90" value="72">
  72%
</meter>
```

- `<datalist>`：为输入提供建议，不强制用户只能选建议值；
- `<output>`：表示计算结果；
- `<progress>`：表示任务完成进度；
- `<meter>`：表示已知范围内的标量值，不用于任务进度。

### 原生约束校验

浏览器可根据 `required`、`type`、`pattern`、`min`、`max`、`step`、`minlength`、`maxlength` 等属性阻止无效提交。

常用 CSS 状态：

```
input:required {
  border-inline-start: 3px solid #555;
}

input:user-invalid {
  border-color: #c62828;
}

input:user-valid {
  border-color: #2e7d32;
}
```

原生校验用于改善用户体验，攻击者可以绕过，服务端必须再次校验和清洗数据。

### button 标签

```
<button type="button">普通操作</button>
<button type="submit">提交表单</button>
<button type="reset">重置表单</button>
```

- 在表单内省略 `type` 时，`<button>` 默认是 `submit`；
- 非提交按钮应显式使用 `type="button"`；
- `disabled` 按钮不可交互且不会获得焦点；
- `reset` 会清除用户输入，通常应避免；
- 只有图标的按钮必须提供可访问名称，例如文本或 `aria-label`。

## 音视频

### video 标签

```
<video
  controls
  width="1280"
  height="720"
  poster="/images/poster.webp"
  preload="metadata"
  playsinline
>
  <source src="/media/demo.webm" type="video/webm">
  <source src="/media/demo.mp4" type="video/mp4">
  <track
    default
    kind="captions"
    src="/media/demo-zh.vtt"
    srclang="zh"
    label="中文"
  >
  <p>
    浏览器不支持视频，请
    <a href="/media/demo.mp4" download>下载视频</a>。
  </p>
</video>
```

- `controls`：显示浏览器原生控制器；
- `autoplay`：尝试自动播放；浏览器通常只允许静音媒体自动播放；
- `muted`：初始静音；
- `loop`：循环播放；
- `playsinline`：提示在元素区域内播放；
- `poster`：首帧可用前显示的海报；
- `preload="none|metadata|auto"`：加载提示，浏览器可以不遵循；
- 多个 `<source>` 按顺序提供格式回退；
- `<track>` 使用 WebVTT 提供字幕、说明或章节。

自动播放的常见写法：

```
<video autoplay muted playsinline loop>
  <source src="/media/background.webm" type="video/webm">
</video>
```

`autoplay="false"` 和 `muted="false"` 仍为真，因为它们是布尔属性。

### audio 标签

```
<audio controls preload="metadata">
  <source src="/media/podcast.ogg" type="audio/ogg">
  <source src="/media/podcast.mp3" type="audio/mpeg">
  <a href="/media/podcast.mp3">下载音频</a>
</audio>
```

`<audio>` 与 `<video>` 都实现 `HTMLMediaElement`，共享 `play()`、`pause()`、`currentTime`、`volume` 等 API。

## 交互元素

### details 与 summary

```
<details name="faq">
  <summary>如何修改密码？</summary>
  <p>进入账户设置后选择“修改密码”。</p>
</details>

<details name="faq">
  <summary>如何注销账户？</summary>
  <p>进入账户设置后选择“注销账户”。</p>
</details>
```

- `<summary>` 应是 `<details>` 的第一个子元素；
- `open` 表示初始展开；
- 相同 `name` 的多个 `<details>` 形成手风琴组，同一时间只展开一个；
- 状态变化时触发 `toggle` 事件；
- 使用 `summary::marker` 修改标记；
- `details:open` 可匹配展开状态，兼容旧浏览器时使用 `details[open]`。

### dialog

`<dialog>` 可创建模态或非模态对话框。模态框使用 `showModal()` 打开，会进入 Top Layer，使页面其余部分不可交互：

```
<button type="button" id="open-dialog">删除账户</button>

<dialog id="confirm-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">确认删除账户？</h2>
  <p>该操作无法撤销。</p>

  <form method="dialog">
    <button value="cancel" autofocus>取消</button>
    <button value="confirm">确认删除</button>
  </form>
</dialog>

<script>
  const dialog = document.querySelector("#confirm-dialog")
  const openButton = document.querySelector("#open-dialog")

  openButton.addEventListener("click", () => {
    dialog.showModal()
  })

  dialog.addEventListener("close", () => {
    console.log(dialog.returnValue)
  })
</script>
```

- `show()`：打开非模态 dialog；
- `showModal()`：打开模态 dialog；
- `close(value)`：关闭并设置 `returnValue`；
- `<form method="dialog">`：提交时关闭 dialog，不发送网络请求；
- `cancel`：用户请求取消时触发，例如按 Esc；
- `close`：关闭后触发；
- `::backdrop`：设置模态背景；
- dialog 内应有明确标题和可见关闭按钮；
- 不要给 `<dialog>` 设置 `tabindex`。

```
dialog::backdrop {
  background: rgb(0 0 0 / 50%);
}
```

### Popover

Popover 适合菜单、提示面板等非模态浮层，可通过 HTML 声明控制关系：

```
<button type="button" popovertarget="user-menu">打开菜单</button>

<div id="user-menu" popover>
  <a href="/profile">个人资料</a>
  <button type="button" popovertarget="user-menu" popovertargetaction="hide">
    关闭
  </button>
</div>
```

默认 `popover="auto"` 支持点击外部或按 Esc 关闭。`popover="manual"` 需要显式关闭。

## 嵌入内容

### canvas

`<canvas>` 提供位图绘图画布，通过 JavaScript 的 2D 或 WebGL API 绘制图形、动画、图表等。

```
<canvas id="chart" width="400" height="300">
  您的浏览器不支持 Canvas。
</canvas>

<script>
  const canvas = document.querySelector('#chart')
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#4285f4'
  ctx.fillRect(10, 10, 100, 100)
</script>
```

- `width`、`height`：画布的像素尺寸（不是 CSS 尺寸），不设置时默认为 300×150；
- 标签内的内容是不支持 canvas 时的回退文本；
- CSS 设置的宽高只影响显示尺寸，不影响绘图坐标系，可能导致拉伸；应通过属性设置绘图尺寸；
- `getContext('2d')` 获取 2D 绘图上下文，`getContext('webgl')` 获取 WebGL 3D 上下文；
- canvas 是位图，放大后会模糊；需要高清屏适配时应按 `devicePixelRatio` 放大画布再用 CSS 缩小；
- 纯文本内容不应使用 canvas 绘制，不利于可访问性和 SEO。

### iframe

`<iframe>` 创建独立的嵌套浏览上下文。跨域页面能否被嵌入，还取决于目标服务器的 `Content-Security-Policy: frame-ancestors` 或 `X-Frame-Options`。

```
<iframe
  src="https://example.com/embed"
  title="示例地图"
  width="800"
  height="450"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-forms"
  allow="fullscreen"
></iframe>
```

常用属性：

- `src`：嵌入页面 URL；
- `srcdoc`：直接提供内联 HTML，只能放可信或严格清洗后的内容；
- `title`：描述 iframe 内容，便于屏幕阅读器识别；
- `width`、`height`：尺寸；
- `loading="lazy"`：延迟加载视口外 iframe；
- `sandbox`：默认施加全部沙箱限制，通过 token 有选择地放开能力；
- `allow`：为 iframe 设置更严格的 Permissions Policy；
- `referrerpolicy`：控制请求携带的 Referrer。

`frameborder`、`scrolling`、`marginwidth`、`marginheight` 等属性已经废弃，应使用 CSS 或现代属性。

安全注意：

- 不要为不可信的同源内容同时添加 `allow-scripts` 和 `allow-same-origin`，否则其可能移除沙箱限制；
- 按最小权限配置 `sandbox` 和 `allow`；
- 同源 iframe 可以通过 `contentWindow`、`contentDocument` 访问；
- 跨域 iframe 受同源策略限制，应使用 `postMessage` 通信；
- 接收消息时必须校验 `event.origin`，发送消息时不要随意使用 `"*"`；
- 每个 iframe 都是完整文档环境，数量过多会增加内存和性能开销。

### object 与 embed

`<object>` 可嵌入 PDF、图片等外部资源，并提供回退内容：

```
<object
  data="/documents/manual.pdf"
  type="application/pdf"
  width="800"
  height="600"
>
  <p>
    浏览器无法预览 PDF，请
    <a href="/documents/manual.pdf">下载文档</a>。
  </p>
</object>
```

PDF 等格式的内嵌行为在不同浏览器中可能不同。视频和音频应优先使用 `<video>`、`<audio>`，图片应使用 `<img>`。

## 全局属性

全局属性可用于所有 HTML 元素，但不一定对每种元素都产生效果。

### id 与 class

- `id`：文档内必须唯一，用于片段链接、label 关联、CSS 和 JavaScript；
- `class`：空格分隔的分类名称，可重复使用；
- 不要依赖自动生成的 `window.idName` 全局变量访问元素。

```
<section id="settings" class="panel panel-primary"></section>
```

### data-* 属性

用于保存与元素相关的自定义数据，可通过 `dataset` 访问：

```
<button type="button" data-user-id="42">查看用户</button>

<script>
  const button = document.querySelector("button")
  console.log(button.dataset.userId)
</script>
```

不要在 `data-*` 中保存密码、令牌等敏感信息，因为 HTML 对用户可见。

### hidden 与 inert

```
<section hidden>暂不相关的内容</section>
<main inert>暂时不可交互的内容</main>
```

- `hidden`：内容当前不相关，浏览器通常不渲染；
- `inert`：子树不能被点击、聚焦或被辅助技术正常交互，适合页面局部暂停；
- 两者都不是安全机制，内容仍可能存在于源码或 DOM 中。

### contenteditable

```
<div contenteditable="true">支持富文本编辑</div>
<div contenteditable="plaintext-only">仅支持纯文本编辑</div>
```

`contenteditable` 是枚举属性，不是普通布尔属性。用户输入可能包含不可信内容，保存或回显前必须进行安全处理。

### tabindex

- `tabindex="0"`：按文档顺序加入键盘焦点；
- `tabindex="-1"`：可通过脚本聚焦，但不加入 Tab 顺序；
- 避免正数 `tabindex`，它会创建难以维护的焦点顺序；
- 不要给本来不可交互的元素随意添加焦点，应优先使用原生按钮、链接和表单控件。

### lang、dir 与 translate

```
<p lang="en" dir="ltr">Hello</p>
<p lang="ar" dir="rtl">مرحبا</p>
<code translate="no">npm install react</code>
```

- `lang`：内容语言；
- `dir="ltr|rtl|auto"`：文本方向；
- `translate="no"`：提示翻译工具不要翻译品牌名、代码等内容。

### title

`title` 提供建议性信息，浏览器可能显示为悬浮提示：

```
<abbr title="Cascading Style Sheets">CSS</abbr>
```

不能依赖 `title` 提供关键说明，因为键盘、触摸设备和辅助技术对它的支持不一致。

### ARIA

ARIA 可以补充无障碍语义，但不能自动补齐原生行为。优先使用原生元素：

```
<!-- 推荐 -->
<button type="button">保存</button>

<!-- 不推荐：还要手动实现焦点、键盘和点击行为 -->
<div role="button" tabindex="0">保存</div>
```

不要添加与原生语义重复或冲突的 `role`。ARIA 的第一原则是：存在合适的原生 HTML 元素时，优先使用原生元素。

## 无障碍实践

- 为 `<html>` 设置正确的 `lang`；
- 使用逻辑连续的标题层级；
- 页面主要内容放在 `<main>`；
- 图片提供符合用途的 `alt`；
- 每个表单控件有可访问名称，优先使用 `<label>`；
- 相关控件用 `<fieldset>` 和 `<legend>` 分组；
- 图标按钮提供文字或 `aria-label`；
- 链接用于导航，按钮用于操作；
- 所有功能都应可用键盘完成；
- 不移除焦点轮廓，或使用清晰的 `:focus-visible` 样式替代；
- 表格使用 `<caption>`、`<th>` 和 `scope`；
- 视频提供字幕，音频提供文字稿；
- 不只依赖颜色表达错误、成功或选中状态；
- DOM 顺序应与视觉顺序和键盘顺序一致；
- 自定义组件需要补齐名称、角色、状态、焦点和键盘行为。
