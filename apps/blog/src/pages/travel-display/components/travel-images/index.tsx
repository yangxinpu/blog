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

    // 初始位置：避免 getBoundingClientRect 强制同步布局，直接用 grid 已知尺寸
    const getInitialPosition = (item: GridItem) => {
      let direction: MasonryProps['animateFrom'] = animateFrom;

      if (animateFrom === 'random') {
        const directions = ['top', 'bottom', 'left', 'right'] as const;
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -200 };
        case 'bottom':
          return { x: item.x, y: gridHeight + 200 };
        case 'left':
          return { x: -200, y: item.y };
        case 'right':
          return { x: width + 200, y: item.y };
        case 'center':
          return {
            x: width / 2 - item.w / 2,
            y: gridHeight / 2 - item.h / 2
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    };

    const ctx = gsap.context(() => {
      if (!hasAnimated.current) {
        grid.forEach(item => {
          const initialPos = getInitialPosition(item);
          // 只设置 transform/opacity/filter，不碰 width/height（避免触发布局）
          gsap.set(`[data-key="${item.id}"]`, {
            x: initialPos.x,
            y: initialPos.y,
            opacity: 0,
            ...(blurToFocus && { filter: 'blur(10px)' })
          });
        });

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
          // 只动画 transform(x,y) + opacity + filter，绝不动画 width/height
          tl.to(
            `[data-key="${item.id}"]`,
            {
              x: item.x,
              y: item.y,
              opacity: 1,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.8,
              ease: 'power3.out'
            },
            index * stagger
          );
        });
      } else {
        grid.forEach(item => {
          gsap.to(`[data-key="${item.id}"]`, {
            x: item.x,
            y: item.y,
            duration: duration,
            ease: ease,
            overwrite: 'auto'
          });
        });
      }
    }, containerRef.current);

    return () => ctx.revert();
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, width, gridHeight, containerRef]);

  const handleMouseEnter = (_e: React.MouseEvent, item: GridItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const el = document.querySelector(`[data-key="${item.id}"]`) as HTMLElement | null;
      const overlay = el?.querySelector('.color-overlay') as HTMLElement | null;
      if (overlay) {
        gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
      }
    }
  };

  const handleMouseLeave = (_e: React.MouseEvent, item: GridItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const el = document.querySelector(`[data-key="${item.id}"]`) as HTMLElement | null;
      const overlay = el?.querySelector('.color-overlay') as HTMLElement | null;
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.3 });
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
            // width/height 通过 inline style 固定，GSAP 不碰它们（避免 reflow）
            style={{ width: item.w, height: item.h }}
            onClick={() => window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="travel-display-images-section-item-img">
              {/* 用 <img> 替代 background-image：原生异步解码，合成层更友好 */}
              <img src={item.img} alt="" loading="eager" decoding="async" draggable={false} />
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
