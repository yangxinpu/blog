<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';

const { page, site } = useData();
const route = useRoute();

const siteUrl = import.meta.env.VITEPRESS_KB_URL || 'https://nailuo-knowledge-base.vercel.app';

const seoMeta = computed(() => {
  const { title, description, frontmatter } = page.value;
  const lang = site.value.lang || 'zh-CN';
  const path = route.path;
  
  const isHome = frontmatter.layout === 'home';
  
  const meta = [
    { name: 'description', content: description || (lang === 'zh-CN' 
      ? '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记' 
      : 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization') },
    { name: 'keywords', content: frontmatter.keywords || (lang === 'zh-CN' 
      ? 'JavaScript, React, Vue, Node.js, 前端开发, 性能优化, 技术博客' 
      : 'JavaScript, React, Vue, Node.js, Frontend Development, Performance Optimization, Tech blog') },
    
    { property: 'og:title', content: `${title} | ${lang === 'zh-CN' ? 'NaiLuo 知识库' : 'NaiLuo Knowledge Base'}` },
    { property: 'og:description', content: description || (lang === 'zh-CN' 
      ? '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记' 
      : 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization') },
    { property: 'og:url', content: `${siteUrl}${path}` },
    { property: 'og:type', content: isHome ? 'website' : 'article' },
    { property: 'og:site_name', content: lang === 'zh-CN' ? 'NaiLuo 知识库' : 'NaiLuo Knowledge Base' },
    { property: 'og:image', content: `${siteUrl}/logo.png` },
    { property: 'og:image:width', content: '600' },
    { property: 'og:image:height', content: '600' },
    { property: 'og:locale', content: lang },
    
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${title} | ${lang === 'zh-CN' ? 'NaiLuo 知识库' : 'NaiLuo Knowledge Base'}` },
    { name: 'twitter:description', content: description || (lang === 'zh-CN' 
      ? '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记' 
      : 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization') },
    { name: 'twitter:image', content: `${siteUrl}/logo.png` },
    { name: 'twitter:site', content: '@NaiLuo' },
    
    { rel: 'canonical', href: `${siteUrl}${path}` },
  ];
  
  if (!isHome) {
    meta.push({ rel: 'amphtml', href: `${siteUrl}${path}?amp` });
  }
  
  return meta;
});
</script>

<template>
  <template v-for="(tag, index) in seoMeta" :key="index">
    <meta v-if="tag.name" :name="tag.name" :content="tag.content" />
    <meta v-else-if="tag.property" :property="tag.property" :content="tag.content" />
    <link v-else-if="tag.rel" :rel="tag.rel" :href="tag.href" />
  </template>
</template>
