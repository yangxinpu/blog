import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

// 预加载图片并采集原始宽高
const loadImageSizes = async (
  urls: string[]
): Promise<Record<string, { w: number; h: number }>> => {
  const entries = await Promise.all(
    urls.map(
      src =>
        new Promise<[string, { w: number; h: number }]>(resolve => {
          const img = new Image();
          img.onload = () => resolve([src, { w: img.naturalWidth, h: img.naturalHeight }]);
          img.onerror = () => resolve([src, { w: 1, h: 1 }]);
          img.src = src;
        })
    )
  );
  return Object.fromEntries(entries);
};

interface Item {
  id: string;
  img: string;
  url: string;
  /** hover 时展示的标题（主色），与 content 同时从下方上滑出场 */
  title?: string;
  /** hover 时展示的描述文案 */
  content?: string;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

const TravelImages: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false
}) => {
  const columns = 2;

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});
  const hasAnimated = useRef(false);

  useEffect(() => {
    loadImageSizes(items.map(i => i.img)).then(setSizes);
  }, [items]);

  const imagesReady = Object.keys(sizes).length === items.length && items.length > 0;

  // 根据图片原始宽高比 × 容器宽度，得到自然显示高度
  const grid = useMemo<GridItem[]>(() => {
    if (!width || !imagesReady) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map(child => {
      const ratio = sizes[child.img] ? sizes[child.img].h / sizes[child.img].w : 1;
      const h = columnWidth * ratio;
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const y = colHeights[col];
      colHeights[col] += h;

      return { ...child, x, y, w: columnWidth, h };
    });
  }, [columns, items, width, sizes, imagesReady]);

  const gridHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map(i => i.y + i.h));
  }, [grid]);

  useLayoutEffect(() => {
    if (!imagesReady || !containerRef.current || !grid.length) return;

    // 入场偏移量：静止位置由 left/top 布局承载（见 JSX inline style），
    // 这里只返回相对静止位置的 transform 偏移，动画结束后 transform 被完全清除
    const getInitialOffset = (item: GridItem) => {
      let direction: MasonryProps['animateFrom'] = animateFrom;

      if (animateFrom === 'random') {
        const directions = ['top', 'bottom', 'left', 'right'] as const;
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      switch (direction) {
        case 'top':
          return { x: 0, y: -item.y - 200 };
        case 'bottom':
          return { x: 0, y: gridHeight + 200 - item.y };
        case 'left':
          return { x: -item.x - 200, y: 0 };
        case 'right':
          return { x: width + 200 - item.x, y: 0 };
        case 'center':
          return {
            x: width / 2 - item.w / 2 - item.x,
            y: gridHeight / 2 - item.h / 2 - item.y
          };
        default:
          return { x: 0, y: 100 };
      }
    };

    const ctx = gsap.context(self => {
      const q = self.selector as (selector: string) => HTMLElement[];

      if (!hasAnimated.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            hasAnimated.current = true;
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true
          }
        });

        grid.forEach((item, index) => {
          const el = q(`[data-key="${item.id}"]`)[0];
          if (!el) return;
          const offset = getInitialOffset(item);
          // 仅动画期间存在 transform/filter：GSAP 自动提升合成层，结束后 clearProps 释放
          gsap.set(el, {
            x: offset.x,
            y: offset.y,
            opacity: 0,
            ...(blurToFocus && { filter: 'blur(6px)' })
          });

          tl.to(
            el,
            {
              x: 0,
              y: 0,
              opacity: 1,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration,
              ease,
              // 动画结束即清除内联 transform/filter/opacity：
              // 静止状态零合成提示，20 张图回归同一内容层随页面滚动
              clearProps: blurToFocus ? 'transform,filter,opacity' : 'transform,opacity'
            },
            index * stagger
          );
        });
      } else {
        // resize 后：left/top 已由 React 重新布局，清除所有动画残留即可
        gsap.set(q('[data-key]'), { clearProps: 'transform,filter,opacit' });
      }
    }, containerRef.current);

    return () => ctx.revert();
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, width, gridHeight, containerRef]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    if (scaleOnHover) {
      gsap.to(el, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      });
    }

    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, { opacity: 0.3, duration: 0.3, overwrite: true });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    if (scaleOnHover) {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
        // hover 结束后同样释放 transform，避免静态卡片残留合成层
        clearProps: 'transform'
      });
    }

    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.3, overwrite: true });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="travel-display-images-section-list"
      style={{ height: gridHeight, flex: 1, minWidth: 0 }}
    >
      {grid.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="travel-display-images-section-item-wrapper"
            // 静止位置由布局（left/top/width/height）承载，GSAP 动画期间才写 transform，
            // 结束后 clearProps 释放 —— 静态滚动时不产生任何常驻合成层
            style={{ width: item.w, height: item.h, left: item.x, top: item.y }}
            onClick={() => window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="travel-display-images-section-item-img">
              {/* 用 <img> 替代 background-image：原生异步解码，合成层更友好 */}
              <img src={item.img} alt="" loading="eager" decoding="async" draggable={false} />
              {(item.title || item.content) && (
                <>
                  {/* 黑色透明遮罩：z-1，hover 淡入 */}
                  <div className="travel-display-images-section-item-mask" />
                  {/* 文案层：z-2，标题 + 描述同时从下方上滑出场 */}
                  <div className="travel-display-images-section-item-caption">
                    {item.title && (
                      <h3 className="travel-display-images-section-item-caption-title">
                        {item.title}
                      </h3>
                    )}
                    {item.content && (
                      <p className="travel-display-images-section-item-caption-content">
                        {item.content}
                      </p>
                    )}
                  </div>
                </>
              )}
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '8px'
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TravelImages;
