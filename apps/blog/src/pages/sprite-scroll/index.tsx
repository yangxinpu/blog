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

/**
 * 每一帧占用的滚动叙事距离（vh）。
 * 帧数增加时保持该值不变，即可让「滚动多少 px 切一帧」与之前一致，
 * 避免帧切换过密导致快速滚动时 drawImage 峰值卡顿；
 * 调大 = 帧切换更稀疏、滚动更轻松，调小 = 更跟手。
 * （26 帧 × 15vh = 390vh；51 帧 × 15vh = 765vh）
 */
const SCROLL_VH_PER_FRAME = 15;
/** 整个胶片序列的滚动叙事距离（vh），注入 CSS 决定轨道高度 */
const SCROLL_DISTANCE_VH = FILM_FRAMES.length * SCROLL_VH_PER_FRAME;

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
 * 值越小滑行越长、惯性越强，值越大播放越快、越跟手：
 *   0.12 ≈ 停手后 300~400ms 到位（几乎无惯性）
 *   0.08 ≈ 500~700ms 滑到位
 *   0.015 ≈ 播放跟手 + 明显惯性：滚动中帧动画滞后约 1s，
 *           停手后滑行尾巴约 4~6s（当前值）
 *   0.01 ≈ 强惯性：明显滑行 2~3s，帧动画尾巴约 8s
 *   0.007 ≈ 过强：滚动中帧动画滞后约 2.4s，尾巴可达 10s 以上，播放显慢
 * 过小会让持续滚动时帧动画/文案明显滞后；仅作用于
 * 帧动画与文案出场，舞台钉固位置始终与滚动 1:1，不参与平滑。
 */
const SMOOTH_FACTOR = 0.015;

/**
 * 画布帧绘制的最小间隔（ms）。
 * 「时间分片」策略：滚动进行中画布最多按此节奏绘制（≈30fps），
 * 期间产生的中间帧直接丢弃、只绘制最新一帧（类似 React 只渲染最新 state），
 * 把主线程预算让给 ScrollSmoother 的滚动跟随；滚动停止（进度到位）时
 * 不受此间隔限制，立即补画最终帧，保证停手后画面精确。
 */
const FRAME_DRAW_MIN_INTERVAL = 33;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 预加载一组帧并提前在离屏线程解码，返回就绪的 Image 数组 */
function preloadFrames(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
          img.onload = () => {
            // 51 帧逐张首次绘制时在主线程解码会造成滚动掉帧，
            // 这里加载后立即 decode()，把解码提前到滚动开始之前
            img.decode().then(
              () => resolve(img),
              () => resolve(img),
            );
          };
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
  /** 平滑进度是否已追到目标（滚动/惯性停止），供绘制循环判断何时立即补画 */
  const settledRef = useRef(true);

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
    // 源帧仅 1280×720，DPR 封顶 1.5：画布像素量比 2.0 少约 44%，
    // 显著降低每帧 drawImage 的纹理上传/填充开销，肉眼差异可忽略
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

    let lastDrawAt = 0;
    const renderLoop = (now: number) => {
      if (dirtyRef.current) {
        // 时间分片：滚动/惯性进行中按 ~30fps 节流绘制，中间帧直接丢弃；
        // 进度到位（settled）时立即补画最新帧，保证停手后画面精确不丢帧
        if (settledRef.current || now - lastDrawAt >= FRAME_DRAW_MIN_INTERVAL) {
          drawFrame();
          dirtyRef.current = false;
          lastDrawAt = now;
        }
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
    let lastStageY = -1;

    const update = (_time: number, deltaMs: number) => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const maxY = Math.max(track.offsetHeight - vh, 0);
      const y = Math.min(Math.max(-rect.top, 0), maxY);
      // 钉固位置不变时（停滚 / 区块外）跳过样式写入，避免每帧无效的样式失效
      if (y !== lastStageY) {
        stage.style.transform = `translate3d(0, ${y}px, 0)`;
        lastStageY = y;
      }

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
      // 进度已追到目标（含减少动态/首帧对齐/收敛 snap）：通知绘制循环立即补画
      settledRef.current = progress === target;

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
      <div
        className="sprite-scroll-track"
        ref={trackRef}
        style={{ '--sprite-scroll-distance': `${SCROLL_DISTANCE_VH}vh` } as CSSProperties}
      >
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
