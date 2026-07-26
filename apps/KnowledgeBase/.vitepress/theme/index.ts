import { Fragment, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './style.css';
import LogoAnimation from './components/LogoAnimation.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import SidebarIcons from './components/SidebarIcons.vue';
import SchemaOrg from './components/SchemaOrg.vue';
import HeadSeo from './components/HeadSeo.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LogoAnimation', LogoAnimation);
    app.component('LoadingOverlay', LoadingOverlay);
    app.component('SidebarIcons', SidebarIcons);
    app.component('SchemaOrg', SchemaOrg);
    app.component('HeadSeo', HeadSeo);
  },
  Layout: () => {
    return h(Fragment, null, [
      h(LoadingOverlay),
      h(SidebarIcons),
      h(SchemaOrg),
      h(DefaultTheme.Layout, null, {
        'home-hero-image': () => h(LogoAnimation),
      }),
    ]);
  },
  head: () => [
    h(HeadSeo),
  ],
} satisfies Theme;
