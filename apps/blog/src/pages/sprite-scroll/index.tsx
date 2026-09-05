import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { Citrus } from 'lucide-react';
import { DRINK_VARIANTS } from './variants';
import './index.css';

/**
 * 雪碧 SPRITE —— 滚动驱动帧动画区块
 *
 * 不是独立网站，而是页面流中的一个 pinned 区块：
 * - WebP 帧序列横跨整个轨道随滚动只播放一遍（向下播放 / 向上回放）
 * - 滚动进度平均分为 N 段（N = variants.ts 中变体数量），每段展示一个变体
 * - 每个变体的文案元素随滚动「错开入场」：品牌行 → 名称 → 副标题 → 描述，
 *   右侧大号序号同步缩放入场；段尾统一淡出，滚动反向时动画整体可逆
 * - 背景为 #111111，仅暗黑，全程无按钮
 */

const SEGMENT_COUNT = DRINK_VARIANTS.length;
/** 滚动中播放的胶片序列（目前三个变体共用这一组镜头） */
const FILM_FRAMES = DRINK_VARIANTS[0].frames;

/** 各元素在「段内进度」中的入场区间（start, end），实现错开出场 */
const REVEAL_RANGES = {
  brand: [0.05, 0.22],
  title: [0.1, 0.34],
  subtitle: [0.18, 0.44],
  desc: [0.26, 0.54],
  number: [0.08, 0.3],
} as const;

/** 段尾淡出区间起点：local > 0.9 后整体淡出到段边界 */
const EXIT_START = 0.9;

/**
 * 惯性强度：以 60fps 为基准，每帧向目标进度趋近的比例。
 * 值越小滑行越长、惯性越强（0.08 ≈ 停下后约 500~700ms 滑到位；
 * 0.12 ≈ 300~400ms；过小会让持续滚动时动画明显滞后），仅作用于
 * 帧动画与文案出场；舞台钉固位置始终与滚动 1:1，不参与平滑。
 */
const SMOOTH_FACTOR = 0.01;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 预加载一组帧，返回解码完成的 Image 数组 */
function preloadFrames(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        }),
    ),
  );
}

const SpriteScroll: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [variantIndex, setVariantIndex] = useState(0);

  const filmRef = useRef<HTMLImageElement[]>([]);
  const frameIdxRef = useRef(0);
  const stateSegRef = useRef(0);
  const readyRef = useRef(false);
  const reducedRef = useRef(false);
  const dirtyRef = useRef(true);
  const rafRef = useRef(0);

  const variant = DRINK_VARIANTS[variantIndex];

  /** 按 cover 方式把当前帧绘制到 canvas */
  const drawFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = filmRef.current[frameIdxRef.current];
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth: w, clientHeight: h } = canvas;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirtyRef.current = true;
  };

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (canvasRef.current) ro.observe(canvasRef.current);

    const renderLoop = () => {
      if (dirtyRef.current) {
        drawFrame();
        dirtyRef.current = false;
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    rafRef.current = requestAnimationFrame(renderLoop);

    // ScrollSmoother 用 transform 模拟滚动，原生 sticky 不生效，
    // 手动按轨道可视位置平移舞台（等价 pin），钉固位置始终与滚动 1:1；
    // 帧进度与文案出场则跟随一个指数趋近的「平滑进度」，滚动停止后
    // 动画会带一点惯性继续滑行到目标位置，向下/向上滚动时整体可逆。
    let smoothProgress = 0;
    let progressInited = false;

    const update = (_time: number, deltaMs: number) => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const maxY = Math.max(track.offsetHeight - vh, 0);
      const y = Math.min(Math.max(-rect.top, 0), maxY);
      stage.style.transform = `translate3d(0, ${y}px, 0)`;

      // 目标进度直接来自滚动位置；平滑进度每帧向它指数趋近（帧率无关）
      const target = maxY > 0 ? y / maxY : 0;
      if (!progressInited) {
        // 首帧直接对齐，避免刷新在区块中间时从 0 快放一遍
        smoothProgress = target;
        progressInited = true;
      } else if (reducedRef.current) {
        smoothProgress = target;
      } else {
        const f = 1 - Math.pow(1 - SMOOTH_FACTOR, deltaMs / (1000 / 60));
        smoothProgress += (target - smoothProgress) * f;
        if (Math.abs(target - smoothProgress) < 0.0005) smoothProgress = target;
      }
      const progress = smoothProgress;

      // 帧序列：横跨整个轨道只播放一遍
      const imgs = filmRef.current;
      if (imgs.length > 0) {
        const idx = Math.min(imgs.length - 1, Math.round(progress * (imgs.length - 1)));
        if (idx !== frameIdxRef.current) {
          frameIdxRef.current = idx;
          dirtyRef.current = true;
        }
      }

      // 当前变体分段（仅用于切换文案内容）
      const seg = Math.min(SEGMENT_COUNT - 1, Math.floor(progress * SEGMENT_COUNT));
      const local = progress * SEGMENT_COUNT - seg;
      if (seg !== stateSegRef.current) {
        stateSegRef.current = seg;
        setVariantIndex(seg);
      }

      // 帧未就绪 / 减少动态效果：不做出场动画
      if (!readyRef.current) return;
      if (reducedRef.current) {
        [brandRef, titleRef, subtitleRef, descRef].forEach((r) => {
          const el = r.current;
          if (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
        if (numberRef.current) {
          numberRef.current.style.opacity = '1';
          numberRef.current.style.transform = 'scale(1)';
        }
        return;
      }

      const exitFade = clamp01((1 - local) / (1 - EXIT_START));

      const revealText = (
        el: HTMLElement | null,
        range: readonly [number, number],
        travel: number,
      ) => {
        if (!el) return;
        const t = easeOutCubic(clamp01((local - range[0]) / (range[1] - range[0])));
        const opacity = t * exitFade;
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, ${(1 - t) * travel}px, 0)`;
      };

      revealText(brandRef.current, REVEAL_RANGES.brand, 24);
      revealText(titleRef.current, REVEAL_RANGES.title, 48);
      revealText(subtitleRef.current, REVEAL_RANGES.subtitle, 32);
      revealText(descRef.current, REVEAL_RANGES.desc, 28);

      const numberEl = numberRef.current;
      if (numberEl) {
        const t = easeOutCubic(
          clamp01((local - REVEAL_RANGES.number[0]) / (REVEAL_RANGES.number[1] - REVEAL_RANGES.number[0])),
        );
        const opacity = t * exitFade;
        numberEl.style.opacity = String(opacity);
        numberEl.style.transform = `scale(${0.86 + t * 0.14})`;
      }
    };
    gsap.ticker.add(update);

    let cancelled = false;
    preloadFrames(FILM_FRAMES).then((imgs) => {
      if (cancelled) return;
      filmRef.current = imgs;
      readyRef.current = true;
      dirtyRef.current = true;

      const loader = loaderRef.current;
      if (loader) {
        if (reducedRef.current) {
          loader.style.display = 'none';
        } else {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              loader.style.display = 'none';
            },
          });
        }
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <section
      className="sprite-scroll"
      style={{ '--sprite-accent': variant.accent } as CSSProperties}
      aria-label="雪碧风味滚动展示"
    >
      <div className="sprite-scroll-track" ref={trackRef}>
        <div className="sprite-scroll-stage" ref={stageRef}>
          <canvas ref={canvasRef} className="sprite-scroll-canvas" aria-hidden="true" />
          <div className="sprite-scroll-scrim" />

          <div className="sprite-scroll-overlay">
            <div className="sprite-scroll-copy">
              <div className="sprite-scroll-brand" ref={brandRef}>
                <Citrus size={18} strokeWidth={2.2} aria-hidden="true" />
                <span className="sprite-scroll-brand-name">雪碧 SPRITE</span>
                <span className="sprite-scroll-series">风味系列 / {variant.no}</span>
              </div>

              <h2 className="sprite-scroll-title" ref={titleRef}>
                {variant.name}
              </h2>

              <p className="sprite-scroll-subtitle" ref={subtitleRef}>
                {variant.subtitle}
                <em>{variant.nameEn}</em>
              </p>

              <p className="sprite-scroll-desc" ref={descRef}>
                {variant.description}
              </p>
            </div>

            <div className="sprite-scroll-number">
              <span className="sprite-scroll-number-text" ref={numberRef}>
                {variant.no}
              </span>
            </div>
          </div>

          <div className="sprite-scroll-loader" ref={loaderRef} role="status" aria-label="加载中">
            <div className="sprite-scroll-spinner" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpriteScroll;
