<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData, useRoute } from 'vitepress';

const { page, site } = useData();
const route = useRoute();
const schemaRef = ref<HTMLElement | null>(null);

const siteUrl = import.meta.env.VITEPRESS_KB_URL || 'https://nailuo-knowledge-base.vercel.app';

const schema = computed(() => {
  const { title, description, lastUpdated, frontmatter, relativePath } = page.value;
  const lang = site.value.lang || 'zh-CN';
  const path = route.path;
  
  const isHome = frontmatter.layout === 'home';
  const isDoc = !isHome && !frontmatter.excludeFromSearch;
  
  const breadcrumbItems = computed(() => {
    const items: Array<{ name: string; url: string }> = [];
    
    if (relativePath.startsWith('zh/')) {
      items.push({ name: '首页', url: `${siteUrl}/zh/` });
      const parts = relativePath.replace('zh/', '').split('/');
      let currentUrl = `${siteUrl}/zh/`;
      parts.forEach((part, index) => {
        if (part && !part.endsWith('.md')) {
          const name = part.replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
          currentUrl += part + '/';
          if (index < parts.length - 1) {
            items.push({ name, url: currentUrl });
          }
        }
      });
    } else if (relativePath.startsWith('en/')) {
      items.push({ name: 'Home', url: `${siteUrl}/en/` });
      const parts = relativePath.replace('en/', '').split('/');
      let currentUrl = `${siteUrl}/en/`;
      parts.forEach((part, index) => {
        if (part && !part.endsWith('.md')) {
          const name = part.replace('.md', '').replace(/([A-Z])/g, ' $1').trim();
          currentUrl += part + '/';
          if (index < parts.length - 1) {
            items.push({ name, url: currentUrl });
          }
        }
      });
    }
    
    items.push({ name: title, url: `${siteUrl}${path}` });
    return items;
  });

  const schemas: Array<Record<string, unknown>> = [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: lang === 'zh-CN' ? 'NaiLuo 知识库' : 'NaiLuo Knowledge Base',
    alternateName: lang === 'zh-CN' ? 'NaiLuo 技术博客' : 'NaiLuo Tech Blog',
    url: `${siteUrl}${lang === 'zh-CN' ? '/zh/' : '/en/'}`,
    description: lang === 'zh-CN' 
      ? '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记' 
      : 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization',
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}${lang === 'zh-CN' ? '/zh/' : '/en/'}{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

  if (isDoc) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}${path}`,
      },
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: 'NaiLuo',
        url: 'https://github.com/yangxinpu',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NaiLuo',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      datePublished: lastUpdated ? new Date(lastUpdated).toISOString() : new Date().toISOString(),
      dateModified: lastUpdated ? new Date(lastUpdated).toISOString() : new Date().toISOString(),
      inLanguage: lang,
      articleSection: lang === 'zh-CN' ? '技术文章' : 'Technical Article',
    });
  }

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.value.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

  return schemas;
});

onMounted(() => {
  if (schemaRef.value) {
    schema.value.forEach((s, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.schema = `schema-${index}`;
      script.textContent = JSON.stringify(s);
      schemaRef.value?.appendChild(script);
    });
  }
});
</script>

<template>
  <div ref="schemaRef" />
</template>
