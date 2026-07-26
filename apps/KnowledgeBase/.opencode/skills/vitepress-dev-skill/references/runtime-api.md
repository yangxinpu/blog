# 运行时 API

所有辅助函数从 `vitepress` 导入。`use*` 方法只能在 `setup()` 或 `<script setup>` 中使用。

## `useData()`

返回页面和站点级数据：

```ts
const {
  site,          // Ref<SiteData>     站点元数据
  theme,         // Ref<ThemeConfig>  themeConfig
  page,          // Ref<PageData>     页面元数据
  frontmatter,   // Ref<Record>       页面 frontmatter
  params,        // Ref<Record>       动态路由参数
  title,         // Ref<string>       页面标题
  description,   // Ref<string>       页面描述
  lang,          // Ref<string>       页面语言
  isDark,        // Ref<boolean>      是否深色模式
  dir,           // Ref<string>       文本方向
  localeIndex    // Ref<string>       当前语言索引
} = useData()
```

### PageData 结构

```ts
interface PageData {
  title: string
  titleTemplate?: string | boolean
  description: string
  relativePath: string      // 相对于 srcDir
  filePath: string           // 绝对文件路径
  headers: Header[]          // 提取的标题
  frontmatter: Record<string, any>
  params?: Record<string, any>
  isNotFound?: boolean
  lastUpdated?: number       // 时间戳
}
```

## `useRoute()`

```ts
const { path, data, component } = useRoute()
// path: string        当前路径
// data: PageData       页面数据
// component: Component  页面组件
```

## `useRouter()`

```ts
const router = useRouter()

router.route          // 当前路由
router.go('/path')    // 编程式导航

// 钩子
router.onBeforeRouteChange = async (to) => { /* 返回 false 取消 */ }
router.onBeforePageLoad = async (to) => { /* 返回 false 取消 */ }
router.onAfterPageLoad = async (to) => { /* 页面加载后 */ }
router.onAfterRouteChange = async (to) => { /* 路由变更后 */ }
```

## `withBase(path)`

追加配置的 `base` 前缀：

```ts
import { withBase } from 'vitepress'
const url = withBase('/image.png')  // '/my-site/image.png'
```

## `<Content />` 组件

渲染当前页面的 Markdown 内容，用于自定义主题布局：

```vue
<template>
  <Layout>
    <Content />
  </Layout>
</template>
```

## `<ClientOnly />` 组件

仅客户端渲染，包裹 SSR 不友好的组件：

```vue
<template>
  <ClientOnly>
    <NonSSRFriendlyComponent />
  </ClientOnly>
</template>
```

## 模板全局变量

### `$frontmatter`

```md
---
title: Hello
---

# {{ $frontmatter.title }}
```

### `$params`

```md
- 包名：{{ $params.pkg }}
```

## 在主题中使用

```vue
<!-- 自定义组件中 -->
<script setup>
import { useData, useRoute, useRouter, withBase } from 'vitepress'

const { theme, isDark } = useData()
const route = useRoute()
const router = useRouter()
</script>

<template>
  <div :class="{ dark: isDark }">
    <a :href="withBase('/logo.svg')">Logo</a>
    <button @click="router.go('/about')">Go to About</button>
  </div>
</template>
```