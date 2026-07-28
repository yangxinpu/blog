<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

const iconSlugs: Record<string, string> = {
  'AI': 'anthropic',
  '人工智能': 'anthropic',
  '上下文工程': 'arxiv',
  'Context Engineering': 'arxiv',
  'MCP': 'modelcontextprotocol',
  'Ollama': 'ollama',
  'Opencode': 'opencode',
  'OpenCode': 'opencode',
  '产品': 'linear',
  'Product': 'linear',
  'Python': 'python',
  '其他': 'mozilla',
  'Other': 'mozilla',
  '计算机网络': 'cloudflare',
  'Computer Network': 'cloudflare',
  'Git': 'git',
  '算法': 'cplusplus',
  'Algorithm': 'cplusplus',
  '书籍': 'bookstack',
  'Books': 'bookstack',
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
  '测试': 'vitest',
  'Testing': 'vitest',
  '单元测试': 'vitest',
  'Unit Testing': 'vitest',
  '集成测试': 'vitest',
  'Integration Testing': 'vitest',
  '端到端测试': 'cypress',
  'E2E Testing': 'cypress',
  '性能测试': 'k6',
  'Performance Testing': 'k6',
}

const iconPaths: Record<string, string> = {
  'Harness工程': '/icons/harness.svg',
  'Harness': '/icons/harness.svg',
  'RAG': '/icons/rag.svg',
  '大模型': '/icons/gpt.svg',
  'LLM': '/icons/gpt.svg',
}

const iconColors: Record<string, string> = {
  'AI': '#41295A',
  '人工智能': '#41295A',
  'Harness工程': '#35A6E6',
  'Harness': '#35A6E6',
  '上下文工程': '#B31B1B',
  'Context Engineering': '#B31B1B',
  'MCP': '#FFFFFF',
  'RAG': '#7C3AED',
  '大模型': '#FFFFFF',
  'LLM': '#FFFFFF',
  'Ollama': '#FFFFFF',
  'Opencode': '#FFFFFF',
  'OpenCode': '#FFFFFF',
  '产品': '#5E6AD2',
  'Product': '#5E6AD2',
  'Python': '#3776AB',
  '其他': '#202020',
  'Other': '#202020',
  '计算机网络': '#F38020',
  'Computer Network': '#F38020',
  'Git': '#F05032',
  '算法': '#00599C',
  'Algorithm': '#00599C',
  '书籍': '#3A6DB5',
  'Books': '#3A6DB5',
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
  '测试': '#10B981',
  'Testing': '#10B981',
  '单元测试': '#10B981',
  'Unit Testing': '#10B981',
  '集成测试': '#10B981',
  'Integration Testing': '#10B981',
  '端到端测试': '#69D3A7',
  'E2E Testing': '#69D3A7',
  '性能测试': '#FF4447',
  'Performance Testing': '#FF4447',
}

const cachedSvgs: Record<string, string> = {}

async function fetchIcon(slugOrPath: string): Promise<string> {
  if (cachedSvgs[slugOrPath]) {
    return cachedSvgs[slugOrPath]
  }
  try {
    let url: string
    if (slugOrPath.startsWith('/')) {
      url = slugOrPath
    } else {
      url = `https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${slugOrPath}.svg`
    }
    const response = await fetch(url)
    if (response.ok) {
      const svgText = await response.text()
      cachedSvgs[slugOrPath] = svgText
      return svgText
    }
  } catch (error) {
    console.error(`Failed to fetch icon ${slugOrPath}:`, error)
  }
  return ''
}

async function addIcons() {
  const sidebarTitles = document.querySelectorAll('.VPSidebarItem.level-0 H2.text')
  for (const title of sidebarTitles) {
    const text = title.textContent?.trim() || ''
    const iconPath = iconPaths[text]
    const iconSlug = iconSlugs[text]
    const color = iconColors[text]
    const identifier = iconPath || iconSlug
    if (identifier && color) {
      const existingIcon = title.querySelector('.sidebar-icon')
      if (!existingIcon) {
        const svgHtml = await fetchIcon(identifier)
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
