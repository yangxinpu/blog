import { Fragment, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { useData } from 'vitepress';
import './style.css';
import LogoAnimation from './components/LogoAnimation.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import SidebarIcons from './components/SidebarIcons.vue';
import SchemaOrg from './components/SchemaOrg.vue';
import HeadSeo from './components/HeadSeo.vue';
import NotFound from './components/NotFound.vue';
import PageStateCache from './components/PageStateCache.vue';

function CustomLayout() {
  const { page } = useData();

  if (page.value?.isNotFound) {
    return h(Fragment, null, [
      h(NotFound),
    ]);
  }

  return h(Fragment, null, [
    h(LoadingOverlay),
    h(SidebarIcons),
    h(PageStateCache),
    h(SchemaOrg),
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(LogoAnimation),
    }),
  ]);
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LogoAnimation', LogoAnimation);
    app.component('LoadingOverlay', LoadingOverlay);
    app.component('SidebarIcons', SidebarIcons);
    app.component('SchemaOrg', SchemaOrg);
    app.component('HeadSeo', HeadSeo);
    app.component('NotFound', NotFound);
  },
  Layout: CustomLayout,
  head: () => [
    h(HeadSeo),
  ],
} satisfies Theme;
