import { defineConfig } from 'vitepress';

const base = process.env.VITEPRESS_BASE || '/';
const blogUrl = process.env.VITEPRESS_BLOG_URL || 'http://localhost:3000';

export default defineConfig({
  title: 'NaiLuo 知识库',
  base,
  srcDir: 'docs',
  cleanUrls: true,
  appearance: 'force-dark',

  vite: {
    server: {
      port: 8080,
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

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon_48px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/favicon_32px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '48x48', href: '/favicon_48px.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', sizes: '64x64', href: '/favicon_64px.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '64x64', href: '/logo.png' }],
  ],

  locales: {
    'zh': {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'NaiLuo 知识库',
      description: '前端技术知识库 - React, Vue',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '前端', link: '/zh/前端/' },
          { text: '后端', link: '/zh/后端/' },
          { text: '运维', link: '/zh/运维/' },
          { text: 'AI', link: '/zh/AI/' },
          { text: '产品', link: '/zh/产品/' },
          { text: 'Python', link: '/zh/Python/' },
          { text: '其他', link: '/zh/其他/' },
          { text: '博客', link: blogUrl },
        ],
        sidebar: {
          '/zh/前端/': [
            {
              text: 'JavaScript',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg',
              collapsed: false,
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
            { text: '计算机网络', link: '/zh/其他/计算机网络/' },
            { text: 'Git', link: '/zh/其他/Git/' },
            { text: '算法', link: '/zh/其他/算法/' },
            { text: '书籍', link: '/zh/其他/书籍/' },
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
      },
    },
    'en': {
      label: 'English',
      lang: 'en-US',
      title: 'NaiLuo Knowledge Base',
      description: 'Frontend Tech Knowledge Base - React, Vue',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Frontend', link: '/en/前端/' },
          { text: 'Backend', link: '/en/后端/' },
          { text: 'DevOps', link: '/en/运维/' },
          { text: 'AI', link: '/en/AI/' },
          { text: 'Product', link: '/en/产品/' },
          { text: 'Python', link: '/en/Python/' },
          { text: 'Other', link: '/en/其他/' },
          { text: 'Blog', link: blogUrl },
        ],
        sidebar: {
          '/en/前端/': [
            {
              text: 'JavaScript',
              icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg',
              collapsed: false,
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
            { text: 'Network', link: '/en/其他/计算机网络/' },
            { text: 'Git', link: '/en/其他/Git/' },
            { text: 'Algorithm', link: '/en/其他/算法/' },
            { text: 'Books', link: '/en/其他/书籍/' },
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
    },
    outline: {
      level: [2, 3],
    },
  },
});