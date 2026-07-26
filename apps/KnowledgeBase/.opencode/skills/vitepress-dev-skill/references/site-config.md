# 站点配置参考

配置文件路径：`<root>/.vitepress/config.[js|ts|mjs|mts]`

## 基本写法

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点级配置
  lang: 'zh-CN',
  title: 'My Site',
  description: 'A VitePress site',
  
  themeConfig: {
    // 主题级配置
  }
})
```

## 异步/动态配置

可以导出 async 函数或使用顶层 await：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  async themeConfig() {
    const posts = await (await fetch('https://my-cms.com/posts')).json()
    return {
      sidebar: posts.map(p => ({ text: p.name, link: `/posts/${p.name}` }))
    }
  }
})
```

## 站点元数据

### `title`
- 类型：`string`
- 默认：`VitePress`
- 显示在导航栏，并作为所有页面标题后缀
- 每页可通过 frontmatter 覆盖

### `titleTemplate`
- 类型：`string | boolean`
- 自定义标题格式
- `:title` 占位符 = 页面第一个 `<h1>` 内容
- `false` 禁用后缀

```ts
export default defineConfig({
  title: 'My Site',
  titleTemplate: ':title - My Site'  // "Hello - My Site"
})
```

### `description`
- 类型：`string`
- 默认：`A VitePress site`
- 渲染为 `<meta name="description">`

### `head`
- 类型：`HeadConfig[]`
- 在 `<head>` 末尾追加元素

```ts
// 类型
type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]

// 示例：添加 favicon
export default defineConfig({
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]]
})

// 示例：添加 Google 字体
export default defineConfig({
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }]
  ]
})
```

### `lang`
- 类型：`string`
- 默认：`en-US`
- 渲染为 `<html lang="...">`

### `base`
- 类型：`string`
- 默认：`/`
- 部署到子路径时必须设置，如 `'/repo/'`
- 始终以 `/` 开头和结尾
- 自动添加到所有以 `/` 开头的 URL 前

## 路由

### `cleanUrls`
- 类型：`boolean`
- 默认：`false`
- 从 URL 移除 `.html` 后缀
- 需要服务器支持（Netlify/GitHub Pages 默认支持）

### `rewrites`
- 类型：`Record<string, string>`
- 自定义目录到 URL 的映射
- 支持 `path-to-regexp` 动态参数

```ts
export default defineConfig({
  rewrites: {
    'packages/:pkg/src/(.*)': ':pkg/index.md'
  }
})
```

## 构建

### `srcDir`
- 类型：`string`
- 默认：`.`
- Markdown 源文件目录（相对于项目根目录）

### `srcExclude`
- 类型：`string`
- glob 模式，排除不作为源内容的 markdown 文件

```ts
export default defineConfig({
  srcExclude: ['**/README.md', '**/TODO.md']
})
```

### `outDir`
- 类型：`string`
- 默认：`./.vitepress/dist`
- 构建输出目录

### `assetsDir`
- 类型：`string`
- 默认：`assets`
- 静态资源子目录（在 outDir 内）

### `cacheDir`
- 类型：`string`
- 默认：`./.vitepress/cache`

### `ignoreDeadLinks`
- 类型：`boolean | 'localhostLinks' | (string | RegExp | ((link, source) => boolean))[]`
- 默认：`false`
- 构建时忽略死链

```ts
// 忽略特定链接
export default defineConfig({
  ignoreDeadLinks: [
    '/playground',
    /^https?:\/\/localhost/,
    (url) => url.includes('ignore')
  ]
})
```

### `mpa`（实验性）
- 类型：`boolean`
- 默认：`false`
- MPA 模式：零 JS，禁用客户端导航

## 主题

### `appearance`
- 类型：`boolean | 'dark' | 'force-dark' | UseDarkOptions`
- 默认：`true`
- 控制深色模式

### `lastUpdated`
- 类型：`boolean`
- 默认：`false`
- 使用 Git 获取页面最后更新时间

## 自定义配置

### `markdown`
- 配置 Markdown-it 实例
- 语法高亮（Shiki）、TOC、锚点等

```ts
export default defineConfig({
  markdown: {
    lineNumbers: true,
    theme: 'material-theme-palenight',
    toc: { level: [1, 2] }
  }
})
```

### `vite`
- 类型：`import('vite').UserConfig`
- 配置底层 Vite 实例

```ts
export default defineConfig({
  vite: {
    plugins: [myPlugin()],
    resolve: { alias: { '@': '/src' } }
  }
})
```

### `vue`
- 类型：`import('@vitejs/plugin-vue').Options`
- 配置 @vitejs/plugin-vue

## 构建钩子

### `buildEnd(siteConfig: SiteConfig)`
- SSG 构建完成后运行

### `postRender(context: SSGContext)`
- SSG 渲染完成时调用，可处理传递的内容

### `transformHead(context: TransformContext)`
- 每个页面生成前转换 head，返回额外 entries
- 注意：仅在构建时调用，开发期间不调用

### `transformHtml(code, id, context)`
- 保存到磁盘前转换每个页面 HTML
- 注意：修改 HTML 可能导致运行时激活问题

### `transformPageData(pageData, context)`
- 转换每个页面的 pageData
- 可直接修改 pageData 或返回合并数据
- 注意：可能影响开发服务器性能

```ts
export default defineConfig({
  // 开发期间添加动态 head
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: `https://example.com/${pageData.relativePath}`.replace(/index\.md$/, '').replace(/\.md$/, '.html') }
    ])
  }
})
```

## 类型提示

```ts
// 默认主题
import { defineConfig } from 'vitepress'
export default defineConfig({ /* 智能提示 */ })

// 自定义主题
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'your-theme'
export default defineConfigWithTheme<ThemeConfig>({ /* 智能提示 */ })
```
