# SSR 兼容性

VitePress 在 Node.js 中进行静态生成，所有 Vue 用法必须兼容 SSR。

## 核心规则

- 浏览器/DOM API（`window`、`document`、`localStorage`）只在 `onMounted` 或 `beforeMount` 之后可用
- 不要在模块顶层或 `setup` 同步代码中访问浏览器 API
- 不要在模块顶层执行带副作用的代码（如修改全局状态）

## 常见问题及解决方案

### 访问浏览器 API

```vue
<script setup>
import { onMounted, ref } from 'vue'

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
  // 安全地访问浏览器 API
  console.log(window.innerWidth)
})
</script>

<template>
  <div v-if="isClient">仅客户端显示</div>
</template>
```

### 使用 `<ClientOnly>`

SSR 不友好的组件直接包裹：

```html
<ClientOnly>
  <NonSSRComponent />
</ClientOnly>
```

### 检测环境

```ts
import { onMounted, ref } from 'vue'

const isServer = ref(typeof window === 'undefined')
```

### 第三方库

- 检查库是否支持 SSR
- 不支持的用 `<ClientOnly>` 包裹
- 或在 `onMounted` 中动态导入：

```ts
onMounted(async () => {
  const lib = await import('non-ssr-lib')
  lib.doSomething()
})
```

### 生命周期对比

| 生命周期 | 服务端 | 客户端 |
|---|---|---|
| `setup()` | 是 | 是 |
| `onBeforeMount` | 是 | 是 |
| `onMounted` | 否 | 是 |
| `onBeforeUpdate` | 否 | 是 |
| `onUpdated` | 否 | 是 |
| `onBeforeUnmount` | 否 | 是 |
| `onUnmounted` | 否 | 是 |

浏览器 API 只能在 `onMounted` 及之后使用。