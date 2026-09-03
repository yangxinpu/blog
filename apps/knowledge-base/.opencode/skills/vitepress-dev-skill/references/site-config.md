# 站点配置参考

配置文件路径：`<root>/.vitepress/config.[js|ts|mjs|mts]`

支持的扩展名：`.js`、`.ts`、`.mjs`、`.mts`，开箱即用地支持 TypeScript。

## 配置解析

配置文件总是从 `<root>/.vitepress/config.[ext]` 解析，其中 `<root>` 是 VitePress 项目根目录。

推荐使用 ES 模块语法，默认导出配置对象：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // 应用级配置选项
  lang: 'en-US',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',

  // 主题级配置选项
  themeConfig: {
    // ...
  }
})
```

## 配置智能提示

使用 `defineConfig` 辅助函数将为配置选项提供 TypeScript 支持的智能提示。
在 JavaScript 和 TypeScript 中都将触发智能提示。

```ts
import { defineConfig } from 'vitepress'
export default defineConfig({ /* ... */ })
```

## 主题类型提示

默认情况下，`defineConfig` 辅助函数期望默认主题的主题配置数据类型为 `DefaultTheme.Config`。

```ts
import { defineConfig } from 'vitepress'
export default defineConfig({
  themeConfig: {
    // 类型为 `DefaultTheme.Config`
  }
})
```

如果使用自定义主题并希望对主题配置进行类型检查，则需要改用 `defineConfigWithTheme`，
并通过泛型参数传递自定义主题的配置类型：

```ts
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'your-theme'

export default defineConfigWithTheme<ThemeConfig>({
  themeConfig: {
    // 类型为 `ThemeConfig`
  }
})
```

## 异步动态配置

如果需要动态生成配置，可以默认导出一个函数，或者在最外层使用 `await`。

**方式一：导出 async 函数**

```ts
import { defineConfig } from 'vitepress'

export default async () => {
  const posts = await (await fetch('https://my-cms.com/blog-posts')).json()

  return defineConfig({
    lang: 'en-US',
    title: 'VitePress',
    description: 'Vite & Vue powered static site generator.',
    themeConfig: {
      sidebar: [
        ...posts.map((post) => ({
          text: post.name,
          link: `/posts/${post.name}`
        }))
      ]
    }
  })
}
```

**方式二：顶层 await**

```ts
import { defineConfig } from 'vitepress'

const posts = await (await fetch('https://my-cms.com/blog-posts')).json()

export default defineConfig({
  lang: 'en-US',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    sidebar: [
      ...posts.map((post) => ({
        text: post.name,
        link: `/posts/${post.name}`
      }))
    ]
  }
})
```

## Vite、Vue 和 Markdown 配置

### Vite 配置

使用 `vite` 选项配置底层 Vite 实例。无需创建单独的 Vite 配置文件。

```ts
export default defineConfig({
  vite: {
    // Vite 配置选项
    plugins: [myPlugin()],
    resolve: {
      alias: { '@': '/src' }
    }
  }
})
```

### Vue 配置

VitePress 已经包含 Vite 的官方 Vue 插件（@vitejs/plugin-vue），使用 `vue` 选项配置。

```ts
export default defineConfig({
  vue: {
    // @vitejs/plugin-vue 选项
  }
})
```

### Markdown 配置

使用 `markdown` 选项配置底层的 Markdown-It 实例。VitePress 使用 Shiki 来高亮语法。

```ts
export default defineConfig({
  markdown: {
    lineNumbers: true,
    theme: 'material-theme-palenight',
    toc: { level: [1, 2] },
    anchor: { /* ... */ },
    config: (md) => {
      // 使用更多的 Markdown-it 插件
      md.use(markdownItFoo)
    }
  }
})
```

---

## 站点元数据

### `title`

- **类型**：`string`
- **默认值**：`VitePress`
- **每个页面可通过 frontmatter 覆盖**

站点的标题。使用默认主题时，这将显示在导航栏中。

它还将用作所有单独页面标题的默认后缀，除非定义了 `titleTemplate`。
单个页面的最终标题将是其第一个 `<h1>` 标题的文本内容加上全局 `title`。

**示例**：

```ts
export default {
  title: 'My Awesome Site'
}
```

页面内容为 `# Hello` → 页面标题为 `Hello | My Awesome Site`

---

### `titleTemplate`

- **类型**：`string | boolean`
- **每个页面可通过 frontmatter 覆盖**

允许自定义每个页面的标题后缀或整个标题。

**自定义后缀**：

```ts
export default {
  title: 'My Awesome Site',
  titleTemplate: 'Custom Suffix'
}
```

页面 `# Hello` → 标题为 `Hello | Custom Suffix`

**使用 `:title` 标识符完全自定义**：

```ts
export default {
  titleTemplate: ':title - Custom Suffix'
}
```

页面 `# Hello` → 标题为 `Hello - Custom Suffix`

**禁用后缀**：

```ts
export default {
  titleTemplate: false
}
```

---

### `description`

- **类型**：`string`
- **默认值**：`A VitePress site`
- **每个页面可通过 frontmatter 覆盖**

站点的描述。这将呈现为页面 HTML 中的 `<meta name="description">` 标签。

```ts
export default {
  description: 'A VitePress site'
}
```

---

### `head`

- **类型**：`HeadConfig[]`
- **默认值**：`[]`
- **可以通过 frontmatter 为每个页面追加**

要在页面 HTML 的 `<head>` 标签中呈现的其他元素。用户添加的标签在结束 `head` 标签之前呈现，在 VitePress 标签之后。

```ts
type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]
```

#### 示例：添加一个图标

```ts
export default {
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]]
}
// 将 favicon.ico 放在公共目录中，如果设置了 base，则使用 /base/favicon.ico

/* 渲染成:
<link rel="icon" href="/favicon.ico">
*/
```

#### 示例：添加谷歌字体

```ts
export default {
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }]
  ]
}
```

#### 示例：添加 serviceWorker

```ts
export default {
  head: [
    [
      'script',
      { id: 'register-sw' },
      `;(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
        }
      })()`
    ]
  ]
}
```

#### 示例：使用谷歌分析

```ts
export default {
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=TAG_ID' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'TAG_ID');`
    ]
  ]
}
```

---

### `lang`

- **类型**：`string`
- **默认值**：`en-US`

站点的 lang 属性。这将呈现为页面 HTML 中的 `<html lang="en-US">` 标签。

```ts
export default {
  lang: 'zh-CN'
}
```

---

### `base`

- **类型**：`string`
- **默认值**：`/`

站点将部署到的 base URL。如果计划在子路径（例如 GitHub 页面）下部署站点，则需要设置此项。

如果计划将站点部署到 `https://foo.github.io/bar/`，那么应该将 `base` 设置为 `'/bar/'`。
它应该始终以 `/` 开头和结尾。

base 会自动添加到其他选项中以 `/` 开头的所有 URL 前面，因此只需指定一次。

```ts
export default {
  base: '/base/'
}
```

---

## 路由

### `cleanUrls`

- **类型**：`boolean`
- **默认值**：`false`

当设置为 `true` 时，VitePress 将从 URL 中删除 `.html` 后缀。

> ⚠️ **需要服务器支持**
> 要启用此功能，可能需要在托管平台上进行额外配置。要使其正常工作，
> 服务器必须能够在**不重定向的情况下**访问 `/foo` 时提供 `/foo.html`。
>
> - Netlify 和 GitHub Pages 默认支持
> - Vercel 需在 vercel.json 中启用 cleanUrls 选项

```ts
export default {
  cleanUrls: true
}
```

---

### `rewrites`

- **类型**：`Record<string, string>`

自定义目录 <-> URL 映射。支持 `path-to-regexp` 动态参数。

```ts
export default {
  rewrites: {
    'source/:page': 'destination/:page'
  }
}
```

**Monorepo 示例**：

```ts
export default {
  rewrites: {
    'packages/:pkg/src/(.*)': ':pkg/index.md'
  }
}
```

> 💡 **注意**：启用 `rewrites` 后，相对链接应基于**重写后的路径**。

---

## 构建

### `srcDir`

- **类型**：`string`
- **默认值**：`.`

相对于项目根目录的 markdown 文件所在的文件夹。

```ts
export default {
  srcDir: './src'
}
```

---

### `srcExclude`

- **类型**：`string`
- **默认值**：`undefined`

用于匹配应排除作为源内容输出的 markdown 文件，语法详见 [glob pattern](https://github.com/mrmlnc/fast-glob#pattern-syntax)。

```ts
export default {
  srcExclude: ['**/README.md', '**/TODO.md']
}
```

---

### `outDir`

- **类型**：`string`
- **默认值**：`./.vitepress/dist`

项目的构建输出位置，相对于项目根目录。

```ts
export default {
  outDir: '../public'
}
```

---

### `assetsDir`

- **类型**：`string`
- **默认值**：`assets`

指定放置生成的静态资源的目录。该路径应位于 `outDir` 内，并相对于它进行解析。

```ts
export default {
  assetsDir: 'static'
}
```

---

### `cacheDir`

- **类型**：`string`
- **默认值**：`./.vitepress/cache`

缓存文件的目录，相对于项目根目录。

```ts
export default {
  cacheDir: './.vitepress/.vite'
}
```

---

### `ignoreDeadLinks`

- **类型**：`boolean | 'localhostLinks' | (string | RegExp | ((link: string, source: string) => boolean))[]`
- **默认值**：`false`

当设置为 `true` 时，VitePress 不会因为死链而导致构建失败。

当设置为 `'localhostLinks'`，出现死链时构建将失败，但不会检查 `localhost` 链接。

```ts
// 完全忽略死链
export default {
  ignoreDeadLinks: true
}

// 忽略 localhost 链接
export default {
  ignoreDeadLinks: 'localhostLinks'
}

// 精确配置
export default {
  ignoreDeadLinks: [
    // 忽略精确网址 "/playground"
    '/playground',
    // 忽略所有 localhost 链接
    /^https?:\/\/localhost/,
    // 忽略所有包含 "/repl/" 的链接
    /\/repl\//,
    // 自定义函数，忽略所有包含 "ignore" 的链接
    (url) => {
      return url.toLowerCase().includes('ignore')
    }
  ]
}
```

---

### `mpa`（实验性）

- **类型**：`boolean`
- **默认值**：`false`

设置为 `true` 时，生产应用程序将在 MPA 模式下构建。
MPA 模式默认提供零 JavaScript 支持，代价是禁用客户端导航，并且需要明确选择加入才能进行交互。

```ts
export default {
  mpa: true
}
```

---

## 主题

### `appearance`

- **类型**：`boolean | 'dark' | 'force-dark' | import('@vueuse/core').UseDarkOptions`
- **默认值**：`true`

是否启用深色模式（通过将 `.dark` 类添加到 `<html>` 元素）。

- `true`：默认主题由用户的首选配色方案决定，可手动切换
- `'dark'`：默认深色主题，用户可手动切换
- `'force-dark'`：强制深色模式，隐藏切换按钮
- `false`：用户无法切换主题

此选项注入一个内联脚本，使用 `vitepress-theme-appearance` key 从本地存储恢复用户设置。
这确保在呈现页面之前应用 `.dark` 类以避免闪烁。

> 💡 `appearance.initialValue` 只能是 `'dark' | undefined`，不支持 Refs 或 getters。

```ts
export default {
  appearance: 'force-dark' // 强制深色模式
}
```

---

### `lastUpdated`

- **类型**：`boolean`
- **默认值**：`false`

是否使用 Git 获取每个页面的最后更新时间戳。时间戳将包含在每个页面的页面数据中，可通过 `useData` 访问。

使用默认主题时，启用此选项将显示每个页面的最后更新时间。可以通过 `themeConfig.lastUpdated` 选项自定义文本和日期格式。

> 💡 需要 Git 仓库才能工作。

```ts
export default {
  lastUpdated: true
}
```

---

## 构建钩子

VitePress 构建钩子允许向站点添加新功能和行为（Sitemap、Search Indexing、PWA、Teleport 等）。

### `buildEnd`

- **类型**：`(siteConfig: SiteConfig) => Awaitable<void>`

`buildEnd` 是一个构建 CLI 钩子，它将在构建 SSG 完成后但在 VitePress CLI 进程退出之前运行。

```ts
export default {
  async buildEnd(siteConfig) {
    // 构建完成后的处理，如生成 sitemap
  }
}
```

---

### `postRender`

- **类型**：`(context: SSGContext) => Awaitable<SSGContext | void>`

`postRender` 是一个构建钩子，在 SSG 渲染完成时调用。它将允许在 SSG 期间处理传递的内容。

```ts
export default {
  async postRender(context) {
    // ...
  }
}
```

```ts
interface SSGContext {
  content: string
  teleports?: Record<string, string>
  [key: string]: any
}
```

---

### `transformHead`

- **类型**：`(context: TransformContext) => Awaitable<HeadConfig[]>`

`transformHead` 是一个构建钩子，用于在生成每个页面之前转换 head。
它将允许添加无法静态添加到 VitePress 配置中的 head entries。
只需要返回额外的 entries，它们将自动与现有 entries 合并。

> ⚠️ 不要改变 `context` 中的任何东西。
> ⚠️ 仅在静态生成站点时才会调用此钩子。在开发期间不会调用它。
> 如果需要在开发期间添加动态 head 条目，使用 `transformPageData` 钩子替代。

```ts
export default {
  async transformHead(context) {
    // 返回额外的 head entries
    return [
      ['meta', { property: 'og:title', content: context.title }]
    ]
  }
}
```

```ts
interface TransformContext {
  page: string // 例如 index.md (相对于 srcDir)
  assets: string[] // 所有非 js/css 资源均作为完全解析的公共 URL
  siteConfig: SiteConfig
  siteData: SiteData
  pageData: PageData
  title: string
  description: string
  head: HeadConfig[]
  content: string
}
```

---

### `transformHtml`

- **类型**：`(code: string, id: string, context: TransformContext) => Awaitable<string | void>`

`transformHtml` 是一个构建钩子，用于在保存到磁盘之前转换每个页面的内容。

> ⚠️ 不要改变 `context` 中的任何东西。另外，修改 html 内容可能会导致运行时出现激活问题。

```ts
export default {
  async transformHtml(code, id, context) {
    // 转换 HTML 内容
    return code
  }
}
```

---

### `transformPageData`

- **类型**：`(pageData: PageData, context: TransformPageContext) => Awaitable<Partial<PageData> | { [key: string]: any } | void>`

`transformPageData` 是一个钩子，用于转换每个页面的 `pageData`。
可以直接改变 `pageData` 或返回将合并到 `PageData` 中的更改值。

> ⚠️ 不要改变 `context` 中的任何东西。请注意，这可能会影响开发服务器的性能，
> 特别是当在钩子中有一些网络请求或大量计算（例如生成图像）时。
> 可以通过判断 `process.env.NODE_ENV === 'production'` 匹配符合条件的情况。

```ts
// 方式一：直接修改 pageData
export default {
  async transformPageData(pageData, { siteConfig }) {
    pageData.contributors = await getPageContributors(pageData.relativePath)
  }
}

// 方式二：返回要合并的数据
export default {
  async transformPageData(pageData, { siteConfig }) {
    return {
      contributors: await getPageContributors(pageData.relativePath)
    }
  }
}
```

```ts
interface TransformPageContext {
  siteConfig: SiteConfig
}
```

#### 示例：添加 canonical URL

```ts
export default {
  transformPageData(pageData) {
    const canonicalUrl = `https://example.com/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ])
  }
}
```

#### 示例：开发期间添加动态 head

```ts
export default {
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'og:title',
        content:
          pageData.frontmatter.layout === 'home'
            ? `VitePress`
            : `${pageData.title} | VitePress`
      }
    ])
  }
}
```

---

## HeadConfig 类型

```ts
type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]
```

- 第一个元素：HTML 标签名（如 `link`、`meta`、`script`）
- 第二个元素：标签属性对象
- 第三个元素（可选）：标签内容（如 script 的代码）

---

## 快速参考表

| 分类 | 选项 | 类型 | 默认值 |
|---|---|---|---|
| 元数据 | `title` | `string` | `VitePress` |
| 元数据 | `titleTemplate` | `string \| boolean` | - |
| 元数据 | `description` | `string` | `A VitePress site` |
| 元数据 | `head` | `HeadConfig[]` | `[]` |
| 元数据 | `lang` | `string` | `en-US` |
| 元数据 | `base` | `string` | `/` |
| 路由 | `cleanUrls` | `boolean` | `false` |
| 路由 | `rewrites` | `Record<string, string>` | - |
| 构建 | `srcDir` | `string` | `.` |
| 构建 | `srcExclude` | `string` | `undefined` |
| 构建 | `outDir` | `string` | `./.vitepress/dist` |
| 构建 | `assetsDir` | `string` | `assets` |
| 构建 | `cacheDir` | `string` | `./.vitepress/cache` |
| 构建 | `ignoreDeadLinks` | `boolean \| 'localhostLinks' \| Array` | `false` |
| 构建 | `mpa` | `boolean` | `false` |
| 主题 | `appearance` | `boolean \| 'dark' \| 'force-dark' \| UseDarkOptions` | `true` |
| 主题 | `lastUpdated` | `boolean` | `false` |
| 自定义 | `markdown` | `MarkdownOption` | - |
| 自定义 | `vite` | `UserConfig` | - |
| 自定义 | `vue` | `PluginVueOptions` | - |
| 钩子 | `buildEnd` | `(siteConfig) => Awaitable<void>` | - |
| 钩子 | `postRender` | `(context) => Awaitable<SSGContext \| void>` | - |
| 钩子 | `transformHead` | `(context) => Awaitable<HeadConfig[]>` | - |
| 钩子 | `transformHtml` | `(code, id, context) => Awaitable<string \| void>` | - |
| 钩子 | `transformPageData` | `(pageData, context) => Awaitable<...>` | - |
