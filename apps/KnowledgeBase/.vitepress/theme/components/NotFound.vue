<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useData } from 'vitepress';

const { lang } = useData();

const isVisible = ref(false);

const i18n = computed(() => {
  const locale = lang.value;
  if (locale === 'zh' || locale === 'zh-CN') {
    return {
      message: '文档暂时未开发，请检查URL拼写是否正确，或使用搜索功能查找内容，也可以返回首页浏览其他文档',
      home: '首页',
      frontEnd: '前端',
      backEnd: '后端',
      devOps: '运维',
    };
  }
  return {
    message: 'Document not yet developed. Please check if the URL is spelled correctly, use search to find content, or return to homepage to browse other documents.',
    home: 'Home',
    frontEnd: 'Frontend',
    backEnd: 'Backend',
    devOps: 'DevOps',
  };
});

const currentLang = computed(() => {
  return lang.value === 'zh' || lang.value === 'zh-CN' ? 'zh' : 'en';
});

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <div class="not-found-container">
    <div class="not-found__background">
      <div class="not-found__diagonal not-found__diagonal--1"></div>
      <div class="not-found__diagonal not-found__diagonal--2"></div>
      <div class="not-found__diagonal not-found__diagonal--3"></div>
      <div class="not-found__diagonal not-found__diagonal--4"></div>
      <div class="not-found__gradient-orb"></div>
    </div>

    <div class="not-found__content" :class="{ 'not-found__content--visible': isVisible }">
      <div class="not-found__number">
        <span class="not-found__digit">4</span>
        <span class="not-found__digit">0</span>
        <span class="not-found__digit">4</span>
      </div>

      <div class="not-found__message">{{ i18n.message }}</div>

      <div class="not-found__links">
        <a class="not-found__link" :href="`/${currentLang}/`">{{ i18n.home }}</a>
        <span class="not-found__separator">/</span>
        <a class="not-found__link" :href="`/${currentLang}/前端/`">{{ i18n.frontEnd }}</a>
        <span class="not-found__separator">/</span>
        <a class="not-found__link" :href="`/${currentLang}/后端/`">{{ i18n.backEnd }}</a>
        <span class="not-found__separator">/</span>
        <a class="not-found__link" :href="`/${currentLang}/运维/`">{{ i18n.devOps }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.not-found__background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.not-found__diagonal {
  position: absolute;
  height: 100%;
  width: 40%;
  background: linear-gradient(
    135deg,
    rgba(64, 64, 64, 0.3) 0%,
    rgba(32, 32, 32, 0.5) 100%
  );
  transform: skewX(-15deg);
}

.not-found__diagonal--1 {
  left: -10%;
  top: 0;
  animation: slide-in-left 1s ease-out;
}

.not-found__diagonal--2 {
  left: 20%;
  top: 0;
  background: linear-gradient(
    135deg,
    rgba(48, 48, 48, 0.4) 0%,
    rgba(24, 24, 24, 0.6) 100%
  );
  animation: slide-in-left 1s ease-out 0.1s both;
}

.not-found__diagonal--3 {
  left: 50%;
  top: 0;
  background: linear-gradient(
    135deg,
    rgba(32, 32, 32, 0.5) 0%,
    rgba(16, 16, 16, 0.7) 100%
  );
  animation: slide-in-left 1s ease-out 0.2s both;
}

.not-found__diagonal--4 {
  left: 80%;
  top: 0;
  background: linear-gradient(
    135deg,
    rgba(40, 40, 40, 0.3) 0%,
    rgba(20, 20, 20, 0.5) 100%
  );
  animation: slide-in-left 1s ease-out 0.3s both;
}

.not-found__gradient-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(64, 108, 255, 0.15) 0%,
    transparent 70%
  );
  animation: pulse-glow 4s ease-in-out infinite;
}

.not-found__content {
  position: relative;
  z-index: 1;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.not-found__content--visible {
  opacity: 1;
  transform: translateY(0);
}

.not-found__number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 2.5rem;
}

.not-found__digit {
  font-size: 12rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.not-found__message {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  margin-bottom: 3rem;
  animation: fade-in-up 0.8s ease 1s both;
}

.not-found__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  animation: fade-in-up 0.8s ease 1.2s both;
}

.not-found__link {
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.not-found__link:hover {
  background-color: rgba(64, 108, 255, 0.15);
  color: var(--vp-c-brand-light);
}

.not-found__separator {
  color: var(--vp-c-text-4);
  font-size: 0.9rem;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%) skewX(-15deg);
    opacity: 0;
  }
  to {
    transform: translateX(0) skewX(-15deg);
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@media (max-width: 768px) {
  .not-found__digit {
    font-size: 6rem;
  }

  .not-found__title {
    font-size: 1rem;
  }

  .not-found__subtitle {
    bottom: -1.5rem;
    font-size: 0.8rem;
  }

  .not-found__message {
    font-size: 0.85rem;
    padding: 0 1rem;
  }

  .not-found__links {
    gap: 0.25rem;
  }

  .not-found__link {
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .not-found__digit {
    font-size: 4rem;
  }

  .not-found__title {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .not-found__subtitle {
    bottom: -1.25rem;
    font-size: 0.7rem;
  }

  .not-found__message {
    margin-bottom: 2rem;
  }
}
</style>