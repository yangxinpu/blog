/**
 * 雪碧 SPRITE —— 饮品变体数据
 *
 * 滚动叙事会按数组顺序自动分段播放这些变体（无需任何点击）：
 * 名称 / 副标题 / 描述 / 主题色 / 帧序列全部集中在此，方便定制。
 * 新增风味：
 * 1. 把该风味的 WebP 帧序列放入 src/assets/Images/sprite/<flavor>/ 目录；
 * 2. 用 import.meta.glob 读取为帧数组（参考 SPRITE_FRAMES）；
 * 3. 在 DRINK_VARIANTS 中追加一项即可，index.tsx 的分段 / 预载逻辑会自动适配。
 */

export interface DrinkVariant {
  /** 唯一 id，同时作为帧缓存的 key */
  id: string;
  /** 右侧大号序号，如 '01' */
  no: string;
  /** 饮品名称（大字号粗体） */
  name: string;
  /** 英文名称（字距拉开的小标题） */
  nameEn: string;
  /** 副标题（细体） */
  subtitle: string;
  /** 描述段落（1-3 句） */
  description: string;
  /** 品牌主题色（CTA / 强调元素 / 活动指示器） */
  accent: string;
  /** WebP 帧序列 URL 列表 */
  frames: string[];
}

/** 经典柠檬帧序列（当前素材目录下的 26 帧 WebP） */
const classicFrameModules = import.meta.glob('../../assets/Images/sprite/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const SPRITE_FRAMES: string[] = Object.keys(classicFrameModules)
  .sort()
  .map((key) => classicFrameModules[key]);

export const DRINK_VARIANTS: DrinkVariant[] = [
  {
    id: 'classic',
    no: '01',
    name: '经典柠檬',
    nameEn: 'LEMON-LIME CLASSIC',
    subtitle: '透心凉，心飞扬',
    description:
      '真实柠檬榨汁冲入强劲气泡，零人工色素、零防腐剂。一口下去，是从舌尖冲到头顶的痛快酷爽。',
    accent: '#2FD676',
    frames: SPRITE_FRAMES,
  },
  {
    id: 'zero',
    no: '02',
    name: '无糖零卡',
    nameEn: 'ZERO SUGAR',
    subtitle: '无糖，更尽兴',
    description:
      '0 糖 0 卡、毫无负担。同样的柠檬鲜爽与强劲气泡，用代糖配方留住全部痛快，适合每一个不想妥协的时刻。',
    accent: '#4CC9F0',
    // 新序列就位后替换为独立帧数组即可；在此之前与经典款共享同一组镜头
    frames: SPRITE_FRAMES,
  },
  {
    id: 'honey',
    no: '03',
    name: '蜂蜜柠檬',
    nameEn: 'HONEY LEMON',
    subtitle: '酷感，加一点甜',
    description:
      '真实蜂蜜调和柠檬鲜爽，入口柔和、回味清甜。淡金色的限定风味，给酷感加一点温度。',
    accent: '#FFC24B',
    frames: SPRITE_FRAMES,
  },
];
