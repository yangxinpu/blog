---
name: vitepress-dev
version: 1.0.0
description: >
  VitePress 静态站点开发：从零搭建、配置、主题定制、内容编写到部署全流程。
  当用户需要创建 VitePress 站点、编写文档站点、配置 VitePress、定制主题、
  使用 Markdown 扩展、处理路由和资源、或部署 VitePress 站点时使用。
---

# VitePress 开发

VitePress 是基于 Vite + Vue 3 的静态站点生成器（SSG），专为构建快速、以内容为中心的站点（文档、博客、营销网站）而设计。

## 何时使用

使用本 skill：

- 用户明确提到 VitePress，或要创建/搭建 VitePress 文档站点、博客站点。
- 用户要配置 VitePress 站点（站点配置、主题配置、frontmatter、路由等）。
- 用户要在 VitePress 中使用 Markdown 扩展（代码块、容器、数学公式、代码片段导入等）。
- 用户要在 Markdown 中使用 Vue（组件、插值、script/style 标签）。
- 用户要自定义主题（扩展默认主题或构建完全自定义主题）。
- 用户要处理 VitePress 路由（动态路由、路由重写、简洁 URL）。
- 用户要处理静态资源（图片、public 目录、base URL）。
- 用户要部署 VitePress 站点到各平台。

不使用本 skill：

- 纯 Vue / Vite 项目开发（非文档/内容站点）。
- 其他 SSG 框架（如 Astro、Docusaurus、Nuxt Content）。
- 仅涉及通用 Node.js / pnpm 问题。

## 前置条件

- Node.js 22+
- 包管理器：pnpm（推荐）/ npm / yarn / bun
- `package.json` 包含 `"type": "module"`（VitePress 是 ESM only）

## 快速决策

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
project-root/          # 项目根目录
├─ docs/              # VitePress 项目根目录（也可直接用 ./ ）
│  ├─ .vitepress/
│  │  ├─ config.ts    # 站点配置（必须）
│  │  ├─ theme/
│  │  │  └─ index.ts  # 主题入口（自定义主题时需要）
│  │  ├─ cache/       # 开发缓存（gitignore）
│  │  └─ dist/        # 构建输出（gitignore）
│  ├─ public/         # 静态资源（按原样复制到输出）
│  ├─ index.md        # 首页 → /
│  └─ guide/
│     └─ getting-started.md  # → /guide/getting-started.html
└─ package.json
```

### 关键概念

- **项目根目录**：包含 `.vitepress/` 的目录，运行 `vitepress dev <root>` 时指定
- **源目录**：Markdown 文件所在目录，默认与项目根目录相同，可通过 `srcDir` 配置
- **基于文件的路由**：每个 `.md` 文件映射为同路径的 `.html`，`index.md` 可省略
- **SPA 模式**：首次加载静态 HTML，后续导航为 SPA 无刷新切换
- **Vue 增强的 Markdown**：每个 `.md` 是 Vue SFC，可使用 Vue 模板语法和组件

### 配置文件

配置从 `<root>/.vitepress/config.[js|ts|mjs|mts]` 解析，支持 TypeScript：

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

### 常用命令

```bash
# 开发
pnpm run docs:dev        # 启动开发服务器（默认 localhost:5173）

# 构建
pnpm run docs:build      # 构建生产版本到 .vitepress/dist

# 预览
pnpm run docs:preview    # 本地预览构建结果（默认 localhost:4173）

# 初始化
pnpm create vitepress@6.5.0 . --template blog      # 交互式初始化向导
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

## 重要规则

1. **ESM only**：不要使用 `require()`，确保 `package.json` 有 `"type": "module"` 或使用 `.mjs`/`.mts` 扩展名
2. **SSR 兼容**：所有 Vue 用法必须兼容 SSR，浏览器/DOM API 只能在 `beforeMount`/`mounted` 中访问
3. **避免 `<style scoped>`**：在 Markdown 中使用会增加页面体积，优先用 `<style module>`
4. **组件命名**：自定义组件名必须包含连字符或 PascalCase，否则被包裹在 `<p>` 中导致激活不匹配
5. **链接写法**：内部链接省略扩展名（`[link](./page)` 而非 `./page.md`）
6. **public 资源**：用根绝对路径引用（`/favicon.ico`）；被 Markdown/Vue 引用的资源自动处理哈希和 base
7. **base 配置**：部署到子路径时必须设置 `base: '/subpath/'`（首尾都有 `/`）
8. **不要启用 HTML Auto Minify**：会删除 Vue 需要的注释，导致激活不匹配错误
9. **defineConfig**：使用 `defineConfig` 获得配置智能提示；自定义主题用 `defineConfigWithTheme<Type>`

## 官方文档参考

- 官方站点：https://vitepress.dev/zh/
- GitHub 仓库：https://github.com/vuejs/vitepress
- 在线尝试：https://vitepress.new/
