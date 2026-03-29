import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

const base = process.env.VITE_BASE_URL || '/';

export default defineConfig({
  base,
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@blog/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
