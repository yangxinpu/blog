<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vitepress';
import { useSidebarStateStore } from '../composables/useSidebarStateStore';

const router = useRouter();
const route = useRoute();
const store = useSidebarStateStore();

let navMouseOverHandler: ((e: MouseEvent) => void) | null = null;
let navMouseOutHandler: ((e: MouseEvent) => void) | null = null;
let originalHrefs: Map<string, string> = new Map();

function getCategoryPath(href: string): string {
  const parts = href.split('/').filter(p => p);
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`;
  }
  return href;
}

function getStoredActiveMenuItem(categoryPath: string): string | null {
  try {
    const pageStates = store.state.pageStates;
    const decodedCategoryPath = decodeURIComponent(categoryPath);
    
    for (const [path, state] of Object.entries(pageStates)) {
      const decodedPath = decodeURIComponent(path);
      const normalizedPath = decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
      if (normalizedPath.startsWith(decodedCategoryPath) && state.activeMenuItem) {
        return state.activeMenuItem;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

function restoreOriginalHrefs(): void {
  const navBar = document.querySelector('.VPNavBar');
  if (!navBar) return;
  
  const navLinks = navBar.querySelectorAll('.VPNavBarMenuLink');
  navLinks.forEach(link => {
    const originalHref = originalHrefs.get(link.getAttribute('href') || '');
    if (originalHref) {
      link.setAttribute('href', originalHref);
    }
  });
  originalHrefs.clear();
}

function isHomePageHref(href: string): boolean {
  const parts = href.split('/').filter(p => p);
  if (parts.length === 0) return true;
  if (parts.length === 1 && ['zh', 'en'].includes(parts[0])) return true;
  return false;
}

function handleMouseOver(e: MouseEvent): void {
  const target = e.target as Element;
  const navLink = target.closest('.VPNavBarMenuLink');
  
  if (!navLink) return;
  
  const href = navLink.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href === '/' || isHomePageHref(href)) return;
  
  const categoryPath = getCategoryPath(href);
  const storedArticle = getStoredActiveMenuItem(categoryPath);
  
  console.log('[TopNavInterceptor] handleMouseOver:', { href, categoryPath, storedArticle, currentPath: route.path, pageStatesCount: Object.keys(store.state.pageStates).length });
  
  if (storedArticle && storedArticle !== route.path) {
    const currentHref = navLink.getAttribute('href') || '';
    if (!originalHrefs.has(currentHref)) {
      originalHrefs.set(currentHref, currentHref);
    }
    
    if (navLink.getAttribute('href') !== storedArticle) {
      console.log('[TopNavInterceptor] Swapping href:', { original: currentHref, new: storedArticle });
      navLink.setAttribute('href', storedArticle);
    }
  }
}

function handleMouseOut(e: MouseEvent): void {
  const target = e.target as Element;
  const navLink = target.closest('.VPNavBarMenuLink');
  
  if (!navLink) return;
  
  const currentHref = navLink.getAttribute('href') || '';
  
  if (originalHrefs.has(currentHref)) {
    const originalHref = originalHrefs.get(currentHref) || currentHref;
    navLink.setAttribute('href', originalHref);
    originalHrefs.delete(currentHref);
    console.log('[TopNavInterceptor] Restored href:', { current: currentHref, original: originalHref });
  }
}

function initInterceptor(): void {
  const navBar = document.querySelector('.VPNavBar');
  if (!navBar) {
    console.warn('[TopNavInterceptor] Navigation bar not found');
    return;
  }
  
  if (navMouseOverHandler) {
    navBar.removeEventListener('mouseover', navMouseOverHandler, true);
  }
  
  if (navMouseOutHandler) {
    navBar.removeEventListener('mouseout', navMouseOutHandler, true);
  }
  
  navMouseOverHandler = handleMouseOver;
  navMouseOutHandler = handleMouseOut;
  navBar.addEventListener('mouseover', navMouseOverHandler, true);
  navBar.addEventListener('mouseout', navMouseOutHandler, true);
  
  console.log('[TopNavInterceptor] Initialized with mouseover/mouseout');
}

function cleanup(): void {
  restoreOriginalHrefs();
  
  if (navMouseOverHandler) {
    const navBar = document.querySelector('.VPNavBar');
    if (navBar) {
      navBar.removeEventListener('mouseover', navMouseOverHandler, true);
    }
    navMouseOverHandler = null;
  }
  if (navMouseOutHandler) {
    const navBar = document.querySelector('.VPNavBar');
    if (navBar) {
      navBar.removeEventListener('mouseout', navMouseOutHandler, true);
    }
    navMouseOutHandler = null;
  }
}

onMounted(() => {
  setTimeout(initInterceptor, 100);
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<template>
  <div class="top-nav-interceptor"></div>
</template>

<style scoped>
.top-nav-interceptor {
  display: none;
}
</style>