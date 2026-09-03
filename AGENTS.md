# blog Monorepo - Agent 指南

> **文档版本**: v1.2.0
> **最后更新**: 2026-07-30

> 本文件仅记录「不看就会踩坑」的仓库专属事实。通用最佳实践不在此赘述。

## 版本管理规则

- 本文档使用语义化版本号（`主版本.次版本.修订号`）
- **每次迭代/修改本项目时，必须同步递增本文档的版本号**：
  - 新增功能或结构调整 → 递增 `次版本`（如 v1.1.0 → v1.2.0）
  - Bug 修复或文档校对 → 递增 `修订号`（如 v1.1.0 → v1.1.1）
  - 重大架构变更 → 递增 `主版本`（如 v1.1.0 → v2.0.0）
- 更新版本号时，同步更新上方的「最后更新」日期

## 仓库拓扑

pnpm monorepo，`pnpm-workspace.yaml` 仅包含 `apps/*`。三个独立应用，**技术栈各不同**：

| 应用 | 包名 | 框架 | 开发端口 | 部署路径 |
|------|------|------|----------|----------|
| [apps/blog](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog) | `blog` | React 19 + Vite 8 + TypeScript | 7070 | `/` |
| [apps/blog](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog) | `blog` | React 19 + Vite 8 + Tailwind CSS 4 | 5173 | `/` |
| [apps/knowledge-base](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base) | `knowledge-base` | VitePress 1.6 + Vue 3 + GSAP | 8080 | `/kb/`（生产） |

- 三个应用互不依赖，可独立开发/构建/部署
- blog 用 React/TSX/SCSS，blog 用 React/TSX/Tailwind，knowledge-base 用 Vue/VitePress/Markdown —— 不要混用范式
- knowledge-base 有自己的 [AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/AGENTS.md)，包含双语文档工作流、SEO 规范、主题样式等详细约束，**修改 knowledge-base 前必读**

## 包管理器

- **必须用 pnpm**，不要用 npm/yarn（CI 用 pnpm 9，Node 20）
- `.npmrc` 已限制 `only-built-dependencies` 仅允许 `esbuild` 和 `@parcel/watcher` 构建脚本
- `pnpm-workspace.yaml` 使用 `allowBuilds` 字段（新版 pnpm 语法）

## 常用命令（根目录）

```bash
pnpm install                # 安装全部依赖
pnpm dev                    # 同时启动所有应用
pnpm dev:blog               # 仅启动 blog（端口 7070）
pnpm dev:blog            # 仅启动 blog（端口 5173）
pnpm dev:kb                 # 仅启动 knowledge-base（端口 8080）
pnpm build                  # 构建全部
pnpm build:blog             # 仅构建 blog
pnpm build:blog          # 仅构建 blog
pnpm build:kb               # 仅构建 knowledge-base
pnpm lint                   # 对所有子包跑 lint
pnpm lint:root              # 对根目录跑 eslint
pnpm format                 # prettier 写入
pnpm format:check           # prettier 检查（CI 会跑）
```

### 单包操作

```bash
pnpm --filter blog run lint              # 仅 lint blog
pnpm --filter blog exec tsc --noEmit     # 仅 typecheck blog
pnpm --filter blog run lint           # 仅 lint blog
pnpm --filter blog exec tsc --noEmit  # 仅 typecheck blog
pnpm --filter knowledge-base run build   # 仅构建 knowledge-base
```

## CI 验证顺序

[ci.yml](file:///Users/NaiLuo/Documents/GithubProject/blog/.github/workflows/ci.yml) 在 `main`/`dev` 分支及 PR 上运行，顺序为 `lint -> typecheck -> build`（build 依赖前两者通过）。

**重要陷阱**：
- CI **只 lint blog**，不 lint knowledge-base（VitePress 无 eslint 配置）
- CI **只 typecheck blog**（`pnpm --filter blog exec tsc --noEmit`），knowledge-base 无独立 typecheck 步骤
- CI **同时构建应用**，且必须传入部署环境变量（见下）

提交前最小验证：

```bash
pnpm --filter blog run lint
pnpm --filter blog exec tsc --noEmit
pnpm --filter blog run build
pnpm --filter blog run lint
pnpm --filter blog exec tsc --noEmit
pnpm --filter blog run build
pnpm --filter knowledge-base run build
```

## 构建环境变量（部署时必传）

CI 和 Vercel 构建时必须为各应用分别传入 base URL，否则资源路径会错：

```bash
# blog
VITE_BASE_URL=/ pnpm --filter blog run build

# blog
VITE_BASE_URL=/ pnpm --filter blog run build

# knowledge-base
VITEPRESS_BASE=/kb/ VITEPRESS_BLOG_URL=/ pnpm --filter knowledge-base run build
```

## 部署拓扑

两条并行部署链路，由不同 workflow 触发：

1. **Vercel**（[vercel.yml](file:///Users/NaiLuo/Documents/GithubProject/blog/.github/workflows/vercel.yml)）
   - 两个应用是**独立的 Vercel 项目**，各自有 `VERCEL_PROJECT_ID_*` secret
   - PR 触发 preview，push 到 main 触发 production
   - 每个应用在自己的目录下执行 `vercel pull/build/deploy`
2. **GitHub Pages**（[deploy.yml](file:///Users/NaiLuo/Documents/GithubProject/blog/.github/workflows/deploy.yml)）
   - 仅 main 分支 push 触发
   - 合并产物：blog → `dist/`，knowledge-base → `dist/kb/`

## knowledge-base 专属约束

- **强制暗色模式**：`appearance: 'force-dark'`，不要写亮色样式
- **双语同步**：`docs/zh/` 与 `docs/en/` 目录结构、文件名、标题层级必须完全一致；文件名用中文
- **侧边栏配置**：新增文档后必须在 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.vitepress/config.mts) 的 `locales.zh` 和 `locales.en` 同步添加
- **根路径重定向**：`/` → `/zh/`（永久），通过 Vercel redirects + Vite 插件实现
- **prebuild 钩子**：[package.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/package.json) 的 `prebuild` 会自动跑 `generate:rss && generate:sitemap`（注意脚本里写的是 `npm run`，但通过 pnpm 调用仍生效）—— 修改 RSS/sitemap 脚本后构建会自动同步
- **静态资源路径**：`publicDir: '../assets'`，引用以 `/` 开头（如 `/logo.png`）
- **不要修改** `.vitepress/.temp/`、`.vitepress/dist/`、`.vitepress/cache/`（自动生成）

## blog 专属约束

- **TS 严格配置**：[tsconfig.base.json](file:///Users/NaiLuo/Documents/GithubProject/blog/tsconfig.base.json) 开启 `noUnusedLocals`、`noUnusedParameters`、`verbatimModuleSyntax`、`erasableSyntaxOnly` —— 删除所有未使用变量/导入
- **ESLint 未使用变量**：必须以 `_` 前缀命名（`argsIgnorePattern: '^_'`）
- **手动 vendor 分包**：[vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/vite.config.ts) 的 `manualChunks` 已配置 react-vendor / motion / i18n / lucide / vendor，新增大依赖时考虑是否需单独分包
- **ESLint 配置继承**：[apps/blog/eslint.config.js](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/eslint.config.js) 继承根 [eslint.config.base.js](file:///Users/nailuo/Documents/GithubProject/blog/eslint.config.base.js)，并叠加 react-hooks + react-refresh 规则

## blog 专属约束

- **Tailwind CSS v4**：通过 `@tailwindcss/vite` 插件集成，不要添加 postcss 配置
- **样式优先**：优先使用 Tailwind 原子类，复杂样式用 `.module.css`
- **ESLint 配置**：[eslint.config.js](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/eslint.config.js) 使用 ESLint 10 flat config，未继承根配置
- **独立约束**：详见 [apps/blog/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/AGENTS.md)

## Agent 工作规则

### Skill 规范

- **语言**：创建或修改 skill 时必须用**中文**编写
- **命名**：skill 目录用小写英文，主文件为 `SKILL.md`
- **YAML 头**：必须包含 `name, description, version, user-invocable, argument-hint, license, allowed-tools`
- **三目录同步**：新增/修改 skill 必须同步到 `.codex/skills/`、`.opencode/skills/`、`.trae/skills/` 三个目录

### Skill 分类

| 类别 | 存放位置 | 说明 |
|------|----------|------|
| 知识库项目 Skill | [apps/knowledge-base/.opencode/skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/.opencode/skills) | 仅作用于 knowledge-base 子项目 |
| 全局通用 Skill | [.opencode/skills/](file:///Users/NaiLuo/Documents/GithubProject/blog/.opencode/skills) | 跨应用共享，位于仓库根 |

现有全局 skill：`gsap-skills`、`performance-optimization`、`code-review-skill`（详见 [apps/knowledge-base/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/AGENTS.md) 的 Skill 规范章节）。

### 规则文件

- [apps/knowledge-base/assets/RULES.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/assets/RULES.md) —— 知识库内容规则
- [apps/knowledge-base/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/AGENTS.md) —— knowledge-base 专属 Agent 指南（v1.6.0）

## 版本管理

四份 AGENTS.md 均遵循顶部「版本管理规则」的语义化版本约定，修改后必须递增版本号并更新日期：

- 根 [AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/AGENTS.md)（本文件）
- [apps/blog/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/AGENTS.md)
- [apps/blog/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/AGENTS.md)
- [apps/knowledge-base/AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/knowledge-base/AGENTS.md)
