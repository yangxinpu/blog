<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isZh = ref(true)

onMounted(() => {
  isZh.value = route.path.startsWith('/zh/')
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
  { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
  { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
  { name: 'React', icon: 'react', color: '#61DAFB' },
  { name: 'Vue', icon: 'vuedotjs', color: '#42B883' },
  { name: 'Node.js', icon: 'nodedotjs', color: '#339933' },
  { name: 'Express', icon: 'express', color: '#FFFFFF' },
  { name: 'MySQL', icon: 'mysql', color: '#4479A1' },
  { name: 'Docker', icon: 'docker', color: '#2496ED' },
  { name: 'Nginx', icon: 'nginx', color: '#009639' },
  { name: 'Linux', icon: 'linux', color: '#FCC624' },
  { name: 'Git', icon: 'git', color: '#F05032' },
  { name: 'Python', icon: 'python', color: '#3776AB' },
  { name: 'Vitest', icon: 'vitest', color: '#10B981' },
  { name: 'AI/LLM', icon: 'anthropic', color: '#FFFFFF' },
  { name: 'MCP', icon: 'modelcontextprotocol', color: '#FFFFFF' },
  { name: 'Kubernetes', icon: 'kubernetes', color: '#326CE5' },
  { name: 'GitHub', icon: 'github', color: '#FFFFFF' },
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
        :style="{ '--tech-color': tech.color }"
      >
        <img 
          class="tech-icon" 
          :src="getIconUrl(tech.icon, tech.color)"
          :alt="tech.name"
          loading="lazy"
        />
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
  gap: 0.375rem;
}

.tech-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.18rem 0.45rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--tech-color);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  cursor: default;
  line-height: 1;
}

.tech-icon {
  width: 12px;
  height: 12px;
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
    padding: 0.14rem 0.35rem;
    font-size: 0.68rem;
  }
  
  .tech-icon {
    width: 10px;
    height: 10px;
  }
}
</style>
