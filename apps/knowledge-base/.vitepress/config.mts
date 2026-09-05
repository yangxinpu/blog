import { defineConfig } from 'vitepress';

const base = process.env.VITEPRESS_BASE || '/';
const blogUrl = process.env.VITEPRESS_BLOG_URL || 'https://nailuo-blog.vercel.app';
const kbUrl = process.env.VITEPRESS_KB_URL || 'https://nailuo-knowledge-base.vercel.app';

export default defineConfig({
  title: 'NaiLuo 知识库',
  base,
  srcDir: 'docs',
  cleanUrls: true,
  appearance: 'force-dark',
  lastUpdated: true,

  scrollBehavior: {
    behavior: 'instant',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon_48px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon_32px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '48x48', href: '/favicon_48px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '64x64', href: '/favicon_64px.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '64x64', href: '/logo.png' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.simpleicons.org' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#0a0a0a' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml', title: 'NaiLuo 知识库 RSS' }],
    ['style', {}, `
      #inline-skeleton {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        background: #0a0a0a;
      }
      html.is-loading #inline-skeleton.sk-home-page {
        display: flex;
        flex-direction: column;
      }
      html.is-loading #inline-skeleton.sk-doc-page {
        display: flex;
        flex-direction: column;
      }
      .sk-nav {
        display: flex;
        align-items: center;
        height: 60px;
        padding: 0 24px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: #0f0f0f;
        gap: 32px;
      }
      .sk-nav-logo {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      .sk-nav-items {
        display: flex;
        gap: 24px;
      }
      .sk-nav-item {
        height: 16px;
        border-radius: 4px;
      }
      .sk-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .sk-sidebar {
        width: 240px;
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        border-right: 1px solid rgba(255,255,255,0.1);
        background: #0f0f0f;
        flex-shrink: 0;
      }
      .sk-sidebar-item {
        height: 14px;
        border-radius: 4px;
      }
      .sk-sidebar-group {
        height: 1px;
        margin: 8px 0;
        background: rgba(255,255,255,0.1);
      }
      .sk-content {
        flex: 1;
        padding: 48px 64px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 900px;
      }
      .sk-title {
        width: 60%;
        height: 36px;
        border-radius: 6px;
      }
      .sk-line {
        height: 14px;
        border-radius: 4px;
      }
      .sk-code {
        width: 100%;
        height: 120px;
        border-radius: 8px;
        margin: 8px 0;
      }
      .sk-heading {
        width: 40%;
        height: 28px;
        border-radius: 6px;
        margin-top: 16px;
      }
      .sk-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
      }
      .sk-list-item {
        height: 14px;
        border-radius: 4px;
      }
      .sk-home {
        flex: 1;
        overflow-y: auto;
        padding: 40px 24px 60px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .sk-hero {
        display: flex;
        gap: 48px;
        padding: 40px 0 32px;
        align-items: flex-start;
      }
      .sk-hero-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .sk-hero-name {
        width: 360px;
        height: 48px;
        border-radius: 10px;
      }
      .sk-hero-text {
        width: 320px;
        height: 32px;
        border-radius: 8px;
      }
      .sk-hero-tagline {
        width: 280px;
        height: 20px;
        border-radius: 4px;
      }
      .sk-hero-info {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .sk-stats {
        display: flex;
        gap: 32px;
      }
      .sk-stat {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .sk-stat-value {
        width: 56px;
        height: 28px;
        border-radius: 6px;
      }
      .sk-stat-label {
        width: 70px;
        height: 12px;
        border-radius: 4px;
      }
      .sk-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .sk-tag {
        width: 68px;
        height: 24px;
        border-radius: 6px;
      }
      .sk-hero-right {
        width: 380px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sk-hero-logo {
        width: 320px;
        height: 320px;
        border-radius: 16px;
      }
      .sk-features {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        padding: 16px 0;
      }
      .sk-feature {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 24px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        background: #0f0f0f;
      }
      .sk-feature-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      .sk-feature-title {
        width: 70%;
        height: 20px;
        border-radius: 4px;
      }
      .sk-feature-desc {
        width: 100%;
        height: 12px;
        border-radius: 4px;
      }
      .sk-shimmer {
        position: relative;
        overflow: hidden;
        background: linear-gradient(
          90deg,
          #0f0f0f 25%,
          rgba(255,255,255,0.08) 50%,
          #0f0f0f 75%
        );
        background-size: 200% 100%;
        animation: sk-shimmer 1.5s ease-in-out infinite;
      }
      @keyframes sk-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @media (max-width: 1024px) {
        .sk-sidebar { width: 200px; }
        .sk-content { padding: 32px 32px; }
        .sk-features { grid-template-columns: repeat(2, 1fr); }
        .sk-hero-right { width: 280px; }
        .sk-hero-logo { width: 240px; height: 240px; }
      }
      @media (max-width: 768px) {
        .sk-nav { padding: 0 16px; gap: 16px; }
        .sk-nav-items { gap: 12px; }
        .sk-body { flex-direction: column; }
        .sk-sidebar {
          width: 100%;
          height: 120px;
          flex-direction: row;
          flex-wrap: wrap;
          border-right: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .sk-content { padding: 24px 16px; }
        .sk-home { padding: 24px 16px 40px; }
        .sk-hero { flex-direction: column; gap: 24px; padding: 24px 0 16px; }
        .sk-hero-right { width: 100%; order: -1; }
        .sk-hero-logo { width: 160px; height: 160px; }
        .sk-hero-name { width: 260px; height: 36px; }
        .sk-hero-text { width: 220px; height: 24px; }
        .sk-hero-tagline { width: 180px; height: 16px; }
        .sk-stats { gap: 20px; }
        .sk-stat-value { width: 44px; height: 22px; }
        .sk-stat-label { width: 56px; }
        .sk-tag { width: 56px; height: 22px; }
        .sk-features { grid-template-columns: 1fr; gap: 16px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .sk-shimmer { animation: none; background: rgba(255,255,255,0.05); }
      }
    `],
    ['script', {}, `
      (function() {
        var path = window.location.pathname;
        var query = window.location.search;
        var hash = window.location.hash;
        if (path === '/' || path === '') {
          window.location.replace('/zh/' + query + hash);
          return;
        }

        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        document.documentElement.classList.add('is-loading');

        var isHome = path === '/zh/' || path === '/en/' || path === '/zh' || path === '/en';

        var homeEl = document.querySelector('#inline-skeleton.sk-home-page');
        var docEl = document.querySelector('#inline-skeleton.sk-doc-page');
        if (homeEl && docEl) {
          if (isHome) {
            homeEl.style.display = 'flex';
            docEl.parentNode.removeChild(docEl);
          } else {
            docEl.style.display = 'flex';
            homeEl.parentNode.removeChild(homeEl);
          }
        }

        var isProgScroll = false;
        var isLocked = true;

        function scrollToTop() {
          isProgScroll = true;
          window.scrollTo(0, 0);
          requestAnimationFrame(function() {
            isProgScroll = false;
          });
        }

        scrollToTop();

        var scrollHandler = function() {
          if (!isProgScroll && isLocked) {
            scrollToTop();
          }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });

        window.removeInlineSkeleton = function() {
          var el = document.getElementById('inline-skeleton');
          if (el) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.2s ease';
            setTimeout(function() {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            }, 200);
          }
        };

        var releaseLock = function() {
          isLocked = false;
          window.removeEventListener('scroll', scrollHandler);
          document.documentElement.classList.remove('is-loading');
          scrollToTop();
        };

        window.addEventListener('load', function() {
          setTimeout(releaseLock, 500);
        }, { once: true });

        setTimeout(releaseLock, 2000);
      })();
    `],
  ],

  vite: {
    server: {
      host: '0.0.0.0',
      port: 8080,
    },
    preview: {
      host: '0.0.0.0',
      port: 8081,
    },
    publicDir: '../assets',
    plugins: [
      {
        name: 'redirect-root-to-zh',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/' || req.url === '') {
              res.writeHead(302, { Location: '/zh/' });
              res.end();
              return;
            }
            next();
          });
        },
      },
      {
        name: 'inject-inline-skeleton',
        transformIndexHtml(html) {
          const homeSkeleton = `
            <div id="inline-skeleton" class="sk-home-page">
              <div class="sk-nav"><div class="sk-nav-logo sk-shimmer"></div><div class="sk-nav-items">
              <div class="sk-nav-item sk-shimmer" style="width:60px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:70px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:55px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:65px"></div>
              </div></div>
              <div class="sk-home"><div class="sk-hero">
              <div class="sk-hero-left">
              <div class="sk-hero-name sk-shimmer"></div>
              <div class="sk-hero-text sk-shimmer"></div>
              <div class="sk-hero-tagline sk-shimmer"></div>
              <div class="sk-hero-info"><div class="sk-stats">
              <div class="sk-stat"><div class="sk-stat-value sk-shimmer"></div><div class="sk-stat-label sk-shimmer"></div></div>
              <div class="sk-stat"><div class="sk-stat-value sk-shimmer"></div><div class="sk-stat-label sk-shimmer"></div></div>
              <div class="sk-stat"><div class="sk-stat-value sk-shimmer"></div><div class="sk-stat-label sk-shimmer"></div></div>
              </div><div class="sk-tags">
              ${Array.from({ length: 17 }, () => '<div class="sk-tag sk-shimmer"></div>').join('')}
              </div></div></div>
              <div class="sk-hero-right"><div class="sk-hero-logo sk-shimmer"></div></div>
              </div>
              <div class="sk-features">
              ${Array.from({ length: 8 }, () => '<div class="sk-feature"><div class="sk-feature-icon sk-shimmer"></div><div class="sk-feature-title sk-shimmer"></div><div class="sk-feature-desc sk-shimmer"></div><div class="sk-feature-desc sk-shimmer" style="width:70%"></div></div>').join('')}
              </div></div>
            </div>
          `;

          const docSkeleton = `
            <div id="inline-skeleton" class="sk-doc-page">
              <div class="sk-nav"><div class="sk-nav-logo sk-shimmer"></div><div class="sk-nav-items">
              <div class="sk-nav-item sk-shimmer" style="width:60px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:70px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:55px"></div>
              <div class="sk-nav-item sk-shimmer" style="width:65px"></div>
              </div></div>
              <div class="sk-body">
              <div class="sk-sidebar">
              <div class="sk-sidebar-item sk-shimmer" style="width:85%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:70%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:75%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:60%"></div>
              <div class="sk-sidebar-group"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:80%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:65%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:72%"></div>
              <div class="sk-sidebar-item sk-shimmer" style="width:55%"></div>
              </div>
              <div class="sk-content">
              <div class="sk-title sk-shimmer"></div>
              <div class="sk-line sk-shimmer" style="width:100%"></div>
              <div class="sk-line sk-shimmer" style="width:92%"></div>
              <div class="sk-line sk-shimmer" style="width:88%"></div>
              <div class="sk-code sk-shimmer"></div>
              <div class="sk-line sk-shimmer" style="width:95%"></div>
              <div class="sk-line sk-shimmer" style="width:85%"></div>
              <div class="sk-line sk-shimmer" style="width:78%"></div>
              <div class="sk-heading sk-shimmer"></div>
              <div class="sk-line sk-shimmer" style="width:100%"></div>
              <div class="sk-line sk-shimmer" style="width:90%"></div>
              <div class="sk-line sk-shimmer" style="width:82%"></div>
              <div class="sk-list">
              <div class="sk-list-item sk-shimmer" style="width:88%"></div>
              <div class="sk-list-item sk-shimmer" style="width:76%"></div>
              <div class="sk-list-item sk-shimmer" style="width:84%"></div>
              </div>
              </div></div></div>
            </div>
          `;

          return html.replace('</body>', homeSkeleton + docSkeleton + '\n</body>');
        },
      },
    ],
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config: (md) => {
      md.options.html = true;
    },
  },

  locales: {
    'zh': {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'NaiLuo 知识库',
      description: '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '前端', link: '/zh/前端/', activeMatch: '^/zh/前端' },
          { text: '后端', link: '/zh/后端/', activeMatch: '^/zh/后端' },
          { text: '测试', link: '/zh/测试/', activeMatch: '^/zh/测试' },
          { text: '运维', link: '/zh/运维/', activeMatch: '^/zh/运维' },
          { text: 'AI', link: '/zh/AI/', activeMatch: '^/zh/AI' },
          { text: '产品', link: '/zh/产品/', activeMatch: '^/zh/产品' },
          { text: 'Python', link: '/zh/Python/', activeMatch: '^/zh/Python' },
          { text: '其他', link: '/zh/其他/', activeMatch: '^/zh/其他' },
          { text: '博客', link: blogUrl },
        ],
        sidebar: {
          '/zh/前端/': [
            {
              text: 'JavaScript',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg',
              collapsed: true,
              items: [
                { text: 'JS 基础', link: '/zh/前端/JavaScript/JS基础' },
                { text: 'JS 提高', link: '/zh/前端/JavaScript/JS提高' },
                { text: 'BOM', link: '/zh/前端/JavaScript/BOM' },
                { text: 'DOM', link: '/zh/前端/JavaScript/DOM' },
                { text: 'DOM 事件', link: '/zh/前端/JavaScript/DOM事件' },
                { text: '内置对象', link: '/zh/前端/JavaScript/内置对象' },
                {
                  text: '函数&面向对象',
                  link: '/zh/前端/JavaScript/函数&面向对象',
                },
                { text: '前后端通信', link: '/zh/前端/JavaScript/前后端通信' },
                { text: 'Web API', link: '/zh/前端/JavaScript/Web  API' },
              ],
            },
            {
              text: 'React',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/react.svg',
              collapsed: true,
              items: [
                { text: 'React 基础', link: '/zh/前端/React/React基础' },
                { text: 'React 提高', link: '/zh/前端/React/React提高' },
                { text: 'React 原理', link: '/zh/前端/React/React原理' },
              ],
            },
            {
              text: 'Vue',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vuedotjs.svg',
              collapsed: true,
              items: [
                { text: 'Vue 基础', link: '/zh/前端/Vue/Vue基础' },
                { text: 'Vue3 基础', link: '/zh/前端/Vue/Vue3基础' },
                { text: 'Vue3 提高', link: '/zh/前端/Vue/Vue3提高' },
              ],
            },
            {
              text: 'Vite',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vite.svg',
              collapsed: true,
              items: [
                { text: 'Vite 基础', link: '/zh/前端/Vite/Vite基础' },
                { text: 'Vite 进阶', link: '/zh/前端/Vite/Vite进阶' },
              ],
            },
            {
              text: 'Webpack',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/webpack.svg',
              collapsed: true,
              items: [
                { text: 'Webpack 基础', link: '/zh/前端/Webpack/Webpack基础' },
                { text: 'Webpack 进阶', link: '/zh/前端/Webpack/Webpack进阶' },
              ],
            },
            {
              text: '性能优化',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/speedtest.svg',
              collapsed: true,
              items: [
                { text: '前端性能', link: '/zh/前端/性能优化/前端性能' },
                { text: '打包优化', link: '/zh/前端/性能优化/打包优化' },
              ],
            },
          ],
          '/zh/后端/': [
            {
              text: 'Node.js',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nodedotjs.svg',
              collapsed: true,
              items: [
                { text: 'Node 基础', link: '/zh/后端/Node/Node基础' },
                { text: 'Express', link: '/zh/后端/Node/Express' },
                { text: 'Koa', link: '/zh/后端/Node/Koa' },
              ],
            },
            {
              text: '数据库',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/database.svg',
              collapsed: true,
              items: [
                { text: 'MySQL', link: '/zh/后端/数据库/MySQL' },
                { text: 'MongoDB', link: '/zh/后端/数据库/MongoDB' },
                { text: 'Redis', link: '/zh/后端/数据库/Redis' },
              ],
            },
            {
              text: 'Bun',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/bun.svg',
              collapsed: true,
              items: [
                { text: 'Bun 基础', link: '/zh/后端/Bun/Bun基础' },
              ],
            },
          ],
          '/zh/测试/': [
            {
              text: '测试',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vitest.svg',
              collapsed: true,
              items: [
                { text: '单元测试', link: '/zh/测试/单元测试' },
                { text: '集成测试', link: '/zh/测试/集成测试' },
                { text: '端到端测试', link: '/zh/测试/端到端测试' },
                { text: '性能测试', link: '/zh/测试/性能测试' },
              ],
            },
          ],
          '/zh/运维/': [
            {
              text: 'Docker',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',
              collapsed: true,
              items: [
                { text: 'Docker 基础', link: '/zh/运维/Docker/Docker基础' },
                { text: 'Docker Compose', link: '/zh/运维/Docker/DockerCompose' },
              ],
            },
            {
              text: 'Linux',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linux.svg',
              collapsed: true,
              items: [
                { text: 'Linux 基础', link: '/zh/运维/Linux/Linux基础' },
                { text: 'Shell 脚本', link: '/zh/运维/Linux/Shell脚本' },
              ],
            },
            {
              text: 'Nginx',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nginx.svg',
              collapsed: true,
              items: [
                { text: 'Nginx 基础', link: '/zh/运维/Nginx/Nginx基础' },
                { text: 'Nginx 配置', link: '/zh/运维/Nginx/Nginx配置' },
              ],
            },
            {
              text: '服务器工具',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/terminal.svg',
              collapsed: true,
              items: [
                { text: 'Git Hooks', link: '/zh/运维/服务器工具/GitHooks' },
                { text: 'CI/CD', link: '/zh/运维/服务器工具/CICD' },
              ],
            },
          ],
          '/zh/AI/': [
            {
              text: 'Harness工程',
              collapsed: true,
              items: [
                { text: 'Harness 基础', link: '/zh/AI/Harness工程/Harness基础' },
              ],
            },
            {
              text: '上下文工程',
              collapsed: true,
              items: [
                { text: 'Prompt 工程', link: '/zh/AI/上下文工程/Prompt工程' },
              ],
            },
            {
              text: 'MCP',
              collapsed: true,
              items: [
                { text: 'MCP 基础', link: '/zh/AI/MCP/MCP基础' },
              ],
            },
            {
              text: 'RAG',
              collapsed: true,
              items: [
                { text: 'RAG 基础', link: '/zh/AI/RAG/RAG基础' },
              ],
            },
            {
              text: '大模型',
              collapsed: true,
              items: [
                { text: 'LLM 基础', link: '/zh/AI/大模型/LLM基础' },
              ],
            },
            {
              text: 'Ollama',
              collapsed: true,
              items: [
                { text: 'Ollama 基础', link: '/zh/AI/Ollama/Ollama基础' },
              ],
            },
            {
              text: 'Opencode',
              collapsed: true,
              items: [
                { text: 'Opencode 基础', link: '/zh/AI/Opencode/Opencode基础' },
              ],
            },
          ],
          '/zh/产品/': [
            {
              text: '产品',
              collapsed: true,
              items: [
                { text: '产品设计', link: '/zh/产品/产品设计' },
                { text: '产品方法论', link: '/zh/产品/产品方法论' },
              ],
            },
          ],
          '/zh/Python/': [
            {
              text: 'Python',
              collapsed: true,
              items: [
                { text: 'Python 基础', link: '/zh/Python/Python基础' },
                { text: 'Python 进阶', link: '/zh/Python/Python进阶' },
                { text: 'Python 框架', link: '/zh/Python/Python框架' },
              ],
            },
          ],
          '/zh/其他/': [
            {
              text: '计算机网络',
              collapsed: true,
              items: [
                { text: '计算机网络', link: '/zh/其他/计算机网络/' },
              ],
            },
            {
              text: 'Git',
              collapsed: true,
              items: [
                { text: 'Git', link: '/zh/其他/Git/' },
              ],
            },
            {
              text: '算法',
              collapsed: true,
              items: [
                { text: '算法', link: '/zh/其他/算法/' },
              ],
            },
            {
              text: '书籍',
              collapsed: true,
              items: [
                { text: '书籍', link: '/zh/其他/书籍/' },
              ],
            },
          ],
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        lastUpdated: {
          text: '最后更新',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        },
        langMenuLabel: '语言',
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
        outline: {
          level: [2, 3],
          label: '页面导航',
        },
      },
    },
    'en': {
      label: 'English',
      lang: 'en-US',
      title: 'NaiLuo Knowledge Base',
      description: 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Frontend', link: '/en/前端/', activeMatch: '^/en/前端' },
          { text: 'Backend', link: '/en/后端/', activeMatch: '^/en/后端' },
          { text: 'Testing', link: '/en/测试/', activeMatch: '^/en/测试' },
          { text: 'DevOps', link: '/en/运维/', activeMatch: '^/en/运维' },
          { text: 'AI', link: '/en/AI/', activeMatch: '^/en/AI' },
          { text: 'Product', link: '/en/产品/', activeMatch: '^/en/产品' },
          { text: 'Python', link: '/en/Python/', activeMatch: '^/en/Python' },
          { text: 'Other', link: '/en/其他/', activeMatch: '^/en/其他' },
          { text: 'blog', link: blogUrl },
        ],
        sidebar: {
          '/en/前端/': [
            {
              text: 'JavaScript',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg',
              collapsed: true,
              items: [
                { text: 'JS Basics', link: '/en/前端/JavaScript/JS基础' },
                { text: 'JS Advanced', link: '/en/前端/JavaScript/JS提高' },
                { text: 'BOM', link: '/en/前端/JavaScript/BOM' },
                { text: 'DOM', link: '/en/前端/JavaScript/DOM' },
                { text: 'DOM Events', link: '/en/前端/JavaScript/DOM事件' },
                { text: 'Built-in Objects', link: '/en/前端/JavaScript/内置对象' },
                {
                  text: 'Functions & OOP',
                  link: '/en/前端/JavaScript/函数&面向对象',
                },
                {
                  text: 'Client-Server Communication',
                  link: '/en/前端/JavaScript/前后端通信',
                },
                { text: 'Web API', link: '/en/前端/JavaScript/Web  API' },
              ],
            },
            {
              text: 'React',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/react.svg',
              collapsed: true,
              items: [
                { text: 'React Basics', link: '/en/前端/React/React基础' },
                { text: 'React Advanced', link: '/en/前端/React/React提高' },
                { text: 'React Principles', link: '/en/前端/React/React原理' },
              ],
            },
            {
              text: 'Vue',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vuedotjs.svg',
              collapsed: true,
              items: [
                { text: 'Vue Basics', link: '/en/前端/Vue/Vue基础' },
                { text: 'Vue3 Basics', link: '/en/前端/Vue/Vue3基础' },
                { text: 'Vue3 Advanced', link: '/en/前端/Vue/Vue3提高' },
              ],
            },
            {
              text: 'Vite',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vite.svg',
              collapsed: true,
              items: [
                { text: 'Vite Basics', link: '/en/前端/Vite/Vite基础' },
                { text: 'Vite Advanced', link: '/en/前端/Vite/Vite进阶' },
              ],
            },
            {
              text: 'Webpack',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/webpack.svg',
              collapsed: true,
              items: [
                { text: 'Webpack Basics', link: '/en/前端/Webpack/Webpack基础' },
                { text: 'Webpack Advanced', link: '/en/前端/Webpack/Webpack进阶' },
              ],
            },
            {
              text: 'Performance',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/speedtest.svg',
              collapsed: true,
              items: [
                { text: 'Frontend Performance', link: '/en/前端/性能优化/前端性能' },
                { text: 'Bundle Optimization', link: '/en/前端/性能优化/打包优化' },
              ],
            },
          ],
          '/en/后端/': [
            {
              text: 'Node.js',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nodedotjs.svg',
              collapsed: true,
              items: [
                { text: 'Node Basics', link: '/en/后端/Node/Node基础' },
                { text: 'Express', link: '/en/后端/Node/Express' },
                { text: 'Koa', link: '/en/后端/Node/Koa' },
              ],
            },
            {
              text: 'Database',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/database.svg',
              collapsed: true,
              items: [
                { text: 'MySQL', link: '/en/后端/数据库/MySQL' },
                { text: 'MongoDB', link: '/en/后端/数据库/MongoDB' },
                { text: 'Redis', link: '/en/后端/数据库/Redis' },
              ],
            },
            {
              text: 'Bun',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/bun.svg',
              collapsed: true,
              items: [
                { text: 'Bun Basics', link: '/en/后端/Bun/Bun基础' },
              ],
            },
          ],
          '/en/测试/': [
            {
              text: 'Testing',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vitest.svg',
              collapsed: true,
              items: [
                { text: 'Unit Testing', link: '/en/测试/单元测试' },
                { text: 'Integration Testing', link: '/en/测试/集成测试' },
                { text: 'E2E Testing', link: '/en/测试/端到端测试' },
                { text: 'Performance Testing', link: '/en/测试/性能测试' },
              ],
            },
          ],
          '/en/运维/': [
            {
              text: 'Docker',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',
              collapsed: true,
              items: [
                { text: 'Docker Basics', link: '/en/运维/Docker/Docker基础' },
                { text: 'Docker Compose', link: '/en/运维/Docker/DockerCompose' },
              ],
            },
            {
              text: 'Linux',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linux.svg',
              collapsed: true,
              items: [
                { text: 'Linux Basics', link: '/en/运维/Linux/Linux基础' },
                { text: 'Shell Scripting', link: '/en/运维/Linux/Shell脚本' },
              ],
            },
            {
              text: 'Nginx',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nginx.svg',
              collapsed: true,
              items: [
                { text: 'Nginx Basics', link: '/en/运维/Nginx/Nginx基础' },
                { text: 'Nginx Configuration', link: '/en/运维/Nginx/Nginx配置' },
              ],
            },
            {
              text: 'Server Tools',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/terminal.svg',
              collapsed: true,
              items: [
                { text: 'Git Hooks', link: '/en/运维/服务器工具/GitHooks' },
                { text: 'CI/CD', link: '/en/运维/服务器工具/CICD' },
              ],
            },
          ],
          '/en/AI/': [
            {
              text: 'Harness Engineering',
              collapsed: true,
              items: [
                { text: 'Harness Basics', link: '/en/AI/Harness工程/Harness基础' },
              ],
            },
            {
              text: 'Context Engineering',
              collapsed: true,
              items: [
                { text: 'Prompt Engineering', link: '/en/AI/上下文工程/Prompt工程' },
              ],
            },
            {
              text: 'MCP',
              collapsed: true,
              items: [
                { text: 'MCP Basics', link: '/en/AI/MCP/MCP基础' },
              ],
            },
            {
              text: 'RAG',
              collapsed: true,
              items: [
                { text: 'RAG Basics', link: '/en/AI/RAG/RAG基础' },
              ],
            },
            {
              text: 'LLM',
              collapsed: true,
              items: [
                { text: 'LLM Basics', link: '/en/AI/大模型/LLM基础' },
              ],
            },
            {
              text: 'Ollama',
              collapsed: true,
              items: [
                { text: 'Ollama Basics', link: '/en/AI/Ollama/Ollama基础' },
              ],
            },
            {
              text: 'Opencode',
              collapsed: true,
              items: [
                { text: 'Opencode Basics', link: '/en/AI/Opencode/Opencode基础' },
              ],
            },
          ],
          '/en/产品/': [
            {
              text: 'Product',
              collapsed: true,
              items: [
                { text: 'Product Design', link: '/en/产品/产品设计' },
                { text: 'Product Methodology', link: '/en/产品/产品方法论' },
              ],
            },
          ],
          '/en/Python/': [
            {
              text: 'Python',
              collapsed: true,
              items: [
                { text: 'Python Basics', link: '/en/Python/Python基础' },
                { text: 'Python Advanced', link: '/en/Python/Python进阶' },
                { text: 'Python Frameworks', link: '/en/Python/Python框架' },
              ],
            },
          ],
          '/en/其他/': [
            {
              text: 'Network',
              collapsed: true,
              items: [
                { text: 'Network', link: '/en/其他/计算机网络/' },
              ],
            },
            {
              text: 'Git',
              collapsed: true,
              items: [
                { text: 'Git', link: '/en/其他/Git/' },
              ],
            },
            {
              text: 'Algorithm',
              collapsed: true,
              items: [
                { text: 'Algorithm', link: '/en/其他/算法/' },
              ],
            },
            {
              text: 'Books',
              collapsed: true,
              items: [
                { text: 'Books', link: '/en/其他/书籍/' },
              ],
            },
          ],
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next',
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        },
        langMenuLabel: 'Language',
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        outline: {
          level: [2, 3],
          label: 'On this page',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/yangxinpu' }],
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} NaiLuo`,
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh': {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索',
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
          'en': {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'escape',
                },
              },
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
    },
  },
});
