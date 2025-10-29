import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['docs/**', 'node_modules/**']), // 忽略docs目录下的所有文件和node_modules目录下的所有文件
    {
        files: ['**/*.{js,jsx}'], // 对所有文件进行eslint检查
        extends: [
            js.configs.recommended, // 启用eslint推荐规则
            reactHooks.configs['recommended-latest'], // 启用react-hooks推荐规则
            reactRefresh.configs.vite, // 启用react-refresh推荐规则
            eslintConfigPrettier, // 禁用与Prettier冲突的规则
        ],
        languageOptions: {
            ecmaVersion: 2020, // 启用ECMAScript 2020语法
            globals: globals.browser, // 启用浏览器全局变量
            parserOptions: {
                ecmaVersion: 'latest', // 启用最新的ECMAScript语法
                ecmaFeatures: { jsx: true }, // 启用JSX语法
                sourceType: 'module', // 启用模块语法
            },
        },
        rules: {
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // 忽略未使用的变量，除非变量名以大写字母或下划线开头
        },
    },
]);
