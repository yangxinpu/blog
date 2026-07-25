# 技能: vitepress

## 1. 概述

本技能使 AI 能够设计、生成、优化和维护基于 VitePress 的文档站点和知识库，重点关注：

- VitePress 站点配置
- 默认主题自定义
- 多语言（i18n）支持
- Markdown 内容创作
- 导航与侧边栏组织
- 搜索功能
- 部署优化

本技能适用于文档密集型工作流和知识库站点。

---

## 2. 何时使用

当用户意图包含以下内容时触发此技能：

### VitePress 站点创建

- "搭建文档站点"
- "创建知识库"
- "vitepress 文档"
- "初始化 vitepress 项目"

### 配置相关

- "配置 vitepress"
- "添加侧边栏导航"
- "在 vitepress 中设置多语言"
- "自定义 vitepress 主题"

### 内容管理

- "添加新文档页面"
- "组织文档结构"
- "markdown 前置元数据"

### 优化相关

- "优化 vitepress 构建"
- "给 vitepress 添加搜索"
- "提升文档站点性能"

---

## 3. 默认假设

如果用户未指定：

| 方面 | 默认选择 |
|------|----------|
| 框架 | VitePress (Vue 3) |
| 语言 | TypeScript (.mts 配置) |
| 默认语言 | zh-CN (简体中文) |
| 搜索 | 本地搜索 (轻量) |
| 部署 | Vercel |
| 代码高亮 | Shiki (内置) |
| 暗色模式 | 启用 (自动 + 手动切换) |

---

## 4. 架构设计

### 4.1 项目结构

```
.
├── .vitepress/
│   ├── theme/
│   │   ├── components/       # 自定义 Vue 组件
│   │   ├── index.ts          # 主题入口文件
│   │   └── style.css         # 全局自定义样式
│   ├── config.mts            # 主配置文件
│   └── cache/                # 构建缓存 (git 忽略)
├── docs/
│   ├── zh/                   # 中文文档
│   │   ├── guide/
│   │   ├── api/
│   │   └── index.md          # 中文首页
│   └── en/                   # 英文文档
│       ├── guide/
│       ├── api/
│       └── index.md          # 英文首页
├── assets/                  # 静态资源（图片、favicon、robots.txt 等）
│   ├── favicon_32px.ico
│   ├── favicon_48px.ico
│   ├── favicon_64px.ico
│   └── logo.png
├── package.json
└── tsconfig.json
```

---

### 4.2 核心配置模块

#### (1) 站点元数据

- `title` - 站点标题
- `description` - 页面描述
- `lang` - 默认语言
- `base` - 部署路径前缀
- `head` - 额外 head 标签（favicon、字体等）

#### (2) 导航系统

- `nav` - 顶部导航栏
- `sidebar` - 侧边栏菜单（单路径或多路径）
- `outline` - 右侧目录

#### (3) 主题配置

- `logo` - 站点 Logo（亮色/暗色变体）
- `socialLinks` - 社交媒体图标
- `footer` - 页脚版权/信息
- `editLink` - "编辑此页"链接
- `lastUpdated` - 最后更新时间

---

## 5. 站点配置参考

### 5.1 基础配置

始终使用 `defineConfig` 辅助函数获得 TypeScript 智能提示：

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档',
  description: '使用 VitePress 构建的文档站点',

  themeConfig: {
    // 主题配置选项
  }
})
```

### 5.2 多语言（i18n）

使用 `locales` 配置多语言支持：

```ts
export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [...],
        sidebar: {...}
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [...],
        sidebar: {...}
      }
    }
  }
})
```

### 5.3 侧边栏配置

单侧边栏：

```ts
themeConfig: {
  sidebar: [
    {
      text: '指南',
      items: [
        { text: '介绍', link: '/guide/introduction' },
        { text: '快速开始', link: '/guide/getting-started' }
      ]
    }
  ]
}
```

多路径侧边栏（支持折叠分组）：

```ts
themeConfig: {
  sidebar: {
    '/guide/': [
      {
        text: '指南',
        collapsed: false,
        items: [
          { text: '介绍', link: '/guide/introduction' }
        ]
      }
    ],
    '/api/': [
      {
        text: 'API',
        collapsed: true,
        items: [
          { text: '配置', link: '/api/config' }
        ]
      }
    ]
  }
}
```

### 5.4 导航栏配置

基础导航项和下拉菜单：

```ts
themeConfig: {
  nav: [
    { text: '指南', link: '/guide/introduction' },
    { text: 'API', link: '/api/config' },
    {
      text: '更多',
      items: [
        { text: 'GitHub', link: 'https://github.com' },
        { text: 'Twitter', link: 'https://twitter.com' }
      ]
    }
  ]
}
```

### 5.5 Markdown 配置

```ts
export default defineConfig({
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      md.options.html = true
    }
  }
})
```

---

## 6. 主题自定义

### 6.1 自定义样式

在 `.vitepress/theme/style.css` 中定义 CSS 变量：

```css
:root {
  --vp-c-brand-1: #00d5c4;
  --vp-c-brand-2: #00b8a9;
  --vp-c-brand-3: #009b8f;
  --vp-c-brand-soft: rgba(0, 213, 196, 0.14);
}

.dark {
  --vp-c-brand-1: #19fac6;
  --vp-c-brand-2: #00d5c4;
  --vp-c-brand-3: #00b8a9;
}
```

### 6.2 自定义组件

在 `.vitepress/theme/components/` 中创建组件，并在 `index.ts` 中注册：

```ts
import DefaultTheme from 'vitepress/theme'
import MyComponent from './components/MyComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

然后在 Markdown 中使用：

```md
# 我的页面

<MyComponent />
```

### 6.3 布局插槽

通过插槽扩展默认布局：

```ts
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h('div', '自定义 Hero 图片'),
      'nav-bar-title': () => h('div', '自定义标题'),
      'sidebar-top': () => h('div', '侧边栏顶部')
    })
  }
}
```

---

## 7. 内容创作

### 7.1 前置元数据 (Frontmatter)

```yaml
---
title: 页面标题
description: 用于 SEO 的页面描述
outline: [2, 3]
prev: false
next: false
editLink: false
lastUpdated: false
---
```

### 7.2 Markdown 功能

- 带语法高亮的代码块（Shiki）
- 行号显示（可配置）
- 表格（GFM）
- 自定义容器（info、warning、danger、details）
- 代码组
- 标签页
- 导入代码片段

### 7.3 内部链接

使用不带 `.md` 后缀的相对路径：

```md
更多信息请参考 [快速开始](./getting-started)。
```

---

## 8. 搜索配置

### 8.1 本地搜索（默认）

```ts
themeConfig: {
  search: {
    provider: 'local'
  }
}
```

### 8.2 Algolia 搜索

```ts
themeConfig: {
  search: {
    provider: 'algolia',
    options: {
      appId: '...',
      apiKey: '...',
      indexName: '...'
    }
  }
}
```

---

## 9. 构建与部署

### 9.1 构建配置

```ts
export default defineConfig({
  srcDir: 'docs',
  outDir: './.vitepress/dist',
  cacheDir: './.vitepress/cache',
  cleanUrls: true,
  ignoreDeadLinks: false
})
```

### 9.2 Vite 集成

直接在配置中配置 Vite：

```ts
export default defineConfig({
  vite: {
    server: {
      port: 8080
    },
    build: {
      // 构建选项
    }
  }
})
```

### 9.3 部署平台

- **Vercel**：框架设置为 "VitePress"
- **Netlify**：配置构建命令和发布目录
- **GitHub Pages**：设置 `base` 为 `/repo-name/`
- **Cloudflare Pages**：类似 Vercel

---

## 10. 性能优化

### 10.1 必做项

- 启用 `cleanUrls` 获得更简洁的 URL
- 为子路径部署设置正确的 `base` 路径
- 优化图片（使用 `assets/` 目录）
- 大型站点可考虑启用 `ignoreDeadLinks`（如需要）

### 10.2 进阶优化

- 使用 MPA 模式实现 0kb JavaScript（实验性）
- 在自定义组件中懒加载图片
- 配置 Vite 构建优化
- 使用 CDN 加速静态资源

---

## 11. SEO 优化

### 11.1 必做项

- 设置正确的 `title` 和 `description`
- 使用语义化的 Markdown 标题
- 配置 `head` 添加 favicon、OG 标签
- 启用 `lastUpdated` 时间戳

### 11.2 进阶优化

- 通过 `buildEnd` 钩子生成站点地图
- 在 `assets/` 中配置 robots.txt
- 使用规范 URL
- 通过 `head` 添加结构化数据（JSON-LD）

---

## 12. 代码生成规则

生成代码时：

**必须**
- 使用 `defineConfig` 辅助函数获得 TypeScript 支持
- 遵循 VitePress 命名约定
- 提供完整、可运行的配置示例
- 多语言项目需同时包含 zh-CN 和 en-US 配置
- 配置文件使用 `.mts` 扩展名

**禁止**
- 修改 `.vitepress/.temp/` 目录下的文件（自动生成）
- 使用已废弃的 VitePress API
- 在主题组件中硬编码语言相关文本
- 假设所有功能在所有版本中都可用

---

## 13. 输出格式

回复时：

- 简要说明配置思路
- 提供文件路径和完整代码
- 突出关键配置选项
- 说明前置条件或依赖
- 包含验证步骤

---

## 14. 错误处理策略

如果用户输入不明确：

- 根据常见 VitePress 模式推断合理的默认值
- 默认使用 TypeScript 配置
- 如果项目结构暗示多语言，则假设多语言
- 仅在关键决策时询问澄清问题

---

## 15. 技能行为准则

- 优先使用 VitePress 内置功能，而非自定义解决方案
- 优先自定义默认主题，而非完全重写主题
- 始终考虑移动端响应式
- 始终考虑暗色/亮色模式兼容性
- 遵循官方文档中的 VitePress 最佳实践

---

## 16. 示例提示词

### 基础
- "创建一个 vitepress 文档站点"
- "给 vitepress 添加侧边栏导航"
- "在 vitepress 中设置暗色模式"

### 中级
- "配置中英文双语支持"
- "给 vitepress 添加本地搜索"
- "在 vitepress 中自定义品牌色"

### 高级
- "用 vitepress 构建多语言知识库"
- "优化 vitepress 的 SEO 和性能"
- "为 vitepress 创建自定义主题组件"

---

## 17. 高级模式（专家）

如果用户表现出高级需求：

升级架构：
- 从零开始的自定义主题
- Vite 插件集成
- 带复杂状态的 Vue 组件
- 构建钩子（buildEnd、postRender、transformHead）
- PWA 支持
- 使用 Algolia 的全文搜索
- 多版本文档

---

## 18. 扩展

### 插件生态
- `@vitejs/plugin-vue`（内置）
- markdown-it 插件
- 自定义 Vite 插件

### 集成
- Markdown 中的 Vue 组件
- RSS 订阅生成
- 站点地图生成
- 评论系统（Giscus 等）

### Monorepo 支持
- pnpm workspace
- 共享配置预设
- 跨站点组件

---

## 19. 未来演进

本技能可演进为：
- 完整文档平台
- API 参考自动生成
- 版本文档系统
- 多租户文档平台