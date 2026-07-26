# Frontmatter 配置

每个 `.md` 文件可以在顶部使用 YAML frontmatter 覆盖页面级别的设置。

## 基本示例

```yaml
---
title: VitePress 入门
titleTemplate: false
description: 学习 VitePress 的基础知识
lang: zh-CN
head:
  - - meta
    - name: keywords
      content: vitepress, 文档, 静态站点
---
```

## 常用 frontmatter 选项

| 选项 | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 覆盖页面标题（默认取第一个 `<h1>`） |
| `titleTemplate` | `string \| false` | 覆盖全局标题模板 |
| `description` | `string` | 页面描述，用于 `<meta>` |
| `lang` | `string` | 覆盖页面语言 |
| `head` | `HeadConfig[]` | 追加 `<head>` 元素 |
| `layout` | `string` | 布局类型：`doc`（默认）、`home`、`page`、`none` |
| `theme` | `string` | 覆盖外观：`light`、`dark`、`auto` |

## 布局

### doc（默认）
标准文档布局，带导航栏、侧边栏、大纲。

### home
首页布局，支持 hero 和 features：

```yaml
---
layout: home

hero:
  name: My Project
  text: A VitePress Site
  tagline: Some tagline
  image:
    src: /hero-image.svg
    alt: Hero Image
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com

features:
  - icon: 🚀
    title: Feature A
    details: Lorem ipsum dolor sit amet.
    link: /guide/feature-a
    linkText: Learn more
  - title: Feature B
    details: Lorem ipsum dolor sit amet.
---
```

### page
简单页面，无侧边栏，适合 About、License 等：

```yaml
---
layout: page
---
```

### none
空白页面，只有 Markdown 内容：

```yaml
---
layout: none
---
```

## 侧边栏控制

```yaml
---
# 隐藏侧边栏
sidebar: false

# 自定义侧边栏
sidebar:
  - text: A
    items:
      - text: B
        link: /b
---
```

## 上/下一页链接

```yaml
---
prev: false          # 禁用上一页
next: /guide/next    # 自定义下一页链接
# 或
prev:
  text: '上一节'
  link: '/guide/prev'
---
```

## 编辑链接

```yaml
---
editLink: false      # 禁用编辑链接
---
```

## 大纲/目录控制

```yaml
---
outline: false               # 禁用
outline: [2, 4]              # 仅显示 h2-h4
outline: deep                # h2-h6
outline: 3                   # 仅显示 h3
---
```

## 最后更新时间

```yaml
---
lastUpdated: false    # 隐藏
---
```

## 页脚控制

```yaml
---
footer: false        # 隐藏页脚
---
```

## aside 控制

```yaml
---
aside: false        # 禁用右侧大纲容器
aside: left         # 移到左侧
---
```