import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import path from 'path';

// 获取 __dirname 的等效值
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        react({
            babel: {
                configFile: path.resolve(__dirname, './babel.config.js'),
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: './',
    build: {
        outDir: 'docs',
        assetsDir: 'assets',
    },
});
