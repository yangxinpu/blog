import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import AeroShards from './components/aero-shards';
import './index.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = () => {
  const rootRef = useRef<HTMLDivElement>(null);


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
      <div className="home-shards">
          <AeroShards
            backgroundColor="#111111"
            shardColor="#0EB890"
            accentColor="#17FBC6"
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
