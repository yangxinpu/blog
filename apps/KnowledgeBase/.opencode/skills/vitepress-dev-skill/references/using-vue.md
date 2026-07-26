# 在 Markdown 中使用 Vue

每个 Markdown 文件编译为 Vue SFC，可使用 Vue 模板语法、组件、`<script>` 和 `<style>`。

> 所有 Vue 用法必须兼容 SSR。

## 插值语法

```md
{{ 1 + 1 }}
```

输出：`2`

## 指令

```html
<span v-for="i in 3">{{ i }}</span>
```

## `<script>` 和 `<style>`

根级 `<script>` 和 `<style>` 标签与 Vue SFC 一致，放在 frontmatter 之后：

```html
---
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## 内容

计数：{{ count }}

<button :class="$style.button" @click="count++">+1</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>
```

注意：
- 支持 `<script setup>`
- 支持 `<style module>`（推荐）
- **避免 `<style scoped>`**，会显著增加页面大小

## 使用组件

### 局部导入（推荐）

```md
<script setup>
import CustomComponent from '../../components/CustomComponent.vue'
</script>

# 文档

<CustomComponent />
```

组件名必须包含连字符或 PascalCase，否则被包裹在 `<p>` 中导致激活不匹配。

### 全局注册

在 `.vitepress/theme/index.ts` 中：

```ts
import DefaultTheme from 'vitepress/theme'
import CustomComponent from '../components/CustomComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomComponent', CustomComponent)
  }
}
```

### 在标题中使用组件

```md
# 使用 <Tag/> 的标题
```

被 `<code>` 包裹的不会渲染为组件。

## 访问页面数据

```html
<script setup>
import { useData } from 'vitepress'

const { page, frontmatter, theme, site } = useData()
</script>

<pre>{{ page }}</pre>
```

## 转义 Vue 语法

```md
This <span v-pre>{{ will be displayed as-is }}</span>
```

或用 v-pre 容器：

```md
::: v-pre
{{ This will be displayed as-is }}
:::
```

## 代码块中的 Vue

默认代码块被 `v-pre` 包裹。启用 Vue 解析需加 `-vue` 后缀：

````md
```js-vue
Hello {{ 1 + 1 }}
```
````

## CSS 预处理器

VitePress 内置支持 `.scss`、`.sass`、`.less`、`.styl`、`.stylus`，需安装对应预处理器：

```bash
pnpm add -D sass  # .scss/.sass
pnpm add -D less  # .less
pnpm add -D stylus # .styl/.stylus
```

## Teleport

SSG 仅支持传送到 body 的 Teleport。其他位置需包裹 `<ClientOnly>` 或使用 `postRender` 钩子：

```html
<ClientOnly>
  <Teleport to="#modal-slot">
    <div>Modal content</div>
  </Teleport>
</ClientOnly>
```

## `<ClientOnly>` 组件

SSR 不友好的组件用 `<ClientOnly>` 包裹：

```html
<ClientOnly>
  <NonSSRFriendlyComponent />
</ClientOnly>
```