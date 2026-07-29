<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vitepress';
import { useSidebarStateStore, getCategoryPath } from '../composables/useSidebarStateStore';

const route = useRoute();
const store = useSidebarStateStore();

let navMouseOverHandler: ((e: Event) => void) | null = null;
let navMouseOutHandler: ((e: Event) => void) | null = null;
let originalHrefs: Map<string, string> = new Map();

function getStoredActiveMenuItem(categoryPath: string): string | null {
  try {
    const pageStates = store.state.pageStates;
    const decodedCategoryPath = decodeURIComponent(categoryPath);
    
    let bestMatch: string | null = null;
    let bestMatchSegments = 0;
    let bestMatchTime = 0;
    
    for (const [path, state] of Object.entries(pageStates)) {
      if (!state.activeMenuItem) continue;
      
      const decodedPath = decodeURIComponent(path);
      const normalizedPath = decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
      
      if (normalizedPath.startsWith(decodedCategoryPath)) {
        const segments = decodedPath.split('/').filter(p => p).length;
        const accessTime = state.lastAccessTime || 0;
        
        if (segments > bestMatchSegments || 
            (segments === bestMatchSegments && accessTime >= bestMatchTime)) {
          bestMatchSegments = segments;
          bestMatchTime = accessTime;
          bestMatch = state.activeMenuItem;
        }
      }
    }
    
    return bestMatch;
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

function handleMouseOver(e: Event): void {
  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.target as Element;
  const navLink = target.closest('.VPNavBarMenuLink');
  
  if (!navLink) return;
  
  const href = navLink.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href === '/' || isHomePageHref(href)) return;
  
  const categoryPath = getCategoryPath(href);
  const storedArticle = getStoredActiveMenuItem(categoryPath);
  
  console.log('[TopNavInterceptor] handleMouseOver:', { href, categoryPath, storedArticle, currentPath: route.path, pageStatesCount: Object.keys(store.state.pageStates).length });
  
  if (storedArticle && storedArticle !== route.path) {
    const originalHref = navLink.getAttribute('href') || '';
    if (!originalHrefs.has(storedArticle)) {
      originalHrefs.set(storedArticle, originalHref);
    }
    
    if (navLink.getAttribute('href') !== storedArticle) {
      console.log('[TopNavInterceptor] Swapping href:', { original: originalHref, new: storedArticle });
      navLink.setAttribute('href', storedArticle);
    }
  }
}

function handleMouseOut(e: Event): void {
  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.target as Element;
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
    const handler = navMouseOverHandler;
    navBar.removeEventListener('mouseover', handler as EventListener, true);
  }
  
  if (navMouseOutHandler) {
    const handler = navMouseOutHandler;
    navBar.removeEventListener('mouseout', handler as EventListener, true);
  }
  
  navMouseOverHandler = handleMouseOver;
  navMouseOutHandler = handleMouseOut;
  
  const overHandler = navMouseOverHandler;
  const outHandler = navMouseOutHandler;
  navBar.addEventListener('mouseover', overHandler as EventListener, true);
  navBar.addEventListener('mouseout', outHandler as EventListener, true);
  
  console.log('[TopNavInterceptor] Initialized with mouseover/mouseout');
}

function cleanup(): void {
  restoreOriginalHrefs();
  
  if (navMouseOverHandler) {
    const navBar = document.querySelector('.VPNavBar');
    if (navBar) {
      const handler = navMouseOverHandler;
      navBar.removeEventListener('mouseover', handler as EventListener, true);
    }
    navMouseOverHandler = null;
  }
  if (navMouseOutHandler) {
    const navBar = document.querySelector('.VPNavBar');
    if (navBar) {
      const handler = navMouseOutHandler;
      navBar.removeEventListener('mouseout', handler as EventListener, true);
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