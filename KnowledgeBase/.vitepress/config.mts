import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'NaiLuo 知识库',
  description: '前端技术知识库 - React, Vue',
  lang: 'zh-CN',

  vite: {
    server: {
      port: 8080
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      md.options.html = true
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'NaiLuo 知识库',

    nav: [
      { text: '首页', link: '/' },
      { text: 'React', link: '/docs/React/React基础' },
      { text: 'Vue', link: '/docs/Vue/Vue基础' },
      { text: '博客', link: 'https://nailuo.github.io' }
    ],

    sidebar: {
      '/docs/React/': [
        {
          text: 'React',
          collapsed: false,
          items: [
            { text: 'React 基础', link: '/docs/React/React基础' },
            { text: 'React 提高', link: '/docs/React/React提高' },
            { text: 'React 原理', link: '/docs/React/React原理' }
          ]
        }
      ],
      '/docs/Vue/': [
        {
          text: 'Vue',
          collapsed: false,
          items: [
            { text: 'Vue 基础', link: '/docs/Vue/Vue基础' },
            { text: 'Vue3 基础', link: '/docs/Vue/Vue3基础' },
            { text: 'Vue3 提高', link: '/docs/Vue/Vue3提高' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nailuo' }
    ],

    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} NaiLuo`
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})
