import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AeroShards from './components/aero-shards';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const rootRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (selector: string) => HTMLElement[];

      const titleEl = q('.home-title')[0];
      const subtitleEls = [q('.home-subtitle')[0], q('.home-subtitle-alt')[0]].filter(
        (el): el is HTMLElement => Boolean(el),
      );

      const introTimeline = gsap.timeline({ delay: 0.15 });
      if (titleEl) {
        introTimeline.from(titleEl, {
          opacity: 0,
          y: 84,
          duration: 1.1,
          ease: 'power3.out',
        });
      }
      if (subtitleEls.length > 0) {
        introTimeline.from(
          subtitleEls,
          {
            opacity: 0,
            y: 64,
            duration: 0.9,
            ease: 'power3.out',
          },
          0.68,
        );
      }

      // 鼠标景深视差：文字被指针轻微吸引，呈现漂浮的灵动感（仅精细指针设备）
      const mm = gsap.matchMedia();
      mm.add('(pointer: fine) and (min-width: 769px)', () => {
        const section = q('.home-section')[0];
        if (!section) return;

        const layers: { el: HTMLElement; dx: number; dy: number }[] = [];
        if (titleEl) layers.push({ el: titleEl, dx: 12, dy: 8 });
        subtitleEls.forEach((el) => layers.push({ el, dx: 6, dy: 4 }));

        const tracked = layers.map(({ el, dx, dy }) => ({
          dx,
          dy,
          xTo: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
          yTo: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
        }));

        const onPointerMove = (e: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          tracked.forEach(({ xTo, yTo, dx, dy }) => {
            xTo(nx * dx);
            yTo(ny * dy);
          });
        };

        const onPointerLeave = () => {
          tracked.forEach(({ xTo, yTo }) => {
            xTo(0);
            yTo(0);
          });
        };

        section.addEventListener('pointermove', onPointerMove);
        section.addEventListener('pointerleave', onPointerLeave);
        return () => {
          section.removeEventListener('pointermove', onPointerMove);
          section.removeEventListener('pointerleave', onPointerLeave);
        };
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
        <div className="home-shards">
          <AeroShards
            backgroundColor="var(--bg)"
            shardColor="var(--primary-400)"
            accentColor="var(--accent-blue)"
            placement="full"
            flow="stream"
            material="pearl"
            detail="balanced"
            effect="none"
            scale={0.7}
            spread={1}
            depth={1}
            speed={1}
            spin={1}
            interaction="repel"
            density={1.5}
            shardSize={1.1}
            stretch={1}
            turbulence={1}
            glow={1}
            edgeSoftness={2}
            bloom={0.5}
            grain={0.05}
            chromaticAberration={0.0075}
            transitionDuration={1}
            interactionRadius={1.5}
            interactionStrength={0.5}
            rippleIntensity={1}
            holdToGather
            paused={false}
          />
        </div>
        <div className="home-overlay" />
        <div className="home-content">
          <div className="home-hero-copy">
            <h1 className="home-title">
              <span className="home-title-part-left">Humans Steer,</span>{' '}
              <span className="home-title-part-right home-title-accent">Agents <span className="home-title-accent-blue">Execute</span></span>
            </h1>

            <p className="home-subtitle">
              积硅步，至千里 —— 只有持续学习和实践，才能成为更好的开发者
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
