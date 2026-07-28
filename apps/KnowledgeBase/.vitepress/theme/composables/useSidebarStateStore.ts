import { reactive } from 'vue';

export interface SidebarState {
  expandedGroups: Record<string, boolean>;
  activeMenuItem: string;
  sidebarScrollY: number;
  mobileSidebarOpen: boolean;
}

export interface PageState {
  scrollY: number;
  sidebar: SidebarState;
}

const STATE_STORAGE_KEY = 'kb_page_state_v2';
const SIDEBAR_GLOBAL_KEY = 'kb_sidebar_global_state';

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const state = reactive<{
  pageStates: Record<string, PageState>;
  globalSidebar: Partial<SidebarState>;
}>({
  pageStates: {},
  globalSidebar: {},
});

let saveTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 200;
let isLoaded = false;

function getCategoryPath(path: string): string {
  const parts = path.split('/').filter(p => p);
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`;
  }
  return path;
}

function getPageStateKey(path: string): string {
  return getCategoryPath(path);
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
    const stored = safeParseJSON<Record<string, PageState>>(localStorage.getItem(STATE_STORAGE_KEY));
    if (stored) {
      state.pageStates = stored;
    }

    const globalStored = safeParseJSON<Partial<SidebarState>>(localStorage.getItem(SIDEBAR_GLOBAL_KEY));
    if (globalStored) {
      state.globalSidebar = globalStored;
    }
    isLoaded = true;
  } catch (e) {
    console.warn('[SidebarStateStore] Failed to load from localStorage:', e);
  }
}

function saveToStorage(): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state.pageStates));
    localStorage.setItem(SIDEBAR_GLOBAL_KEY, JSON.stringify(state.globalSidebar));
  } catch (e) {
    console.warn('[SidebarStateStore] Failed to save to localStorage:', e);
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
    const key = getPageStateKey(path);
    if (!state.pageStates[key]) {
      state.pageStates[key] = {
        scrollY: 0,
        sidebar: {
          expandedGroups: {},
          activeMenuItem: '',
          sidebarScrollY: 0,
          mobileSidebarOpen: false,
        },
      };
    }
    return state.pageStates[key];
  }

  function setPageState(path: string, updates: Partial<PageState>): void {
    const key = getPageStateKey(path);
    if (!state.pageStates[key]) {
      state.pageStates[key] = {
        scrollY: 0,
        sidebar: {
          expandedGroups: {},
          activeMenuItem: '',
          sidebarScrollY: 0,
          mobileSidebarOpen: false,
        },
      };
    }
    Object.assign(state.pageStates[key], updates);
    debouncedSave();
  }

  function setSidebarState(path: string, updates: Partial<SidebarState>): void {
    const pageState = getPageState(path);
    Object.assign(pageState.sidebar, updates);
    debouncedSave();
  }

  function setGlobalSidebar(updates: Partial<SidebarState>): void {
    Object.assign(state.globalSidebar, updates);
    debouncedSave();
  }

  function getGlobalSidebar(): Partial<SidebarState> {
    return state.globalSidebar;
  }

  function updateExpandedGroup(path: string, groupKey: string, expanded: boolean): void {
    const pageState = getPageState(path);
    pageState.sidebar.expandedGroups[groupKey] = expanded;
    debouncedSave();
  }

  function setActiveMenuItem(path: string, menuItem: string): void {
    const pageState = getPageState(path);
    pageState.sidebar.activeMenuItem = menuItem;
    debouncedSave();
  }

  function setSidebarScroll(path: string, scrollY: number): void {
    const pageState = getPageState(path);
    pageState.sidebar.sidebarScrollY = scrollY;
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
    state.globalSidebar = {};
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      localStorage.removeItem(STATE_STORAGE_KEY);
      localStorage.removeItem(SIDEBAR_GLOBAL_KEY);
    } catch {
      // ignore
    }
  }

  loadFromStorage();

  return {
    getPageState,
    setPageState,
    setSidebarState,
    setGlobalSidebar,
    getGlobalSidebar,
    updateExpandedGroup,
    setActiveMenuItem,
    setSidebarScroll,
    setMobileSidebarOpen,
    getMobileSidebarOpen,
    saveNow,
    saveDebounced: debouncedSave,
    clearAll,
    state,
  };
}
