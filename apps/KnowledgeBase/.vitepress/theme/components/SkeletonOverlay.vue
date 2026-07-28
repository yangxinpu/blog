<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vitepress';
import { useLoadingState } from '../composables/useLoadingState';

const router = useRouter();
const route = useRoute();
const { setLoading, markPageReady, isLoading, resetForNavigation } = useLoadingState();

const isVisible = ref(false);
const isActive = ref(false);

const isHomePage = computed(() => {
  const path = route.path;
  return path === '/' || path === '/zh/' || path === '/en/' || path === '/zh' || path === '/en';
});

const SHOW_DELAY = 300;
const MIN_DISPLAY_TIME = 400;
const FADE_DURATION = 420;

let showTimer: number | null = null;
let hideTimer: number | null = null;
let minDisplayTimer: number | null = null;
let safetyTimer: number | null = null;
let loadingStartTime = 0;
let navId = 0;
let currentNavId = 0;

function clearTimers() {
  if (showTimer !== null) {
    window.clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (minDisplayTimer !== null) {
    window.clearTimeout(minDisplayTimer);
    minDisplayTimer = null;
  }
  if (safetyTimer !== null) {
    window.clearTimeout(safetyTimer);
    safetyTimer = null;
  }
}

function showOverlay() {
  isVisible.value = true;
  document.body.style.overflow = 'hidden';
  window.requestAnimationFrame(() => {
    isActive.value = true;
  });
}

function hideOverlay() {
  isActive.value = false;
  document.body.style.overflow = '';
  hideTimer = window.setTimeout(() => {
    isVisible.value = false;
    markPageReady();
  }, FADE_DURATION);
}

function getLoadedPages(): Set<string> {
  try {
    const stored = sessionStorage.getItem('kb_loaded_pages');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function markPageAsLoaded(path: string) {
  try {
    const loadedPages = getLoadedPages();
    loadedPages.add(path);
    sessionStorage.setItem('kb_loaded_pages', JSON.stringify([...loadedPages]));
  } catch (e) {
    console.warn('[SkeletonOverlay] Failed to mark page as loaded:', e);
  }
}

function hasPageLoaded(path: string): boolean {
  return getLoadedPages().has(path);
}

function onRouteChangeStart(targetPath?: string) {
  clearTimers();
  navId++;
  currentNavId = navId;
  loadingStartTime = Date.now();
  resetForNavigation();
  setLoading(true);

  const path = targetPath || window.location.pathname;
  const categoryPath = getCategoryPath(path);

  console.log('[SkeletonOverlay] Route change to:', path, 'category:', categoryPath);

  if (hasPageLoaded(categoryPath)) {
    console.log('[SkeletonOverlay] Page already loaded, skipping animation:', categoryPath);
    return;
  }

  showTimer = window.setTimeout(() => {
    showTimer = null;
    if (navId !== currentNavId) return;
    showOverlay();

    minDisplayTimer = window.setTimeout(() => {
      minDisplayTimer = null;
    }, MIN_DISPLAY_TIME);
  }, SHOW_DELAY);
}

function getCategoryPath(path: string): string {
  if (!path || path === '/') {
    return path;
  }
  
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  const parts = normalizedPath.split('/').filter(p => p && p !== '_clear');
  
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`;
  }
  
  if (parts.length === 1) {
    return `/${parts[0]}/`;
  }
  
  return path;
}

function onRouteChangeEnd() {
  if (navId !== currentNavId) return;

  const elapsed = Date.now() - loadingStartTime;
  const categoryPath = getCategoryPath(window.location.pathname);
  markPageAsLoaded(categoryPath);

  if (showTimer !== null) {
    window.clearTimeout(showTimer);
    showTimer = null;
    setLoading(false);
    markPageReady();
    return;
  }

  if (minDisplayTimer !== null) {
    const remaining = MIN_DISPLAY_TIME - elapsed;
    if (remaining > 0) {
      minDisplayTimer = window.setTimeout(() => {
        minDisplayTimer = null;
        hideOverlay();
      }, remaining);
    } else {
      minDisplayTimer = null;
      hideOverlay();
    }
  } else {
    hideOverlay();
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).removeInlineSkeleton) {
    (window as any).removeInlineSkeleton();
  } else {
    const inlineSkeleton = document.getElementById('inline-skeleton');
    if (inlineSkeleton && inlineSkeleton.parentNode) {
      inlineSkeleton.parentNode.removeChild(inlineSkeleton);
    }
  }

  clearTimers();
  navId++;
  currentNavId = navId;
  loadingStartTime = Date.now();
  resetForNavigation();
  setLoading(false);

  console.log('[SkeletonOverlay] Vue mounted, inline skeleton removed');

  safetyTimer = window.setTimeout(() => {
    safetyTimer = null;
    if (document.readyState === 'complete') {
      onRouteChangeEnd();
    }
  }, 1000);

  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      console.log('[SkeletonOverlay] Document already complete');
      markPageReady();
    } else {
      window.addEventListener('load', () => {
        console.log('[SkeletonOverlay] Window load event');
        markPageReady();
      }, { once: true });
    }
  }

  router.onBeforeRouteChange = async (to) => {
    onRouteChangeStart(to);
    return true;
  };

  router.onAfterPageLoad = async (to) => {
    console.log('[SkeletonOverlay] onAfterPageLoad:', to);
    onRouteChangeEnd();
  };
});

onBeforeUnmount(() => {
  clearTimers();
  router.onBeforeRouteChange = undefined;
  router.onAfterPageLoad = undefined;
});
</script>

<template>
  <div
    v-if="isVisible"
    class="kb-skeleton"
    :class="{ 'kb-skeleton-active': isActive, 'kb-skeleton--home': isHomePage }"
    aria-live="polite"
    aria-label="Loading page"
  >
    <div class="kb-skeleton__nav">
      <div class="kb-skeleton__nav-logo shimmer"></div>
      <div class="kb-skeleton__nav-items">
        <div class="kb-skeleton__nav-item shimmer" style="width: 60px"></div>
        <div class="kb-skeleton__nav-item shimmer" style="width: 70px"></div>
        <div class="kb-skeleton__nav-item shimmer" style="width: 55px"></div>
        <div class="kb-skeleton__nav-item shimmer" style="width: 65px"></div>
      </div>
    </div>

    <template v-if="isHomePage">
      <div class="kb-skeleton__home">
        <section class="kb-skeleton__hero">
          <div class="kb-skeleton__hero-left">
            <div class="kb-skeleton__hero-name shimmer"></div>
            <div class="kb-skeleton__hero-text shimmer"></div>
            <div class="kb-skeleton__hero-tagline shimmer"></div>

            <div class="kb-skeleton__hero-info">
              <div class="kb-skeleton__stats">
                <div class="kb-skeleton__stat">
                  <div class="kb-skeleton__stat-value shimmer"></div>
                  <div class="kb-skeleton__stat-label shimmer"></div>
                </div>
                <div class="kb-skeleton__stat">
                  <div class="kb-skeleton__stat-value shimmer"></div>
                  <div class="kb-skeleton__stat-label shimmer"></div>
                </div>
                <div class="kb-skeleton__stat">
                  <div class="kb-skeleton__stat-value shimmer"></div>
                  <div class="kb-skeleton__stat-label shimmer"></div>
                </div>
              </div>

              <div class="kb-skeleton__tech-tags">
                <div v-for="i in 17" :key="i" class="kb-skeleton__tech-tag shimmer"></div>
              </div>
            </div>
          </div>

          <div class="kb-skeleton__hero-right">
            <div class="kb-skeleton__hero-logo shimmer"></div>
          </div>
        </section>

        <section class="kb-skeleton__features">
          <div v-for="i in 8" :key="i" class="kb-skeleton__feature">
            <div class="kb-skeleton__feature-icon shimmer"></div>
            <div class="kb-skeleton__feature-title shimmer"></div>
            <div class="kb-skeleton__feature-desc shimmer"></div>
            <div class="kb-skeleton__feature-desc shimmer" style="width: 70%"></div>
          </div>
        </section>
      </div>
    </template>

    <template v-else>
      <div class="kb-skeleton__body">
        <aside class="kb-skeleton__sidebar">
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 85%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 70%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 75%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 60%"></div>
          <div class="kb-skeleton__sidebar-group"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 80%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 65%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 72%"></div>
          <div class="kb-skeleton__sidebar-item shimmer" style="width: 55%"></div>
        </aside>

        <main class="kb-skeleton__content">
          <div class="kb-skeleton__title shimmer"></div>
          <div class="kb-skeleton__line shimmer" style="width: 100%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 92%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 88%"></div>
          <div class="kb-skeleton__code shimmer"></div>
          <div class="kb-skeleton__line shimmer" style="width: 95%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 85%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 78%"></div>
          <div class="kb-skeleton__heading shimmer"></div>
          <div class="kb-skeleton__line shimmer" style="width: 100%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 90%"></div>
          <div class="kb-skeleton__line shimmer" style="width: 82%"></div>
          <div class="kb-skeleton__list">
            <div class="kb-skeleton__list-item shimmer" style="width: 88%"></div>
            <div class="kb-skeleton__list-item shimmer" style="width: 76%"></div>
            <div class="kb-skeleton__list-item shimmer" style="width: 84%"></div>
          </div>
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.kb-skeleton {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--vp-c-bg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.kb-skeleton-active {
  opacity: 1;
}

.kb-skeleton__nav {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  gap: 32px;
}

.kb-skeleton__nav-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.kb-skeleton__nav-items {
  display: flex;
  gap: 24px;
  align-items: center;
}

.kb-skeleton__nav-item {
  height: 16px;
  border-radius: 4px;
}

.kb-skeleton__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.kb-skeleton__sidebar {
  width: 240px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  flex-shrink: 0;
  overflow-y: auto;
}

.kb-skeleton__sidebar-item {
  height: 14px;
  border-radius: 4px;
}

.kb-skeleton__sidebar-group {
  height: 1px;
  margin: 8px 0;
  background: var(--vp-c-divider);
}

.kb-skeleton__content {
  flex: 1;
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  max-width: 900px;
}

.kb-skeleton__title {
  width: 60%;
  height: 36px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.kb-skeleton__heading {
  width: 40%;
  height: 28px;
  border-radius: 6px;
  margin-top: 16px;
}

.kb-skeleton__line {
  height: 14px;
  border-radius: 4px;
}

.kb-skeleton__code {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  margin: 8px 0;
}

.kb-skeleton__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.kb-skeleton__list-item {
  height: 14px;
  border-radius: 4px;
}

.kb-skeleton__home {
  flex: 1;
  overflow-y: auto;
  padding: 40px 24px 60px;
}

.kb-skeleton--home .kb-skeleton__home {
  max-width: 1200px;
  margin: 0 auto;
}

.kb-skeleton__hero {
  display: flex;
  gap: 48px;
  padding: 40px 0 32px;
  align-items: flex-start;
}

.kb-skeleton__hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kb-skeleton__hero-name {
  width: 360px;
  max-width: 90%;
  height: 48px;
  border-radius: 10px;
}

.kb-skeleton__hero-text {
  width: 320px;
  max-width: 80%;
  height: 32px;
  border-radius: 8px;
}

.kb-skeleton__hero-tagline {
  width: 280px;
  max-width: 70%;
  height: 20px;
  border-radius: 4px;
}

.kb-skeleton__hero-info {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kb-skeleton__stats {
  display: flex;
  gap: 32px;
}

.kb-skeleton__stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kb-skeleton__stat-value {
  width: 56px;
  height: 28px;
  border-radius: 6px;
}

.kb-skeleton__stat-label {
  width: 70px;
  height: 12px;
  border-radius: 4px;
}

.kb-skeleton__tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.kb-skeleton__tech-tag {
  width: 68px;
  height: 24px;
  border-radius: 6px;
}

.kb-skeleton__hero-right {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kb-skeleton__hero-logo {
  width: 320px;
  height: 320px;
  border-radius: 16px;
}

.kb-skeleton__features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 16px 0;
}

.kb-skeleton__feature {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.kb-skeleton__feature-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.kb-skeleton__feature-title {
  width: 70%;
  height: 20px;
  border-radius: 4px;
}

.kb-skeleton__feature-desc {
  width: 100%;
  height: 12px;
  border-radius: 4px;
}

.shimmer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    var(--vp-c-bg-soft) 25%,
    var(--vp-c-divider) 50%,
    var(--vp-c-bg-soft) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1024px) {
  .kb-skeleton__sidebar {
    width: 200px;
  }

  .kb-skeleton__content {
    padding: 32px 32px;
  }

  .kb-skeleton__features {
    grid-template-columns: repeat(2, 1fr);
  }

  .kb-skeleton__hero-right {
    width: 280px;
  }

  .kb-skeleton__hero-logo {
    width: 240px;
    height: 240px;
  }
}

@media (max-width: 768px) {
  .kb-skeleton__nav {
    padding: 0 16px;
    gap: 16px;
  }

  .kb-skeleton__nav-items {
    gap: 12px;
  }

  .kb-skeleton__body {
    flex-direction: column;
  }

  .kb-skeleton__sidebar {
    width: 100%;
    height: 120px;
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .kb-skeleton__sidebar-item {
    width: calc(50% - 8px) !important;
  }

  .kb-skeleton__content {
    padding: 24px 16px;
  }

  .kb-skeleton__home {
    padding: 24px 16px 40px;
  }

  .kb-skeleton__hero {
    flex-direction: column;
    gap: 24px;
    padding: 24px 0 16px;
  }

  .kb-skeleton__hero-right {
    width: 100%;
    order: -1;
  }

  .kb-skeleton__hero-logo {
    width: 160px;
    height: 160px;
  }

  .kb-skeleton__hero-name {
    width: 260px;
    height: 36px;
  }

  .kb-skeleton__hero-text {
    width: 220px;
    height: 24px;
  }

  .kb-skeleton__hero-tagline {
    width: 180px;
    height: 16px;
  }

  .kb-skeleton__stats {
    gap: 20px;
  }

  .kb-skeleton__stat-value {
    width: 44px;
    height: 22px;
  }

  .kb-skeleton__stat-label {
    width: 56px;
  }

  .kb-skeleton__tech-tag {
    width: 56px;
    height: 22px;
  }

  .kb-skeleton__features {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
    background: var(--vp-c-divider);
  }
}
</style>
