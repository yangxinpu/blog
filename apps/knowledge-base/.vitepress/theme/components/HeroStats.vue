<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isZh = ref(true)

const SCROLL_LOCK_DURATION = 0

let isProgrammaticScroll = false
let lockTimer: ReturnType<typeof setTimeout> | null = null
let scrollListener: (() => void) | null = null
let isScrollLocked = false

function programmaticScrollToTop() {
  isProgrammaticScroll = true
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  requestAnimationFrame(() => {
    isProgrammaticScroll = false
  })
}

function releaseScrollLock() {
  isScrollLocked = false
  document.documentElement.classList.remove('is-loading')
  
  if (lockTimer !== null) {
    clearTimeout(lockTimer)
    lockTimer = null
  }
  if (scrollListener !== null) {
    window.removeEventListener('scroll', scrollListener)
    scrollListener = null
  }
  
  programmaticScrollToTop()
}

onMounted(() => {
  isZh.value = route.path.startsWith('/zh/')
  
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  
  isScrollLocked = true
  document.documentElement.classList.add('is-loading')
  
  scrollListener = () => {
    if (!isProgrammaticScroll && isScrollLocked) {
      programmaticScrollToTop()
    }
  }
  window.addEventListener('scroll', scrollListener, { passive: true })
  
  programmaticScrollToTop()
  
  nextTick(() => {
    programmaticScrollToTop()
  })
  
  lockTimer = setTimeout(() => {
    releaseScrollLock()
  }, SCROLL_LOCK_DURATION)
})

onUnmounted(() => {
  releaseScrollLock()
})

watch(() => route.path, () => {
  isZh.value = route.path.startsWith('/zh/')
})

const stats = [
  { labelZh: '技术领域', labelEn: 'Tech Areas', value: '7+' },
  { labelZh: '学习笔记', labelEn: 'Study Notes', value: '50+' },
  { labelZh: '知识模块', labelEn: 'Modules', value: '30+' },
]

const techStacks = computed(() => [
  { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E', bg: 'rgba(247, 223, 30, 0.15)' },
  { name: 'TypeScript', icon: 'typescript', color: '#3178C6', bg: 'rgba(49, 120, 198, 0.15)' },
  { name: 'React', icon: 'react', color: '#61DAFB', bg: 'rgba(97, 218, 251, 0.15)' },
  { name: 'Vue', icon: 'vuedotjs', color: '#42B883', bg: 'rgba(66, 184, 131, 0.15)' },
  { name: 'Node.js', icon: 'nodedotjs', color: '#339933', bg: 'rgba(51, 153, 51, 0.15)' },
  { name: 'Vite', icon: 'vite', color: '#646CFF', bg: 'rgba(100, 108, 255, 0.15)' },
  { name: 'MySQL', icon: 'mysql', color: '#4479A1', bg: 'rgba(68, 121, 161, 0.15)' },
  { name: 'MongoDB', icon: 'mongodb', color: '#47A248', bg: 'rgba(71, 162, 72, 0.15)' },
  { name: 'Redis', icon: 'redis', color: '#DC382D', bg: 'rgba(220, 56, 45, 0.15)' },
  { name: 'Docker', icon: 'docker', color: '#2496ED', bg: 'rgba(36, 150, 237, 0.15)' },
  { name: 'Nginx', icon: 'nginx', color: '#009639', bg: 'rgba(0, 150, 57, 0.15)' },
  { name: 'Linux', icon: 'linux', color: '#FCC624', bg: 'rgba(252, 198, 36, 0.15)' },
  { name: 'Git', icon: 'git', color: '#F05032', bg: 'rgba(240, 80, 50, 0.15)' },
  { name: 'Python', icon: 'python', color: '#3776AB', bg: 'rgba(55, 118, 171, 0.15)' },
  { name: 'Vitest', icon: 'vitest', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { name: 'AI/LLM', icon: 'anthropic', color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.1)' },
  { name: 'MCP', icon: 'modelcontextprotocol', color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.1)' },
])

const getIconUrl = (slug: string, color: string) => {
  const hex = color.replace('#', '')
  return `https://cdn.simpleicons.org/${slug}/${hex}`
}
</script>

<template>
  <div class="hero-stats">
    <div class="stats-row">
      <div v-for="stat in stats" :key="stat.labelZh" class="stat-item">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ isZh ? stat.labelZh : stat.labelEn }}</span>
      </div>
    </div>
    <div class="tech-tags">
      <span 
        v-for="tech in techStacks" 
        :key="tech.name" 
        class="tech-tag"
        :style="{ '--tech-bg': tech.bg }"
      >
        <span class="tech-icon-wrap">
          <img 
            class="tech-icon" 
            :src="getIconUrl(tech.icon, tech.color)"
            :alt="tech.name"
            loading="lazy"
          />
        </span>
        <span class="tech-name">{{ tech.name }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
}

.stats-row {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(120deg, #19fac6, #00d5c4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #e0e0e0;
  background: var(--tech-bg);
  border-radius: 8px;
  cursor: default;
  line-height: 1;
  transition: filter 0.2s ease;
}

.tech-tag:hover {
  filter: brightness(1.2);
}

.tech-tag .tech-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.tech-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.tech-name {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .stats-row {
    gap: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.35rem;
  }
  
  .hero-stats {
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .tech-tags {
    gap: 0.3rem;
  }
  
  .tech-tag {
    padding: 0.2rem 0.4rem;
    font-size: 0.68rem;
  }
  
  .tech-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
