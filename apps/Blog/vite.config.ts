import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // 预打包 GSAP 深度导入与图标库，避免运行时二次优化触发整页 reload
    include: [
      'gsap/ScrollTrigger',
      'gsap/ScrollSmoother',
      'gsap/ScrollToPlugin',
      'gsap/SplitText',
      'lucide-react',
    ],
  },
  server: {
    port: 7070,
    host: '0.0.0.0',
  },
  preview: {
    port: 7071,
    host: '0.0.0.0',  
  },
})
