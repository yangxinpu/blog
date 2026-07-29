import { reactive } from 'vue';

export interface SidebarGlobalState {
  expandedGroups: Record<string, boolean>;
  sidebarScrollY: number;
}

export interface PageState {
  scrollY: number;
  activeMenuItem: string;
  lastAccessTime: number;
}

export interface CategorySidebarStates {
  [categoryPath: string]: SidebarGlobalState;
}

const PAGE_STATE_KEY = 'kb_page_states_v3';
const SIDEBAR_CATEGORY_KEY = 'kb_sidebar_category_states_v3';
const SIDEBAR_GLOBAL_KEY = 'kb_sidebar_global_state_v3';

const isBrowser = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';

const state = reactive<{
  pageStates: Record<string, PageState>;
  categorySidebars: Record<string, SidebarGlobalState>;
  globalSidebar: {
    mobileSidebarOpen: boolean;
  };
}>({
  pageStates: {},
  categorySidebars: {},
  globalSidebar: {
    mobileSidebarOpen: false,
  },
});

let saveTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 200;
let isLoaded = false;

export function getFullPath(path: string): string {
  const cleanPath = path.split('#')[0].split('?')[0];
  return cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
}

export function getCategoryPath(path: string): string {
  const parts = path.split('/').filter(p => p);
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`;
  }
  return `/${parts.join('/')}/`;
}

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function loadFromStorage(): void {
  if (!isBrowser || isLoaded) return;
  
  try {
    const pageStates = safeParseJSON<Record<string, PageState>>(sessionStorage.getItem(PAGE_STATE_KEY));
    if (pageStates) {
      state.pageStates = pageStates;
    }

    const categorySidebars = safeParseJSON<Record<string, SidebarGlobalState>>(sessionStorage.getItem(SIDEBAR_CATEGORY_KEY));
    if (categorySidebars) {
      state.categorySidebars = categorySidebars;
    }

    const globalSidebar = safeParseJSON<{ mobileSidebarOpen: boolean }>(sessionStorage.getItem(SIDEBAR_GLOBAL_KEY));
    if (globalSidebar) {
      state.globalSidebar = globalSidebar;
    }
    isLoaded = true;
  } catch (e) {
    console.warn('[SidebarStateStore] Failed to load from sessionStorage:', e);
  }
}

function saveToStorage(): void {
  if (!isBrowser) return;
  
  try {
    sessionStorage.setItem(PAGE_STATE_KEY, JSON.stringify(state.pageStates));
    sessionStorage.setItem(SIDEBAR_CATEGORY_KEY, JSON.stringify(state.categorySidebars));
    sessionStorage.setItem(SIDEBAR_GLOBAL_KEY, JSON.stringify(state.globalSidebar));
  } catch (e) {
    console.warn('[SidebarStateStore] Failed to save to sessionStorage:', e);
  }
}

function debouncedSave(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(() => {
    saveToStorage();
    saveTimer = null;
  }, DEBOUNCE_DELAY);
}

export function useSidebarStateStore() {
  function getPageState(path: string): PageState {
    const key = getFullPath(path);
    if (!state.pageStates[key]) {
      state.pageStates[key] = {
        scrollY: 0,
        activeMenuItem: '',
        lastAccessTime: Date.now(),
      };
    }
    return state.pageStates[key];
  }

  function getCategorySidebar(path: string): SidebarGlobalState {
    const key = getCategoryPath(path);
    if (!state.categorySidebars[key]) {
      state.categorySidebars[key] = {
        expandedGroups: {},
        sidebarScrollY: 0,
      };
    }
    return state.categorySidebars[key];
  }

  function setPageState(path: string, updates: Partial<PageState>): void {
    const key = getFullPath(path);
    if (!state.pageStates[key]) {
      state.pageStates[key] = {
        scrollY: 0,
        activeMenuItem: '',
        lastAccessTime: Date.now(),
      };
    }
    Object.assign(state.pageStates[key], updates, { lastAccessTime: Date.now() });
    debouncedSave();
  }

  function setCategorySidebar(path: string, updates: Partial<SidebarGlobalState>): void {
    const sidebar = getCategorySidebar(path);
    Object.assign(sidebar, updates);
    debouncedSave();
  }

  function updateExpandedGroup(path: string, groupKey: string, expanded: boolean): void {
    const sidebar = getCategorySidebar(path);
    sidebar.expandedGroups[groupKey] = expanded;
    debouncedSave();
  }

  function setActiveMenuItem(path: string, menuItem: string): void {
    const pageState = getPageState(path);
    pageState.activeMenuItem = menuItem;
    debouncedSave();
  }

  function setSidebarScroll(path: string, scrollY: number): void {
    const sidebar = getCategorySidebar(path);
    sidebar.sidebarScrollY = scrollY;
    debouncedSave();
  }

  function setPageScroll(path: string, scrollY: number): void {
    const pageState = getPageState(path);
    pageState.scrollY = scrollY;
    debouncedSave();
  }

  function setMobileSidebarOpen(open: boolean): void {
    state.globalSidebar.mobileSidebarOpen = open;
    debouncedSave();
  }

  function getMobileSidebarOpen(): boolean {
    return state.globalSidebar.mobileSidebarOpen ?? false;
  }

  function saveNow(): void {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    saveToStorage();
  }

  function clearAll(): void {
    state.pageStates = {};
    state.categorySidebars = {};
    state.globalSidebar = { mobileSidebarOpen: false };
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      sessionStorage.removeItem(PAGE_STATE_KEY);
      sessionStorage.removeItem(SIDEBAR_CATEGORY_KEY);
      sessionStorage.removeItem(SIDEBAR_GLOBAL_KEY);
    } catch {
      // ignore
    }
  }

  loadFromStorage();

  return {
    getPageState,
    getCategorySidebar,
    setPageState,
    setCategorySidebar,
    updateExpandedGroup,
    setActiveMenuItem,
    setSidebarScroll,
    setPageScroll,
    setMobileSidebarOpen,
    getMobileSidebarOpen,
    saveNow,
    saveDebounced: debouncedSave,
    clearAll,
    state,
  };
}
