# Markdown 扩展

VitePress 内置丰富的 Markdown 扩展，使用 Markdown-It 解析，Shiki 语法高亮。

## 标题锚点

自动生成，可自定义：

```md
# 使用自定义锚点 {#my-anchor}
```

链接：`#my-anchor`

## 链接

### 内部链接（SPA 导航）

```md
[首页](/)                          <!-- index.html -->
[指南](/guide/)                      <!-- guide/index.html -->
[锚点](./#heading)                   <!-- 当前目录 index 的锚点 -->
[相对路径](../bar/three)             <!-- 省略扩展名 -->
```

最佳实践：**省略扩展名**，让 VitePress 处理最终 URL。

### 外部链接

自动添加 `target="_blank" rel="noreferrer"`。

## 表格

GitHub 风格表格，支持对齐：

```md
| Tables | Are | Cool |
| ------ | :--: | ----: |
| 左对齐 | 居中 | 右对齐 |
```

## Emoji

```md
:tada: :100:
```

完整列表：[mdit-plugins emoji data](https://github.com/mdit-plugins/mdit-plugins/blob/main/packages/emoji/src/data/full.ts)

## 目录 TOC

```md
[[toc]]
```

配置：

```ts
export default defineConfig({
  markdown: {
    toc: { level: [2, 3] }
  }
})
```

## 自定义容器

```md
::: info
信息内容
:::

::: tip
提示内容
:::

::: warning
警告内容
:::

::: danger
危险内容
:::

::: details
可折叠的详细信息
:::

::: danger STOP
自定义标题的容器
:::
```

中文标签全局配置：

```ts
export default defineConfig({
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  }
})
```

### raw 容器

防止与 VitePress 样式和路由冲突：

```md
::: raw
内容被包裹在 `<div class="vp-raw">` 中
:::
```

样式隔离需要安装 `postcss` 并配置：

```js
// docs/postcss.config.mjs
import { postcssIsolateStyles } from 'vitepress'
export default { plugins: [postcssIsolateStyles()] }
```

## GitHub 风格警报

```md
> [!NOTE]
> 重要信息。

> [!TIP]
> 建议性信息。

> [!IMPORTANT]
> 关键信息。

> [!WARNING]
> 风险警告。

> [!CAUTION]
> 负面影响。
```

## 代码块

### 语法高亮（Shiki）

````md
```js
console.log('hello')
```
````

语言列表：[Shiki languages](https://shiki.style/languages)

### 行高亮

````md
```js{4}
// 第 4 行高亮
const a = 1
const b = 2
const c = 3   // <- 高亮
```

```js{1,4,6-8}
// 多行高亮
```

// 或使用注释
```js
const msg = 'highlighted' // [!code highlight]
```
````

### 代码聚焦

````md
```js
const other = 'blurred' // [!code focus]
```

// 聚焦多行
```js
const a = 'focus' // [!code focus:3]
const b = 'focus'
const c = 'focus'
```
````

### 颜色差异

````md
```js
const old = 'removed' // [!code --]
const neo = 'added'   // [!code ++]
```
````

### 错误和警告高亮

````md
```js
const err = 'error line'   // [!code error]
const warn = 'warn line'   // [!code warning]
```
````

### 行号

全局启用：

```ts
export default defineConfig({
  markdown: { lineNumbers: true }
})
```

单代码块控制：

````md
```ts:line-numbers
// 始终显示行号
```

```ts:no-line-numbers
// 始终隐藏行号
```

```ts:line-numbers=5
// 从第 5 行开始
```
````

## 导入代码片段

```md
<<< @/filepath
<<< @/filepath{2}
<<< @/filepath{1,3-5}
```

使用 VS Code region：

```md
<<< @/file.js#region-name{1}
```

指定语言：

```md
<<< @/file.cs{c#}
<<< @/file.cs{1,2 c#:line-numbers}
```

## 代码组

````md
::: code-group
```js [config.js]
const config = { }
```

```ts [config.ts]
const config: UserConfig = { }
```
:::
````

也可导入代码片段：

```md
::: code-group
<<< @/snippets/base.js
<<< @/snippets/types.ts [with custom title]
:::
```

## 包含 Markdown 文件

```md
<!--@include: ./parts/basics.md-->
<!--@include: ./parts/basics.md{3,}-->
<!--@include: ./parts/basics.md{1,10}-->
```

也可用 `@` 绝对路径（基于源目录）。注意：文件不存在时不会报错。

## 数学方程

需要安装依赖：

```bash
pnpm add -D markdown-it-mathjax3@^4
```

```ts
export default defineConfig({
  markdown: { math: true }
})
```

```md
行内公式 $a \ne 0$

块级公式：
$$
x = {-b \pm \sqrt{b^2-4ac} \over 2a}
$$
```

## 图片懒加载

```ts
export default defineConfig({
  markdown: {
    image: { lazyLoad: true }
  }
})
```

## 高级配置

```ts
import { defineConfig } from 'vitepress'
import { headerLink } from '@mdit/plugin-anchor'
import markdownItFoo from 'markdown-it-foo'

export default defineConfig({
  markdown: {
    anchor: { permalink: headerLink() },
    toc: { level: [1, 2] },
    config: (md) => {
      md.use(markdownItFoo)
    }
  }
})
```