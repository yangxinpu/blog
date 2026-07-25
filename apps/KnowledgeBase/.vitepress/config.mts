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
              collapsed: true,
              items: [
                { text: 'React 基础', link: '/zh/前端/React/React基础' },
                { text: 'React 提高', link: '/zh/前端/React/React提高' },
                { text: 'React 原理', link: '/zh/前端/React/React原理' },
              ],
            },
            {
              text: 'Vue',
              collapsed: true,
              items: [
                { text: 'Vue 基础', link: '/zh/前端/Vue/Vue基础' },
                { text: 'Vue3 基础', link: '/zh/前端/Vue/Vue3基础' },
                { text: 'Vue3 提高', link: '/zh/前端/Vue/Vue3提高' },
              ],
            },
          ],
          '/zh/后端/': [],
          '/zh/产品/': [],
          '/zh/运维/': [],
          '/zh/AI/': [],
          '/zh/Python/': [],
          '/zh/其他/': [
            { text: '计算机网络', link: '/zh/其他/计算机网络/' },
            { text: 'Git', link: '/zh/其他/Git/' },
            { text: '书籍', link: '/zh/其他/书籍/' },
            { text: '算法', link: '/zh/其他/算法/' },
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
              collapsed: true,
              items: [
                { text: 'React Basics', link: '/en/前端/React/React基础' },
                { text: 'React Advanced', link: '/en/前端/React/React提高' },
                { text: 'React Principles', link: '/en/前端/React/React原理' },
              ],
            },
            {
              text: 'Vue',
              collapsed: true,
              items: [
                { text: 'Vue Basics', link: '/en/前端/Vue/Vue基础' },
                { text: 'Vue3 Basics', link: '/en/前端/Vue/Vue3基础' },
                { text: 'Vue3 Advanced', link: '/en/前端/Vue/Vue3提高' },
              ],
            },
          ],
          '/en/后端/': [],
          '/en/产品/': [],
          '/en/运维/': [],
          '/en/AI/': [],
          '/en/Python/': [],
          '/en/其他/': [
            { text: 'Network', link: '/en/其他/计算机网络/' },
            { text: 'Git', link: '/en/其他/Git/' },
            { text: 'Books', link: '/en/其他/书籍/' },
            { text: 'Algorithm', link: '/en/其他/算法/' },
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