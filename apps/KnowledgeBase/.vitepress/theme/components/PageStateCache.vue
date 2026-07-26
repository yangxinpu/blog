<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick, ref } from 'vue'
import { useRouter, useRoute } from 'vitepress'

const router = useRouter()
const route = useRoute()

interface PageState {
  scrollY: number
  sidebarExpanded: Record<string, boolean>
}

let currentPath = route.path

function getCategoryPath(path: string): string {
  const parts = path.split('/').filter(p => p)
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}/`
  }
  return path
}

function getStateKey(path: string): string {
  return `kb_page_state_${getCategoryPath(path)}`
}

function savePageState(path?: string) {
  const sidebarExpanded: Record<string, boolean> = {}
  const sidebarItems = document.querySelectorAll('.VPSidebarItem.level-0')
  
  sidebarItems.forEach((item) => {
    const text = item.querySelector('H2.text')?.textContent?.trim() || ''
    const caretIcon = item.querySelector('.caret-icon')
    const isExpanded = caretIcon && !caretIcon.classList.contains('caret-icon--right')
    sidebarExpanded[text] = isExpanded
  })

  const state: PageState = {
    scrollY: window.scrollY,
    sidebarExpanded,
  }

  const key = getStateKey(path || route.path)
  try {
    sessionStorage.setItem(key, JSON.stringify(state))
    console.log('[PageStateCache] Saved state:', key, state)
  } catch (e) {
    console.warn('[PageStateCache] Failed to save page state:', e)
  }
}

function restorePageState() {
  const key = getStateKey(route.path)
  const stored = sessionStorage.getItem(key)
  if (!stored) {
    console.log('[PageStateCache] No stored state for:', key)
    return
  }

  try {
    const state: PageState = JSON.parse(stored)
    console.log('[PageStateCache] Restoring state:', key, state)
    
    setTimeout(() => {
      window.scrollTo(0, state.scrollY)
    }, 100)

    const checkAndRestoreSidebar = () => {
      const sidebarItems = document.querySelectorAll('.VPSidebarItem.level-0')
      if (sidebarItems.length === 0) {
        setTimeout(checkAndRestoreSidebar, 100)
        return
      }

      sidebarItems.forEach((item) => {
        const text = item.querySelector('H2.text')?.textContent?.trim() || ''
        const shouldExpand = state.sidebarExpanded[text]
        
        if (shouldExpand !== undefined) {
          const caretIcon = item.querySelector('.caret-icon')
          const isCurrentlyExpanded = caretIcon && !caretIcon.classList.contains('caret-icon--right')
          
          if (shouldExpand && !isCurrentlyExpanded) {
            console.log('[PageStateCache] Expanding:', text)
            const caretBtn = item.querySelector('.caret')
            if (caretBtn) caretBtn.click()
          } else if (!shouldExpand && isCurrentlyExpanded) {
            console.log('[PageStateCache] Collapsing:', text)
            const caretBtn = item.querySelector('.caret')
            if (caretBtn) caretBtn.click()
          }
        }
      })
    }

    setTimeout(checkAndRestoreSidebar, 500)
  } catch (e) {
    console.warn('[PageStateCache] Failed to restore page state:', e)
  }
}

onMounted(() => {
  restorePageState()
  
  const originalOnBeforeRouteChange = router.onBeforeRouteChange
  router.onBeforeRouteChange = async (to) => {
    savePageState(currentPath)
    
    if (originalOnBeforeRouteChange) {
      return await originalOnBeforeRouteChange(to)
    }
    return true
  }
})

watch(() => route.path, () => {
  currentPath = route.path
  nextTick(() => {
    restorePageState()
  })
})

onBeforeUnmount(() => {
  savePageState()
})
</script>

<template>
  <div class="page-state-cache"></div>
</template>

<style scoped>
.page-state-cache {
  display: none;
}
</style>
