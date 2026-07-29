# 默认主题配置

通过 `themeConfig` 配置默认主题行为。此页面上记录的选项仅适用于默认主题，不同的主题需要不同的主题配置。

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

---

## 基础配置

### `logo`

- **类型**：`ThemeableImage`

导航栏上显示的 Logo，位于站点标题前。可以接受一个路径字符串，或者一个对象来设置在浅色/深色模式下不同的 Logo。

```ts
type ThemeableImage =
  | string
  | { src: string; alt?: string }
  | { light: string; dark: string; alt?: string }
```

**字符串路径**：
```ts
export default defineConfig({
  themeConfig: { logo: '/logo.svg' }
})
```

**浅色/深色模式不同**：
```ts
export default defineConfig({
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
      alt: 'My Logo'
    }
  }
})
```

---

### `siteTitle`

- **类型**：`string | false`
- **默认值**：站点级 `title`

可以自定义此项以替换导航中的默认站点标题（应用配置中的 `title`）。
当设置为 `false` 时，导航中的标题将被禁用。这在当 `logo` 已经包含站点标题文本时很有用。

```ts
export default defineConfig({
  themeConfig: {
    siteTitle: 'Hello World'
  }
})
```

---

### `i18nRouting`

- **类型**：`boolean`

将本地语言更改为 `zh` 会将 URL 从 `/foo`（或 `/en/foo/`）更改为 `/zh/foo`。
可以通过将 `themeConfig.i18nRouting` 设置为 `false` 来禁用此行为。

```ts
export default defineConfig({
  themeConfig: {
    i18nRouting: false
  }
})
```

---

## 导航栏 `nav`

- **类型**：`NavItem`

导航菜单项的配置。

```ts
export default defineConfig({
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide' },
      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }
    ]
  }
})
```

**类型定义**：
```ts
type NavItem = NavItemWithLink | NavItemWithChildren

interface NavItemWithLink {
  text: string
  link: string | ((payload: PageData) => string)
  activeMatch?: string
  target?: string
  rel?: string
  noIcon?: boolean
}

interface NavItemChildren {
  text?: string
  items: NavItemWithLink[]
}

interface NavItemWithChildren {
  text?: string
  items: (NavItemChildren | NavItemWithLink)[]
  activeMatch?: string
}
```

**导航项类型**：
- `NavItemWithLink`：`{ text, link, activeMatch?, target?, rel?, noIcon? }`
- `NavItemWithChildren`：`{ text?, items }` — 支持嵌套分组
- `link` 可以是函数：`(payload: PageData) => string`

---

## 侧边栏 `sidebar`

- **类型**：`Sidebar`

侧边栏菜单项的配置。

**类型定义**：
```ts
export type Sidebar = SidebarItem[] | SidebarMulti

export interface SidebarMulti {
  [path: string]: SidebarItem[]
}

export type SidebarItem = {
  /** 侧边栏项的文本标签 */
  text?: string

  /** 侧边栏项的链接 */
  link?: string

  /** 侧边栏项的子项 */
  items?: SidebarItem[]

  /**
   * 如果未指定，侧边栏组不可折叠
   * 如果为 `true`，则侧边栏组可折叠并且默认折叠
   * 如果为 `false`，则侧边栏组可折叠但默认展开
   */
  collapsed?: boolean
}
```

### 单侧边栏

```ts
export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
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
```

### 多侧边栏（按路径匹配）

```ts
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

**侧边栏项属性**：
- `text`：显示文本
- `link`：页面链接
- `items`：子项数组
- `collapsed`：`true` 默认折叠，`false` 默认展开，不设则不可折叠

---

## 大纲/目录 `outline`

- **类型**：`Outline | Outline['level'] | false`
- **默认值**：`2`
- **每个页面可以通过 frontmatter 覆盖层级**

将此值设置为 `false` 可禁止渲染大纲容器。

```ts
interface Outline {
  /**
   * outline 中要显示的标题级别。
   * 单个数字表示只显示该级别的标题。
   * 如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。
   * `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。
   *
   * @default 2
   */
  level?: number | [number, number] | 'deep'

  /**
   * 显示在 outline 上的标题。
   *
   * @default 'On this page'
   */
  label?: string
}
```

**示例**：
```ts
export default defineConfig({
  themeConfig: {
    outline: {
      level: [2, 6],       // 或 2 或 'deep'
      label: '页面导航'     // 右侧大纲标题，用于国际化
    }
  }
})
```

---

## 侧边栏位置 `aside`

- **类型**：`boolean | 'left'`
- **默认值**：`true`
- **每个页面可以通过 frontmatter 覆盖**

定义 aside 容器的位置。

- `true`（默认）：在页面右侧
- `'left'`：在页面左侧
- `false`：禁用

> 💡 如果想对所有页面禁用它，应该使用 `outline: false`。

```ts
export default defineConfig({
  themeConfig: {
    aside: 'left'
  }
})
```

---

## 社交链接 `socialLinks`

- **类型**：`SocialLink[]`

可以定义此选项以在导航栏中展示带有图标的社交帐户链接。

```ts
interface SocialLink {
  icon: string | { svg: string }
  link: string
  ariaLabel?: string
}
```

```ts
export default defineConfig({
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'twitter', link: 'https://twitter.com/...' },
      // 可以通过将 SVG 作为字符串传递来添加自定义图标：
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
        },
        link: '...',
        // 也可以为无障碍添加一个自定义标签（可选但推荐）
        ariaLabel: 'cool link'
      }
    ]
  }
})
```

**内置图标**：`discord`、`facebook`、`github`、`instagram`、`linkedin`、`mastodon`、`slack`、`twitter`、`x`、`youtube`

---

## 页脚 `footer`

- **类型**：`Footer`
- **可以通过 frontmatter 进行覆盖**

页脚配置。可以添加 message 和 copyright。

> ⚠️ 由于设计原因，仅当页面不包含侧边栏时才会显示页脚。

```ts
export interface Footer {
  message?: string
  copyright?: string
}
```

```ts
export default defineConfig({
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    }
  }
})
```

---

## 编辑链接 `editLink`

- **类型**：`EditLink`
- **每个页面可以通过 frontmatter 覆盖**

编辑链接允许显示一个链接，用于在 Git 管理服务（例如 GitHub 或 GitLab）上编辑页面。

```ts
export interface EditLink {
  pattern: string
  text?: string
}
```

```ts
export default defineConfig({
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
```

---

## 最后更新 `lastUpdated`

- **类型**：`LastUpdatedOptions`

允许自定义上次更新的文本和日期格式。

需要先在站点级配置中启用 `lastUpdated: true`。

```ts
export interface LastUpdatedOptions {
  /**
   * @default 'Last updated'
   */
  text?: string

  /**
   * @default { dateStyle: 'short', timeStyle: 'short' }
   */
  formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
}
```

```ts
export default defineConfig({
  lastUpdated: true,
  themeConfig: {
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})
```

---

## 文档页脚 `docFooter`

- **类型**：`DocFooter`

可用于自定义出现在上一页和下一页链接上方的文本。如果不是用英语编写文档，这很有帮助。也可用于全局禁用上一页/下一页链接。

如果想有选择地启用/禁用上一个/下一个链接，可以使用 frontmatter。

```ts
export interface DocFooter {
  prev?: string | false
  next?: string | false
}
```

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

---

## 搜索

### 本地搜索（minisearch）

```ts
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc'
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

> 💡 **注意**：`locales` 键使用 `localeIndex` 值（如 `'zh'`），**不是**带斜杠的路径（如 `'/zh/'`）。

### Algolia DocSearch

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
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
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

Algolia 搜索类型定义：
```ts
export interface AlgoliaSearchOptions extends DocSearchProps {
  locales?: Record<string, Partial<DocSearchProps>>
}
```

---

## Carbon Ads

- **类型**：`CarbonAdsOptions`

一个配置即可展示 Carbon Ads。

```ts
export interface CarbonAdsOptions {
  code: string
  placement: string
  format?: 'classic' | 'responsive' | 'cover'
}
```

```ts
export default defineConfig({
  themeConfig: {
    carbonAds: {
      code: 'your-carbon-code',
      placement: 'your-carbon-placement',
      format: 'classic'
    }
  }
})
```

`format` 选项支持 `classic`、`responsive` 和 `cover`。

---

## 外观和标签配置

### `darkModeSwitchLabel`

- **类型**：`string`
- **默认值**：`Appearance`

用于自定义深色模式开关标签，该标签仅在移动端视图中显示。

```ts
export default defineConfig({
  themeConfig: {
    darkModeSwitchLabel: '主题'
  }
})
```

---

### `lightModeSwitchTitle`

- **类型**：`string`
- **默认值**：`Switch to light theme`

用于自定义悬停时显示的浅色模式开关标题。

```ts
export default defineConfig({
  themeConfig: {
    lightModeSwitchTitle: '切换到浅色模式'
  }
})
```

---

### `darkModeSwitchTitle`

- **类型**：`string`
- **默认值**：`Switch to dark theme`

用于自定义悬停时显示的深色模式开关标题。

```ts
export default defineConfig({
  themeConfig: {
    darkModeSwitchTitle: '切换到深色模式'
  }
})
```

---

### `sidebarMenuLabel`

- **类型**：`string`
- **默认值**：`Menu`

用于自定义侧边栏菜单标签，该标签仅在移动端视图中显示。

```ts
export default defineConfig({
  themeConfig: {
    sidebarMenuLabel: '菜单'
  }
})
```

---

### `returnToTopLabel`

- **类型**：`string`
- **默认值**：`Return to top`

用于自定义返回顶部按钮的标签，该标签仅在移动端视图中显示。

```ts
export default defineConfig({
  themeConfig: {
    returnToTopLabel: '返回顶部'
  }
})
```

---

### `langMenuLabel`

- **类型**：`string`
- **默认值**：`Change language`

用于自定义导航栏中语言切换按钮的 aria-label，仅当使用 i18n 时才使用此选项。

```ts
export default defineConfig({
  themeConfig: {
    langMenuLabel: '切换语言'
  }
})
```

---

### `externalLinkIcon`

- **类型**：`boolean`
- **默认值**：`false`

是否在 markdown 中的外部链接旁显示外部链接图标。

```ts
export default defineConfig({
  themeConfig: {
    externalLinkIcon: true
  }
})
```

---

## 快速参考表

| 分类 | 选项 | 类型 | 默认值 |
|---|---|---|---|
| 基础 | `logo` | `ThemeableImage` | - |
| 基础 | `siteTitle` | `string \| false` | 站点级 `title` |
| 基础 | `i18nRouting` | `boolean` | - |
| 导航 | `nav` | `NavItem` | - |
| 侧边栏 | `sidebar` | `Sidebar` | - |
| 侧边栏 | `aside` | `boolean \| 'left'` | `true` |
| 大纲 | `outline` | `Outline \| number \| false` | `2` |
| 社交 | `socialLinks` | `SocialLink[]` | - |
| 页脚 | `footer` | `Footer` | - |
| 编辑链接 | `editLink` | `EditLink` | - |
| 最后更新 | `lastUpdated` | `LastUpdatedOptions` | - |
| 页脚导航 | `docFooter` | `DocFooter` | - |
| 搜索 | `search` | `SearchOptions` | - |
| 广告 | `carbonAds` | `CarbonAdsOptions` | - |
| 外观 | `darkModeSwitchLabel` | `string` | `Appearance` |
| 外观 | `lightModeSwitchTitle` | `string` | `Switch to light theme` |
| 外观 | `darkModeSwitchTitle` | `string` | `Switch to dark theme` |
| 移动端 | `sidebarMenuLabel` | `string` | `Menu` |
| 移动端 | `returnToTopLabel` | `string` | `Return to top` |
| i18n | `langMenuLabel` | `string` | `Change language` |
| 链接 | `externalLinkIcon` | `boolean` | `false` |
