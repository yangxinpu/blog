import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './style.css';
import LogoAnimation from './components/LogoAnimation.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LogoAnimation', LogoAnimation);
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(LogoAnimation),
    });
  },
} satisfies Theme;
