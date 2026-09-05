/**
 * 全站预加载资源清单
 * 所有需要在首屏加载完成前就绪的图片都在此声明
 */

// 旅行展示图片（20 张）
import travel01 from './Images/travel/travel-01.webp';
import travel02 from './Images/travel/travel-02.webp';
import travel03 from './Images/travel/travel-03.webp';
import travel04 from './Images/travel/travel-04.webp';
import travel05 from './Images/travel/travel-05.webp';
import travel06 from './Images/travel/travel-06.webp';
import travel07 from './Images/travel/travel-07.webp';
import travel08 from './Images/travel/travel-08.webp';
import travel09 from './Images/travel/travel-09.webp';
import travel10 from './Images/travel/travel-10.webp';
import travel11 from './Images/travel/travel-11.webp';
import travel12 from './Images/travel/travel-12.webp';
import travel13 from './Images/travel/travel-13.webp';
import travel14 from './Images/travel/travel-14.webp';
import travel15 from './Images/travel/travel-15.webp';
import travel16 from './Images/travel/travel-16.webp';
import travel17 from './Images/travel/travel-17.webp';
import travel18 from './Images/travel/travel-18.webp';
import travel19 from './Images/travel/travel-19.webp';
import travel20 from './Images/travel/travel-20.webp';

// 知识库 Logo
import knowledgeLogo from './Images/common/knowlege-base-logo.png';

// 旅行图片列表（供 travel-display 复用，避免重复导入）
export const travelImages = [
  travel01, travel02, travel03, travel04, travel05,
  travel06, travel07, travel08, travel09, travel10,
  travel11, travel12, travel13, travel14, travel15,
  travel16, travel17, travel18, travel19, travel20,
];

// 技术栈 Logo（与 logo-section 保持一致）
export const techLogos = [
  'https://cdn.simpleicons.org/react/FFFFFF',
  'https://cdn.simpleicons.org/typescript/FFFFFF',
  'https://cdn.simpleicons.org/javascript/FFFFFF',
  'https://cdn.simpleicons.org/vuedotjs/FFFFFF',
  'https://cdn.simpleicons.org/vite/FFFFFF',
  'https://cdn.simpleicons.org/tailwindcss/FFFFFF',
  'https://cdn.simpleicons.org/threedotjs/FFFFFF',
  'https://cdn.simpleicons.org/nodedotjs/FFFFFF',
  'https://cdn.simpleicons.org/python/FFFFFF',
  'https://cdn.simpleicons.org/git/FFFFFF',
  'https://cdn.simpleicons.org/docker/FFFFFF',
  'https://cdn.simpleicons.org/nginx/FFFFFF',
  'https://cdn.simpleicons.org/postgresql/FFFFFF',
  'https://cdn.simpleicons.org/redis/FFFFFF',
  'https://cdn.simpleicons.org/linux/FFFFFF',
];

// 知识库分类图标（与 knowledge-intro 保持一致，主色 #17FBC6）
export const categoryIcons = [
  'https://cdn.simpleicons.org/javascript/17FBC6',
  'https://cdn.simpleicons.org/nodedotjs/17FBC6',
  'https://cdn.simpleicons.org/vitest/17FBC6',
  'https://cdn.simpleicons.org/docker/17FBC6',
  'https://cdn.simpleicons.org/anthropic/17FBC6',
  'https://cdn.simpleicons.org/linear/17FBC6',
  'https://cdn.simpleicons.org/python/17FBC6',
  'https://cdn.simpleicons.org/git/17FBC6',
];

/**
 * 所有需要预加载的图片 URL
 * 顺序：本地图片优先（体积大、首屏关键），外链图标其次
 */
export const ALL_PRELOAD_IMAGES: string[] = [
  ...travelImages,
  knowledgeLogo,
  ...techLogos,
  ...categoryIcons,
];
