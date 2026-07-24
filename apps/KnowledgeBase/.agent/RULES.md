# NaiLuo 知识库 - Agent 工作规则

## 核心原则

1. **双语同步**: 任何文档内容的新增、修改或删除，必须同时更新 `docs/zh/` 和 `docs/en/` 两个目录下的对应文件
2. **结构一致**: 中英文文档的目录结构、文件命名、标题层级必须完全一致
3. **质量优先**: 技术内容需准确、规范，代码示例需可运行
4. **遵循 VitePress 规范**: 所有 Markdown 扩展语法必须符合 VitePress 的支持范围

## 文档编写规则

### 文件与目录

- 文档统一放在 `docs/` 目录下，按语言分 `zh/` 和 `en/` 子目录
- 文件名使用中文，与侧边栏配置的 `link` 路径保持一致
- 目录结构需与侧边栏配置的 `sidebar` 层级对应
- 新增文档后，必须同步更新 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/config.mts) 中的侧边栏配置

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
3. 在 [config.mts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/config.mts) 的 `locales.root.themeConfig.sidebar` 和 `locales.en.themeConfig.sidebar` 中分别添加侧边栏配置
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

项目使用青色系品牌色，定义在 [style.css](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/theme/style.css)：

| 变量名 | 亮色模式 | 暗色模式 | 用途 |
|--------|----------|----------|------|
| `--vp-c-brand-1` | `#00d5c4` | `#19fac6` | 主品牌色 |
| `--vp-c-brand-2` | `#00b8a9` | `#00d5c4` | 次品牌色 |
| `--vp-c-brand-3` | `#009b8f` | `#00b8a9` | 第三品牌色 |
| `--vp-c-brand-soft` | `rgba(0, 213, 196, 0.14)` | `rgba(25, 250, 198, 0.14)` | 柔和背景色 |

### 自定义组件

- 组件放在 `.vitepress/theme/components/` 目录
- 使用 Vue 3 `<script setup lang="ts">` 语法
- 在 [index.ts](file:///Users/NaiLuo/Documents/GithubProject/blog/apps/KnowledgeBase/.vitepress/theme/index.ts) 的 `enhanceApp` 中全局注册
- 组件样式使用 `scoped` 避免污染全局

### 样式规范

- 优先使用 CSS 变量（`--vp-c-*`），确保主题切换正常
- 动画过渡使用 `ease` 缓动函数，时长 0.2-0.5s
- 支持暗色模式，需考虑两种模式下的样式表现
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
- [ ] 页面在亮色/暗色模式下均正常显示
- [ ] 页面在移动端正常显示
- [ ] 内部链接跳转正确
- [ ] 代码块语法高亮正确
- [ ] 构建无错误

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
5. **图片资源** 放在 `assets/` 目录下，引用路径以 `/` 开头（VitePress 配置 `publicDir: 'assets'`）