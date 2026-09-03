# 路由

## 基于文件的路由

```
.                  →  /index.html (可通过 / 访问)
prologue.md         →  /prologue.html
guide/
  index.md         →  /guide/index.html (可通过 /guide/ 访问)
  getting-started.md → /guide/getting-started.html
```

## 项目根目录与源目录

### 项目根目录
包含 `.vitepress/` 的目录，命令行指定：

```bash
vitepress dev docs     # docs/ 是项目根目录
```

### 源目录（srcDir）
Markdown 文件所在位置，默认同项目根目录：

```ts
export default defineConfig({
  srcDir: './src'  // 相对于项目根目录
})
```

## 链接页面

```md
<!-- 推荐 -->
[Getting Started](./getting-started)
[Getting Started](../guide/getting-started)

<!-- 不推荐 -->
[Getting Started](./getting-started.md)
[Getting Started](./getting-started.html)
```

### 链接到非 VitePress 页面

```md
[Link](/pure.html){target="_self"}
```

或使用原始 HTML：

```md
<a href="/pure.html" target="_self">Link</a>
```

## 生成简洁 URL

启用 `cleanUrls` 移除 `.html` 后缀：

```ts
export default defineConfig({
  cleanUrls: true
})
```

需要服务器支持（Netlify/GitHub Pages 默认支持，Vercel 需在 `vercel.json` 启用 `cleanUrls`）。

## 路由重写（rewrites）

自定义源文件到 URL 的映射，支持 `path-to-regexp` 语法：

```ts
// 精确映射
export default defineConfig({
  rewrites: {
    'packages/pkg-a/src/pkg-a-docs.md': 'pkg-a/index.md',
    'packages/pkg-b/src/pkg-b-docs.md': 'pkg-b/index.md'
  }
})

// 动态参数
export default defineConfig({
  rewrites: {
    'packages/:pkg/src/(.*)': ':pkg/index.md'
  }
})
```

启用重写后，**相对链接应基于重写后的路径**。

## 动态路由

使用 `[param]` 语法从单个模板生成多个页面。

### 文件结构

```
packages/
  [pkg].md          # 路由模板
  [pkg].paths.js    # 路径加载器（必须）
```

### 路径加载器

```js
// packages/[pkg].paths.js
export default {
  paths() {
    return [
      { params: { pkg: 'foo' }},
      { params: { pkg: 'bar' }}
    ]
  }
}
```

生成：`packages/foo.html`、`packages/bar.html`

### 多参数

```
packages/
  [pkg]-[version].md
  [pkg]-[version].paths.js
```

```js
export default {
  paths: () => [
    { params: { pkg: 'foo', version: '1.0.0' }},
    { params: { pkg: 'foo', version: '2.0.0' }}
  ]
}
```

### 动态生成路径

路径加载器在 Node.js 中运行（仅构建时），可从本地或远程获取数据：

```js
// 本地
import fs from 'node:fs'
export default {
  paths() {
    return fs.readdirSync('packages').map(pkg => ({
      params: { pkg }
    }))
  }
}

// 远程
export default {
  async paths() {
    const posts = await (await fetch('https://api.example.com/posts')).json()
    return posts.map(post => ({
      params: { id: post.id }
    }))
  }
}
```

### 访问页面参数

```md
- 包名：{{ $params.pkg }}
```

```vue
<script setup>
import { useData } from 'vitepress'
const { params } = useData()
console.log(params.value)
</script>
```

### 渲染原始内容

避免在 params 中传递大量数据，使用 `content` 属性：

```js
export default {
  async paths() {
    const posts = await (await fetch('https://api.example.com/posts')).json()
    return posts.map(post => ({
      params: { id: post.id },
      content: post.content  // 原始 Markdown 或 HTML
    }))
  }
}
```

在模板中使用：

```md
<!-- @content -->
```

## 重要规则

1. **内部链接省略扩展名**：`[link](./page)` 而非 `./page.md`，让 VitePress 处理最终 URL
2. **base 自动添加**：Markdown 链接中，`base` 会自动添加到 URL 前面
3. **重写后相对链接**：启用 `rewrites` 后，相对链接应基于**重写后的路径**
4. **cleanUrls 需要服务器支持**：
   - Netlify / GitHub Pages：默认支持
   - Vercel：需在 vercel.json 中启用 `cleanUrls`
5. **动态路由必须伴随 paths 加载器**：`[param].md` 必须有对应的 `[param].paths.js` 或 `.ts`
6. **content 属性传递大量数据**：避免在 params 中传递大量数据（如 Markdown/HTML 内容），使用 `content` 属性代替
7. **路径加载器仅在构建时运行**：路径加载器在 Node.js 中执行，仅构建时运行，可使用 Node API