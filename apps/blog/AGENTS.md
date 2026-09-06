# blog 应用 - Agent 指南

> **文档版本**: v4.7.0
> **最后更新**: 2026-09-06

> 本文件仅记录「不看就会踩坑」的应用专属事实。monorepo 层面的事实见根 [AGENTS.md](file:///Users/NaiLuo/Documents/GithubProject/blog/AGENTS.md)。


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
| i18next | 25.x | 国际化 |
| Lucide React | 0.577.x | 图标库 |
| GSAP | 3.x | 动画库 |
| @react-three/fiber | 9.x | React Three.js 绑定 |
| @react-three/drei | 10.x | R3F 辅助组件 |
| Three.js | 0.183.x | 3D 渲染 |
| postprocessing | 6.x | 后处理效果 |
| ogl | 1.x | WebGL 工具库 |

## 关键依赖

| 依赖 | 正确导入 | 注意 |
|------|----------|------|
| `lucide-react` | 图标按需导入，如 `import { IconName } from 'lucide-react'` | |
| `i18next` + `react-i18next` | `import i18n from 'i18next'`、`import { useTranslation } from 'react-i18next'` | 见 i18n 章节 |
| `tailwindcss` | `@import "tailwindcss"` 在 CSS 中引入 | v4 通过 Vite 插件工作，无需 postcss |
| `@react-three/fiber` | `import { Canvas, useFrame, useThree } from '@react-three/fiber'` | React 19 兼容性需用类型断言 |
| `@react-three/drei` | `import { ... } from '@react-three/drei'` | 辅助组件库 |
| `three` | `import * as THREE from 'three'` | Three.js 核心 |
| `gsap` + `@gsap/react` | `import { gsap } from 'gsap'` | 动画库 |

## Tailwind CSS v4

- 通过 `@tailwindcss/vite` 集成到 [vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/vite.config.ts)
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
├── components/         # 可复用组件
│   ├── Antigravity/    # 3D 粒子背景动画（R3F + Three.js）
│   ├── CursorGrid/     # 鼠标追踪网格背景动画（Canvas）
│   ├── PixelBlast/     # 像素粒子背景动画（Canvas）
│   └── PixelTransition/ # 图片像素过渡动画（GSAP）
├── pages/              # 页面区块
│   ├── Home/           # 首页（Hero + PixelBlast 背景）
│   ├── KnowledgeIntro/ # 知识库介绍页（CursorGrid 背景）
│   ├── AboutSection/   # 自我介绍页（左右布局）
│   ├── QuoteSection/   # 名言页（Antigravity 3D 背景）
│   └── sprite-scroll/  # 雪碧饮料视差页（Canvas WebP 帧序列 + 滚动 scrub，数据见 variants.ts）
├── libs/               # hooks / i18n / utils
├── assets/Images/      # 图片资源
├── App.tsx             # 应用入口组件
├── App.css             # App 级样式
├── index.css           # 全局样式 + Tailwind 引入 + CSS 变量
├── r3f.d.ts            # React Three Fiber 类型声明
└── main.tsx            # 应用启动
```

**页面结构**（按 App.tsx 顺序）：
1. **Home** — 首页 Hero，使用 PixelBlast 粒子背景
2. **KnowledgeIntro** — 知识库介绍，使用 CursorGrid 网格背景
3. **AboutSection** — 自我介绍，左右布局（文字 + 图片像素过渡）
4. **QuoteSection** — 名言展示，使用 Antigravity 3D 粒子背景

## 样式约定

- 优先使用 Tailwind 原子类
- 需要复杂/可复用样式时，使用 CSS Modules（`.module.css`）或独立 `.css` 文件
- 全局样式只写在 [index.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/index.css)
- 页面级样式存放在对应页面目录下的 `.css` 文件
- 组件级样式存放在对应组件目录下的 `.css` 文件

## 主色系统（必须与 DESIGN.md 保持一致）

采用青色系，CSS 变量定义在 [index.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/index.css)：

```css
:root {
  /* 主色 */
  --primary-100: #E6FFF8;
  --primary-200: #8DFBDE;
  --primary-300: #17FBC6;
  --primary-400: #0EB890;
  --primary-500: #0B8F70;
  --primary-600: #086550;

  /* 语义色 */
  --text: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #808080;
  --bg: #111111;
  --bg-secondary: #111111;
  --bg-tertiary: #0d0d0d;
  --border: #2a2a2a;
  --border-subtle: #1a1a1a;
  --accent: #17FBC6;
  --accent-hover: var(--primary-200);
  --shadow: rgba(0, 0, 0, 0.3);

  /* Tag / Chip */
  --tag-bg: rgba(23, 251, 198, 0.12);
  --tag-bg-hover: rgba(23, 251, 198, 0.10);
  --tag-border: rgba(23, 251, 198, 0.25);
  --tag-border-hover: rgba(23, 251, 198, 0.22);

  /* 字体 */
  --font-display: 'Space Grotesk', 'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Courier New', monospace;

  /* 半透明背景（让 3D 背景微微透出） */
  --bg-translucent: rgba(26, 26, 26, 0.97);
  --bg-secondary-translucent: rgba(42, 42, 42, 0.97);
}
```

**约束**：

本项目以 [DESIGN.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/DESIGN.md) 为**唯一设计真源**，采用 `@google/design.md` 规范格式。

修改 UI 代码时，必须遵循 [DESIGN.md](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/DESIGN.md) 中「Agent Implementation Constraints」章节：


1. **主题来源**：所有视觉决策以 DESIGN.md 为准，禁止硬编码未定义的色值
2. **CSS 变量**：新增 token 必须先在 `index.css` 的 `:root` 中定义，组件通过 `var(--*)` 引用
3. **响应式**：移动端单列，`md:` (768px) 以上启用多列布局

### 验证命令

```bash
npx @google/design.md lint DESIGN.md    # 验证设计系统完整性
```

## 3D 动画组件

### Antigravity（3D 粒子背景）

- 位置：[src/components/Antigravity/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/components/Antigravity/)
- 技术栈：React Three Fiber + Three.js
- 功能：3D 粒子环形系统，鼠标交互产生"反重力"效果
- **React 19 兼容性**：需使用类型断言绕过 R3F JSX 类型检查
  ```tsx
  const R3F = {
    InstancedMesh: 'instancedMesh' as unknown as React.ElementType,
    // ...
  };
  ```
- 类型声明：[src/r3f.d.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/r3f.d.ts) 引入 R3F 类型

### CursorGrid（网格背景）

- 位置：[src/components/CursorGrid/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/components/CursorGrid/)
- 技术栈：Canvas 2D
- 功能：鼠标追踪网格线动画，边缘内部模糊效果

### PixelBlast（粒子背景）

- 位置：[src/components/PixelBlast/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/components/PixelBlast/)
- 技术栈：Canvas 2D
- 功能：像素粒子背景动画

### PixelTransition（图片过渡）

- 位置：[src/components/PixelTransition/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/components/PixelTransition/)
- 技术栈：GSAP
- 功能：图片像素块过渡动画，支持 hover 触发

## 设计系统（DESIGN.md）

### 核心理念

- **极简深色开发者风**：以青色 `#17FBC6` 为唯一强调色，建立克制的视觉层次
- **不依赖阴影**：深度通过背景色差交替与细线分隔实现
- **3D/玻璃拟态禁止**：保持纯粹的 flat design 风格

## 国际化

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
- 参考 [apps/blog/src/libs/i18n/](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/src/libs/i18n/) 目录结构

## 环境变量

通过 `import.meta.env.VITE_*` 读取：

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `VITE_BASE_URL` | Vite `base`（部署路径前缀） | `/` |

## 构建与验证

```bash
pnpm --filter blog run lint              # ESLint
pnpm --filter blog exec tsc --noEmit     # 类型检查
pnpm --filter blog run build             # tsc -b && vite build
```

- `build` 脚本是 `tsc -b && vite build`
- 部署构建必须传 `VITE_BASE_URL=/`（见根 AGENTS.md「构建环境变量」）
- **无测试套件**：没有 test runner、没有测试文件

## 代码规范

- **TS 严格**：`noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` —— 未用变量/导入必须删除
- **ESLint 未用变量**：以 `_` 前缀命名（`argsIgnorePattern: '^_'`）
- **ESLint 配置**：[eslint.config.js](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/eslint.config.js) 使用 ESLint 10 flat config
- **vendor 分包**：[vite.config.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/blog/vite.config.ts) 后续可配置 `manualChunks`
- **React 19 + R3F 类型兼容**：R3F JSX 元素需使用类型断言，参考 Antigravity 组件实现

## 开发服务器

```bash
pnpm --filter blog run dev    # 端口默认 7070
```
