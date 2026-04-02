import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const base = process.env.VITE_BASE_URL || '/';

export default defineConfig({
  base,
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
  resolve: {
    alias: {
      '@blog/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    cssCodeSplit: true,
  },
});
