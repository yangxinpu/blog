import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

export interface MarqueeRow {
  images: string[];
  /** 单趟位移时长（秒），越短越快 */
  duration: number;
  /** true：从左向右反向滚动 */
  reverse?: boolean;
  /** 卡片宽度系数（在基础宽高比上放大），默认 1 */
  widthScale?: number;
}

interface TravelMarqueeProps {
  rows: MarqueeRow[];
}

// 每组内容在轨道内重复的份数（需保证单组宽度大于常见视口，-50% 才能无缝）
const SET_REPEAT = 3;

// 预加载并发上限：避免 12 张图同时请求/解码把首屏线程压满
const PRELOAD_CONCURRENCY = 4;

// 卡片宽高比循环（宽/高）：同一行高度一致，靠不同宽高比形成横向宽窄错落
const CARD_RATIOS = [4 / 3, 1, 16 / 10, 3 / 4, 5 / 4];

/**
 * 并发受控的图片预加载：
 * - 只对去重后的唯一 URL 发请求（轨道里每张图要复制 6 份，DOM 节点共享缓存）
 * - decode() 预热位图，ready 后再挂载全部 <img>，避免 72 个节点同时解码卡顿
 * - 失败也放行，卡片底色 #111 兜底，绝不让加载层永久卡住
 */
const preloadImages = (srcs: string[], onProgress: (done: number) => void) =>
  new Promise<void>((resolve) => {
    let cursor = 0;
    let done = 0;
    const total = srcs.length;

    const finishOne = () => {
      done += 1;
      onProgress(done);
    };

    const loadOne = (src: string) =>
      new Promise<void>((resolveOne) => {
        const img = new Image();
        img.decoding = 'async';
        const settle = () => {
          finishOne();
          resolveOne();
        };
        img.onload = () => {
          // 解码失败不阻塞：缓存里已有编码数据，DOM 挂载时浏览器会自行解码
          img.decode().then(settle, settle);
        };
        img.onerror = settle;
        img.src = src;
      });

    const worker = async () => {
      while (cursor < total) {
        const src = srcs[cursor];
        cursor += 1;
        await loadOne(src);
      }
    };

    Promise.all(
      Array.from({ length: Math.min(PRELOAD_CONCURRENCY, total) }, worker)
    ).then(() => resolve());
  });

const TravelMarquee: React.FC<TravelMarqueeProps> = ({ rows }) => {
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  // 整体是否处于视口内：离开视口后即使 hover 移出也不恢复播放
  const visibleRef = useRef(true);
  const tweensRef = useRef<(gsap.core.Tween | null)[]>([]);

  // 12 张唯一图片先行预加载，完成前不渲染任何 <img>
  const uniqueSrcs = useMemo(
    () => Array.from(new Set(rows.flatMap((row) => row.images))),
    [rows]
  );
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    preloadImages(uniqueSrcs, (done) => {
      if (!cancelled) setProgress(Math.round((done / uniqueSrcs.length) * 100));
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [uniqueSrcs]);

  useEffect(() => {
    const root = rootRef.current;
    // ready 前轨道节点尚未挂载，等图片预加载完成后再初始化动画
    if (!root || !ready) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    // 无限滚动：轨道内放两份完全相同的组，位移 -50% 后视觉归零，无缝衔接
    rows.forEach((row, i) => {
      const track = trackRefs.current[i];
      if (!track) return;

      gsap.set(track, { xPercent: row.reverse ? -50 : 0 });
      tweensRef.current[i] = gsap.to(track, {
        xPercent: row.reverse ? 0 : -50,
        duration: row.duration,
        ease: 'none',
        repeat: -1,
      });
    });

    // 整屏停留期间在视口内；滚出后暂停，省电
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        tweensRef.current.forEach((tween) => {
          if (!tween) return;
          if (entry.isIntersecting) tween.play();
          else tween.pause();
        });
      },
      { threshold: 0.01 }
    );
    io.observe(root);

    // 滚动揭示：海报屏从视口底部进入到顶部对齐的整段滚动里，
    // 整个海报墙共享一个青绿半椭圆遮罩：半径固定（宽满屏、高满屏，不收缩），
    // 圆心从顶部中心（50% 0）随 --p 沿中轴向上移动到 -100%，整体移出墙顶后不再遮挡；
    // 图片不戴遮罩，只做明显的弹性放大，三行自上而下轻微级联
    const ctx = gsap.context(() => {
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        },
      });

      gsap.set(root, { '--p': 1 });
      revealTl.to(root, { '--p': 0, duration: 0.9, ease: 'power3.out' }, 0);

      rows.forEach((_, rowIndex) => {
        const zooms = gsap.utils.toArray<HTMLElement>(
          `.travel-marquee__row:nth-child(${rowIndex + 1}) .travel-marquee__zoom`,
          root
        );
        if (!zooms.length) return;
        // 缩放作用于 zoom 层；img 自身有 scale(1.2) overscan，两层相乘：
        // 0.84×1.2≈1.01（初始满幅不露边）→ 1×1.2（终态明显推近 20%）
        gsap.set(zooms, { scale: 0.84 });
        revealTl.to(
          zooms,
          { scale: 1, duration: 0.9, ease: 'back.out(1.5)' },
          rowIndex * 0.12
        );
      });
    }, root);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [rows, ready]);

  return (
    <div
      ref={rootRef}
      className={`travel-marquee${ready ? ' travel-marquee--ready' : ''}`}
      aria-hidden="true"
    >
      {ready &&
        rows.map((row, rowIndex) => (
          <div key={rowIndex} className="travel-marquee__row">
            <div
              className="travel-marquee__track"
              ref={(el) => {
                trackRefs.current[rowIndex] = el;
              }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="travel-marquee__set">
                  {Array.from({ length: SET_REPEAT }).flatMap(
                    (_, repeatIndex) =>
                      row.images.map((src, imgIndex) => {
                        // 行间、重复组间错开节奏，避免相邻卡片宽窄雷同；两份拷贝顺序一致不影响无缝循环
                        const patternIndex =
                          (imgIndex + repeatIndex * 3 + rowIndex * 2) %
                          CARD_RATIOS.length;
                        return (
                          <div
                            key={`${copy}-${repeatIndex}-${imgIndex}`}
                            className="travel-marquee__card"
                            style={{
                              aspectRatio:
                                CARD_RATIOS[patternIndex] *
                                (row.widthScale ?? 1),
                            }}
                          >
                            <div className="travel-marquee__zoom">
                              <img
                                className="travel-marquee__img"
                                src={src}
                                alt=""
                                draggable={false}
                                decoding="async"
                              />
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* 整个海报墙唯一的青绿椭圆遮罩：宽满屏、高度固定满屏，
          圆心读 root 的 --p 从顶部中心向上移出；图片无遮罩，此层不拦截事件 */}
      {ready && <div className="travel-marquee__reveal" />}

      {/* 图片预加载遮罩：12 张唯一图片并发预加载完成前盖住海报墙，
          ready 后淡出；spinner 在 reduced-motion 下静止 */}
      <div className="travel-marquee__loader" role="status" aria-live="polite">
        <div className="travel-marquee__spinner" />
        <p className="travel-marquee__loader-text">海报加载中 · {progress}%</p>
      </div>
    </div>
  );
};

export default TravelMarquee;
