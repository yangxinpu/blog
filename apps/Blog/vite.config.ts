import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

const base = process.env.VITE_BASE_URL || '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    port: 3000,
    host: true,
  },
});
