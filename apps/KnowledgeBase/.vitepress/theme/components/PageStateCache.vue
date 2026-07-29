<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vitepress';
import { useSidebarStateStore } from '../composables/useSidebarStateStore';

const router = useRouter();
const route = useRoute();
const store = useSidebarStateStore();

let mutationObserver: MutationObserver | null = null;
let mobileOverlayObserver: MutationObserver | null = null;
let mobileBodyObserver: MutationObserver | null = null;
let sidebarScrollObserver: MutationObserver | null = null;

let currentPath = route.path;
let isRestoring = false;
let isNavigating = false;

let scrollHandler: (() => void) | null = null;
let beforeUnloadHandler: (() => void) | null = null;
let beforeRouteChangeHandler: ((to: string) => boolean | void) | null = null;

function generateGroupKey(item: Element): string {
  const textElement = item.querySelector(':scope > .item > .text') || 
                       item.querySelector(':scope > .item > H2') ||
                       item.querySelector(':scope > .item');
  const text = textElement?.textContent?.trim() || '';
  if (text) {
    return text;
  }
  const link = item.querySelector(':scope > .item > a')?.getAttribute('href') || '';
  return link;
}

function collectExpandedGroups(container: Element): Record<string, boolean> {
  const expanded: Record<string, boolean> = {};
  const collapsibleItems = container.querySelectorAll('.VPSidebarItem.collapsible');
  
  collapsibleItems.forEach((item) => {
    const key = generateGroupKey(item);
    if (key) {
      const isExpanded = !item.classList.contains('collapsed');
      expanded[key] = isExpanded;
    }
  });
  
  return expanded;
}

function restoreExpandedGroups(container: Element, expandedGroups: Record<string, boolean>): void {
  const collapsibleItems = container.querySelectorAll('.VPSidebarItem.collapsible');
  
  console.log('[PageStateCache] restoreExpandedGroups: found', collapsibleItems.length, 'collapsible items,', Object.keys(expandedGroups).length, 'saved groups');
  
  let clicksPerformed = 0;
  
  collapsibleItems.forEach((item, index) => {
    const key = generateGroupKey(item);
    const savedValue = expandedGroups[key];
    
    console.log(`[PageStateCache] item[${index}]: key="${key}", savedValue=${savedValue}, collapsed=${item.classList.contains('collapsed')}`);
    
    if (key && savedValue !== undefined) {
      const shouldExpand = savedValue;
      const isCurrentlyExpanded = !item.classList.contains('collapsed');
      
      if (shouldExpand !== isCurrentlyExpanded) {
        const itemDiv = item.querySelector(':scope > .item');
        if (itemDiv) {
          isRestoring = true;
          itemDiv.click();
          clicksPerformed++;
          console.log(`[PageStateCache] item[${index}]: clicked to ${shouldExpand ? 'expand' : 'collapse'}`);
        }
      }
    }
  });
  
  console.log('[PageStateCache] restoreExpandedGroups:', clicksPerformed, 'clicks performed');
}

function saveCurrentState(immediate = false): void {
  if (isRestoring) {
    console.log('[PageStateCache] saveCurrentState skipped: isRestoring');
    return;
  }
  
  const sidebar = document.querySelector('.VPSidebar');
  if (!sidebar) return;
  
  try {
    const pageState = store.getPageState(currentPath);
    const categorySidebar = store.getCategorySidebar(currentPath);
    
    if (!pageState || !categorySidebar) {
      console.warn('[PageStateCache] saveCurrentState: state is undefined');
      return;
    }
    
    pageState.scrollY = window.scrollY;
    pageState.activeMenuItem = getActiveMenuItem(sidebar);
    
    categorySidebar.expandedGroups = collectExpandedGroups(sidebar);
    
    const sidebarContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
    categorySidebar.sidebarScrollY = sidebarContainer.scrollTop;
    
    console.log('[PageStateCache] saveCurrentState', {
      path: currentPath,
      immediate,
      scrollY: pageState.scrollY,
      activeMenuItem: pageState.activeMenuItem,
      expandedGroups: Object.entries(categorySidebar.expandedGroups).filter(([, v]) => v),
      sidebarScrollY: categorySidebar.sidebarScrollY,
    });
    
    if (immediate) {
      store.saveNow();
    } else {
      store.saveDebounced();
    }
  } catch (e) {
    console.warn('[PageStateCache] saveCurrentState error:', e);
  }
}

function getActiveMenuItem(sidebar: Element): string {
  const activeLinks = sidebar.querySelectorAll('a.active');
  
  for (const link of activeLinks) {
    const href = link.getAttribute('href');
    if (!href) continue;
    
    if (href === currentPath) {
      const parts = currentPath.split('/').filter(p => p);
      if (parts.length >= 3) {
        return href;
      }
    }
  }
  
  if (currentPath && currentPath !== '/') {
    const parts = currentPath.split('/').filter(p => p);
    if (parts.length >= 3) {
      return currentPath;
    }
  }
  
  return '';
}

function waitForSidebar(maxAttempts = 30): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    const tryFind = () => {
      const sidebar = document.querySelector('.VPSidebar');
      if (sidebar) {
        const hasItems = sidebar.querySelector('.VPSidebarItem');
        if (hasItems) {
          resolve(sidebar);
          return;
        }
      }
      attempts++;
      if (attempts >= maxAttempts) {
        resolve(sidebar);
        return;
      }
      setTimeout(tryFind, 100);
    };
    tryFind();
  });
}

async function restoreCurrentState(): Promise<void> {
  isRestoring = true;
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] restoreCurrentState: sidebar not found');
    isRestoring = false;
    return;
  }
  
  const pageState = store.getPageState(route.path);
  const categorySidebar = store.getCategorySidebar(route.path);
  
  console.log('[PageStateCache] restoreCurrentState', {
    path: route.path,
    categoryPath: getCategoryPath(route.path),
    savedScrollY: pageState.scrollY,
    savedActiveMenuItem: pageState.activeMenuItem,
    savedExpandedGroups: Object.entries(categorySidebar.expandedGroups).filter(([, v]) => v).map(([k]) => k),
    savedSidebarScrollY: categorySidebar.sidebarScrollY,
  });
  
  await nextTick();
  
  setTimeout(() => {
    if (categorySidebar.expandedGroups && Object.keys(categorySidebar.expandedGroups).length > 0) {
      restoreExpandedGroups(sidebar, categorySidebar.expandedGroups);
    }
    
    if (pageState.activeMenuItem) {
      scrollToActiveMenuItem(sidebar, pageState.activeMenuItem);
    }
    
    if (pageState.scrollY > 0) {
      window.scrollTo(0, pageState.scrollY);
    }
    
    if (categorySidebar.sidebarScrollY > 0) {
      const sidebarContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
      sidebarContainer.scrollTop = categorySidebar.sidebarScrollY;
    }
    
    setTimeout(() => {
      saveCurrentState(true);
      isRestoring = false;
      console.log('[PageStateCache] restore complete');
    }, 500);
  }, 200);
}

function getCategoryPath(path: string): string {
  const parts = path.split('/').filter(p => p);
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`;
  }
  return `/${parts.join('/')}/`;
}

function scrollToActiveMenuItem(sidebar: Element, activeHref: string): void {
  if (!activeHref) return;
  
  const activeLink = sidebar.querySelector(`a[href="${activeHref}"]`);
  if (activeLink) {
    activeLink.scrollIntoView({ block: 'nearest' });
  }
}

function initMutationObserver(): void {
  const sidebar = document.querySelector('.VPSidebar');
  if (!sidebar) return;
  
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  
  mutationObserver = new MutationObserver((mutations) => {
    if (isRestoring || isNavigating) return;
    
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
        const target = mutation.target as Element;
        if (target.classList.contains('VPSidebarItem') ||
            target.closest('.VPSidebarItem')) {
          saveCurrentState();
          break;
        }
      }
      
      if (mutation.type === 'childList') {
        saveCurrentState();
        break;
      }
    }
  });
  
  mutationObserver.observe(sidebar, {
    attributes: true,
    attributeFilter: ['class', 'style'],
    childList: true,
    subtree: true,
  });
}

function initSidebarScrollObserver(): void {
  const sidebar = document.querySelector('.VPSidebar');
  if (!sidebar) return;
  
  const scrollContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
  
  if (sidebarScrollObserver) {
    scrollContainer.removeEventListener('scroll', sidebarScrollObserver);
  }
  
  sidebarScrollObserver = () => {
    if (isRestoring) return;
    const categorySidebar = store.getCategorySidebar(currentPath);
    categorySidebar.sidebarScrollY = scrollContainer.scrollTop;
  };
  
  scrollContainer.addEventListener('scroll', sidebarScrollObserver, { passive: true });
}

function initMobileSidebarObserver(): void {
  const mobileOverlay = document.querySelector('.VPNavScreen');
  const mobileBody = document.querySelector('body');
  
  const checkMobileSidebar = () => {
    if (mobileBody) {
      const hasOpenClass = mobileBody.classList.contains('sidebar-open') || 
                          mobileBody.classList.contains('has-sidebar');
      store.setMobileSidebarOpen(hasOpenClass);
    }
  };
  
  if (mobileOverlay) {
    if (mobileOverlayObserver) {
      mobileOverlayObserver.disconnect();
    }
    mobileOverlayObserver = new MutationObserver(checkMobileSidebar);
    mobileOverlayObserver.observe(mobileOverlay, { attributes: true, attributeFilter: ['class'] });
  }
  
  if (mobileBody) {
    if (mobileBodyObserver) {
      mobileBodyObserver.disconnect();
    }
    mobileBodyObserver = new MutationObserver(checkMobileSidebar);
    mobileBodyObserver.observe(mobileBody, { attributes: true, attributeFilter: ['class'] });
  }
}

function initBeforeRouteChangeHandler(): void {
  if (beforeRouteChangeHandler) {
    router.onBeforeRouteChange = undefined;
  }
  
  beforeRouteChangeHandler = (to: string) => {
    if (isRestoring) return true;
    
    console.log('[PageStateCache] beforeRouteChangeHandler: saving state before navigation to', to);
    isNavigating = true;
    saveCurrentState(true);
    isNavigating = false;
    return true;
  };
  
  router.onBeforeRouteChange = beforeRouteChangeHandler;
}

function cleanupAll(): void {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
  
  if (mobileOverlayObserver) {
    mobileOverlayObserver.disconnect();
    mobileOverlayObserver = null;
  }
  
  if (mobileBodyObserver) {
    mobileBodyObserver.disconnect();
    mobileBodyObserver = null;
  }
  
  if (sidebarScrollObserver) {
    const sidebar = document.querySelector('.VPSidebar');
    if (sidebar) {
      const scrollContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
      scrollContainer.removeEventListener('scroll', sidebarScrollObserver);
    }
    sidebarScrollObserver = null;
  }
  
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
  
  if (beforeRouteChangeHandler) {
    router.onBeforeRouteChange = undefined;
    beforeRouteChangeHandler = null;
  }
}

async function handleRouteChange(): Promise<void> {
  console.log('[PageStateCache] handleRouteChange', { from: currentPath, to: route.path });
  
  currentPath = route.path;
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] handleRouteChange: sidebar not found after route change');
    return;
  }
  
  initMutationObserver();
  initSidebarScrollObserver();
  initMobileSidebarObserver();
  initBeforeRouteChangeHandler();
  restoreCurrentState();
}

watch(() => route.path, () => {
  handleRouteChange();
});

onMounted(async () => {
  console.log('[PageStateCache] onMounted', { path: route.path });
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] onMounted: sidebar not found');
    return;
  }
  
  console.log('[PageStateCache] sidebar found, initializing observers and restoring state');
  
  initMutationObserver();
  initSidebarScrollObserver();
  initMobileSidebarObserver();
  initBeforeRouteChangeHandler();
  restoreCurrentState();
  
  scrollHandler = () => {
    if (isRestoring) return;
    const pageState = store.getPageState(currentPath);
    pageState.scrollY = window.scrollY;
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  beforeUnloadHandler = () => {
    if (isNavigating) {
      console.log('[PageStateCache] beforeUnloadHandler: navigating, skipping');
      return;
    }
    if (isRestoring) return;
    console.log('[PageStateCache] beforeUnloadHandler: saving state');
    saveCurrentState(true);
  };
  window.addEventListener('beforeunload', beforeUnloadHandler);
});

onBeforeUnmount(() => {
  isRestoring = false;
  saveCurrentState(true);
  cleanupAll();
});
</script>

<template>
  <div class="page-state-cache"></div>
</template>

<style scoped>
.page-state-cache {
  display: none;
}
</style>
