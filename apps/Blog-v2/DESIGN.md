---
version: "1.5.0"
name: NaiLuo Portfolio — Lightfall
description: React Bits Lightfall 风格的流式光束背景，GSAP 驱动的 6 段滚动叙事动画
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
---

## Overview

**NaiLuo Portfolio — Teal Dark** 是一个极简主义风格的开发者作品集设计系统。它追求克制、精确与留白，用最少的视觉元素传达最多的信息。

设计灵感来源于优秀开发者工具的界面美学——线性分隔、等宽字体的技术标签、精确到像素的间距，以及恰到好处的微动效。青色（`#17FBC6`）作为唯一的品牌强调色，在深邃的炭黑背景上形成清晰的视觉锚点，用于引导用户注意力至核心交互与重要信息。

核心体验原则：
1. **内容优先**：文字是主角，装饰元素退居幕后
2. **层级清晰**：通过字号、字重、颜色三重维度建立信息架构
3. **动效克制**：GSAP 驱动的滚动入场动画以"淡入上浮"为基础形态，绝不干扰阅读
4. **可访问性**：全链路保证文字对比度满足 WCAG AA 标准

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
4. **视差背景**：首页 FerrofluidBackground WebGL 流体背景提供微弱的动态深度感，但不干扰前景内容

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
- Logo 使用 `assets/Images/logo.png` 图片 + `accent` 色 Geist 字体文字组合
- 仅包含"首页"导航项，通过 IntersectionObserver sentinel 检测滚动状态切换背景

### Hero Section（首屏）

- 占满视口高度（`min-h-[100dvh]`），内容居中布局
- 角色标签（accent 色）→ Display 标题 → 描述文字 → CTA 按钮（GitHub 链接）
- 背景：FerrofluidBackground WebGL 流体着色器（全屏 `fixed inset-0`），鼠标磁吸交互
- 文字背后叠加径向暗化遮罩保证可读性
- 入场动画：GSAP timeline，标题逐字符上浮（`stagger: 0.06`），其他元素依次淡入

### Section（通用板块）

- 标题使用 `headline-lg/md` 或 `headline-sm`
- 入场动画：`fromTo { opacity: 0, y: 40px } → { opacity: 1, y: 0 }`，duration 0.7~0.8s，ease `power3.out`
- 通过 `ScrollTrigger` 在进入视口 70%~80% 时触发，`once: true`

### Button（按钮）

使用 CSS 类 `.btn-primary` / `.btn-secondary`（定义于 `index.css`），统一 hover/active/focus 状态：

- **Primary** (`.btn-primary`): `accent` 背景 + `bg` 文字色 + `full` 圆角 + hover 变 `accent-hover` + `scale(1.03)` + 按压 `scale(0.98)`
- **Secondary** (`.btn-secondary`): 透明背景 + `1px solid {accent}` 边框 + `accent` 文字色 + `full` 圆角 + hover 加 `tag-bg` 背景 tint + 边框/文字变 `accent-hover`
- **Tertiary**: `bg-secondary` 背景 + `1px solid {border}` 边框 + 标准文字色 + `sm` 圆角

### Tag / Chip（标签）

- `rgba(23, 251, 198, 0.12)` 背景 + `accent` 文字色 + `rgba(23, 251, 198, 0.25)` 边框（1px）
- 使用等宽字体 12px，`full` 圆角
- 说明：由于 tag 背景与文字色对比度接近 WCAG AA 底线，tag 文字仅用于短标签（如 `#React`、`#性能`），不承载长文本

## Animation System

本节记录首页动画的设计思路与实现细节，作为后续滚动动画设计的参考基线。

### 设计原则

1. **克制至上**：每个元素只做一次入场动画，不重复、不循环（滚动指示器除外）
2. **级联递进**：元素按视觉重要性依次入场，通过负偏移（`-=N`）让前后动画重叠，消除等待死区
3. **衰减位移**：Y 偏移量随元素重要性递减（28→20→16→12→8px），营造"由远及近、逐渐安定"的物理感
4. **统一缓动**：入场动画统一使用 `power3.out`（快速启动、缓慢落定），循环动画使用 `sine.inOut`（自然往复）
5. **降级保障**：所有动画在 `prefers-reduced-motion: reduce` 下完全跳过，元素直接以最终状态呈现

### 首页入场时间线

使用 GSAP `timeline` 编排，`defaults: { ease: 'power3.out' }`，`scope` 限定在 section 容器内：

| 顺序 | 元素 | 起始状态 | 终止状态 | duration | 开始偏移 | 说明 |
|:----:|:-----|:---------|:---------|:--------:|:--------:|:-----|
| 1 | 标题字符 | `opacity: 0, y: 28` | `opacity: 1, y: 0` | 0.7s | 0 | 逐字符 `stagger: 0.06`，通过 `data-text` 拆分为 `<span>` |
| 2 | 角色标签 | `opacity: 0, y: 20` | `opacity: 1, y: 0` | 0.7s | `-=0.35` | 与标题最后 35% 重叠 |
| 3 | 描述文字 | `opacity: 0, y: 16` | `opacity: 1, y: 0` | 0.6s | `-=0.4` | 与角色标签最后 40% 重叠 |
| 4 | CTA 按钮 | `opacity: 0, y: 12` | `opacity: 1, y: 0` | 0.5s | `-=0.3` | 与描述文字最后 30% 重叠 |
| 5 | 滚动指示器 | `opacity: 0, y: -8` | `opacity: 1, y: 0` | 0.6s | `-=0.2` | 从上方落入（y 负值），与 CTA 最后 20% 重叠 |

**总时长**：约 2.5s（含重叠），无停顿。

### 标题逐字符动画

标题 "NaiLuo" 通过 `data-text` 属性拆分为独立 `<span>`，每个字符独立动画：

```
拆分前：<h1 data-text="NaiLuo">NaiLuo</h1>
拆分后：<h1 data-text="NaiLuo">
         <span style="display:inline-block;opacity:0">N</span>
         <span style="display:inline-block;opacity:0">a</span>
         ...
       </h1>
```

- `gsap.set(spans, { y: 28 })` 设置初始位移（在 DOM 操作后、动画前）
- `stagger: 0.06` 让 6 个字符依次延迟入场，总字符动画时长 = 6×0.06 + 0.7 = 1.06s
- `display: inline-block` 确保 `transform` 生效（`inline` 元素不支持 transform）

### 滚动指示器循环动画

独立于时间线，通过 `useEffect` + `gsap.to` 创建无限循环：

```
gsap.to(scrollRef, {
  y: 8,
  duration: 1.2,
  ease: 'sine.inOut',
  yoyo: true,    // 往返播放
  repeat: -1,    // 无限循环
})
```

- `yoyo: true` + `repeat: -1` 实现上下往复浮动
- `sine.inOut` 缓动模拟自然呼吸节奏
- 组件卸载时 `tween.kill()` 清理，防止内存泄漏

### 径向暗化遮罩

标题文字背后的静态视觉层（非动画），用于保证文字在 WebGL 流体背景上的可读性：

```
radial-gradient(
  ellipse 60% 50% at center,
  rgba(10, 10, 10, 0.55) 0%,
  rgba(10, 10, 10, 0.25) 45%,
  transparent 75%
)
```

- 中心最暗（55% 不透明度），向外渐变至透明
- 覆盖范围 60%×50%，仅作用于文字区域，不影响整体背景观感
- `pointer-events: none` 确保不拦截鼠标事件（流体背景的鼠标磁吸交互正常工作）

### 滚动动画设计参考（待实现）

后续新增 section 时，遵循以下模式：

1. **触发方式**：`ScrollTrigger` + `once: true`，进入视口 70%~80% 时触发
2. **基础形态**：`fromTo { opacity: 0, y: 40 } → { opacity: 1, y: 0 }`
3. **duration**：0.6~0.8s（标题 0.8s，内容 0.6~0.7s）
4. **stagger**：列表/网格类内容使用 `stagger: 0.08~0.12`
5. **scope**：必须用 `useGSAP` 的 `scope` 限定在 section 容器
6. **降级**：`prefers-reduced-motion: reduce` 时直接 `return`

```ts
gsap.fromTo(
  '.element-class',
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 70%',
      once: true,
    },
  }
)
```

## Lightfall Narrative（流式光束叙事）

> 整个页面的背景是**同一种流式光束（光雨）在连续向上运动中呈现不同形态**。参考 React Bits 的 Lightfall 效果，单一 WebGL 光束引擎驱动全屏，GSAP 时间线基于滚动进度动画 shader uniform，使光束在滚动过程中从静谧晨露 → 急流骤升 → 侧向风涌 → 凝固星芒 → 极光射流 → 星云升腾，六段连续向上演变。

### 参考视觉

- 参考来源：React Bits — [Lightfall](https://www.reactbits.dev/backgrounds/lightfall)
- 核心视觉：数十至上百根独立光束以不同长度/粗细/颜色从下方垂直上升，每根光束拥有「明亮尖锐的头部 + 柔和衰减的长尾」，随机闪烁（twinkle）与轻微水平摆动（sway），光标附近有发光和横向推挤效果。
- 落地实现：以 ogl + GLSL 单次全屏通道渲染，使用「3x3 网格邻域搜索」累加每格 1~2 根光束的贡献，避免边界截断。

### 核心架构

- **单一引擎**：`FluidBackground` 组件（基于 ogl + GLSL shader），全屏 `fixed inset-0`
- **连续变形**：GSAP `timeline` + `scrub: 0.85` 直接动画 shader 的 uniform 参数（speed, turbulence, scale, flow 等）
- **无缝过渡**：参数之间使用 `power2.inOut` 缓动，22% 滚动宽度的交叉区间确保无跳变
- **性能最优**：仅一个 WebGL 上下文、一次全屏着色器渲染（9 格 × 最多 2 根/格 = 18 根 per pixel 光束累加）

### 参数语义（流式光束版）

| 参数 | 语义（新） | 典型范围 |
|:-----|:---------|:---------|
| `speed` | 光束上升速度（整体时间倍率） | 0.1 (静) ~ 1.8 (急) |
| `scale` | 光束网格密度（越大 = 越稀疏越大尺度） | 1.3 (密雨) ~ 3.8 (星云) |
| `turbulence` | 光束水平摆动强度（simplex noise 驱动） | 0.1 (垂直) ~ 1.6 (极光) |
| `fluidity` | 光束尾迹拉长系数（拖尾柔和度） | 0.2 ~ 0.55 |
| `rimWidth` | 光束粗细（宽度倍率） | 0.15 (星芒) ~ 0.7 (星云) |
| `sharpness` | 光束头部锐度（1=大头圆钝，6=针尖星点） | 1.0 ~ 6.0 |
| `shimmer` | 光束 twinkle 闪烁强度 | 0.1 ~ 1.8 |
| `glow` | 整体发光倍率 | 0.5 ~ 1.0 |
| `flowX` | 水平漂移（侧风分量） | -1 ~ +1 |
| `flowY` | 垂直方向（正=上升）与倍率 | 0 ~ +1.3 |

### 六种运动形态

六种形态共享同一套 shader，变化的只是 uniform 参数值：

#### 形态 A：静谧晨露（Calm Dew）

滚动进度 0% ~ 20%，首屏默认状态。稀疏、缓慢的细丝光束从画面下方向上飘动，偶有轻微闪烁，如清晨叶脉露珠缓缓升腾。

```
参数预设：
  speed: 0.5        // 慢速上升
  scale: 2.5        // 稀疏，约 26 列
  turbulence: 0.15  // 近垂直（微摆）
  fluidity: 0.3     // 中等拖尾
  rimWidth: 0.2     // 细光束
  sharpness: 2.0    // 圆钝的亮头
  shimmer: 0.3      // 柔和微闪
  glow: 0.7         // 克制发光
  flow: (0, 1)      // 垂直上升
```

#### 形态 B：急流骤升（Turbulent Rise）

滚动进度 20% ~ 42%。光束密度陡增、速度加快、粗细参差并带轻微水平抖动，画面在一瞬间转为滂沱上升光流。

```
参数预设：
  speed: 1.8        // 快速上升（最高速）
  scale: 1.3        // 稠密，约 50 列
  turbulence: 0.8   // 中等摆动 = 上升气流抖动
  fluidity: 0.45    // 长拖尾 = 光流拉长
  rimWidth: 0.35    // 中等偏粗光束
  sharpness: 2.5    // 较亮但不尖锐的头部
  shimmer: 1.5      // 高闪烁 = 气流反光
  glow: 0.95        // 高亮上升流
  flow: (0.1, 1)    // 略向右的上升流
```

#### 形态 C：侧向风涌（Crosswind Surge）

滚动进度 42% ~ 65%。上升方向转为强烈对角线倾斜，光束加宽变柔和，像横风裹挟的光幕从下方涌升整个画面。

```
参数预设：
  speed: 0.9        // 中速
  scale: 2.0        // 中等密度 约 32 列
  turbulence: 0.4   // 中等摆动
  fluidity: 0.55    // 长拖尾（最长）
  rimWidth: 0.55    // 超宽光束 = 整片光幕
  sharpness: 1.5    // 圆钝大头
  shimmer: 0.5      // 中度闪烁
  glow: 0.6         // 柔和发光（大面积不刺眼）
  flow: (-0.8, 1)   // 右→左的倾斜上升
```

#### 形态 D：凝固星芒（Frozen Stardust）

滚动进度 65% ~ 83%。速度骤然降低，光束变稀疏、头部收束为极其锐利的针尖光点，闪烁极弱，像漫天星点被冻住缓慢升腾。

```
参数预设：
  speed: 0.1        // 近乎静止
  scale: 3.0        // 极稀疏 约 22 列
  turbulence: 0.1   // 完全垂直
  fluidity: 0.2     // 短拖尾，只留下针尖
  rimWidth: 0.15    // 极细光针
  sharpness: 6.0    // 极限锐利（pow head^4.5）
  shimmer: 0.15     // 极弱闪烁
  glow: 1.0         // 最大发光倍率，星点高光
  flow: (0, 0.3)    // 极缓慢、几乎静止的上升
```

#### 形态 E：极光射流（Aurora Jets）

滚动进度 83% ~ 91%。方向强化：光束从下方强力升起，大幅度水平摆动（极光幕布），闪烁强烈，像极光的彩色缎带向上翻涌。

```
参数预设：
  speed: 0.8        // 快速上升
  scale: 2.2        // 中密度 约 30 列
  turbulence: 1.6   // 最大摆动 = 极光波浪翻滚
  fluidity: 0.5     // 长拖尾
  rimWidth: 0.28    // 中等宽度光幕带
  sharpness: 3.2    // 锐利但有面积
  shimmer: 1.8      // 最大闪烁
  glow: 0.85        // 高亮发光
  flow: (0.7, 1.3)  // 向右上方上升
```

**叙事含义**：凝固不是终点，光会以极光的姿态继续向上生长。

#### 形态 F：星云升腾（Nebula Ascent）

滚动进度 91% ~ 100%。光束数量骤减、宽度极度放大，锐度降至最低，每根光束都成为柔和的气体云带，以几乎感知不到的速度缓慢倾斜升腾。叙事在此以「深呼吸」的节奏收束。

```
参数预设：
  speed: 0.15       // 近静止的缓慢漂移
  scale: 3.8        // 最稀疏，约 17 列，超宽光束
  turbulence: 0.2   // 极低摆动（气体云的自然晃动）
  fluidity: 0.35    // 中拖尾（云带衔接）
  rimWidth: 0.7     // 最宽（云带）
  sharpness: 1.0    // 完全柔化，无锐利边界
  shimmer: 0.2      // 极弱闪烁（远星）
  glow: 0.5         // 最弱发光（深空自发光）
  flow: (0.2, 0.3)  // 轻微右下倾斜缓升
```

**叙事含义**：所有的急流与极光，最终都化作深空中缓慢呼吸的升腾星云。

### 参数过渡时间线

```
scroll progress (0 → 1)
│
├── 0.00 ── A 静谧晨露 ████████░░░░░░░░░░░░░░░░░░░░░░░░░ (0%~20%)
│                          ↘ 20%~42% (22%) 过渡
│
├── 0.20 ── B 急流骤升 ░░░░████████████████████░░░░░░░░░░░ (20%~42%)
│                                             ↘ 42%~65% (23%) 过渡
│
├── 0.42 ── C 侧向风涌 ░░░░░░░░░░████████████████████░░░░ (42%~65%)
│                                                      ↘ 65%~83% (18%) 过渡
│
├── 0.65 ── D 凝固星芒 ░░░░░░░░░░░░░░░░░██████████████░░░ (65%~83%)
│                                                          ↘ 83%~91% (8%) 过渡
│
├── 0.83 ── E 极光射流 ░░░░░░░░░░░░░░░░░░░░░░░░░░████████░ (83%~91%)
│                                                                 ↘ 91%~100% (9%) 过渡
│
└── 0.91 ── F 星云升腾 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███ (91%~100%)
```

### 参数动画原理

GSAP timeline 的属性 tween 直接映射到 shader uniform：

```typescript
gsap.timeline({ scrollTrigger: { trigger: document.body, scrub: 0.85 } })
  .to(fluidRef, { // 20%~42%: A → B (快速上升)
    speed: 1.8, turbulence: 0.8, scale: 1.3,
    sharpness: 2.5, shimmer: 1.5, glow: 0.95, rimWidth: 0.35,
    fluidity: 0.45, flowX: 0.1, flowY: 1,
    duration: 0.22, ease: 'power2.inOut',
  }, 0.2)
  .to(fluidRef, { // 42%~65%: B → C (横风上升)
    speed: 0.9, turbulence: 0.4, scale: 2.0,
    sharpness: 1.5, shimmer: 0.5, glow: 0.6, rimWidth: 0.55,
    fluidity: 0.55, flowX: -0.8, flowY: 1,
    duration: 0.22, ease: 'power2.inOut',
  }, 0.42)
  .to(fluidRef, { // 65%~83%: C → D (凝固上升)
    speed: 0.1, turbulence: 0.1, scale: 3.0,
    sharpness: 6.0, shimmer: 0.15, glow: 1.0, rimWidth: 0.15,
    fluidity: 0.2, flowX: 0, flowY: 0.3,
    duration: 0.22, ease: 'power2.inOut',
  }, 0.65)
  .to(fluidRef, { // 83%~91%: D → E (极光射流 强化)
    speed: 0.8, turbulence: 1.6, scale: 2.2,
    sharpness: 3.2, shimmer: 1.8, glow: 0.85, rimWidth: 0.28,
    fluidity: 0.5, flowX: 0.7, flowY: 1.3,
    duration: 0.12, ease: 'power2.inOut',
  }, 0.83)
  .to(fluidRef, { // 91%~100%: E → F (星云升腾)
    speed: 0.15, turbulence: 0.2, scale: 3.8,
    sharpness: 1.0, shimmer: 0.2, glow: 0.5, rimWidth: 0.7,
    fluidity: 0.35, flowX: 0.2, flowY: 0.3,
    duration: 0.12, ease: 'power2.inOut',
  }, 0.91)
```

每帧 `requestAnimationFrame` 将 tween 目标值写入 `program.uniforms`。

### 共通规范

- **容器**：`fixed inset-0 z-0 overflow-hidden pointer-events-none`
- **颜色**：`primary-600 (#086550)` → `primary-300 (#17FBC6)` → `primary-200 (#8DFBDE)`（每根光束 hash 到三者之一）
- **背景色**：`#0a2a26`（深青绿，与主色系呼应）
- **光标交互**：附近光束被横向推挤 + 亮度加成（cursor warp + glow）
- **单一 WebGL 上下文**：全程仅创建一次 renderer、program、mesh
- **降级**：`prefers-reduced-motion: reduce` 时光标交互停用，直接以形态 A 速度的静态帧渲染
- **清理**：组件卸载时释放 WebGL 资源（loseContext + 从容器 remove canvas）

### 对比表

| 形态 | 运动特征 | 关键参数 | 视觉联想 |
|:-----|:---------|:---------|:---------|
| A 静谧晨露 | 细、慢、稳 | speed: 0.5, scale: 2.5 | 叶脉露珠升腾 |
| B 急流骤升 | 密、快、参差抖动 | speed: 1.8, scale: 1.3, shimmer: 1.5 | 滂沱上升光流 |
| C 侧向风涌 | 倾斜宽光幕 | flowX: -0.8, rimWidth: 0.55 | 横风裹携的上升光幕 |
| D 凝固星芒 | 静、锐、稀疏 | sharpness: 6.0, speed: 0.1 | 凝固的上升星点针芒 |
| E 极光射流 | 强上升 + 翻涌 | flowY: +1.3, turbulence: 1.6 | 北极光缎带上升 |
| F 星云升腾 | 大尺度、软、慢 | scale: 3.8, rimWidth: 0.7, sharpness: 1.0 | 深空气体云升腾 |

## Do's and Don'ts

✅ **必须**严格复用 Design Token 中的颜色、间距、圆角值，禁止硬编码
✅ **必须**使用 GSAP 的 `useGSAP` hook + `scope` 限定动画作用域
✅ **必须**为所有动效添加 `prefers-reduced-motion` 降级
✅ **必须**保证 text-on-background 对比度满足 WCAG AA (4.5:1)，tag 和 footer 等特殊场景可例外但需审查
✅ **必须**在 `index.css` 的 `:root` 中维护所有 CSS 变量，组件通过 `var(--*)` 引用

❌ **禁止**使用玻璃拟态（backdrop-filter 仅用于导航栏滚动态）
❌ **禁止**使用霓虹发光效果（3D 透视变换仅允许用于全局背景滚动动画层）
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
