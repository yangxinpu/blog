import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import catImage from '../../assets/Images/common/cat.webp';
import nailuoImage from '../../assets/Images/common/Nailuozhiyan.png';
import AeroShards from './components/aero-shards';
import GitHubActivity from './components/github-activity';
import './index.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = () => {
  const rootRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (selector: string) => HTMLElement[];

      const titleEl = q('.home-title')[0];
      const accentEl = q('.home-title-accent')[0];
      const subtitleEls = [q('.home-subtitle')[0], q('.home-subtitle-alt')[0]].filter(
        (el): el is HTMLElement => Boolean(el),
      );
      const cardMotionEls = q('.home-card-motion');

      if (titleEl) {
        const titleSplit = new SplitText(titleEl, { type: 'chars' });
        const tl = gsap.timeline({ delay: 0.15 });

        // 标题：自中心向两侧波浪式弹入，每个字符带随机小倾角与回弹
        tl.from(titleSplit.chars, {
          opacity: 0,
          yPercent: 115,
          scale: 0.65,
          rotation: () => gsap.utils.random(-10, 10),
          duration: 1.05,
          ease: 'back.out(1.6)',
          stagger: { each: 0.03, from: 'center' },
        });

        // 副标题：逐字轻盈浮现，整段同步失焦 → 对焦
        subtitleEls.forEach((el, i) => {
          const split = new SplitText(el, { type: 'chars' });
          const position = 0.55 + i * 0.28;

          tl.from(
            split.chars,
            {
              opacity: 0,
              y: 16,
              duration: 0.55,
              ease: 'power3.out',
              stagger: 0.025,
            },
            position,
          );
          tl.from(
            el,
            {
              filter: 'blur(10px)',
              duration: 0.8,
              ease: 'power2.out',
            },
            position,
          );
        });

        // 强调语入场完成后保持轻柔漂浮，灵气收尾
        if (accentEl) {
          gsap.to(accentEl, {
            y: -4,
            duration: 2.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1.7,
          });
        }
      }

      if (cardMotionEls.length > 0) {
        gsap.fromTo(
          cardMotionEls,
          {
            autoAlpha: 0,
            y: 36,
            scale: 0.96,
            rotationZ: (i) => [-0.8, 0.6, 0][i] ?? 0,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotationZ: 0,
            duration: 0.82,
            ease: 'power3.out',
            stagger: 0.11,
            delay: 0.85,
            force3D: true,
            overwrite: 'auto',
          },
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
          <div className="home-hero-copy">
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

          <div className="home-card-grid" aria-label="主页内容卡片">
            <div className="home-card-motion">
              <article className="home-card home-profile-card">
                <img className="home-profile-card__image" src={catImage} alt="NaiLuo 的猫咪头像" />
                <div className="home-profile-card__body">
                  <span className="home-card__eyebrow">ABOUT</span>
                  <h2>全栈开发者</h2>
                  <p>
                    关注前端工程化、交互体验与 AI Agent 工作流，把持续学习沉淀成可复用的知识和作品。
                  </p>
                </div>
              </article>
            </div>

            <div className="home-card-motion">
              <GitHubActivity />
            </div>

            <div className="home-card-motion">
              <figure className="home-card home-portrait-card">
                <img className="home-portrait-card__image" src={nailuoImage} alt="NaiLuo 之眼" />
              </figure>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
