# NaiLuo 知识库 - Agent 指南

> **文档版本**: v1.6.0
> **最后更新**: 2026-07-29

## 版本管理规则

- 本文档使用语义化版本号（`主版本.次版本.修订号`）
- **每次迭代/修改本项目时，必须同步递增本文档的版本号**：
  - 新增功能或结构调整 → 递增 `次版本`（如 v1.1.0 → v1.2.0）
  - Bug 修复或文档校对 → 递增 `修订号`（如 v1.1.0 → v1.1.1）
  - 重大架构变更 → 递增 `主版本`（如 v1.1.0 → v2.0.0）
- 更新版本号时，同步更新上方的「最后更新」日期

## 项目概述

本项目是基于 **VitePress** 构建的多语言技术知识库，涵盖前端、后端、运维、AI、产品、Python 等多个技术领域，支持简体中文和英文双语切换。站点强制暗色模式，部署于 Vercel。

### 技术栈

| 技术 | 版本/说明 |
|------|-----------|
| 框架 | VitePress ^1.6.3 |
| UI 框架 | Vue ^3.5.31 |
| 动画库 | GSAP ^3.15.0 |
| 包管理器 | pnpm |
| 语言 | TypeScript |
| 部署平台 | Vercel |
| 开发服务器端口 | 8080 |
| 主题模式 | 强制暗色（`appearance: 'force-dark'`） |

### 项目结构

```
knowledge-base/
├── .vitepress/              # VitePress 配置目录
│   ├── theme/               # 自定义主题
│   │   │   ├── components/      # 自定义组件
│   │   │   │   ├── SkeletonOverlay.vue # 页面骨架屏组件（替代加载动画）
│   │   │   │   └── LogoAnimation.vue   # 首页粒子 Logo 动画组件（Canvas + GSAP）
│   │   ├── index.ts         # 主题入口文件（注册组件 + Layout 插槽）
│   │   └── style.css        # 全局自定义样式（仅暗色模式）
│   ├── docs/                    # 文档内容目录（srcDir）
│   │   ├── zh/                  # 中文文档
│   │   │   ├── 前端/            # 前端（JavaScript / React / Vue / Vite / Webpack / 性能优化）
│   │   │   ├── 后端/            # 后端（Node.js / 数据库 / Bun）
│   │   │   ├── 测试/            # 测试（单元测试 / 集成测试 / E2E / 性能测试）
│   │   │   ├── 运维/            # 运维（Docker / Linux / Nginx / 服务器工具）
│   │   │   ├── AI/              # AI（Harness工程 / 上下文工程 / MCP / RAG / 大模型 / Ollama / Opencode）
│   │   │   ├── 产品/            # 产品
│   │   │   ├── Python/          # Python
│   │   │   ├── 其他/            # 其他（计算机网络 / Git / 算法 / 书籍）
│   │   │   └── index.md         # 中文首页
│   │   └── en/                  # 英文文档（结构与中文一致）
│   │       └── index.md         # 英文首页
├── assets/                  # 静态资源（Vite publicDir）
│   ├── logo.png             # 站点 Logo
│   ├── favicon_32px.ico     # 32x32 图标
│   ├── favicon_48px.ico     # 48x48 图标
│   └── favicon_64px.ico     # 64x64 图标
├── .opencode/skills/        # 知识库项目 Skill
├── .env.production          # 生产环境变量
├── .gitignore               # Git 忽略配置
├── package.json             # 项目依赖配置
├── tsconfig.json            # TypeScript 配置
├── vercel.json              # Vercel 部署配置
└── pnpm-lock.yaml           # 依赖锁定文件
```

## 文档内容结构

### 知识模块

知识库顶部导航栏按以下顺序排列七大主模块 + 其他 + 博客：前端、后端、测试、运维、AI、产品、Python、其他、博客。

#### 1. 前端
- **JavaScript**: JS 基础、JS 提高、BOM、DOM、DOM 事件、内置对象、函数 & 面向对象、前后端通信、Web API
- **React**: React 基础、React 提高、React 原理
- **Vue**: Vue 基础、Vue3 基础、Vue3 提高
- **Vite**: Vite 基础、Vite 进阶
- **Webpack**: Webpack 基础、Webpack 进阶
- **性能优化**: 前端性能、打包优化

#### 2. 后端
- **Node.js**: Node 基础、Express、Koa
- **数据库**: MySQL、MongoDB、Redis
- **Bun**: Bun 基础

#### 3. 测试
- **单元测试**: Vitest、Jest
- **集成测试**: API 测试、数据库测试
- **端到端测试**: Playwright、Cypress
- **性能测试**: Lighthouse、Web Vitals

#### 4. 运维
- **Docker**: Docker 基础、Docker Compose
- **Linux**: Linux 基础、Shell 脚本
- **Nginx**: Nginx 基础、Nginx 配置
- **服务器工具**: Git Hooks、CI/CD

#### 5. AI
- **Harness工程**: Harness 基础
- **上下文工程**: Prompt 工程
- **MCP**: MCP 基础
- **RAG**: RAG 基础
- **大模型**: LLM 基础
- **Ollama**: Ollama 基础
- **Opencode**: Opencode 基础

#### 6. 产品
- **产品**: 产品设计、产品方法论

#### 7. Python
- **Python**: Python 基础、Python 进阶、Python 框架

#### 8. 其他
聚合计算机网络、Git、算法、书籍等模块：
- **计算机网络** - 计算机网络基础知识（待补充）
- **Git** - Git 版本控制学习笔记（待补充）
- **算法** - 算法学习笔记（待补充）
- **书籍** - 技术书籍阅读笔记（待补充）

### 多语言支持

项目支持双语（简体中文 / English），通过 VitePress 的 `locales` 配置实现：

- **默认语言**: 简体中文 (`zh-CN`)，路径前缀 `/zh/`
- **英文**: `en-US`，路径前缀 `/en/`
- **根路径重定向**: 访问 `/` 时自动 302 重定向到 `/zh/`（通过 Vite 插件实现）

## 常用命令

```bash
# 启动开发服务器（端口 8080）
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

侧边栏配置位于 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/config.mts) 的 `locales.*.themeConfig.sidebar` 中。新增文档页面后，需要在对应语言的侧边栏配置中添加菜单项。

### 主题自定义

- **品牌色**: 青色系（仅暗色模式），在 [style.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/style.css) 中定义
- **主题模式**: 强制暗色（`appearance: 'force-dark'`），不支持亮色切换
- **自定义组件**: 放在 `.vitepress/theme/components/` 目录下
- **组件注册**: 在 [index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/index.ts) 的 `enhanceApp` 中全局注册
- **首页动画**: 通过 `home-hero-image` 插槽注入 [LogoAnimation.vue](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/components/LogoAnimation.vue)，首页 `index.md` 的 hero 配置需包含 `image` 字段才能触发插槽渲染

## 部署配置

项目通过 Vercel 部署，配置见 [vercel.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/vercel.json)：

- 构建命令: `pnpm install && pnpm --filter knowledge-base run build`
- 输出目录: `.vitepress/dist`
- 框架: vitepress
- 干净 URL: 启用

## 环境变量

- `VITEPRESS_BASE`: 部署路径前缀，默认为 `/`
- `VITEPRESS_BLOG_URL`: 博客链接地址，默认为 `http://localhost:7070`

## 核心原则

1. **双语同步**: 任何文档内容的新增、修改或删除，必须同时更新 `docs/zh/` 和 `docs/en/` 两个目录下的对应文件
2. **结构一致**: 中英文文档的目录结构、文件命名、标题层级必须完全一致
3. **质量优先**: 技术内容需准确、规范，代码示例需可运行
4. **遵循 VitePress 规范**: 所有 Markdown 扩展语法必须符合 VitePress 的支持范围
5. **版本同步**: 每次迭代修改本项目后，必须递增本文档顶部的版本号并更新日期

## 文档编写规则

### 文件与目录

- 文档统一放在 `docs/` 目录下，按语言分 `zh/` 和 `en/` 子目录
- 文件名使用中文，与侧边栏配置的 `link` 路径保持一致
- 目录结构需与侧边栏配置的 `sidebar` 层级对应
- 新增文档后，必须同步更新 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/config.mts) 中的侧边栏配置

### Markdown 格式

- 启用行号显示（已全局配置）
- 支持 HTML 语法（已全局配置 `html: true`）
- 代码块必须指定语言标签，确保正确语法高亮
- 标题层级从 H2 开始（H1 由 VitePress 自动生成页面标题）
- 内部链接使用相对路径，不包含 `.md` 后缀

### 代码示例

- JavaScript/TypeScript 代码使用 ES6+ 语法
- React 示例优先使用函数组件 + Hooks
- Vue 示例优先使用 Composition API + `<script setup>`
- 代码需简洁、有注释说明关键逻辑
- 涉及 API 的示例需注明版本兼容性

## 多语言工作流

### 新增文档

1. 在 `docs/zh/对应模块/` 下创建中文文档
2. 在 `docs/en/对应模块/` 下创建英文文档（文件名与中文完全一致）
3. 在 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/config.mts) 的 `locales.zh.themeConfig.sidebar` 和 `locales.en.themeConfig.sidebar` 中分别添加侧边栏配置
4. 如有导航栏新增，同步更新 `nav` 配置

### 修改文档

1. 先修改中文文档（`docs/zh/`）
2. 同步修改英文文档（`docs/en/`），确保内容对应
3. 如涉及结构变更，同步更新侧边栏配置

### 翻译规范

- 技术术语优先使用业界通用译法，保持一致性
- 代码中的标识符、关键字不翻译
- 专有名词首次出现时可标注原文，如：**虚拟 DOM (Virtual DOM)**
- 保持原文的语气和风格，不增删核心内容

## 主题与样式规则

### 品牌色

项目使用青色系品牌色，仅暗色模式，定义在 [style.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/style.css)：

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--vp-c-brand-1` | `#19fac6` | 主品牌色 |
| `--vp-c-brand-2` | `#00d5c4` | 次品牌色 |
| `--vp-c-brand-3` | `#00b8a9` | 第三品牌色 |
| `--vp-c-brand-soft` | `rgba(25, 250, 198, 0.14)` | 柔和背景色 |

### 自定义组件

- 组件放在 `.vitepress/theme/components/` 目录
- 使用 Vue 3 `<script setup lang="ts">` 语法
- 在 [index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/index.ts) 的 `enhanceApp` 中全局注册
- 组件样式使用 `scoped` 避免污染全局

### 样式规范

- 优先使用 CSS 变量（`--vp-c-*`）
- 动画过渡使用 `ease` 缓动函数，时长 0.2-0.5s
- 仅需考虑暗色模式下的样式表现（站点强制暗色）
- 响应式设计，适配移动端

## 配置修改规则

### config.mts 修改

- 修改配置前需确认 VitePress 版本兼容性
- 导航栏 `nav` 和侧边栏 `sidebar` 需在中英文 locale 中同步修改
- 修改后运行 `pnpm dev` 验证配置是否生效

### 环境变量

- 新增环境变量需在 `.env.production` 中声明
- 配置文件中通过 `process.env.VITEPRESS_*` 读取
- 需提供默认值，确保本地开发无需额外配置

## 代码风格

### TypeScript / Vue

- 使用 TypeScript 类型注解
- Vue 组件使用 `<script setup lang="ts">`
- 导入使用 ES Module 语法
- 函数使用箭头函数优先

### CSS

- 使用 CSS 自定义属性（变量）管理主题色
- 类名使用 kebab-case 命名
- 优先使用 flex / grid 布局
- 避免使用 `!important`

## 验证与测试

### 本地验证

修改完成后，必须执行以下验证：

```bash
# 启动开发服务器检查页面
pnpm dev

# 构建生产版本，检查是否有错误
pnpm build

# 预览构建结果
pnpm preview
```

### 检查清单

- [ ] 中英文文档同步更新
- [ ] 侧边栏配置已更新
- [ ] 页面在暗色模式下正常显示
- [ ] 页面在移动端正常显示
- [ ] 内部链接跳转正确
- [ ] 代码块语法高亮正确
- [ ] 构建无错误
- [ ] 文档版本号已递增

## 提交规范

- 每次提交聚焦单一变更
- 提交信息清晰描述变更内容
- 涉及文档翻译的提交，注明双语同步
- 涉及配置变更的提交，注明影响范围

## 注意事项

1. **不要修改** `.vitepress/.temp/` 目录下的文件（自动生成）
2. **不要提交** `node_modules/`、`.vitepress/dist/`、`.vitepress/cache/` 目录
3. **不要直接修改** 构建产物文件
4. **大段内容翻译** 建议分多次提交，便于审查
5. **图片资源** 放在 `assets/` 目录下，引用路径以 `/` 开头，如 `/logo.png`、`/favicon_48px.ico`（Vite 配置 `publicDir: '../assets'`）

## SEO 规范

### SEO 组件

项目使用自定义 SEO 组件 [HeadSeo.vue](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/components/HeadSeo.vue) 注入元数据标签，在 [index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/theme/index.ts) 中通过 `Layout` 插槽全局注入。

### 配置规则

- **站点 URL**: `https://nailuo-knowledge-base.vercel.app`
- **默认语言**: `zh-CN`
- **页面类型**: 首页使用 `website`，其他页面使用 `article`

### 必须包含的 Meta 标签

1. **description**: 页面描述，优先使用 frontmatter 中的 `description` 字段
2. **keywords**: 关键词，优先使用 frontmatter 中的 `keywords` 字段
3. **og:title**: 格式为 `{页面标题} | NaiLuo 知识库`
4. **og:description**: 与 description 一致
5. **og:url**: 完整 URL，格式为 `{siteUrl}{route.path}`
6. **og:type**: 首页 `website`，其他 `article`
7. **og:image**: 使用 `/logo.png`，尺寸 600x600
8. **og:locale**: `zh-CN` 或 `en-US`
9. **twitter:card**: `summary_large_image`
10. **twitter:title**: 与 og:title 一致
11. **twitter:description**: 与 og:description 一致
12. **twitter:image**: 与 og:image 一致
13. **twitter:site**: `@NaiLuo`
14. **canonical**: 与 og:url 一致
15. **amphtml**: 非首页时添加，指向 `{url}?amp`

### 多语言 SEO

- 中文页面默认 SEO 数据（description、keywords）以中文为主
- 英文页面（路径以 `/en/` 开头）使用英文默认数据
- 所有 frontmatter 支持独立设置 `title`、`description`、`keywords`

### 页面 SEO Frontmatter 示例

```yaml
---
title: 页面标题
description: 页面描述内容（建议 150-160 字符）
keywords: 关键词1, 关键词2, 关键词3
---
```

### 注意事项

- 新增页面必须确保 frontmatter 包含 `title` 和 `description`
- 中英文页面的 `title` 和 `description` 需分别设置，保持语言一致性
- 首页的 `description` 和 `keywords` 应在 `config.mts` 的 `description` 配置中维护
- SEO 组件已全局注册，无需在每个页面单独引入

## Skill 规范

- **语言要求**: 创建或修改 skill 时，必须使用中文编写
- **命名规范**: skill 目录使用小写英文命名，主文件为 `SKILL.md`

### Skill 分类

项目中的 skill 分为以下两类：

#### 1. 知识库项目 Skill

存放位置：[.opencode/skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.opencode/skills) 目录（知识库项目内部）

| Skill 名称 | 说明 | 位置 |
|-----------|------|------|
| vitepress-dev-skill | VitePress 文档站点开发技能，包含站点配置、主题自定义、内容创作、搜索、部署等完整指南，使用 pnpm 作为包管理器 | [.opencode/skills/vitepress-dev-skill/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.opencode/skills/vitepress-dev-skill) |

#### 2. 全局通用 Skill

存放位置：[.opencode/skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills) 目录（Blog 项目根目录，跨应用共享）

| Skill 名称 | 说明 | 位置 |
|-----------|------|------|
| gsap-skills | GSAP 动画库技能集合，包含 core、timeline、scrolltrigger、react、plugins、frameworks、performance、utils 等子技能 | [.opencode/skills/gsap-skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills/gsap-skills) |
| performance-optimization | 应用性能优化技能，涵盖 Core Web Vitals 指标、测量方法、瓶颈识别、优化流程（测量→识别→修复→验证→守护）及常见反模式修复 | [.opencode/skills/performance-optimization/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills/performance-optimization) |
| impeccable | 高质量前端界面设计技能，规范颜色、排版、布局、动效等设计标准 | [.opencode/skills/impeccable/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills/impeccable) |
| taste-skill | 反模板化前端设计技能，避免 AI 生成的常见设计陷阱 | [.opencode/skills/taste-skill/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills/taste-skill) |
| code-review-skill | 代码审查技能，支持 React、Vue、Angular、Rust、TypeScript、Python、Java、Go、C# 等多种语言，涵盖架构审查、性能审查、安全审计、代码质量反模式和常见 Bug 检测 | [.opencode/skills/code-review-skill/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills/code-review-skill) |
