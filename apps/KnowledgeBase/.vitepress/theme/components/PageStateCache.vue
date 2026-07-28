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
let currentPath = route.path;
let isRestoring = false;
let isNavigating = false;
let stateSavedBeforeUnload = false;

let scrollHandler: (() => void) | null = null;
let beforeUnloadHandler: (() => void) | null = null;
let sidebarScrollHandler: (() => void) | null = null;
let globalClickHandler: ((e: MouseEvent) => void) | null = null;
let beforeRouteChangeHandler: ((to: string) => boolean | void) | null = null;

function generateGroupKey(item: Element): string {
  const h2Text = item.querySelector(':scope > .item > H2.text')?.textContent?.trim() || '';
  if (h2Text) {
    return h2Text;
  }
  const link = item.querySelector(':scope > .item > a')?.getAttribute('href') || '';
  const pText = item.querySelector(':scope > .item > a > P.text')?.textContent?.trim() || '';
  return `${pText}${link}`;
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

function saveCurrentState(immediate = false, force = false): void {
  if (!force && (isRestoring || isNavigating)) {
    console.log('[PageStateCache] saveCurrentState skipped:', { isRestoring, isNavigating });
    return;
  }
  
  const sidebar = document.querySelector('.VPSidebar');
  if (!sidebar) return;
  
  const pageState = store.getPageState(currentPath);
  
  pageState.scrollY = window.scrollY;
  pageState.sidebar.expandedGroups = collectExpandedGroups(sidebar);
  
  const activeLink = sidebar.querySelector('.active');
  if (activeLink) {
    pageState.sidebar.activeMenuItem = activeLink.getAttribute('href') || activeLink.textContent?.trim() || '';
  }
  
  const sidebarContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
  pageState.sidebar.sidebarScrollY = sidebarContainer.scrollTop;
  
  console.log('[PageStateCache] saveCurrentState', {
    path: currentPath,
    immediate,
    force,
    expandedGroups: Object.entries(pageState.sidebar.expandedGroups).filter(([, v]) => v),
    scrollY: pageState.scrollY,
  });
  
  if (immediate) {
    store.saveNow();
  } else {
    store.saveDebounced();
  }
}

function waitForSidebar(maxAttempts = 30): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    const tryFind = () => {
      const sidebar = document.querySelector('.VPSidebar');
      if (sidebar) {
        const hasCollapsible = sidebar.querySelector('.VPSidebarItem.collapsible');
        const hasItem = sidebar.querySelector('.VPSidebarItem');
        if (hasCollapsible || hasItem) {
          resolve(sidebar);
          return;
        }
      }
      attempts++;
      if (attempts >= maxAttempts) {
        const sidebar = document.querySelector('.VPSidebar');
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
  isNavigating = true;
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] restoreCurrentState: sidebar not found');
    isRestoring = false;
    isNavigating = false;
    return;
  }
  
  const pageState = store.getPageState(route.path);
  
  const collapsibleItems = sidebar.querySelectorAll('.VPSidebarItem.collapsible');
  const currentKeys: string[] = [];
  collapsibleItems.forEach((item) => {
    const key = generateGroupKey(item);
    if (key) currentKeys.push(key);
  });
  
  console.log('[PageStateCache] restoreCurrentState', {
    path: route.path,
    savedGroups: Object.entries(pageState.sidebar.expandedGroups).filter(([, v]) => v).map(([k]) => k),
    currentCollapsibles: currentKeys,
    scrollY: pageState.scrollY,
  });
  
  await nextTick();
  
  setTimeout(() => {
    if (pageState.scrollY > 0) {
      window.scrollTo(0, pageState.scrollY);
    }
    
    if (Object.keys(pageState.sidebar.expandedGroups).length > 0) {
      restoreExpandedGroups(sidebar, pageState.sidebar.expandedGroups);
    }
    
    if (pageState.sidebar.sidebarScrollY > 0) {
      const sidebarContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
      sidebarContainer.scrollTop = pageState.sidebar.sidebarScrollY;
    }
    
    setTimeout(() => {
      saveCurrentState(true, true);
      isRestoring = false;
      isNavigating = false;
      console.log('[PageStateCache] restore complete');
    }, 500);
  }, 200);
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

function initGlobalClickHandler(): void {
  if (globalClickHandler) {
    document.removeEventListener('click', globalClickHandler);
  }
  
  if (beforeRouteChangeHandler) {
    router.onBeforeRouteChange = undefined;
  }
  
  globalClickHandler = (e: MouseEvent) => {
    if (isRestoring) return;
    
    const target = e.target as Element;
    const anchor = target.closest('a');
    if (!anchor) return;
    
    const href = anchor.getAttribute('href') || anchor.href;
    if (!href || href.startsWith('javascript:') || href.startsWith('#')) return;
    
    const isExternal = anchor.target === '_blank' || 
                       (href.startsWith('http') && !href.includes(window.location.host));
    if (isExternal) return;
    
    console.log('[PageStateCache] globalClickHandler: saving state before navigation');
    stateSavedBeforeUnload = true;
    saveCurrentState(true);
    isNavigating = true;
  };
  
  beforeRouteChangeHandler = (to: string) => {
    if (isRestoring) return true;
    
    console.log('[PageStateCache] beforeRouteChangeHandler: saving state before navigation to', to);
    stateSavedBeforeUnload = true;
    saveCurrentState(true);
    isNavigating = true;
    return true;
  };
  
  document.addEventListener('click', globalClickHandler);
  router.onBeforeRouteChange = beforeRouteChangeHandler;
}

function initScrollObserver(): void {
  const sidebar = document.querySelector('.VPSidebar');
  if (!sidebar) return;
  
  const scrollContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
  
  if (sidebarScrollHandler) {
    scrollContainer.removeEventListener('scroll', sidebarScrollHandler);
  }
  
  sidebarScrollHandler = () => {
    if (isRestoring) return;
    const pageState = store.getPageState(currentPath);
    pageState.sidebar.sidebarScrollY = scrollContainer.scrollTop;
  };
  
  scrollContainer.addEventListener('scroll', sidebarScrollHandler, { passive: true });
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
  
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  
  if (beforeUnloadHandler) {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    beforeUnloadHandler = null;
  }
  
  const sidebar = document.querySelector('.VPSidebar');
  if (sidebar && sidebarScrollHandler) {
    const scrollContainer = sidebar.querySelector('.VPSidebar__scroll') || sidebar;
    scrollContainer.removeEventListener('scroll', sidebarScrollHandler);
    sidebarScrollHandler = null;
  }
  
  if (globalClickHandler) {
    document.removeEventListener('click', globalClickHandler);
    globalClickHandler = null;
  }
  
  if (beforeRouteChangeHandler) {
    router.onBeforeRouteChange = undefined;
    beforeRouteChangeHandler = null;
  }
}

async function handleRouteChange(): Promise<void> {
  console.log('[PageStateCache] handleRouteChange', { from: currentPath, to: route.path });
  
  isNavigating = true;
  currentPath = route.path;
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] handleRouteChange: sidebar not found after route change');
    isNavigating = false;
    return;
  }
  
  initMutationObserver();
  initScrollObserver();
  initMobileSidebarObserver();
  initGlobalClickHandler();
  restoreCurrentState();
}

watch(() => route.path, () => {
  handleRouteChange();
});

onMounted(async () => {
  console.log('[PageStateCache] onMounted', { path: route.path });
  
  stateSavedBeforeUnload = false;
  
  const sidebar = await waitForSidebar();
  if (!sidebar) {
    console.warn('[PageStateCache] onMounted: sidebar not found');
    return;
  }
  
  console.log('[PageStateCache] sidebar found, initializing observers and restoring state');
  
  initMutationObserver();
  initScrollObserver();
  initMobileSidebarObserver();
  initGlobalClickHandler();
  restoreCurrentState();
  
  scrollHandler = () => {
    if (isRestoring) return;
    const pageState = store.getPageState(currentPath);
    pageState.scrollY = window.scrollY;
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  beforeUnloadHandler = () => {
    if (stateSavedBeforeUnload) {
      console.log('[PageStateCache] beforeUnloadHandler: state already saved, skipping');
      return;
    }
    if (isRestoring || isNavigating) return;
    console.log('[PageStateCache] beforeUnloadHandler: saving state');
    saveCurrentState(true);
  };
  window.addEventListener('beforeunload', beforeUnloadHandler);
});

onBeforeUnmount(() => {
  isRestoring = false;
  isNavigating = false;
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
