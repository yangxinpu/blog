import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import './index.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const TravelHero: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (selector: string) => HTMLElement[];
      const inner = q('.travel-hero-inner')[0];
      if (!inner) return;

      // 1. 整个文字卡片从底部整体上浮 + 淡入（主动画）
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.from(inner, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'expo.out',
      });

      // 2. 卡片内主标题字符级 stagger 从底部翻上来（叠在容器动画后半段）
      const titleEl = q('.travel-hero-title')[0];
      if (titleEl) {
        const split = new SplitText(titleEl, { type: 'chars' });

        tl.from(
          split.chars,
          {
            yPercent: 120,
            rotateZ: 6,
            opacity: 0,
            stagger: { each: 0.03, from: 'start' },
            duration: 0.7,
            ease: 'expo.out',
          },
          '>-=0.5'
        );
      }

      // 3. 装饰线 + 底部 meta 继续往后
      tl.from(q('.travel-hero-subtitle'), {
        opacity: 0,
        y: 24,
        duration: 0.4,
        ease: 'expo.out',
      });

      const line = q('.travel-hero-line')[0];
      if (line) {
        tl.from(
          line,
          {
            scaleX: 0,
            duration: 0.4,
            ease: 'expo.out',
            transformOrigin: 'left',
          },
          '<'
        );
      }

      tl.from(q('.travel-hero-meta-bottom'), {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, rootRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="travel-hero">
      <div className="travel-hero-inner">
        <div className="travel-hero-meta travel-hero-meta-top">
          <span className="travel-hero-line" />
        </div>

        <h1 className="travel-hero-title">
          Nature and Life
        </h1>

        <p className="travel-hero-subtitle">
          所有的出发，都是为了更好的回来 —— All departures are for a better comeback.
        </p>

        <div className="travel-hero-meta travel-hero-meta-bottom">
          <span>— Culture · City · Scenery</span>
          <span className="travel-hero-dot" />
          <span>2023 / {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default TravelHero;
