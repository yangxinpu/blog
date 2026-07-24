# Assets 目录规则

## 用途

本目录作为 VitePress 的静态资源目录（`publicDir: 'assets'`），存放所有图片、图标、favicon 等静态资源。

## 文件说明

| 文件 | 用途 | 尺寸 |
|------|------|------|
| `favicon_32px.ico` | 小屏设备浏览器标签页图标 | 32×32 |
| `favicon_48px.ico` | 中等屏幕浏览器标签页图标 | 48×48 |
| `favicon_64px.ico` | 大屏/高分辨率浏览器标签页图标 + Apple Touch Icon | 64×64 |
| `logo.png` | 网站导航栏 Logo | - |

## 规则

1. **所有图片资源** 统一放置在本目录下
2. **引用路径** 以 `/` 开头（如 `/logo.png`、`/favicon_32px.ico`）
3. **favicon** 需提供 32px、48px、64px 三种尺寸，浏览器会根据屏幕大小自动切换
4. **不要使用** `docs/` 目录下的图片资源
5. 如需添加 robots.txt 等配置文件，也放在本目录下