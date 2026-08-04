import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 7070,
    host: '0.0.0.0',
  },
  preview: {
    port: 7071,
    host: '0.0.0.0',  
  },
})
