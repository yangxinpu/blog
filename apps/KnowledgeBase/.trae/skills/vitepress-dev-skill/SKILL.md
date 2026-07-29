---
name: vitepress-dev
version: 3.0.0
description: >
  VitePress 静态站点开发全流程指南：从零搭建、站点配置、默认主题定制、
  Markdown 扩展、Frontmatter、路由与资源处理、国际化、搜索配置、
  自定义主题、构建钩子、SEO 优化到部署上线。
  当用户需要创建 VitePress 站点、编写文档站点、配置 VitePress、定制主题、
  使用 Markdown 扩展、处理路由和资源、配置搜索和国际化、或部署 VitePress 站点时使用。
---

# VitePress 开发技能

VitePress 是一个基于 Vite + Vue 3 的**静态站点生成器 (SSG)**，专为构建快速、以内容为中心的站点而设计。
简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

## 核心特性

### Vite 驱动
- **即时服务器启动**：开发服务器秒级启动
- **热更新极速**：编辑变化始终 <100ms 实时反映，无需重新加载页面
- **原生 ESM**：基于 Vite 的原生 ESM 构建，无打包开销

### Vue 增强的 Markdown
- 每个 Markdown 页面都是 Vue **单文件组件 (SFC)**
- Vue 模板与 HTML 100% 语法兼容
- 可在静态内容中嵌入交互性（Vue 模板语法或导入的 Vue 组件）
- 静态与动态部分自动分离，最小化激活成本

### 内置 Markdown 扩展
- **Frontmatter**：YAML 格式的页面元数据
- **GitHub 风格表格**：支持对齐、斑马纹
- **语法高亮**：基于 Shiki，支持 100+ 编程语言
- **代码块高级功能**：行高亮、聚焦、颜色差异、错误/警告标记、行号
- **自定义容器**：info、tip、warning、danger、details
- **GitHub 风格警报**：NOTE、TIP、IMPORTANT、WARNING、CAUTION
- **代码组**：多语言/多方案代码块分组切换
- **代码片段导入**：从外部文件导入代码，支持 region 语法
- **Markdown 文件包含**：嵌套包含其他 Markdown 文件
- **数学公式**：可选的 MathJax 支持
- **Emoji**：全量 emoji 支持
- **目录 (TOC)**：`[[toc]]` 自动生成目录
- **图片懒加载**：可选的全局懒加载配置

### 性能优秀
- **SSG + SPA 混合模式**：首屏静态 HTML，后续 SPA 导航
- **快速初始加载**：预渲染静态 HTML，极快首屏，最佳 SEO
- **激活快速**：Vue 3 编译优化，低端设备也近乎满分
- **加载后快速切换**：SPA 无刷新切换，自动预加载视口链接
- **高效交互**：静态部分从 JS payload 中移除，激活期间跳过

### 默认主题
专为技术文档设计的精致默认主题：
- **导航栏**：Logo、站点标题、导航菜单、下拉菜单、社交链接
- **侧边栏**：多级嵌套、分组折叠、按路径匹配多侧边栏
- **搜索**：本地搜索（minisearch）或 Algolia DocSearch
- **暗黑模式**：支持自动、浅色、深色、强制深色
- **大纲/目录**：右侧页面导航，可配置级别和标签
- **编辑链接**：一键跳转到 Git 编辑页面
- **最后更新时间**：基于 Git 提交时间
- **上一页/下一页**：文档页脚导航
- **页脚**：自定义消息和版权信息
- **Carbon Ads**：内置广告支持

### 完全可定制
- **扩展默认主题**：继承并覆盖默认主题组件
- **完全自定义主题**：拥有标准 Vite + Vue 应用的开发体验
- **Vite 插件生态**：直接利用丰富的 Vite 插件
- **Vue 插件**：配置 @vitejs/plugin-vue 选项

### 灵活的数据加载与路由
- **数据加载**：支持本地或远程数据加载
- **动态路由**：`[param].md` + `[param].paths.js` 动态生成页面
- **路由重写**：自定义目录 <-> URL 映射，支持 path-to-regexp 参数
- **简洁 URL**：可选移除 `.html` 后缀

### i18n 国际化
- 内置多语言支持
- 每个 locale 可独立配置 lang、title、description、head、themeConfig
- 语言切换菜单
- RTL 支持（实验性）

## 使用场景

### 文档站点
VitePress 默认主题专为技术文档设计。Vue.js、Vite、Rollup、Pinia、VueUse、Vitest、D3.js、UnoCSS、Iconify 等官方文档均基于 VitePress。

### 博客、档案和营销网站
- 完全自定义主题，标准 Vite + Vue 开发体验
- 灵活的数据加载 API（本地或远程）
- 动态路由生成
- 只要构建时能确定数据，几乎可以构建任何站点

## 何时使用本 skill

使用本 skill：
- 用户明确提到 VitePress，或要创建/搭建 VitePress 文档站点、博客站点
- 用户要配置 VitePress 站点（站点配置、主题配置、frontmatter、路由等）
- 用户要在 VitePress 中使用 Markdown 扩展（代码块、容器、数学公式、代码片段导入等）
- 用户要在 Markdown 中使用 Vue（组件、插值、script/style 标签）
- 用户要自定义主题（扩展默认主题或构建完全自定义主题）
- 用户要处理 VitePress 路由（动态路由、路由重写、简洁 URL）
- 用户要处理静态资源（图片、public 目录、base URL）
- 用户要部署 VitePress 站点到各平台
- 用户需要配置搜索（本地搜索或 Algolia DocSearch）
- 用户需要国际化（i18n）支持
- 用户需要 SEO 优化（head、transformHead、transformPageData 等钩子）
- 用户需要配置构建钩子扩展功能
- 用户需要使用运行时 API（useData、useRouter 等）

不使用本 skill：
- 纯 Vue / Vite 项目开发（非文档/内容站点）
- 其他 SSG 框架（如 Astro、Docusaurus、Nuxt Content）
- 仅涉及通用 Node.js / pnpm 问题

## 前置条件

- **Node.js 22+**
- **包管理器**：pnpm（推荐）/ npm / yarn / bun
- `package.json` 包含 `"type": "module"`（VitePress 是 ESM only）

## 快速决策索引

| 用户需求 | 行动 |
|---|---|
| 从零搭建 VitePress 站点 | → [references/getting-started.md](references/getting-started.md) |
| 配置站点（标题、描述、head、base 等） | → [references/site-config.md](references/site-config.md) |
| 配置默认主题（导航栏、侧边栏、页脚、搜索） | → [references/default-theme-config.md](references/default-theme-config.md) |
| 编写 Markdown 内容（代码块、容器、表格等） | → [references/markdown-extensions.md](references/markdown-extensions.md) |
| 使用 frontmatter 控制页面 | → [references/frontmatter-config.md](references/frontmatter-config.md) |
| 在 Markdown 中使用 Vue | → [references/using-vue.md](references/using-vue.md) |
| 处理路由（动态路由、重写、简洁 URL） | → [references/routing.md](references/routing.md) |
| 处理静态资源（图片、public 目录、base URL） | → [references/asset-handling.md](references/asset-handling.md) |
| 自定义主题 / 扩展默认主题 | → [references/custom-theme.md](references/custom-theme.md) |
| 使用运行时 API（useData、useRouter 等） | → [references/runtime-api.md](references/runtime-api.md) |
| 构建和部署站点 | → [references/deploy.md](references/deploy.md) |
| CLI 命令参考 | → [references/cli.md](references/cli.md) |
| 国际化（i18n） | → [references/i18n.md](references/i18n.md) |
| 数据加载 | → [references/data-loading.md](references/data-loading.md) |
| SSR 兼容性 | → [references/ssr-compat.md](references/ssr-compat.md) |

## 核心心智模型

### 项目结构

```
project-root/              # 项目根目录
├─ docs/                  # VitePress 项目根目录（也可直接用 ./ ）
│  ├─ .vitepress/
│  │  ├─ config.ts        # 站点配置（必须）
│  │  ├─ theme/
│  │  │  └─ index.ts      # 主题入口（自定义主题时需要）
│  │  ├─ cache/           # 开发缓存（gitignore）
│  │  └─ dist/            # 构建输出（gitignore）
│  ├─ public/             # 静态资源（按原样复制到输出）
│  ├─ index.md            # 首页 → /
│  └─ guide/
│     └─ getting-started.md  # → /guide/getting-started.html
└─ package.json
```

### 关键概念

- **项目根目录**：包含 `.vitepress/` 的目录，运行 `vitepress dev <root>` 时指定
- **源目录**：Markdown 文件所在目录，默认与项目根目录相同，可通过 `srcDir` 配置
- **基于文件的路由**：每个 `.md` 文件映射为同路径的 `.html`，`index.md` 可省略
- **SSG + SPA 混合模式**：首次加载静态 HTML（SSG），后续导航为 SPA 无刷新切换
- **Vue 增强的 Markdown**：每个 `.md` 是 Vue SFC，可使用 Vue 模板语法和组件
- **静态与动态分离**：Vue 编译器自动分离静态和动态部分，最小化激活成本和 payload 大小

### 配置文件

配置从 `<root>/.vitepress/config.[js|ts|mjs|mts]` 解析，开箱即用地支持 TypeScript。
推荐使用 ES 模块语法，默认导出配置对象。

**基础写法**：
```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'My Site',
  description: 'A VitePress site',
  themeConfig: {
    // 默认主题配置
  }
})
```

**`defineConfig` 辅助函数**：提供 TypeScript 智能提示，JS 和 TS 中均生效。

**异步动态配置**：支持导出 async 函数或顶层 `await`：
```ts
import { defineConfig } from 'vitepress'

const posts = await (await fetch('https://my-cms.com/posts')).json()

export default defineConfig({
  themeConfig: {
    sidebar: posts.map(p => ({ text: p.name, link: `/posts/${p.name}` }))
  }
})
```

**自定义主题类型提示**：使用 `defineConfigWithTheme<ThemeConfig>` 获得自定义主题的类型检查：
```ts
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'your-theme'

export default defineConfigWithTheme<ThemeConfig>({
  themeConfig: {
    // 类型为 ThemeConfig
  }
})
```

**Vite、Vue、Markdown 配置**：
- `vite` 选项配置底层 Vite 实例，无需单独的 vite.config 文件
- `vue` 选项配置 @vitejs/plugin-vue
- `markdown` 选项配置 Markdown-it 实例

### 站点元数据配置

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | `string` | `VitePress` | 站点标题，导航栏显示，页面标题后缀 |
| `titleTemplate` | `string \| boolean` | - | 自定义标题格式，`:title` 占位符，`false` 禁用后缀 |
| `description` | `string` | `A VitePress site` | 站点描述，渲染为 `<meta>` 标签 |
| `head` | `HeadConfig[]` | `[]` | 额外的 head 元素，favicon、字体、分析等 |
| `lang` | `string` | `en-US` | 页面 lang 属性 |
| `base` | `string` | `/` | 部署子路径，首尾都需带 `/` |

**HeadConfig 类型**：
```ts
type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]
```

### 路由配置

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `cleanUrls` | `boolean` | `false` | 从 URL 移除 `.html` 后缀，需服务器支持 |
| `rewrites` | `Record<string, string>` | - | 自定义目录 <-> URL 映射，支持动态参数 |
| `srcDir` | `string` | `.` | Markdown 源文件目录（相对项目根） |
| `srcExclude` | `string` | - | 排除的 markdown 文件 glob 模式 |

### 构建配置

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `outDir` | `string` | `./.vitepress/dist` | 构建输出目录 |
| `assetsDir` | `string` | `assets` | 静态资源子目录（outDir 内） |
| `cacheDir` | `string` | `./.vitepress/cache` | 缓存文件目录 |
| `ignoreDeadLinks` | `boolean \| 'localhostLinks' \| (string\|RegExp\|Function)[]` | `false` | 死链检测配置 |
| `mpa` | `boolean` | `false` | MPA 模式（实验性），零 JavaScript，禁用客户端导航 |

### 主题配置（站点级）

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `appearance` | `boolean \| 'dark' \| 'force-dark' \| UseDarkOptions` | `true` | 深色模式控制 |
| `lastUpdated` | `boolean` | `false` | 使用 Git 获取页面最后更新时间 |

### 构建钩子

VitePress 提供 5 个强大的构建钩子用于扩展功能：

| 钩子 | 调用时机 | 用途 |
|---|---|---|
| `buildEnd(siteConfig)` | SSG 构建完成后、CLI 退出前 | 构建后处理（sitemap、PWA 等） |
| `postRender(context)` | SSG 渲染完成时 | 处理 teleport 内容 |
| `transformHead(context)` | 每个页面生成前（仅构建时） | 转换 head，返回额外 entries |
| `transformHtml(code, id, context)` | 保存到磁盘前 | 转换页面 HTML（注意激活问题） |
| `transformPageData(pageData, context)` | 转换 pageData（开发和构建都调用） | 修改页面数据、动态 head、contributors 等 |

**transformPageData 示例 - 添加 canonical URL**：
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

### 搜索配置

#### 本地搜索（minisearch）

```ts
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                }
              }
            }
          }
        },
        miniSearch: {
          options: { /* minisearch options */ },
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
          }
        }
      }
    }
  }
})
```

**注意**：`locales` 键使用 `localeIndex` 值（如 `'zh'`），**不是**带斜杠的路径（如 `'/zh/'`）。

#### Algolia DocSearch

```ts
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: '...',
        apiKey: '...',
        indexName: '...',
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: { /* ... */ }
            }
          }
        },
        askAi: { assistantId: 'XXXYYY' }  // 可选：AI 问答
      }
    }
  }
})
```

### 常用命令

```bash
# 开发
pnpm run docs:dev        # 启动开发服务器（默认 localhost:5173）

# 构建
pnpm run docs:build      # 构建生产版本到 .vitepress/dist

# 预览
pnpm run docs:preview    # 本地预览构建结果（默认 localhost:4173）

# 初始化
pnpm create vitepress@latest . --template docs    # 文档模板
pnpm create vitepress@latest . --template blog    # 博客模板
```

### pnpm scripts 模板

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

## 重要规则（必读）

1. **ESM only**：不要使用 `require()`，确保 `package.json` 有 `"type": "module"` 或使用 `.mjs`/`.mts` 扩展名

2. **SSR 兼容**：所有 Vue 用法必须兼容 SSR，浏览器/DOM API 只能在 `beforeMount`/`mounted` 中访问；使用 `ClientOnly` 组件包裹不兼容 SSR 的组件

3. **避免 `<style scoped>`**：在 Markdown 中使用会增加页面体积，优先用 `<style module>`

4. **组件命名**：自定义组件名必须包含连字符或 PascalCase，否则被包裹在 `<p>` 中导致激活不匹配

5. **链接写法**：内部链接省略扩展名（`[link](./page)` 而非 `./page.md`）

6. **public 资源**：用根绝对路径引用（`/favicon.ico`）；被 Markdown/Vue 引用的资源自动处理哈希和 base

7. **base 配置**：部署到子路径时必须设置 `base: '/subpath/'`（首尾都有 `/`），自动添加到所有以 `/` 开头的 URL 前

8. **不要启用 HTML Auto Minify**：会删除 Vue 需要的注释，导致激活不匹配错误

9. **defineConfig**：使用 `defineConfig` 获得配置智能提示；自定义主题用 `defineConfigWithTheme<Type>`

10. **搜索国际化**：本地搜索的 `locales` 键使用 `localeIndex` 值（如 `'zh'`、`'en'`），**不是**带斜杠的路径（如 `'/zh/'`）

11. **i18n 配置结构**：`locales` 中的每个 locale 可以覆盖 `lang`、`title`、`description`、`head`、`themeConfig` 等；`head` 会自动合并，重复 meta 标签自动删除

12. **死链检测**：使用 `ignoreDeadLinks` 避免因死链导致构建失败，支持精确 URL、正则和自定义函数；`'localhostLinks'` 可跳过 localhost 链接检查

13. **MPA 模式**：设置 `mpa: true` 启用零 JavaScript 模式，代价是禁用客户端导航，交互需显式 opt-in

14. **transformHead vs transformPageData**：
    - `transformHead`：仅在**构建时**调用，适合纯构建时的 head 处理
    - `transformPageData`：**开发和构建都调用**，适合添加动态 head（开发时也能看到效果）

15. **路由重写后相对链接**：启用 `rewrites` 后，相对链接应基于**重写后的路径**

16. **cleanUrls 需要服务器支持**：Netlify/GitHub Pages 默认支持，Vercel 需在 vercel.json 中启用

17. **lastUpdated 基于 Git**：需要 Git 仓库才能工作，显示最后提交时间

18. **outline.label 国际化**：通过 `themeConfig.outline.label` 配置右侧大纲标题（如"页面导航"）

19. **footer 仅在无侧边栏时显示**：有侧边栏的页面不会显示页脚

20. **appearance: 'force-dark'**：强制深色模式，隐藏主题切换按钮

## 性能模型

VitePress 采用 **SSG + SPA 混合模式** 提供最佳性能平衡：

### 1. 快速初始加载
对任何页面的初次访问返回静态的、预渲染的 HTML，实现极快的加载速度和最佳 SEO。
然后页面加载 JavaScript bundle，将页面变成 Vue SPA（称为"激活"）。
由于 Vue 3 的原始性能和编译优化，激活过程非常快。
典型 VitePress 站点在低端移动设备低速网络下也能获得近乎完美的 PageSpeed Insights 分数。

### 2. 加载后快速切换
首次加载后切换页面为 SPA，不再触发整页刷新，而是动态获取并更新页面内容。
VitePress 自动预加载视口范围内链接对应的页面片段，大部分情况下用户点击后立即可见新页面。

### 3. 高效交互
每个 Markdown 页面被处理为 Vue 组件并编译为 JavaScript。
Vue 编译器自动分离静态和动态部分，最小化激活成本和 payload 大小。
初始页面加载时，静态部分自动从 JS payload 中移除，激活期间跳过。

## VitePress vs VuePress

| 特性 | VitePress | VuePress 1 |
|---|---|---|
| 底层框架 | Vue 3 + Vite | Vue 2 + webpack |
| 开发体验 | 更好（即时启动、HMR 极速） | 一般 |
| 生产性能 | 更好（SSG + SPA 混合模式） | 传统 SSG |
| 默认主题 | 更精致、功能更全 | 基础 |
| 自定义 API | 更灵活 | 基础 |
| 维护状态 | Vue 团队推荐，长期维护 | 已弃用 |

Vue 团队决定将 VitePress 作为长期维护并推荐的 SSG。VuePress 1 已弃用，VuePress 2 已移交给社区团队。

## 官方文档参考

- **官方站点**：https://vitepress.dev/zh/
- **GitHub 仓库**：https://github.com/vuejs/vitepress
- **在线尝试**：https://vitepress.new/

### 核心指南
- 什么是 VitePress：https://vitepress.dev/zh/guide/what-is-vitepress
- 快速开始：https://vitepress.dev/zh/guide/getting-started
- 路由：https://vitepress.dev/zh/guide/routing
- Markdown 扩展：https://vitepress.dev/zh/guide/markdown
- 在 Markdown 中使用 Vue：https://vitepress.dev/zh/guide/using-vue
- 资源处理：https://vitepress.dev/zh/guide/asset-handling
- 国际化：https://vitepress.dev/zh/guide/i18n
- 自定义主题：https://vitepress.dev/zh/guide/custom-theme
- 数据加载：https://vitepress.dev/zh/guide/data-loading
- 部署：https://vitepress.dev/zh/guide/deploy
- MPA 模式：https://vitepress.dev/zh/guide/mpa-mode
- SSR 兼容性：https://vitepress.dev/zh/guide/ssr-compat

### 配置参考
- 站点配置：https://vitepress.dev/zh/reference/site-config
- 默认主题配置：https://vitepress.dev/zh/reference/default-theme-config
- frontmatter 配置：https://vitepress.dev/zh/reference/frontmatter-config
- 运行时 API：https://vitepress.dev/zh/reference/runtime-api
- CLI 参考：https://vitepress.dev/zh/reference/cli

### 默认主题
- 导航栏：https://vitepress.dev/zh/reference/default-theme-nav
- 侧边栏：https://vitepress.dev/zh/reference/default-theme-sidebar
- 主页：https://vitepress.dev/zh/reference/default-theme-home-page
- 搜索：https://vitepress.dev/zh/reference/default-theme-search
- 编辑链接：https://vitepress.dev/zh/reference/default-theme-edit-link
- 最后更新：https://vitepress.dev/zh/reference/default-theme-last-updated
