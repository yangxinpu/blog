<script setup lang="ts">
import { onMounted, watch, nextTick, computed } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const categoryInfo = computed(() => {
  const path = route.path;
  const parts = path.split('/').filter(p => p);
  
  if (parts.length >= 2) {
    const lang = decodeURIComponent(parts[0]);
    const category = decodeURIComponent(parts[1]);
    const categoryPath = `/${parts[0]}/${parts[1]}/`;
    const decodedPath = decodeURIComponent(path);
    const decodedCategoryPath = `/${lang}/${category}/`;
    
    return {
      name: category,
      href: categoryPath,
      isActive: decodedPath === decodedCategoryPath || decodedPath === `/${lang}/${category}`
    };
  }
  
  return null;
});

function addOverviewLink(): void {
  const nav = document.querySelector('#VPSidebarNav');
  if (!nav) {
    console.warn('[SidebarOverview] Navigation not found');
    return;
  }
  
  let existingOverview = nav.querySelector('.sidebar-overview-link');
  if (existingOverview) {
    existingOverview.closest('.sidebar-overview-group')?.remove();
  }
  
  if (!categoryInfo.value) return;
  
  const overviewLink = document.createElement('a');
  overviewLink.className = 'sidebar-overview-link VPLink link';
  overviewLink.href = categoryInfo.value.href;
  
  if (categoryInfo.value.isActive) {
    overviewLink.classList.add('active');
  }
  
  const content = document.createElement('div');
  content.className = 'sidebar-overview-content';
  
  const icon = document.createElement('span');
  icon.className = 'sidebar-overview-icon';
  icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `;
  
  const text = document.createElement('span');
  text.className = 'sidebar-overview-text';
  text.textContent = `${categoryInfo.value.name} 概览`;
  
  content.appendChild(icon);
  content.appendChild(text);
  overviewLink.appendChild(content);
  
  const group = document.createElement('div');
  group.className = 'sidebar-overview-group';
  group.appendChild(overviewLink);
  
  const firstGroup = nav.querySelector('.group');
  if (firstGroup) {
    nav.insertBefore(group, firstGroup);
  } else {
    nav.insertBefore(group, nav.firstChild.nextSibling);
  }
  
  console.log('[SidebarOverview] Added overview link for:', categoryInfo.value.name);
}

onMounted(() => {
  nextTick(() => {
    setTimeout(addOverviewLink, 150);
  });
});

watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(addOverviewLink, 150);
  });
});
</script>

<template>
  <div class="sidebar-overview-injector"></div>
</template>

<style>
.sidebar-overview-group {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sidebar-overview-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s ease;
  text-decoration: none;
}

.sidebar-overview-link:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

.sidebar-overview-link.active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.sidebar-overview-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.sidebar-overview-link:hover .sidebar-overview-icon,
.sidebar-overview-link.active .sidebar-overview-icon {
  opacity: 1;
}

.sidebar-overview-text {
  letter-spacing: 0.5px;
}
</style>

<style scoped>
.sidebar-overview-injector {
  display: none;
}
</style>