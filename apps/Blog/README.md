# Blog

极简深色开发者作品集，基于 React 19 + TypeScript + Tailwind CSS v4 + Vite 8 构建。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI 框架 |
| TypeScript | 6.x | 类型系统 |
| Vite | 8.x | 构建工具 |
| Tailwind CSS | 4.x | 原子化 CSS |
| GSAP | 3.x | 动画引擎（含 `@gsap/react`） |
| ogl | 1.x | WebGL 着色器（背景光束动画） |
| i18next | 25.x | 国际化 |
| Lucide React | 0.577.x | 图标库 |

## 快速开始

```bash
# 安装依赖（需在 monorepo 根目录执行）
pnpm install

# 启动开发服务器（端口 5173）
pnpm --filter Blog run dev

# 构建生产版本
pnpm --filter Blog run build
```

## 项目结构

```
src/
├── components/     # 可复用组件
├── pages/          # 页面区块
├── libs/           # hooks / i18n / utils
├── assets/Images/  # 图片资源
├── App.tsx         # 应用入口组件
├── App.css         # App 级样式
├── index.css       # 全局样式 + Tailwind 引入
└── main.tsx        # 应用启动
```

## 设计规范

设计系统以 [DESIGN.md](./DESIGN.md) 为唯一设计真源，配色采用青绿色系（`#17FBC6`），遵循「极简深色开发者风」的视觉风格。

详细约束见 [AGENTS.md](./AGENTS.md)。

## 脚本

| 命令 | 说明 |
|------|------|
| `pnpm --filter Blog run dev` | 启动开发服务器 |
| `pnpm --filter Blog run build` | 构建生产版本 |
| `pnpm --filter Blog run lint` | 代码检查 |
| `pnpm --filter Blog exec tsc --noEmit` | 类型检查 |

## 构建环境变量

生产构建需传入 `VITE_BASE_URL`：

```bash
VITE_BASE_URL=/ pnpm --filter Blog run build
```
