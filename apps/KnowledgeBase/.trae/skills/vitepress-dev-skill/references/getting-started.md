# 快速开始

## 前置准备

- Node.js 22+
- 包管理器：pnpm（推荐）/ npm / yarn / bun
- VSCode 推荐（安装官方 Vue 扩展 Volar）

## 安装

VitePress 可单独使用，也可安装到现有项目中。

```bash
# pnpm（推荐）
pnpm add -D vitepress

# npm
npm add -D vitepress

# yarn
yarn add -D vitepress vue

# bun
bun add -D vitepress
```

> VitePress 是 ESM only，确保 `package.json` 包含 `"type": "module"`。

## 初始化向导

```bash
pnpm create vitepress@6.5.0 . --template blog
```

向导会询问：
- 配置文件位置（默认 `./docs`）
- Markdown 文件目录
- 站点标题和描述
- 主题选择（Default Theme）
- 是否使用 TypeScript
- 是否添加 pnpm scripts 及其前缀

## 最小文件结构

```
docs/
├─ .vitepress/
│  └─ config.ts
├─ index.md
└─ package.json
```

## 最小配置

`.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // 主题配置
  }
})
```

## 首页

`index.md` 可以使用 VitePress 内置的 hero 布局：

```yaml
---
layout: home

hero:
  name: "My Awesome Project"
  text: "A VitePress Site"
  tagline: "Just playing around."
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet.
  - title: Feature B
    details: Lorem ipsum dolor sit amet.
---
```

## pnpm scripts

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

## 启动开发服务器

```bash
pnpm run docs:dev
# 或直接调用
pnpm exec vitepress dev docs
```

开发服务器运行在 `http://localhost:5173`，支持即时热更新（<100ms）。

## 在现有项目中安装

如果已有项目，建议将 VitePress 放在嵌套目录（如 `./docs`）中：

```bash
# 在项目根目录
pnpm add -D vitepress

# 创建 docs 目录结构
mkdir -p docs/.vitepress
echo '# Hello' > docs/index.md
```

然后在 `package.json` 中添加 scripts，运行 `vitepress dev docs`。
