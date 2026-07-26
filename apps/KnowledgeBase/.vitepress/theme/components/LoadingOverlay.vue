<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vitepress';
import { useLoadingState } from '../composables/useLoadingState';

const router = useRouter();
const { setLoading, markPageReady, isLoading, resetForNavigation } = useLoadingState();

const brandText = 'NAILUO';
const brandChars = brandText.split('');
const isVisible = ref(false);
const isActive = ref(false);

const SHOW_DELAY = 0;
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

function onRouteChangeStart() {
  clearTimers();
  navId++;
  currentNavId = navId;
  loadingStartTime = Date.now();
  resetForNavigation();
  setLoading(true);

  showTimer = window.setTimeout(() => {
    showTimer = null;
    if (navId !== currentNavId) return;
    showOverlay();

    minDisplayTimer = window.setTimeout(() => {
      minDisplayTimer = null;
    }, MIN_DISPLAY_TIME);
  }, SHOW_DELAY);
}

function onRouteChangeEnd() {
  if (navId !== currentNavId) return;

  const elapsed = Date.now() - loadingStartTime;

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
  onRouteChangeStart();

  safetyTimer = window.setTimeout(() => {
    safetyTimer = null;
    if (!isLoading()) return;
    onRouteChangeEnd();
  }, 3000);

  router.onBeforeRouteChange = async (to) => {
    onRouteChangeStart();
    return true;
  };

  router.onAfterPageLoad = async (to) => {
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
    class="kb-loading"
    :class="{ 'kb-loading-active': isActive }"
    aria-live="polite"
    aria-label="Loading page"
  >
    <div class="kb-loading__background">
      <div class="kb-loading__orb kb-loading__orb--one"></div>
      <div class="kb-loading__orb kb-loading__orb--two"></div>
      <div class="kb-loading__orb kb-loading__orb--three"></div>
    </div>

    <div class="kb-loading__content">

      <div class="loader">
        <div class="particle-ring">
          <div class="particle" v-for="i in 12" :key="i" :style="{ '--i': i }"></div>
        </div>
      </div>

      <div class="kb-loading__text">
        <h2 class="kb-loading__brand">
          <span
            v-for="(char, index) in brandChars"
            :key="`${char}-${index}`"
            class="kb-loading__char"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            {{ char }}
          </span>
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top left,
      rgba(0, 213, 196, 0.18),
      transparent 35%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(25, 250, 198, 0.14),
      transparent 38%
    ),
    var(--vp-c-bg);
  opacity: 0;
  transition: opacity 0.42s ease;
}

.kb-loading-active {
  opacity: 1;
}

.kb-loading__background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.kb-loading__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  background: radial-gradient(circle, var(--vp-c-brand-1) 0%, transparent 70%);
}

.kb-loading__orb--one {
  top: -18%;
  left: -12%;
  width: 60vw;
  height: 60vw;
  opacity: 0.16;
  animation: kb-float-one 8s ease-in-out infinite;
}

.kb-loading__orb--two {
  right: -20%;
  bottom: -28%;
  width: 68vw;
  height: 68vw;
  opacity: 0.12;
  animation: kb-float-two 10s ease-in-out infinite;
}

.kb-loading__orb--three {
  top: 50%;
  left: 50%;
  width: 38vw;
  height: 38vw;
  opacity: 0.1;
  transform: translate(-50%, -50%);
  animation: kb-pulse-bg 4s ease-in-out infinite;
}

.kb-loading__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.loader {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.particle-ring {
  position: relative;
  width: 100px;
  height: 100px;
  animation: ring-rotate 2s linear infinite;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(calc((var(--i) - 1) * 30deg)) translateY(-40px);
}

/* ===== 文字 ===== */
.kb-loading__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.kb-loading__brand {
  display: flex;
  gap: 0.1em;
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 2.7rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--vp-c-brand-1);
}

.kb-loading__char {
  display: inline-block;
  text-shadow: 0 0 20px color-mix(in srgb, var(--vp-c-brand-1) 75%, transparent);
  animation: kb-char-glow 2s ease-in-out infinite;
}

@keyframes kb-float-one {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(10%, 14%) scale(1.08);
  }
}

@keyframes kb-float-two {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-12%, -8%) scale(1.12);
  }
}

@keyframes kb-pulse-bg {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.08;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.14;
  }
}

@keyframes kb-char-glow {
  0%,
  100% {
    color: var(--vp-c-brand-1);
  }

  50% {
    color: #ffffff;
  }
}

@keyframes kb-caption-fade {
  0%,
  100% {
    opacity: 0.45;
  }

  50% {
    opacity: 1;
  }
}

@keyframes ring-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kb-loading *,
  .kb-loading *::before,
  .kb-loading *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
