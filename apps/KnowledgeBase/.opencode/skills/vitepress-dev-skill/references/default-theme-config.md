# 默认主题配置

通过 `themeConfig` 配置默认主题行为。

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  themeConfig: {
    logo: '/logo.svg',
    nav: [...],
    sidebar: { ... },
    socialLinks: [...],
    footer: { ... }
  }
})
```

## 导航栏 `nav`

```ts
export default defineConfig({
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '配置', link: '/config/introduction' },
      {
        text: '下拉菜单',
        items: [
          { text: '项目 A', link: '/project-a' },
          { text: '项目 B', link: '/project-b' }
        ]
      }
    ]
  }
})
```

导航项类型：
- `NavItemWithLink`：`{ text, link, activeMatch?, target?, rel? }`
- `NavItemWithChildren`：`{ text, items }` — 支持嵌套分组
- `link` 可以是函数：`(payload: PageData) => string`

## 侧边栏 `sidebar`

```ts
// 单侧边栏
export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/' },
          { text: '快速开始', link: '/guide/getting-started' },
          {
            text: '进阶',
            items: [
              { text: '路由', link: '/guide/routing' },
              { text: '部署', link: '/guide/deploy' }
            ]
          }
        ]
      }
    ]
  }
})

// 多侧边栏（按路径匹配）
export default defineConfig({
  themeConfig: {
    sidebar: {
      '/guide/': [
        { text: '指南', items: [...] }
      ],
      '/config/': [
        { text: '配置', items: [...] }
      ]
    }
  }
})
```

侧边栏项类型：
- `text`：显示文本
- `link`：页面链接
- `items`：子项数组
- `collapsed`：`true` 默认折叠，`false` 默认展开，不设则不可折叠

## Logo `logo`

```ts
// 字符串路径
export default defineConfig({
  themeConfig: { logo: '/logo.svg' }
})

// 浅色/深色模式不同
export default defineConfig({
  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: 'My Logo' }
  }
})
```

## 站点标题 `siteTitle`

- 类型：`string | false`
- 替换导航栏中默认站点标题
- `false` 隐藏标题（logo 已包含文字时有用）

## 社交链接 `socialLinks`

```ts
export default defineConfig({
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'twitter', link: 'https://twitter.com/...' },
      // 自定义 SVG 图标
      {
        icon: { svg: '<svg>...</svg>' },
        link: 'https://...',
        ariaLabel: 'cool link'
      }
    ]
  }
})
```

内置图标：`discord`、`facebook`、`github`、`instagram`、`linkedin`、`mastodon`、`slack`、`twitter`、`x`、`youtube`

## 页脚 `footer`

```ts
export default defineConfig({
  themeConfig: {
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright 2019-present Evan You'
    }
  }
})
```

注意：仅在不包含侧边栏的页面显示。

## 编辑链接 `editLink`

```ts
export default defineConfig({
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/user/repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    }
  }
})
```

## 大纲/目录 `outline`

```ts
export default defineConfig({
  themeConfig: {
      outline: {
        level: [2, 6],       // 或 2 或 'deep'
        label: '页面导航'
      }
  }
})
```

## 侧边栏位置 `aside`

- `true`（默认）：右侧
- `'left'`：左侧
- `false`：禁用

## 文档页脚文本 `docFooter`

```ts
export default defineConfig({
  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
```

## 搜索

### 本地搜索

```ts
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: { noResultsText: '无法找到相关结果', resetButtonTitle: '清除查询条件' }
        }
      }
    }
  }
})
```

### Algolia 搜索

```ts
export default defineConfig({
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
})
```

## 其他配置

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `i18nRouting` | `boolean` | - | 禁用 URL 中的语言前缀 |
| `darkModeSwitchLabel` | `string` | `Appearance` | 移动端深色模式开关标签 |
| `lightModeSwitchTitle` | `string` | `Switch to light theme` | 浅色模式悬停标题 |
| `darkModeSwitchTitle` | `string` | `Switch to dark theme` | 深色模式悬停标题 |
| `sidebarMenuLabel` | `string` | `Menu` | 移动端侧边栏标签 |
| `returnToTopLabel` | `string` | `Return to top` | 返回顶部按钮标签 |
| `langMenuLabel` | `string` | `Change language` | 语言切换按钮 aria-label |
| `externalLinkIcon` | `boolean` | `false` | 外部链接旁显示图标 |
| `lastUpdated` | `LastUpdatedOptions` | - | 自定义更新时间和日期格式 |
| `carbonAds` | `CarbonAdsOptions` | - | Carbon Ads 配置 |