---
name: "blog-project"
description: "提供博客项目的依赖信息和国际化配置，确保trae能够使用项目中已安装的库和国际化功能，避免每次对话后都执行build命令。"
---

# 博客项目技能

## 项目依赖

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

## 国际化配置

### 配置文件
- **src/libs/i18n/index.ts** - i18next 配置文件
- **src/libs/i18n/locales/zh-CN.json** - 中文翻译
- **src/libs/i18n/locales/en-US.json** - 英文翻译

### 使用方法
1. 在组件中导入 `useTranslation` hook：
   ```tsx
   import { useTranslation } from 'react-i18next';
   ```

2. 在组件中使用：
   ```tsx
   const { t, i18n } = useTranslation();
   
   // 翻译文本
   <h1>{t('welcome')}</h1>
   
   // 切换语言
   const changeLanguage = (lang: string) => {
     i18n.changeLanguage(lang);
   };
   ```

### 可用的翻译键
- **welcome** - 欢迎语
- **about** - 关于
- **posts** - 文章
- **contact** - 联系
- **theme.dark** - 深色模式
- **theme.light** - 浅色模式
- **footer.copyright** - 版权信息

## 开发服务器配置

### Vite 配置
Vite 已配置为自动打开浏览器并使用主机地址：

```typescript
// vite.config.ts
server: {
  open: true,  // 自动打开浏览器
  host: true   // 使用主机地址
}
```

### 开发命令
使用 `pnpm run dev` 启动开发服务器，而不是每次修改后都执行 `pnpm run build`。

## 样式配置

### SCSS 配置
项目使用 SCSS 和 CSS Module 进行样式管理：
- **src/global.scss** - 全局样式和主题变量
- **src/App.module.scss** - App 组件样式
- **src/pages/Home/Home.module.scss** - Home 页面样式

### SCSS 嵌套语法
在编写 SCSS 样式时，应尽量使用嵌套语法，使代码更加清晰和易于维护。例如：

```scss
// 推荐使用嵌套语法
.header {
  background-color: var(--bg);
  padding: 1rem 0;
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    
    a {
      color: var(--text);
      text-decoration: none;
      
      &:hover {
        color: var(--accent);
      }
    }
  }
}

// 不推荐的写法
.header {
  background-color: var(--bg);
  padding: 1rem 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.header .logo a {
  color: var(--text);
  text-decoration: none;
}

.header .logo a:hover {
  color: var(--accent);
}
```

### 主色调
项目使用以下主色调：
- **--primary-100**: #19fac6
- **--primary-200**: #00d5c4
- **--primary-300**: #00b0b7
- **--primary-400**: #008c9f
- **--primary-500**: #24697f
- **--primary-600**: #2f4858

### 黑白主题
项目支持黑白主题切换，配置如下：

1. **主题变量**：在 `src/global.scss` 中定义了浅色和深色主题的变量
2. **主题切换**：在 App 组件中实现了主题切换功能
3. **本地存储**：主题选择会保存在本地存储中，刷新页面后保持一致

#### 使用方法
```tsx
// 主题切换函数
const toggleTheme = () => {
  setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
};

// 主题状态
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme === 'dark' ? 'dark' : 'light');
});

// 主题应用
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);
```

## 注意事项
1. 优先使用项目中已安装的依赖包，而不是自己实现
2. 开发过程中使用 `pnpm run dev` 启动开发服务器，实时预览修改
3. 所有用户可见的文本都应该使用国际化功能，避免硬编码
4. 样式使用 SCSS 和 CSS Module，确保样式隔离
5. 注意使用黑白主题功能，确保所有组件在两种主题下都能正常显示
6. 新增样式时，要考虑两种主题的兼容性，使用主题变量而不是硬编码颜色
7. 确保所有注释和文档都使用中文，便于团队理解和维护
8. 注意使用全局变量，特别是主题相关的变量，确保样式的一致性
9. 在 `src/global.scss` 中定义的全局变量应该被优先使用，避免在组件样式中重复定义
