# CLI 参考

## `vitepress dev [root]`

启动开发服务器。

```bash
vitepress dev [root] [options]
```

| 选项 | 说明 |
|---|---|
| `--open` | 启动后打开浏览器 |
| `--port <port>` | 指定端口（默认 5173） |
| `--host <host>` | 绑定主机名 |
| `--strictPort` | 端口被占用时退出 |
| `--base <path>` | 覆盖 base |
| `--force` | 强制优化依赖 |

## `vitepress build [root]`

构建生产版本。

```bash
vitepress build [root] [options]
```

| 选项 | 说明 |
|---|---|
| `--outDir <dir>` | 输出目录 |
| `--assetsDir <dir>` | 静态资源子目录 |
| `--minify [swc|esbuild]` | 压缩器（默认 esbuild） |
| `--ssr` | 构建可被服务器渲染的版本 |
| `--force` | 强制优化依赖 |

## `vitepress preview [root]`

预览构建结果。

```bash
vitepress preview [root] [options]
```

| 选项 | 说明 |
|---|---|
| `--port <port>` | 指定端口（默认 4173） |
| `--host <host>` | 绑定主机名 |
| `--strictPort` | 端口被占用时退出 |
| `--base <path>` | 覆盖 base |

## `vitepress init [root]`

交互式初始化向导。