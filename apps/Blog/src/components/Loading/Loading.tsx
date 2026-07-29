import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './Loading.module.scss';

gsap.registerPlugin(useGSAP);

interface LoadingProps {
  logo?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ logo, text = 'NAILUO' }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 加载屏所有动画
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // logoWrapper 入场
      const logoWrapper = root.querySelector<HTMLElement>(
        `.${styles.logoWrapper}`
      );
      if (logoWrapper) {
        gsap.fromTo(
          logoWrapper,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
        );
      }

      // 三圈旋转
      const ring = root.querySelector<HTMLElement>(`.${styles.ring}`);
      if (ring) {
        gsap.to(ring, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
      }

      const ringReverse = root.querySelector<HTMLElement>(
        `.${styles.ringReverse}`
      );
      if (ringReverse) {
        gsap.to(ringReverse, {
          rotation: -360,
          duration: 4,
          repeat: -1,
          ease: 'none',
        });
      }

      const ringDotted = root.querySelector<HTMLElement>(
        `.${styles.ringDotted}`
      );
      if (ringDotted) {
        gsap.to(ringDotted, {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: 'none',
        });
      }

      // logo 光晕脉动
      const logoGlow = root.querySelector<HTMLElement>(`.${styles.logoGlow}`);
      if (logoGlow) {
        gsap.to(logoGlow, {
          keyframes: {
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          },
          duration: 2,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }

      // logo 图像上下浮动
      const logoImg = root.querySelector<HTMLElement>(`.${styles.logo}`);
      if (logoImg) {
        gsap.to(logoImg, {
          keyframes: { y: [0, -8, 0] },
          duration: 2,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }

      // 脉冲圆环
      const pulseRing = root.querySelector<HTMLElement>(
        `.${styles.pulseRing}`
      );
      if (pulseRing) {
        gsap.to(pulseRing, {
          keyframes: {
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
          },
          duration: 2,
          repeat: -1,
          ease: 'power2.out',
        });
      }

      // 文本容器入场
      const textContainer = root.querySelector<HTMLElement>(
        `.${styles.textContainer}`
      );
      if (textContainer) {
        gsap.fromTo(
          textContainer,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, delay: 0.3, duration: 0.5, ease: 'power2.out' }
        );
      }

      // 品牌字符颜色循环
      const chars = root.querySelectorAll<HTMLElement>(`.${styles.char}`);
      chars.forEach((char, index) => {
        gsap.to(char, {
          keyframes: {
            color: ['var(--accent)', '#ffffff', 'var(--accent)'],
          },
          duration: 2,
          repeat: -1,
          delay: index * 0.1,
          ease: 'none',
        });
      });

      // "Loading..." 透明度脉动
      const loadingText = root.querySelector<HTMLElement>(
        `.${styles.loadingText}`
      );
      if (loadingText) {
        gsap.to(loadingText, {
          keyframes: { opacity: [0.5, 1, 0.5] },
          duration: 1.5,
          repeat: -1,
          ease: 'none',
        });
      }

      // 12 个粒子上升
      const particles = root.querySelectorAll<HTMLElement>(
        `.${styles.particle}`
      );
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          keyframes: {
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          },
          duration: 2,
          repeat: -1,
          delay: index * 0.15,
          ease: 'power1.inOut',
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div className={styles.loadingContainer} ref={rootRef}>
      <div className={styles.background}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <div className={styles.ringContainer}>
            <div className={styles.ring} />
            <div className={styles.ringReverse} />
            <div className={styles.ringDotted} />
          </div>

          <div className={styles.logoGlow} />

          {logo && (
            <img src={logo} alt="Logo" className={styles.logo} />
          )}

          <div className={styles.pulseRing} />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.brandText}>
            {text.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className={styles.char}
              >
                {char}
              </span>
            ))}
          </h2>

          <p className={styles.loadingText}>Loading...</p>
        </div>

        <div className={styles.particles}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={
                {
                  '--delay': `${i * 0.2}s`,
                  '--distance': `${80 + i * 15}px`,
                  '--angle': `${i * 30}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
