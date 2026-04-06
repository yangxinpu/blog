<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const brandText = 'NAILUO';
const brandChars = brandText.split('');
const isVisible = ref(false);
const isActive = ref(false);

const INITIAL_DURATION = 1100;
const ROUTE_DURATION = 650;
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
      <div class="kb-loading__logo-wrapper">
        <div class="kb-loading__ring-container">
          <div class="kb-loading__ring kb-loading__ring--primary"></div>
          <div class="kb-loading__ring kb-loading__ring--reverse"></div>
          <div class="kb-loading__ring kb-loading__ring--dotted"></div>
        </div>

        <div class="kb-loading__logo-glow"></div>
        <img
          src="/assets/logo.png"
          alt="NaiLuo logo"
          class="kb-loading__logo"
        />
        <div class="kb-loading__pulse-ring"></div>
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

      <div class="kb-loading__particles">
        <span
          v-for="i in 12"
          :key="i"
          class="kb-loading__particle"
          :style="{
            '--particle-angle': `${(i - 1) * 30}deg`,
            '--particle-distance': `${80 + (i - 1) * 14}px`,
            '--particle-delay': `${(i - 1) * 0.12}s`,
          }"
        ></span>
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
  gap: 2rem;
}

.kb-loading__logo-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kb-loading__ring-container {
  position: absolute;
  inset: 0;
}

.kb-loading__ring {
  position: absolute;
  border-radius: 50%;
}

.kb-loading__ring--primary {
  inset: 0;
  border: 2px solid transparent;
  border-top-color: var(--vp-c-brand-1);
  border-right-color: var(--vp-c-brand-1);
  opacity: 0.85;
  animation: kb-spin 3s linear infinite;
}

.kb-loading__ring--reverse {
  inset: 10px;
  border: 2px solid transparent;
  border-bottom-color: var(--vp-c-brand-2);
  border-left-color: var(--vp-c-brand-2);
  opacity: 0.58;
  animation: kb-spin-reverse 4s linear infinite;
}

.kb-loading__ring--dotted {
  inset: -10px;
  border: 2px dashed color-mix(in srgb, var(--vp-c-brand-1) 60%, transparent);
  opacity: 0.4;
  animation: kb-spin 8s linear infinite;
}

.kb-loading__logo-glow {
  position: absolute;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--vp-c-brand-1) 0%, transparent 70%);
  filter: blur(20px);
  animation: kb-breathe 2s ease-in-out infinite;
}

.kb-loading__logo {
  position: relative;
  z-index: 2;
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: drop-shadow(
    0 0 18px color-mix(in srgb, var(--vp-c-brand-1) 65%, transparent)
  );
  animation: kb-float-logo 2s ease-in-out infinite;
}

.kb-loading__pulse-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 80%, transparent);
  border-radius: 50%;
  animation: kb-pulse-ring 2s ease-out infinite;
}

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

.kb-loading__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.kb-loading__particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 12px color-mix(in srgb, var(--vp-c-brand-1) 80%, transparent);
  transform: translate(-50%, -50%) rotate(var(--particle-angle))
    translateY(calc(var(--particle-distance) * -1));
  opacity: 0;
  animation: kb-particle-float 2s ease-in-out infinite;
  animation-delay: var(--particle-delay);
}

@keyframes kb-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes kb-spin-reverse {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
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

@keyframes kb-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.45;
  }

  50% {
    transform: scale(1.14);
    opacity: 0.8;
  }
}

@keyframes kb-float-logo {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes kb-pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  70% {
    transform: scale(1.45);
    opacity: 0;
  }

  100% {
    transform: scale(1.45);
    opacity: 0;
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

@keyframes kb-particle-float {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--particle-angle))
      translateY(calc((var(--particle-distance) - 12px) * -1)) scale(0.5);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--particle-angle))
      translateY(calc(var(--particle-distance) * -1)) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--particle-angle))
      translateY(calc((var(--particle-distance) + 14px) * -1)) scale(0.5);
  }
}

@media (max-width: 640px) {
  .kb-loading__logo-wrapper {
    width: 120px;
    height: 120px;
  }

  .kb-loading__ring--reverse {
    inset: 8px;
  }

  .kb-loading__ring--dotted {
    inset: -8px;
  }

  .kb-loading__logo {
    width: 60px;
    height: 60px;
  }

  .kb-loading__brand {
    letter-spacing: 0.18em;
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
