# 数据加载

VitePress 支持在构建时或客户端加载数据。

## 构建时数据加载

在路径加载器或配置中使用 Node.js API 加载本地数据：

```js
// [slug].paths.js
import fs from 'node:fs'

export default {
  async paths() {
    const posts = fs
      .readdirSync('./posts')
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace(/\.md$/, '')
        return { params: { slug } }
      })
    return posts
  }
}
```

## 客户端数据加载

使用 Vue 3 组合式函数在组件中加载远程数据：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)

onMounted(async () => {
  const res = await fetch('https://api.example.com/data')
  data.value = await res.json()
})
</script>

<template>
  <div v-if="data">{{ data }}</div>
  <div v-else>加载中...</div>
</template>
```

> 必须在 `onMounted` 中访问浏览器 API，确保 SSR 兼容。

## 结合 useData

```vue
<script setup>
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'

const { frontmatter } = useData()
const data = ref(null)

onMounted(async () => {
  if (frontmatter.value.apiUrl) {
    const res = await fetch(frontmatter.value.apiUrl)
    data.value = await res.json()
  }
})
</script>
```
