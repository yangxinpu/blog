import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import PixelBlast from '../../components/pixel-blast';
import './home.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  const accentColor =
    typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#17FBC6'
      : '#17FBC6';

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (selector: string) => HTMLElement[];

      // 整个标题一次性 SplitText，两行的所有字符共享同一套交错动画
      const titleEl = q('.home-title')[0];
      if (titleEl) {
        const split = new SplitText(titleEl, { type: 'chars' });

        gsap.set(split.chars, {
          opacity: 0,
          yPercent: 80,
          scale: 0.8,
        });

        gsap.to(split.chars, {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          stagger: { each: 0.04, from: 'start' },
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.2,
        });
      }

      gsap.from(q('.home-subtitle, .home-subtitle-alt'), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 1.1,
      });

      // Hero 滚动视差淡出
      gsap.to(q('.home-content'), {
        opacity: 0,
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: q('.home-section')[0],
          start: 'top top',
          end: 'bottom 35%',
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="home-page">
      <section className="home-section">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color={accentColor}
          patternScale={2}
          patternDensity={1.2}
          speed={0.5}
          edgeFade={0.2}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.08}
          rippleIntensityScale={1.2}
        />

        <div className="home-overlay" />

        <div className="home-content">
          <h1 className="home-title">
            <span className="home-title-part-left">Humans Steer, </span>
            <span className="home-title-part-right home-title-accent">Agents Execute</span>
          </h1>

          <p className="home-subtitle">
            我是 NaiLuo，一名致力于学习和成为前端工程与 AI Agent 工作流的全栈开发者
          </p>
          <p className="home-subtitle-alt">
            积硅步，至千里 —— 只有持续学习和实践，才能成为更好的开发者。
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
