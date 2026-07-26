<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

const iconSlugs: Record<string, string> = {
  'JavaScript': 'javascript',
  'React': 'react',
  'Vue': 'vuedotjs',
  'Vite': 'vite',
  'Webpack': 'webpack',
  '性能优化': 'googleanalytics',
  'Performance': 'googleanalytics',
  'Node.js': 'nodedotjs',
  '数据库': 'mysql',
  'Database': 'mysql',
  'Bun': 'bun',
  'Docker': 'docker',
  'Linux': 'linux',
  'Nginx': 'nginx',
  '服务器工具': 'tmux',
  'Server Tools': 'tmux',
}

const iconColors: Record<string, string> = {
  'JavaScript': '#F7DF1E',
  'React': '#61DAFB',
  'Vue': '#42B883',
  'Vite': '#646CFF',
  'Webpack': '#8DD6F9',
  '性能优化': '#EAB308',
  'Performance': '#EAB308',
  'Node.js': '#339933',
  '数据库': '#4479A1',
  'Database': '#4479A1',
  'Bun': '#FBF0DF',
  'Docker': '#2496ED',
  'Linux': '#FCC624',
  'Nginx': '#009639',
  '服务器工具': '#1BB954',
  'Server Tools': '#1BB954',
}

const cachedSvgs: Record<string, string> = {}

async function fetchIcon(slug: string): Promise<string> {
  if (cachedSvgs[slug]) {
    return cachedSvgs[slug]
  }
  try {
    const response = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${slug}.svg`)
    if (response.ok) {
      const svgText = await response.text()
      cachedSvgs[slug] = svgText
      return svgText
    }
  } catch (error) {
    console.error(`Failed to fetch icon ${slug}:`, error)
  }
  return ''
}

async function addIcons() {
  const sidebarTitles = document.querySelectorAll('.VPSidebarItem.level-0 H2.text')
  for (const title of sidebarTitles) {
    const text = title.textContent?.trim() || ''
    const slug = iconSlugs[text]
    const color = iconColors[text]
    if (slug && color) {
      const existingIcon = title.querySelector('.sidebar-icon')
      if (!existingIcon) {
        const svgHtml = await fetchIcon(slug)
        if (svgHtml) {
          const wrapper = document.createElement('span')
          wrapper.className = 'sidebar-icon'
          wrapper.style.display = 'inline-flex'
          wrapper.style.alignItems = 'center'
          wrapper.style.justifyContent = 'center'
          wrapper.style.width = '24px'
          wrapper.style.height = '24px'
          wrapper.style.marginRight = '10px'
          wrapper.style.flexShrink = '0'
          wrapper.style.verticalAlign = 'middle'
          wrapper.innerHTML = svgHtml.replace(/<path/g, `<path fill="${color}"`)
          title.insertBefore(wrapper, title.firstChild)
        }
      }
    }
  }
}

onMounted(() => {
  nextTick(() => {
    setTimeout(addIcons, 100)
  })
})

watch(() => router.route.path, () => {
  nextTick(() => {
    setTimeout(addIcons, 100)
  })
})
</script>

<template>
  <div class="sidebar-icons-injector"></div>
</template>

<style scoped>
.sidebar-icons-injector {
  display: none;
}
</style>
