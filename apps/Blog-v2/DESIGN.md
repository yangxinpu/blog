---
version: "0.4.0"
name: NaiLuo Portfolio — Teal Dark
description: 极简主义深色开发者作品集，以青色为强调色，GSAP 驱动的克制微动效
colors:
  primary: "#19fac6"
  primary-100: "#d3fff3"
  primary-200: "#97fce4"
  primary-300: "#19fac6"
  primary-400: "#13d6aa"
  primary-500: "#0ea387"
  primary-600: "#0a6f5d"
  accent: "#19fac6"
  text: "#e0e0e0"
  text-secondary: "#b0b0b0"
  text-muted: "#808080"
  bg: "#1a1a1a"
  bg-secondary: "#2a2a2a"
  bg-tertiary: "#222222"
  border: "#404040"
  border-subtle: "#2e2e2e"
  shadow: "rgba(0, 0, 0, 0.3)"
typography:
  display:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline-lg:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-md:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-sm:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title-md:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body-lg:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'SF Mono', Monaco, 'Courier New', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "24px"
  full: "9999px"
components:
  primary-palette-reference:
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.text}"
  primary-hover:
    backgroundColor: "{colors.primary-200}"
    textColor: "{colors.bg}"
  primary-default:
    backgroundColor: "{colors.primary-300}"
    textColor: "{colors.bg}"
  primary-active:
    backgroundColor: "{colors.primary-400}"
    textColor: "{colors.bg}"
  primary-deep:
    backgroundColor: "{colors.primary-500}"
    textColor: "{colors.text}"
  primary-deepest:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.text}"
  text-secondary-usage:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-secondary}"
  muted-text-usage:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-muted}"
  bg-tertiary-usage:
    backgroundColor: "{colors.bg-tertiary}"
    textColor: "{colors.text}"
  border-token-usage:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text}"
  border-subtle-usage:
    backgroundColor: "{colors.border-subtle}"
    textColor: "{colors.text}"
  shadow-usage:
    backgroundColor: "{colors.shadow}"
    textColor: "{colors.text}"
  navbar:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    height: "64px"
  hero-section:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
  section:
    textColor: "{colors.text}"
    padding: "{spacing.2xl} {spacing.md}"
  section-secondary:
    backgroundColor: "{colors.bg-secondary}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm} {spacing.lg}"
  button-primary-hover:
    backgroundColor: "{colors.primary-200}"
    textColor: "{colors.bg}"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm} {spacing.lg}"
  button-tertiary:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  tag:
    backgroundColor: "{colors.bg-tertiary}"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  article-row:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    padding: "{spacing.lg} 0"
  project-card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.2xl}"
  social-icon:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    size: "32px"
  footer:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-secondary}"
---

## Overview

**NaiLuo Portfolio — Teal Dark** 是一个极简主义风格的开发者作品集设计系统。它追求克制、精确与留白，用最少的视觉元素传达最多的信息。

设计灵感来源于优秀开发者工具的界面美学——线性分隔、等宽字体的技术标签、精确到像素的间距，以及恰到好处的微动效。青色（`#19fac6`）作为唯一的品牌强调色，在深邃的炭黑背景上形成清晰的视觉锚点，用于引导用户注意力至核心交互与重要信息。

核心体验原则：
1. **内容优先**：文字是主角，装饰元素退居幕后
2. **层级清晰**：通过字号、字重、颜色三重维度建立信息架构
3. **动效克制**：GSAP 驱动的滚动入场动画以"淡入上浮"为基础形态，绝不干扰阅读
4. **可访问性**：全链路保证文字对比度满足 WCAG AA 标准

## Colors

### Primary Palette（青色主色系）

主色为一组 6 级的青绿色梯度，灵感源自科技产品的冷静与精确。`primary-300`（`#19fac6`）作为品牌核心色，在深色背景上提供恰到好处的强调效果。

- **primary-100 (`#d3fff3`)**: 最亮阶，用于 hover 状态、focus 环高亮
- **primary-200 (`#97fce4`)**: 次亮阶，用于文字链接 hover 态、图标高亮、按钮 hover 态
- **primary-300 / accent (`#19fac6`)**: 品牌主色，用于 CTA 按钮、链接、标签、数据强调
- **primary-400 (`#13d6aa`)**: 主色微深变体，用于按压态
- **primary-500 (`#0ea387`)**: 深阶，用于低饱和度的强调元素
- **primary-600 (`#0a6f5d`)**: 最深阶，用于活跃/选中状态下的补充指示

### Text Colors（文字色）

三级灰度文字系统，保证长文阅读舒适度的同时建立信息层级：

- **text (`#e0e0e0`)**: 主文字色，用于标题和正文核心内容，避免纯白刺眼
- **text-secondary (`#b0b0b0`)**: 次要文字，用于描述、摘要、辅助说明
- **text-muted (`#808080`)**: 弱化文字，用于时间戳、元数据、版权信息（对比度接近 AA 底线，仅用于非关键辅助信息）

### Backgrounds（背景色）

三级灰度背景建立页面纵深，而非依赖色彩对比：

- **bg (`#1a1a1a`)**: 页面主背景
- **bg-secondary (`#2a2a2a`)**: 交替区块背景，用于 create visual rhythm
- **bg-tertiary (`#222222`)**: 嵌套容器背景（标签、chip 等）

### Border Colors（边框色）

- **border (`#404040`)**: 标准边框，用于按钮、输入框等交互元素
- **border-subtle (`#2e2e2e`)**: 微弱边框，用于区块分隔线、卡片边缘

### Shadow

- **shadow (`rgba(0, 0, 0, 0.3)`)**: 标准阴影，用于按钮 focus 环等轻微 elevation

**Do's**：
- ✅ 主色 `accent` 仅用于交互驱动（CTA、链接、标签），不要大面积填充
- ✅ 使用 `text` 而非 `#ffffff` 作为正文颜色，避免长时间阅读刺眼
- ✅ 通过背景色分层（`bg` → `bg-secondary` → `bg-tertiary`）而非装饰性渐变建立层次

**Don'ts**：
- ❌ 禁止使用高饱和度纯色大面积覆盖背景
- ❌ 禁止硬编码 `rgba(0,0,0,...)` 替代 `shadow` token

## Typography

字体策略采用 **Geist** 作为显示字体，**SF Mono** 作为代码/标签字体，形成现代开发者工具的气质。

### Geist Family

- **Display**: 超大号展示字体，用于 Hero 区域主标题，48px 基准配合 `clamp(3rem, 10vw, 7.5rem)` 实现响应式缩放，`-0.04em` 字间距营造冲击感
- **Headline-lg / Headline-md**: 二级板块标题，40px / 36px 基准
- **Headline-sm**: 三级标题，28px 基准
- **Title-lg / Title-md**: 卡片内标题，20px / 18px 基准，字重 700，行高 1.15
- **Body-lg / Body-md**: 正文 16px，行高 1.7 保证阅读舒适度
- **Body-sm**: 小号正文 14px，用于密集信息

### SF Mono Family

- **Label**: 等宽字体，用于时间戳、阅读时长、技术标签等元信息，12px，`text-muted` 色

**响应式缩放说明**：Typography token 定义的是设计基准尺寸。实际实现时，通过 CSS `clamp()` 或媒体查询实现响应式缩放。例如 Display 字号使用 `font-size: clamp(3rem, 10vw, 7.5rem)`。

**层级体系**：`display > headline > title > body > label`，通过字号、字重、颜色三重区分，确保信息流向清晰。

**Do's**：
- ✅ 标题统一使用 Geist 并设置字重 700 与负字间距
- ✅ 技术元信息（日期、标签、时间）使用等宽字体 SF Mono

**Don'ts**：
- ❌ 禁止在正文段落中混合使用超过 2 种字重
- ❌ 禁止正文行高低于 1.6

## Layout

### 网格系统

- **容器最大宽度**：`max-w-6xl` (1152px)
- **网格列数**：12 列，桌面端 12 列网格用于主从布局
- **响应式断点**：`md:` (768px) 为移动/桌面分界点

### 间距系统

基于 4px 基础单位的间距刻度：

| Token | 值 | 典型用途 |
|:------|:--|:---------|
| xs | 4px | 图标与文字间距、紧凑 gap |
| sm | 8px | 组件内部小间距、标签间距 |
| md | 16px | 标准内边距、列表间距 |
| lg | 24px | 区块内边距、卡片间距 |
| xl | 32px | 大间距、section 内边距 |
| 2xl | 48px | section 垂直间距 |
| 3xl | 64px | 特大间距、Hero 区域底部留白 |

### 区块结构

每个主 section 遵循一致的垂直节奏：`py-16 md:py-24 px-5 md:px-8`（移动端 64px / 桌面端 96px 垂直内边距）。

## Elevation & Depth

本设计系统**不使用阴影**来传达层次。深度通过以下方式实现：

1. **背景色差**：相邻 section 使用 `bg` / `bg-secondary` 交替，营造微妙的节奏感
2. **细线分隔**：文章列表、section 边界使用 `border-subtle` （`#2e2e2e`）分隔线
3. **边框提示**：卡片、图片容器使用 `border-subtle` 边框定义形状边界
4. **视差背景**：首页 Canvas 粒子背景提供微弱的动态深度感，但不干扰前景内容

**Do's**：
- ✅ 通过背景色交替建立页面节奏
- ✅ 使用细线（`border-subtle`）而非粗边框分隔内容

**Don'ts**：
- ❌ 禁止添加 box-shadow 营造 elevation 效果（按钮 focus 环除外）
- ❌ 禁止在组件中使用 `backdrop-filter`（仅导航栏滚动态可破例使用）

## Shapes

形状语言追求**简洁克制**：

- **圆角阶梯**：`sm(4px)` → `md(8px)` → `lg(12px)` → `xl(16px)` → `2xl(24px)` → `full(9999px)`
- **按钮/标签**：一律使用 `full` （pill 形状），传递现代感
- **卡片/图片容器**：使用 `2xl` (24px) 圆角，保持柔和
- **输入框/按钮-tertiary**：使用 `sm` (4px) 圆角，传递专业感

**Do's**：
- ✅ 同一页面中保持圆角风格一致，不要混用 pill 与 sharp
- ✅ 图片容器统一使用 `2xl` 圆角

**Don'ts**：
- ❌ 禁止在同一上下文中混合超过 2 种圆角规格

## Components

### Navbar（导航栏）

- 粘性置顶（`fixed top-0`），z-index 50，高度 64px
- 初始透明背景；滚动后背景变为 `rgba(26, 26, 26, 0.85)` + `backdrop-filter: blur(12px)` + `1px solid {border}` 底部边框
- Logo 使用 `accent` 色 + Geist 字体字重 700
- 选中导航项下方 `2px` `accent` 色下划线（通过 inline style `background: var(--accent)` 实现）
- 移动端汉堡菜单展开时背景 `rgba(26, 26, 26, 0.98)` + 顶边框

### Hero Section（首屏）

- 占满视口高度（`min-h-[100dvh]`）
- 左侧：角色标签（accent 色）→ Display 标题 → 描述文字 → CTA 按钮组
- 右侧：图片容器，`aspect-ratio 4:3` → `4:5` 自适应，底部叠加黑色渐变遮罩（`linear-gradient(180deg, rgba(26,26,26,0) 40%, rgba(26,26,26,0.55) 100%)`）
- 背景：Canvas 粒子交互层（`ParticleBackground`），鼠标靠近粒子产生 bulging 效果
- 入场动画：GSAP timeline，标题逐字符上浮（`stagger: 0.05`），其他元素依次淡入

### Section（通用板块）

- 标题使用 `headline-lg/md` 或 `headline-sm`
- 入场动画：`fromTo { opacity: 0, y: 40px } → { opacity: 1, y: 0 }`，duration 0.7~0.8s，ease `power3.out`
- 通过 `ScrollTrigger` 在进入视口 70%~80% 时触发，`once: true`

### Button（按钮）

- **Primary**: `accent` 背景 + `bg` 文字色 + `full` 圆角 + hover `scale(1.03)` + 按压 `scale(0.98)`，可选 `boxShadow: 0 0 24px rgba(25, 250, 198, 0.25)` 发光
- **Secondary**: 透明背景 + `1px solid {accent}` 边框 + `accent` 文字色 + `full` 圆角
- **Tertiary**: `bg-secondary` 背景 + `1px solid {border}` 边框 + 标准文字色 + `sm` 圆角

### Tag / Chip（标签）

- `rgba(25, 250, 198, 0.12)` 背景 + `accent` 文字色 + `rgba(25, 250, 198, 0.25)` 边框（1px）
- 使用等宽字体 12px，`full` 圆角
- 说明：由于 tag 背景与文字色对比度接近 WCAG AA 底线，tag 文字仅用于短标签（如 `#React`、`#性能`），不承载长文本

### Article Row（文章行）

- 非卡片式编辑风格布局，用 `1px solid {border-subtle}` 顶部分隔线
- 左列（1/3 宽）：日期 + 阅读时长 + 标签（等宽字体）
- 右列（2/3 宽）：标题 + 描述 + "阅读全文"链接（accent 色 + ArrowUpRight 图标，hover 时图标偏移）

### Project Card（项目卡）

- `1px solid {border-subtle}` 边框 + `2xl` 圆角 + `overflow: hidden`
- 交替布局：左右图（双列网格，md:grid-cols-2）与全宽 feature 卡交替
- 图片 hover `scale(1.05)` 缓动 700ms
- 底部覆盖黑色渐变遮罩保证文字可读性

### About（关于）

- 左右 7:5 网格
- 左列：标题 + 两段描述 + 技术关注列表（`/` 符号作为列表标记，accent 色 0.7 透明度）
- 右列：统计数据网格，4 格 2×2，数据值使用 `headline-sm` + `accent` 色

### Footer（页脚）

- `bg` 背景 + 顶部 `1px solid {border-subtle}` 分隔线
- 三列布局：Logo + 导航链接 + 社交图标
- 社交图标：圆形按钮，`bg-secondary` 背景 + `border` 边框 + `accent` 图标色，hover `scale(1.1)`

## Do's and Don'ts

✅ **必须**严格复用 Design Token 中的颜色、间距、圆角值，禁止硬编码
✅ **必须**使用 GSAP 的 `useGSAP` hook + `scope` 限定动画作用域
✅ **必须**为所有动效添加 `prefers-reduced-motion` 降级
✅ **必须**保证 text-on-background 对比度满足 WCAG AA (4.5:1)，tag 和 footer 等特殊场景可例外但需审查
✅ **必须**在 `index.css` 的 `:root` 中维护所有 CSS 变量，组件通过 `var(--*)` 引用

❌ **禁止**使用玻璃拟态（backdrop-filter 仅用于导航栏滚动态）
❌ **禁止**使用霓虹发光效果或 3D 透视变换
❌ **禁止**在正文中使用纯白（`#ffffff`）或近纯白色
❌ **禁止**在同一页面混用超过 2 种字体
❌ **禁止**添加不必要的装饰性元素（渐变、阴影、纹理）
❌ **禁止**脱离 `:root` 变量系统直接在组件中硬编码颜色值

## Agent Implementation Constraints

当 Agent 生成或修改本项目的 UI 代码时，必须遵循以下约束：

1. **主题来源**：所有视觉决策以本文件（DESIGN.md）为唯一设计真源
2. **CSS 变量**：新增 token 必须先在 `src/index.css` 的 `:root` 中定义 `--*` 变量
3. **Tailwind 映射**：可通过 `@theme` 块将 CSS 变量映射到 Tailwind 原子类，但不得脱离 `--*` 变量直接硬编码色值
4. **动画引擎**：统一使用 GSAP + `@gsap/react` 的 `useGSAP` hook，禁止引入其他动画库
5. **无障碍**：所有交互元素必须有 `focus-visible` 样式，所有动效必须尊重 `prefers-reduced-motion`
6. **性能**：动画优先使用 `transform` / `opacity`，避免触发 layout
7. **响应式**：移动端默认单列，`md:` (768px) 以上启用多列布局
8. **字体加载**：Geist 字体通过 `@font-face` 在 `index.css` 中加载，fallback 到 system-ui
