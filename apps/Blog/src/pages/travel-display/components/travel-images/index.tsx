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

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

interface Item {
  id: string;
  img: string;
  url: string;
  height: number;
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
  const columns = 2; // 单列瀑布流，图片宽度由外层 flex 决定，不在这里拆分

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  // masonry 自然摆放：每张图片 height = child.height / 2，不缩放
  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const h = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += h;

      return { ...child, x, y, w: columnWidth, h };
    });
  }, [columns, items, width]);

  const gridHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map(i => i.y + i.h));
  }, [grid]);

  useLayoutEffect(() => {
    if (!imagesReady || !containerRef.current || !grid.length) return;

    const getInitialPosition = (item: GridItem) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { x: item.x, y: item.y };

      let direction: MasonryProps['animateFrom'] = animateFrom;

      if (animateFrom === 'random') {
        const directions = ['top', 'bottom', 'left', 'right'] as const;
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -200 };
        case 'bottom':
          return { x: item.x, y: containerRect.height + 200 };
        case 'left':
          return { x: -200, y: item.y };
        case 'right':
          return { x: containerRect.width + 200, y: item.y };
        case 'center':
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    };

    const ctx = gsap.context(() => {
      if (!hasAnimated.current) {
        // 还没入场过：先 set 初始状态（opacity:0），等 ScrollTrigger 触发
        grid.forEach(item => {
          const initialPos = getInitialPosition(item);
          gsap.set(`[data-key="${item.id}"]`, {
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
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
          tl.to(
            `[data-key="${item.id}"]`,
            {
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
              opacity: 1,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.8,
              ease: 'power3.out'
            },
            index * stagger
          );
        });
      } else {
        // resize 后重新定位（不重播入场动画）
        grid.forEach(item => {
          gsap.to(`[data-key="${item.id}"]`, {
            x: item.x,
            y: item.y,
            width: item.w,
            height: item.h,
            duration: duration,
            ease: ease,
            overwrite: 'auto'
          });
        });
      }
    }, containerRef.current);

    return () => ctx.revert();
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, containerRef]);

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
            onClick={() => window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="travel-display-images-section-item-img" style={{ backgroundImage: `url(${item.img})` }}>
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
