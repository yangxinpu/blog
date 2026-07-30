# Blog 应用 - Agent 指南

> **文档版本**: v1.2.0
> **最后更新**: 2026-07-30

> 本文件仅记录「不看就会踩坑」的应用专属事实。monorepo 层面的事实见根 [AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/AGENTS.md)。

## 版本管理规则

- 本文档使用语义化版本号（`主版本.次版本.修订号`）
- **每次迭代/修改本项目时，必须同步递增本文档的版本号**：
  - 新增功能或结构调整 → 递增 `次版本`（如 v1.1.0 → v1.2.0）
  - Bug 修复或文档校对 → 递增 `修订号`（如 v1.1.0 → v1.1.1）
  - 重大架构变更 → 递增 `主版本`（如 v1.1.0 → v2.0.0）
- 更新版本号时，同步更新上方的「最后更新」日期

## 架构核心：单页滚动，无路由

**没有 react-router**。[App.tsx](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/App.tsx) → [MainContent.tsx](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/Layout/MainContent/MainContent.tsx) 把所有页面（Home / Motto / Thoughts / TextAnimation / AuroraRisePage / NeonSprintPage）**纵向堆叠**在同一个 `<main>` 里渲染。

- 站内导航靠 `scrollIntoView` 滚动到元素 ID，不是路由跳转
- 跳转到知识库用 `<a href>` 指向外站（`VITE_KB_BASE_URL`），不是 SPA 导航
- **不要引入 react-router**，除非用户明确要求改造为多页应用

## 关键依赖陷阱

| 依赖 | 正确导入 | 注意 |
|------|----------|------|
| `gsap`（v3）+ `@gsap/react`（v2） | `import gsap from 'gsap'`、`import { useGSAP } from '@gsap/react'`、`import { ScrollTrigger } from 'gsap/ScrollTrigger'` | 所有动画基于 GSAP。`useGSAP` 自带 `gsap.context` 清理，必须用 `scope` 限定作用域。需要滚动联动时手动 `gsap.registerPlugin(useGSAP, ScrollTrigger)` |
| `three` | `from 'three'` | 仅 [Motto/CanvasWaves.tsx](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/pages/Motto/CanvasWaves.tsx) 使用 |
| `lucide-react` | 图标按需导入 | |
| `i18next` + `react-i18next` | 见下 | |

## 加载屏机制（不要随便改）

[App.tsx](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/App.tsx) 有一个 **800ms 最小展示阈值**（`LOAD_THRESHOLD`）：

- Loading 展示直到 `window.load` 触发 **且** 距页面起始已过 800ms
- `MainContent` 用 `React.lazy` + `Suspense` 懒加载，Suspense fallback 也是 Loading
- 修改加载逻辑时务必同时考虑这两个条件，否则会出现 Loading 闪烁或卡死

## 主题系统

- **强制暗色模式**：`<html data-theme="dark">` 硬编码在 [index.html](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/index.html)，无主题切换功能
- CSS 变量直接定义在 [global.scss](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/global.scss) 的 `:root`（已是暗色值，不再有 `[data-theme='dark']` 覆盖块）
- 不要引入亮色样式或主题切换 UI

## i18n

[i18n/index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/libs/i18n/index.ts) 初始化，默认 `zh-CN`，fallback `zh-CN`。两份 locale 文件必须保持 key 一致：

- [zh-CN.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/libs/i18n/locales/zh-CN.json)
- [en-US.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/libs/i18n/locales/en-US.json)

切换语言调 `i18n.changeLanguage(lang)`，不要重新初始化实例。

## 目录约定

```
src/
├── Layout/        # Header / Footer / MainContent（页面组合，非路由）
├── pages/         # 全屏页面区块，每个独立目录
├── components/    # 可复用组件，barrel 导出（index.ts）
├── libs/          # hooks / i18n / utils
└── assets/Images/ # 图片在 TSX 中 import 引入
```

**组件目录模式**：每个组件/页面独占一个同名目录，含 `Name.tsx` + `Name.module.scss`。例：`pages/Home/Home.tsx` + `pages/Home/Home.module.scss`。

**样式约定**：
- 一律 CSS Modules + SCSS，`import styles from './X.module.scss'`
- 全局样式只写在 [global.scss](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/global.scss)
- 不要新增全局 `.css` 文件

**Barrel 导出**：[components/index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/components/index.ts) 和 [libs/utils/index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/libs/utils/index.ts) 已建立，新增可复用组件/工具时在此追加导出。

## 环境变量

通过 `import.meta.env.VITE_*` 读取：

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `VITE_BASE_URL` | Vite `base`（部署路径前缀） | `/` |
| `VITE_KB_BASE_URL` | 跳转知识库的基础 URL | 开发 `http://localhost:8080`，生产 `https://blog-knowledge-base.vercel.app` |
| `VITE_APP_NAME` | 应用名 | `NaiLuo-Blog` |

**知识库跳转路径用中文**：`${VITE_KB_BASE_URL}/zh/React/React基础`（知识库文件名是中文，见根 AGENTS.md）。

## 构建与验证

```bash
pnpm --filter blog run lint              # ESLint
pnpm --filter blog exec tsc --noEmit     # 类型检查（CI 用这个）
pnpm --filter blog run build             # tsc -b && vite build
```

- `build` 脚本是 `tsc -b && vite build`，`tsc -b` 走 project references（[tsconfig.app.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/tsconfig.app.json) + [tsconfig.node.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/tsconfig.node.json)）
- 部署构建必须传 `VITE_BASE_URL=/`（见根 AGENTS.md「构建环境变量」）
- **无测试套件**：没有 test runner、没有测试文件、CI 不跑测试 —— 不要臆造测试命令

## 代码规范

- **TS 严格**：继承根 [tsconfig.base.json](file:///Users/NaiLuo/Documents/GithubProject/blog/tsconfig.base.json)，`noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` + `erasableSyntaxOnly` —— 未用变量/导入必须删除
- **ESLint 未用变量**：以 `_` 前缀命名（`argsIgnorePattern: '^_'`）
- **Prettier**：单引号、2 空格、分号、`trailingComma: 'es5'`、`endOfLine: 'lf'`（见 [.prettierrc.json](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/.prettierrc.json)）
- **ESLint 继承链**：[eslint.config.js](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/eslint.config.js) → 根 [eslint.config.base.js](file:///Users/NaiLuo/Documents/GithubProject/blog/eslint.config.base.js) + react-hooks + react-refresh
- **vendor 分包**：[vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/vite.config.ts) 的 `manualChunks` 已分 react-vendor / gsap / i18n / lucide / vendor，新增大依赖时考虑是否单独分包

## 开发服务器

```bash
pnpm --filter blog run dev    # 端口 3000，host: true
```

知识库需另开（端口 8080），Blog 跨链接到 KB 时本地需同时启动两个应用。
