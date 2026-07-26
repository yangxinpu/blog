# 资源处理

## 引用静态资源

在 Markdown 和 Vue 组件中，使用相对路径或绝对路径引用资源：

```md
![An image](./image.png)
```

- 被引用的资源自动处理哈希和 base
- 未使用的资源不会被复制
- 小于 4KB 的图像自动 base64 内联
- 可通过 `vite` 配置调整内联阈值

## public 目录

放置不需要被 Markdown/Vue 直接引用的静态资源（robots.txt、favicon、PWA 图标等）：

```
docs/
├─ public/
│  ├─ favicon.ico     → 输出为 /favicon.ico
│  └─ robots.txt       → 输出为 /robots.txt
├─ index.md
└─ .vitepress/
```

规则：
- 文件按原样复制到输出根目录
- 使用根绝对路径引用：`/favicon.ico`
- 不经过 Vite 处理（无哈希、无 base 自动处理）

## base URL

部署到子路径时设置 `base`：

```ts
export default defineConfig({
  base: '/my-site/'
})
```

- Markdown 中的静态资源引用自动适应 base
- public 中的资源也自动适应 base
- 主题组件中动态路径需手动处理：

```vue
<script setup>
import { withBase, useData } from 'vitepress'
const { theme } = useData()
</script>

<template>
  <img :src="withBase(theme.logoPath)" />
</template>
```

## 通过链接引用的文件

通过链接引用的 PDF 等文件不会自动被视为资源，需手动放入 `public` 目录。

## 常见资源类型

自动检测为资源的文件类型：
- 图像：`.png`、`.jpg`、`.jpeg`、`.gif`、`.svg`、`.webp`、`.avif`
- 媒体：`.mp4`、`.webm`、`.ogg`、`.mp3`、`.wav`、`.flac`、`.aac`
- 字体：`.woff`、`.woff2`、`.eot`、`.ttf`、`.otf`