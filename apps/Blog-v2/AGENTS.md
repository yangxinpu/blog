# Blog-v2 应用 - Agent 指南

> **文档版本**: v1.8.0
> **最后更新**: 2026-08-01

> 本文件仅记录「不看就会踩坑」的应用专属事实。monorepo 层面的事实见根 [AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/AGENTS.md)。

## 项目定位

**Blog-v2 是 [apps/Blog](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog) 的重构项目**，核心目标：

- 用 **Tailwind CSS v4** 替代 SCSS Modules，提升样式开发效率
- 继承原项目的国际化等能力
- 优化代码结构和可维护性

## 版本管理规则

- 本文档使用语义化版本号（`主版本.次版本.修订号`）
- **每次迭代/修改本项目时，必须同步递增本文档的版本号**：
  - 新增功能或结构调整 → 递增 `次版本`（如 v1.1.0 → v1.2.0）
  - Bug 修复或文档校对 → 递增 `修订号`（如 v1.1.0 → v1.1.1）
  - 重大架构变更 → 递增 `主版本`（如 v1.1.0 → v2.0.0）
- 更新版本号时，同步更新上方的「最后更新」日期

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI 框架 |
| Vite | 8.x | 构建工具 |
| TypeScript | 6.x | 类型系统 |
| Tailwind CSS | 4.x | 原子化 CSS（通过 `@tailwindcss/vite` 插件集成） |
| GSAP | 3.x | 动画引擎 |
| Three.js | 0.183.x | 3D 渲染 |
| ogl | 1.x | WebGL 着色器（FerrofluidBackground 流体背景） |
| i18next | 25.x | 国际化 |
| Lucide React | 0.577.x | 图标库 |

## 关键依赖

| 依赖 | 正确导入 | 注意 |
|------|----------|------|
| `gsap` + `@gsap/react` | `import gsap from 'gsap'`、`import { useGSAP } from '@gsap/react'`、`import { ScrollTrigger } from 'gsap/ScrollTrigger'` | 所有动画基于 GSAP。`useGSAP` 自带 `gsap.context` 清理，必须用 `scope` 限定作用域 |
| `three` | `import * as THREE from 'three'` | 3D 场景渲染 |
| `ogl` | `import { Renderer, Program, Mesh, Triangle } from 'ogl'` | **清理陷阱**：`Renderer` 无 `destroy()`、`Mesh` 无 `remove()`。正确清理 = `geometry.remove()` + `program.remove()` + `gl.getExtension('WEBGL_lose_context')?.loseContext()` + 移除 canvas |
| `lucide-react` | 图标按需导入，如 `import { IconName } from 'lucide-react'` | |
| `i18next` + `react-i18next` | `import i18n from 'i18next'`、`import { useTranslation } from 'react-i18next'` | 见 i18n 章节 |
| `tailwindcss` | `@import "tailwindcss"` 在 CSS 中引入 | v4 通过 Vite 插件工作，无需 postcss |

## Tailwind CSS v4

- 通过 `@tailwindcss/vite` 集成到 [vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/vite.config.ts)
- **不需要** `tailwind.config.js` 或 `postcss.config.js`
- 主题定制在 CSS 中用 `@theme` 块：
  ```css
  @theme {
    --color-primary: #aa3bff;
  }
  ```
- 使用 Tailwind 类名直接在 JSX 中写样式，如 `className="flex items-center gap-4"`
- CSS 变量仍可在 `:root` 中定义，Tailwind 不排斥传统 CSS

## 目录约定

```
src/
├── components/     # 可复用组件（Navbar、FerrofluidBackground）
├── pages/          # 页面区块（当前仅 Home）
├── libs/           # hooks / i18n / utils
├── assets/Images/  # 图片资源
├── App.tsx         # 应用入口组件
├── App.css         # App 级样式
├── index.css       # 全局样式 + Tailwind 引入
└── main.tsx        # 应用启动
```

**当前页面结构**：仅包含首页（Home）和导航栏（Navbar）。About、TechStack、Projects、Blog、Contact、Footer 页面已移除。

## 样式约定

- 优先使用 Tailwind 原子类
- 需要复杂/可复用样式时，使用 CSS Modules（`.module.css`）
- 全局样式只写在 [index.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/src/index.css)
- 不要新增不必要的全局 `.css` 文件

## 主色系统（必须与 DESIGN.md 保持一致）

采用青色系，CSS 变量定义在 [index.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/src/index.css)：

```css
:root {
  /* 主色 */
  --primary-100: #d3fff3;
  --primary-200: #97fce4;
  --primary-300: #19fac6;
  --primary-400: #13d6aa;
  --primary-500: #0ea387;
  --primary-600: #0a6f5d;

  /* 语义色 */
  --text: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #808080;
  --bg: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-tertiary: #222222;
  --border: #404040;
  --border-subtle: #2e2e2e;
  --accent: #19fac6;
  --accent-hover: var(--primary-200);
  --shadow: rgba(0, 0, 0, 0.3);

  /* 字体 */
  --font-display: 'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Courier New', monospace;
}
```

**约束**：
- 主色 `--accent` 必须使用 `#19fac6`（青色），与 [DESIGN.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/DESIGN.md) 保持一致
- 不要更改色值，确保视觉风格统一
- Tailwind 中可通过 `@theme` 映射这些变量

## 设计系统（DESIGN.md）

本项目以 [DESIGN.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/DESIGN.md) 为**唯一设计真源**，采用 `@google/design.md` 规范格式。

### 核心理念

- **极简深色开发者风**：以青色 `#19fac6` 为唯一强调色，建立克制的视觉层次
- **GSAP 驱动动效**：所有入场动画基于 `useGSAP` + `ScrollTrigger`，遵循"淡入上浮"基础形态
- **不依赖阴影**：深度通过背景色差交替与细线分隔实现
- **3D/玻璃拟态禁止**：保持纯粹的 flat design 风格

### Agent 实现约束

修改 UI 代码时，必须遵循 [DESIGN.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/DESIGN.md) 中「Agent Implementation Constraints」章节：

1. **主题来源**：所有视觉决策以 DESIGN.md 为准，禁止硬编码未定义的色值
2. **CSS 变量**：新增 token 必须先在 `index.css` 的 `:root` 中定义，组件通过 `var(--*)` 引用
3. **动画引擎**：统一使用 GSAP + `@gsap/react` 的 `useGSAP` hook + `scope` 限定作用域
4. **无障碍**：所有动效必须尊重 `prefers-reduced-motion`，交互元素需有 `focus-visible`
5. **响应式**：移动端单列，`md:` (768px) 以上启用多列布局

### 验证命令

```bash
npx @google/design.md lint DESIGN.md    # 验证设计系统完整性
```

## 国际化（必须与原 Blog 保持一致）

使用 `i18next` + `react-i18next`，配置要求：

- **默认语言**：`zh-CN`
- **fallback 语言**：`zh-CN`
- **locale 文件位置**：`src/libs/i18n/locales/zh-CN.json` 和 `en-US.json`
- **初始化文件**：`src/libs/i18n/index.ts`

配置示例：
```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  // ...
});
```

**约束**：
- 两份 locale 文件的 key 必须完全一致
- 切换语言使用 `i18n.changeLanguage(lang)`，不要重新初始化实例
- 参考 [apps/Blog/src/libs/i18n/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog/src/libs/i18n/) 目录结构

## 环境变量

通过 `import.meta.env.VITE_*` 读取：

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `VITE_BASE_URL` | Vite `base`（部署路径前缀） | `/` |

## 构建与验证

```bash
pnpm --filter blog-v2 run lint              # ESLint
pnpm --filter blog-v2 exec tsc --noEmit     # 类型检查
pnpm --filter blog-v2 run build             # tsc -b && vite build
```

- `build` 脚本是 `tsc -b && vite build`
- 部署构建必须传 `VITE_BASE_URL=/`（见根 AGENTS.md「构建环境变量」）
- **无测试套件**：没有 test runner、没有测试文件

## 代码规范

- **TS 严格**：`noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` —— 未用变量/导入必须删除
- **ESLint 未用变量**：以 `_` 前缀命名（`argsIgnorePattern: '^_'`）
- **ESLint 配置**：[eslint.config.js](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/eslint.config.js) 使用 ESLint 10 flat config
- **vendor 分包**：[vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/Blog-v2/vite.config.ts) 后续可配置 `manualChunks`

## 开发服务器

```bash
pnpm --filter blog-v2 run dev    # 端口默认 5173
```