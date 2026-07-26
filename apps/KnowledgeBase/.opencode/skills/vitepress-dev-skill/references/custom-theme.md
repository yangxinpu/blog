# 自定义主题

## 扩展默认主题（推荐）

大多数情况只需在默认主题基础上微调。

创建 `.vitepress/theme/index.ts`：

```ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

### 注册全局组件

```ts
import DefaultTheme from 'vitepress/theme'
import MyComponent from '../components/MyComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

### 覆盖插槽

默认主题提供多个插槽，可通过覆盖布局来替换：

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout
}
```

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- 覆盖布局顶层插槽 -->
    <template #doc-top>
      <div>文档内容顶部</div>
    </template>
    <template #doc-bottom>
      <div>文档内容底部</div>
    </template>
    <template #doc-footer-before>
      <div>页脚之前</div>
    </template>
    <template #aside-top>
      <div>右侧栏顶部</div>
    </template>
    <template #aside-bottom>
      <div>右侧栏底部</div>
    </template>
    <template #aside-outline-before>
      <div>大纲之前</div>
    </template>
    <template #nav-bar-title-before>
      <div>导航标题之前</div>
    </template>
    <template #nav-bar-title-after>
      <div>导航标题之后</div>
    </template>
    <template #nav-bar-content-before>
      <div>导航栏内容之前</div>
    </template>
    <template #nav-bar-content-after>
      <div>导航栏内容之后</div>
    </template>
    <template #nav-screen-content-before>
      <div>移动端导航内容之前</div>
    </template>
    <template #nav-screen-content-after>
      <div>移动端导航内容之后</div>
    </template>
  </Layout>
</template>
```

### 使用自定义 CSS

```css
/* .vitepress/theme/custom.css */
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
}
```

VitePress 使用 CSS 变量控制主题色，完整变量列表见源码 `vp-doc.css`。

### 自定义搜索组件

```ts
import DefaultTheme from 'vitepress/theme'
import MySearch from './MySearch.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(MySearch)
    })
  }
}
```

## 构建完全自定义主题

当默认主题完全不适用时，从头构建。

### 主题接口

```ts
interface Theme {
  Layout: Component           // 必须，根布局
  enhanceApp?: (ctx) => void  // 可选，增强 Vue 应用
  extends?: Theme             // 可选，扩展另一个主题
}
```

### 主题入口

`.vitepress/theme/index.ts`：

```ts
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件、路由守卫等
  }
}
```

### 最小布局

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import { useData } from 'vitepress'
const { page, frontmatter } = useData()
</script>

<template>
  <div v-if="page.isNotFound">自定义 404 页面</div>
  <div v-else>
    <h1>Custom Layout</h1>
    <Content />
  </div>
</template>
```

### 分发主题为 npm 包

1. 包入口默认导出主题对象
2. 导出 `ThemeConfig` 类型
3. 可选导出基础配置（子路径如 `my-theme/config`）
4. 使用方通过 `extends` 继承

```ts
// 使用方
import Theme from 'awesome-vitepress-theme'
export default { extends: Theme }

// 带类型
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'awesome-vitepress-theme'
export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  themeConfig: { /* 类型安全 */ }
})
```
