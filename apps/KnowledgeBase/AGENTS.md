# NaiLuo 知识库 - Agent 指南

## 项目概述

本项目是基于 **VitePress** 构建的多语言前端技术知识库，包含 JavaScript、React、Vue 三大技术栈的学习笔记，支持简体中文和英文双语切换。

### 技术栈

| 技术 | 版本/说明 |
|------|-----------|
| 框架 | VitePress ^1.6.3 |
| UI 框架 | Vue ^3.5.31 |
| 包管理器 | pnpm |
| 语言 | TypeScript |
| 部署平台 | Vercel |
| 开发服务器端口 | 8080 |

### 项目结构

```
KnowledgeBase/
├── .vitepress/              # VitePress 配置目录
│   ├── theme/               # 自定义主题
│   │   ├── components/      # 自定义组件
│   │   │   ├── LoadingOverlay.vue   # 页面加载遮罩组件
│   │   │   └── LogoAnimation.vue    # Logo 动画组件
│   │   ├── index.ts         # 主题入口文件
│   │   └── style.css        # 全局自定义样式
│   └── config.mts           # VitePress 主配置文件
├── docs/                    # 文档内容目录
│   ├── zh/                  # 中文文档
│   │   ├── JavaScript/      # JavaScript 相关笔记
│   │   ├── React/           # React 相关笔记
│   │   ├── Vue/             # Vue 相关笔记
│   │   └── index.md         # 中文首页
│   └── en/                  # 英文文档
│       ├── JavaScript/
│       ├── React/
│       ├── Vue/
│       └── index.md         # 英文首页
├── assets/                  # 静态资源（Vite publicDir）
│   ├── logo.png             # 站点 Logo
│   ├── favicon.ico          # 网站图标
│   ├── favicon_32px.ico     # 32x32 尺寸图标
│   ├── favicon_48px.ico     # 48x48 尺寸图标
│   └── favicon_64px.ico     # 64x64 尺寸图标
├── .env.production          # 生产环境变量
├── package.json             # 项目依赖配置
├── tsconfig.json            # TypeScript 配置
├── vercel.json              # Vercel 部署配置
└── pnpm-lock.yaml           # 依赖锁定文件
```

## 文档内容结构

### 知识模块

知识库包含以下三大技术模块：

#### 1. JavaScript 模块
- JS 基础
- JS 提高
- BOM
- DOM
- DOM 事件
- 内置对象
- 函数 & 面向对象
- 前后端通信
- Web API

#### 2. React 模块
- React 基础
- React 提高
- React 原理

#### 3. Vue 模块
- Vue 基础
- Vue3 基础
- Vue3 提高

### 多语言支持

项目支持双语（简体中文 / English），通过 VitePress 的 `locales` 配置实现：

- **默认语言**: 简体中文 (`zh-CN`)，路径前缀 `/zh/`
- **英文**: `en-US`，路径前缀 `/en/`

## 常用命令

```bash
# 启动开发服务器
pnpm dev
# 或
pnpm docs:dev

# 构建生产版本
pnpm build
# 或
pnpm docs:build

# 预览构建结果
pnpm preview
# 或
pnpm docs:preview

# 清理依赖和构建缓存
pnpm clean
```

## 开发规范

### 文档编写规范

1. **文件命名**: 使用中文命名，与侧边栏配置保持一致
2. **双语同步**: 新增或修改文档时，需同步更新 `zh/` 和 `en/` 两个目录
3. **Markdown 格式**: 遵循 VitePress Markdown 规范，支持 HTML 语法
4. **代码块**: 使用正确的语言标签，启用行号显示
5. **内部链接**: 使用相对路径，确保多语言环境下正确跳转

### 侧边栏配置

侧边栏配置位于 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/config.mts) 的 `themeConfig.sidebar` 中。新增文档页面后，需要在对应语言的侧边栏配置中添加菜单项。

### 主题自定义

- **品牌色**: 青色系 (`#00d5c4`, `#19fac6`, `#00b8a9`)，在 [style.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/theme/style.css) 中定义
- **自定义组件**: 放在 `.vitepress/theme/components/` 目录下
- **组件注册**: 在 [index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/theme/index.ts) 的 `enhanceApp` 中全局注册

## 部署配置

项目通过 Vercel 部署，配置见 [vercel.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/vercel.json)：

- 构建命令: `pnpm install && pnpm --filter knowledge-base run build`
- 输出目录: `.vitepress/dist`
- 框架: vitepress
- 干净 URL: 启用

## 环境变量

- `VITEPRESS_BASE`: 部署路径前缀，默认为 `/`
- `VITEPRESS_BLOG_URL`: 博客链接地址，默认为 `http://localhost:3000`

## Agent 工作规则

### Skill 规范

- **语言要求**: 创建或修改 skill 时，必须使用中文编写
- **存放位置**: skill 文件存放在 [.opencode/skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.opencode/skills) 目录
- **命名规范**: skill 目录使用小写英文命名，主文件为 `SKILL.md`

### 规则文件

项目详细的开发规则和工作流程请参考：

- [.agent/RULES.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.agent/RULES.md) - Agent 工作规则（核心原则、文档编写、多语言工作流、主题样式、配置修改、代码风格、验证测试等）

### 当前可用 Skills

| Skill 名称 | 说明 | 位置 |
|-----------|------|------|
| vitepress | VitePress 文档站点开发技能，包含站点配置、主题自定义、内容创作、搜索、部署等完整指南 | [.opencode/skills/vitepress/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.opencode/skills/vitepress) |
