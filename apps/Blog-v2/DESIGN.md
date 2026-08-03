---
version: "2.0.0"
name: NaiLuo Portfolio — Teal Dark
description: 极简深色开发者作品集设计系统
colors:
  primary: "#17FBC6"
  primary-100: "#E6FFF8"
  primary-200: "#8DFBDE"
  primary-300: "#17FBC6"
  primary-400: "#0EB890"
  primary-500: "#0B8F70"
  primary-600: "#086550"
  accent: "#17FBC6"
  text: "#e0e0e0"
  text-secondary: "#b0b0b0"
  text-muted: "#808080"
  bg: "#0a2a26"
  bg-secondary: "#0d3530"
  bg-tertiary: "#0b2f2a"
  border: "#1a4a42"
  border-subtle: "#15352f"
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
---

## Overview

**NaiLuo Portfolio — Teal Dark** 是一个极简主义风格的开发者作品集设计系统。它追求克制、精确与留白，用最少的视觉元素传达最多的信息。

设计灵感来源于优秀开发者工具的界面美学——线性分隔、等宽字体的技术标签、精确到像素的间距。青色（`#17FBC6`）作为唯一的品牌强调色，在深邃的深青绿背景上形成清晰的视觉锚点，用于引导用户注意力至核心交互与重要信息。

核心体验原则：
1. **内容优先**：文字是主角，装饰元素退居幕后
2. **层级清晰**：通过字号、字重、颜色三重维度建立信息架构
3. **可访问性**：全链路保证文字对比度满足 WCAG AA 标准

## Colors

### Primary Palette（青绿主色系）

主色为一组 6 级的青绿色梯度，灵感源自科技产品的冷静与精确。`primary-300`（`#17FBC6`）作为品牌核心色，在深色背景上提供恰到好处的强调效果。

- **primary-100 (`#E6FFF8`)**: 最亮阶，用于 hover 状态、focus 环高亮
- **primary-200 (`#8DFBDE`)**: 次亮阶，用于文字链接 hover 态、图标高亮、按钮 hover 态
- **primary-300 / accent (`#17FBC6`)**: 品牌主色，用于 CTA 按钮、链接、标签、数据强调
- **primary-400 (`#0EB890`)**: 主色微深变体，用于按压态
- **primary-500 (`#0B8F70`)**: 深阶，用于低饱和度的强调元素
- **primary-600 (`#086550`)**: 最深阶，用于活跃/选中状态下的补充指示

### Text Colors（文字色）

三级灰度文字系统，保证长文阅读舒适度的同时建立信息层级：

- **text (`#e0e0e0`)**: 主文字色，用于标题和正文核心内容，避免纯白刺眼
- **text-secondary (`#b0b0b0`)**: 次要文字，用于描述、摘要、辅助说明
- **text-muted (`#808080`)**: 弱化文字，用于时间戳、元数据、版权信息（对比度接近 AA 底线，仅用于非关键辅助信息）

### Backgrounds（背景色）

三级灰黑背景建立页面纵深，通过微妙的灰度差异建立层次感：

- **bg (`#0a0a0a`)**: 页面主背景（最暗层，用于首页 Hero 区域）
- **bg-secondary (`#111111`)**: 交替区块背景，用于 create visual rhythm（中间层，用于知识库等区块）
- **bg-tertiary (`#0d0d0d`)**: 嵌套容器背景（卡片、标签容器等，介于主背景与交替背景之间）

### Border Colors（边框色）

- **border (`#2a2a2a`)**: 标准边框，用于按钮、输入框等交互元素
- **border-subtle (`#1a1a1a`)**: 微弱边框，用于区块分隔线、卡片边缘

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
2. **细线分隔**：文章列表、section 边界使用 `border-subtle` （`#15352f`）分隔线
3. **边框提示**：卡片、图片容器使用 `border-subtle` 边框定义形状边界

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
- 初始透明背景；滚动后背景变为 `rgba(10, 42, 38, 0.85)` + `1px solid {border}` 底部边框
- Logo 使用 `assets/Images/logo.png` 图片 + `accent` 色 Geist 字体文字组合
- 仅包含"首页"导航项

### Hero Section（首屏）

- 占满视口高度（`min-h-[100dvh]`），内容居中布局
- 角色标签（accent 色）→ Display 标题 → 描述文字 → CTA 按钮（GitHub 链接）

### Section（通用板块）

- 标题使用 `headline-lg/md` 或 `headline-sm`

### Button（按钮）

使用 CSS 类 `.btn-primary` / `.btn-secondary`（定义于 `index.css`），统一 hover/active/focus 状态：

- **Primary** (`.btn-primary`): `accent` 背景 + `bg` 文字色 + `full` 圆角 + hover 变 `accent-hover` + `scale(1.03)` + 按压 `scale(0.98)`
- **Secondary** (`.btn-secondary`): 透明背景 + `1px solid {accent}` 边框 + `accent` 文字色 + `full` 圆角 + hover 加 `tag-bg` 背景 tint + 边框/文字变 `accent-hover`
- **Tertiary**: `bg-secondary` 背景 + `1px solid {border}` 边框 + 标准文字色 + `sm` 圆角

### Tag / Chip（标签）

- `rgba(23, 251, 198, 0.12)` 背景 + `accent` 文字色 + `rgba(23, 251, 198, 0.25)` 边框（1px）
- 使用等宽字体 12px，`full` 圆角
- 说明：由于 tag 背景与文字色对比度接近 WCAG AA 底线，tag 文字仅用于短标签（如 `#React`、`#性能`），不承载长文本

## Do's and Don'ts

✅ **必须**严格复用 Design Token 中的颜色、间距、圆角值，禁止硬编码
✅ **必须**保证 text-on-background 对比度满足 WCAG AA (4.5:1)，tag 和 footer 等特殊场景可例外但需审查
✅ **必须**在 `index.css` 的 `:root` 中维护所有 CSS 变量，组件通过 `var(--*)` 引用

❌ **禁止**使用玻璃拟态（backdrop-filter 仅用于导航栏滚动态）
❌ **禁止**使用霓虹发光效果
❌ **禁止**在正文中使用纯白（`#ffffff`）或近纯白色
❌ **禁止**在同一页面混用超过 2 种字体
❌ **禁止**添加不必要的装饰性元素（渐变、阴影、纹理）
❌ **禁止**脱离 `:root` 变量系统直接在组件中硬编码颜色值

## Agent Implementation Constraints

当 Agent 生成或修改本项目的 UI 代码时，必须遵循以下约束：

1. **主题来源**：所有视觉决策以本文件（DESIGN.md）为唯一设计真源
2. **CSS 变量**：新增 token 必须先在 `src/index.css` 的 `:root` 中定义 `--*` 变量
3. **Tailwind 映射**：可通过 `@theme` 块将 CSS 变量映射到 Tailwind 原子类，但不得脱离 `--*` 变量直接硬编码色值
4. **无障碍**：所有交互元素必须有 `focus-visible` 样式
5. **响应式**：移动端默认单列，`md:` (768px) 以上启用多列布局
6. **字体加载**：Geist 字体通过 `@font-face` 在 `index.css` 中加载，fallback 到 system-ui
