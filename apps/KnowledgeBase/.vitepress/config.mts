import { defineConfig } from 'vitepress';

const base = process.env.VITEPRESS_BASE || '/';
const blogUrl = process.env.VITEPRESS_BLOG_URL || 'http://localhost:3000';

export default defineConfig({
  title: 'NaiLuo 知识库',
  base,

  vite: {
    server: {
      port: 8080,
    },
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
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/logo.png' }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'NaiLuo 知识库',
      description: '前端技术知识库 - React, Vue',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: 'JavaScript', link: '/zh/JavaScript/JS基础：' },
          { text: 'React', link: '/zh/React/React基础' },
          { text: 'Vue', link: '/zh/Vue/Vue基础' },
          { text: '博客', link: blogUrl },
        ],
        sidebar: {
          '/zh/JavaScript/': [
            {
              text: 'JavaScript',
              collapsed: false,
              items: [
                { text: 'JS 基础', link: '/zh/JavaScript/JS基础：' },
                { text: 'JS 提高', link: '/zh/JavaScript/JS提高' },
                { text: 'BOM', link: '/zh/JavaScript/BOM' },
                { text: 'DOM', link: '/zh/JavaScript/DOM' },
                { text: 'DOM 事件', link: '/zh/JavaScript/DOM事件' },
                { text: '内置对象', link: '/zh/JavaScript/内置对象' },
                {
                  text: '函数&面向对象',
                  link: '/zh/JavaScript/函数&面向对象：',
                },
                { text: '前后端通信', link: '/zh/JavaScript/前后端通信' },
                { text: 'Web API', link: '/zh/JavaScript/Web  API' },
              ],
            },
          ],
          '/zh/React/': [
            {
              text: 'React',
              collapsed: false,
              items: [
                { text: 'React 基础', link: '/zh/React/React基础' },
                { text: 'React 提高', link: '/zh/React/React提高' },
                { text: 'React 原理', link: '/zh/React/React原理' },
              ],
            },
          ],
          '/zh/Vue/': [
            {
              text: 'Vue',
              collapsed: false,
              items: [
                { text: 'Vue 基础', link: '/zh/Vue/Vue基础' },
                { text: 'Vue3 基础', link: '/zh/Vue/Vue3基础' },
                { text: 'Vue3 提高', link: '/zh/Vue/Vue3提高' },
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
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'NaiLuo Knowledge Base',
      description: 'Frontend Tech Knowledge Base - React, Vue',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'JavaScript', link: '/en/JavaScript/JS基础：' },
          { text: 'React', link: '/en/React/React基础' },
          { text: 'Vue', link: '/en/Vue/Vue基础' },
          { text: 'Blog', link: blogUrl },
        ],
        sidebar: {
          '/en/JavaScript/': [
            {
              text: 'JavaScript',
              collapsed: false,
              items: [
                { text: 'JS Basics', link: '/en/JavaScript/JS基础：' },
                { text: 'JS Advanced', link: '/en/JavaScript/JS提高' },
                { text: 'BOM', link: '/en/JavaScript/BOM' },
                { text: 'DOM', link: '/en/JavaScript/DOM' },
                { text: 'DOM Events', link: '/en/JavaScript/DOM事件' },
                { text: 'Built-in Objects', link: '/en/JavaScript/内置对象' },
                {
                  text: 'Functions & OOP',
                  link: '/en/JavaScript/函数&面向对象：',
                },
                {
                  text: 'Client-Server Communication',
                  link: '/en/JavaScript/前后端通信',
                },
                { text: 'Web API', link: '/en/JavaScript/Web  API' },
              ],
            },
          ],
          '/en/React/': [
            {
              text: 'React',
              collapsed: false,
              items: [
                { text: 'React Basics', link: '/en/React/React基础' },
                { text: 'React Advanced', link: '/en/React/React提高' },
                { text: 'React Principles', link: '/en/React/React原理' },
              ],
            },
          ],
          '/en/Vue/': [
            {
              text: 'Vue',
              collapsed: false,
              items: [
                { text: 'Vue Basics', link: '/en/Vue/Vue基础' },
                { text: 'Vue3 Basics', link: '/en/Vue/Vue3基础' },
                { text: 'Vue3 Advanced', link: '/en/Vue/Vue3提高' },
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
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
      },
    },
  },

  themeConfig: {
    logo: '/assets/logo.png',
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
