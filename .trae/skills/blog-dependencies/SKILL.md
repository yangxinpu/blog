---
name: "blog-dependencies"
description: "提供博客项目中已安装的依赖包信息，确保 trae 能够使用这些库而不是自己实现。当用户需要实现功能时，优先使用项目中已安装的依赖包。"
---

# Blog Dependencies Skill

## 项目依赖包

### 生产依赖
- **react** ^19.2.4 - React 核心库
- **react-dom** ^19.2.4 - React DOM 渲染
- **i18next** ^25.10.3 - 国际化库
- **react-i18next** ^16.6.0 - React 国际化集成
- **motion** ^12.38.0 - Framer Motion 动画库
- **sass** ^1.98.0 - CSS 预处理器

### 开发依赖
- **@babel/core** ^7.29.0 - Babel 核心
- **@eslint/js** ^9.39.4 - ESLint 核心
- **@rolldown/plugin-babel** ^0.2.1 - Rolldown Babel 插件
- **@types/babel__core** ^7.20.5 - Babel 类型定义
- **@types/node** ^24.12.0 - Node.js 类型定义
- **@types/react** ^19.2.14 - React 类型定义
- **@types/react-dom** ^19.2.3 - React DOM 类型定义
- **@vitejs/plugin-react** ^6.0.1 - Vite React 插件
- **babel-plugin-react-compiler** ^1.0.0 - React 编译器插件
- **eslint** ^9.39.4 - ESLint 代码检查
- **eslint-plugin-react-hooks** ^7.0.1 - React Hooks ESLint 插件
- **eslint-plugin-react-refresh** ^0.5.2 - React 热更新 ESLint 插件
- **globals** ^17.4.0 - 全局变量定义
- **prettier** ^3.8.1 - 代码格式化
- **typescript** ~5.9.3 - TypeScript
- **typescript-eslint** ^8.57.0 - TypeScript ESLint 插件
- **vite** ^8.0.1 - 构建工具

## 使用指南

当用户需要实现功能时，请优先使用项目中已安装的依赖包，而不是自己实现。以下是主要库的使用场景：

1. **React 相关**：使用 react 和 react-dom 构建 UI 组件
2. **国际化**：使用 i18next 和 react-i18next 实现多语言支持
3. **动画**：使用 motion (Framer Motion) 实现流畅的动画效果
4. **样式**：使用 sass 编写模块化的 CSS
5. **开发工具**：使用 typescript 进行类型检查，eslint 进行代码质量检查，prettier 进行代码格式化，vite 进行构建

请根据用户的需求，选择合适的库来实现功能。