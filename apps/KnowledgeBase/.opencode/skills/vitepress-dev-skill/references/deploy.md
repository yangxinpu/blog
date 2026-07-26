# 构建与部署

## 本地构建与测试

```bash
# 构建
pnpm run docs:build

# 预览（默认 localhost:4173）
pnpm run docs:preview

# 自定义端口
pnpm run docs:preview -- --port 8080
```

## 设定 public 根目录

部署到子路径时必须设置 `base`：

```ts
export default defineConfig({
  base: '/repo/'  // 部署到 user.github.io/repo/
})
```

## HTTP 缓存

`assets/` 中的文件带哈希名，可设置长期缓存：

```
Cache-Control: max-age=31536000,immutable
```

Netlify `_headers`（放 `public/` 下）：

```
/assets/*
  cache-control: max-age=31536000
  cache-control: immutable
```

Vercel `vercel.json`：

```json
{
  "headers": [{
    "source": "/assets/(.*)",
    "headers": [{
      "key": "Cache-Control",
      "value": "max-age=31536000, immutable"
    }]
  }]
}
```

## 各平台部署

### Netlify / Vercel / Cloudflare Pages / AWS Amplify / Render

- **构建命令**：`pnpm run docs:build`
- **输出目录**：`docs/.vitepress/dist`
- **Node 版本**：22+

> 不要启用 HTML Auto Minify

### GitHub Pages

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: pnpm
      - uses: actions/configure-pages@v4
      - run: pnpm install
      - run: pnpm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### GitLab Pages

设置 `outDir: '../public'` 和 `base: '/<repo>/'`，创建 `.gitlab-ci.yml`：

```yaml
image: node:22
pages:
  cache:
    paths: [node_modules/]
  script:
    - pnpm install
    - pnpm run docs:build
  artifacts:
    paths: [public]
  only:
    - main
```

### Firebase

`firebase.json`：

```json
{
  "hosting": {
    "public": "docs/.vitepress/dist",
    "ignore": []
  }
}
```

```bash
pnpm run docs:build && firebase deploy
```

### Nginx

```nginx
server {
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  listen 80;
  server_name _;
  index index.html;
  location / {
    root /app;
    try_files $uri $uri.html $uri/ =404;
    error_page 404 /404.html;
    error_page 403 /404.html;
    location ~* ^/assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

> `try_files` 不要默认到 `index.html`，这会导致页面状态无效。

### Surge

```bash
pnpm run docs:build && pnpm exec surge docs/.vitepress/dist
```
