<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const brandText = 'NAILUO';
const brandChars = brandText.split('');
const isVisible = ref(false);
const isActive = ref(false);

// 动画周期为 4s（含 1s 延迟），初始展示一个完整周期
const INITIAL_DURATION = 5000;
const ROUTE_DURATION = 4200;
const FADE_DURATION = 420;

const LOADED_KEY = 'kb-loaded';

let closeTimer: number | null = null;
let hideTimer: number | null = null;

function clearTimers() {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  if (hideTimer !== null) {
    window.clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function hasLoadedBefore(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return sessionStorage.getItem(LOADED_KEY) === 'true';
}

function markAsLoaded() {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(LOADED_KEY, 'true');
}

function playOverlay(duration: number) {
  if (typeof window === 'undefined') {
    return;
  }

  if (hasLoadedBefore()) {
    return;
  }

  clearTimers();
  isVisible.value = true;

  window.requestAnimationFrame(() => {
    isActive.value = true;
  });

  closeTimer = window.setTimeout(() => {
    isActive.value = false;

    hideTimer = window.setTimeout(() => {
      isVisible.value = false;
      markAsLoaded();
    }, FADE_DURATION);
  }, duration);
}

onMounted(() => {
  playOverlay(INITIAL_DURATION);
});

watch(
  () => route.path,
  (nextPath, previousPath) => {
    if (!previousPath || nextPath === previousPath) {
      return;
    }

    if (hasLoadedBefore()) {
      return;
    }

    playOverlay(ROUTE_DURATION);
  }
);

onBeforeUnmount(() => {
  clearTimers();
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
        <div class="box1"></div>
        <div class="box2"></div>
        <div class="box3"></div>
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
        <p class="kb-loading__caption">Loading...</p>
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

/* ===== 盒子加载动画 ===== */
.loader {
  width: 112px;
  height: 112px;
  position: relative;
}

.box1,
.box2,
.box3 {
  border: 16px solid var(--vp-c-brand-1);
  box-sizing: border-box;
  position: absolute;
  display: block;
}

.box1 {
  width: 112px;
  height: 48px;
  margin-top: 64px;
  margin-left: 0px;
  animation: abox1 4s 1s forwards ease-in-out infinite;
}

.box2 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 0px;
  animation: abox2 4s 1s forwards ease-in-out infinite;
}

.box3 {
  width: 48px;
  height: 48px;
  margin-top: 0px;
  margin-left: 64px;
  animation: abox3 4s 1s forwards ease-in-out infinite;
}

@keyframes abox1 {
  0% {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  25% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  50% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }

  75% {
    width: 48px;
    height: 112px;
    margin-top: 0px;
    margin-left: 0px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  100% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }
}

@keyframes abox2 {
  0% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  25% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  50% {
    width: 112px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  75% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  100% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }
}

@keyframes abox3 {
  0% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  12.5% {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
  }

  25% {
    width: 48px;
    height: 112px;
    margin-top: 0px;
    margin-left: 64px;
  }

  37.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  50% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  62.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  75% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  87.5% {
    width: 48px;
    height: 48px;
    margin-top: 64px;
    margin-left: 64px;
  }

  100% {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
  }
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

.kb-loading__caption {
  margin: 0;
  font-size: 0.875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  animation: kb-caption-fade 1.6s ease-in-out infinite;
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
