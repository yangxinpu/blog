import { Fragment, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './style.css';
import LogoAnimation from './components/LogoAnimation.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LogoAnimation', LogoAnimation);
    app.component('LoadingOverlay', LoadingOverlay);
  },
  Layout: () => {
    return h(Fragment, null, [
      h(LoadingOverlay),
      h(DefaultTheme.Layout, null, {
        'home-hero-image': () => h(LogoAnimation),
      }),
    ]);
  },
} satisfies Theme;
