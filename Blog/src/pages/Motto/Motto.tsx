import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Motto.module.scss';

const waves = [
  {
    path: 'M -220 288 C 50 184, 320 390, 640 296 S 1200 208, 1780 320',
    duration: 7,
    delay: 0,
    opacity: 0.9,
    width: 2.8
  },
  {
    path: 'M -240 350 C 96 238, 372 448, 720 350 S 1260 236, 1820 292',
    duration: 8.2,
    delay: -1.6,
    opacity: 0.55,
    width: 2.2
  },
  {
    path: 'M -200 408 C 140 308, 430 516, 842 408 S 1320 248, 1820 188',
    duration: 9,
    delay: -3.1,
    opacity: 0.34,
    width: 1.8
  },
  {
    path: 'M -210 476 C 84 362, 390 568, 790 500 S 1360 308, 1860 414',
    duration: 9.6,
    delay: -4.4,
    opacity: 0.24,
    width: 1.6
  },
  {
    path: 'M -220 234 C 174 128, 452 322, 796 274 S 1310 180, 1820 334',
    duration: 7.6,
    delay: -1.1,
    opacity: 0.44,
    width: 2
  }
];

const Motto: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sparkleCount = 12;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    const element = sectionRef.current;
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const quoteLinesRaw = t('mottoSection.quotes', {
    returnObjects: true
  }) as unknown;

  const quoteLines =
    Array.isArray(quoteLinesRaw) && quoteLinesRaw.length > 0
      ? (quoteLinesRaw as string[])
      : [t('mottoSection.quote')];

  return (
    <section
      ref={sectionRef}
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.aurora} />
        <div className={styles.auroraSecondary} />
        <div className={styles.gridPulse} />

        <div className={styles.sparkleField}>
          {Array.from({ length: sparkleCount }).map((_, index) => (
            <span key={index} className={styles.sparkle} />
          ))}
        </div>

        <svg
          className={styles.waveCanvas}
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          {waves.map((wave, index) => (
            <g
              key={index}
              className={styles.waveGroup}
              style={
                {
                  '--wave-duration': `${wave.duration}s`,
                  '--wave-delay': `${wave.delay}s`,
                  '--wave-opacity': `${wave.opacity}`,
                  '--wave-width': `${wave.width}`
                } as CSSProperties
              }
            >
              <path className={styles.waveGlow} d={wave.path} />
              <path className={styles.waveLine} d={wave.path} />
            </g>
          ))}
        </svg>
      </div>

      <motion.div
        className={styles.quoteStack}
        initial={{ opacity: 0, y: 14 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.55 }}
      >
        {quoteLines.map((line, index) => (
          <motion.p
            key={`${line}-${index}`}
            initial={{
              opacity: 0,
              y: 24,
              filter: 'blur(10px)',
              clipPath: 'inset(0 0 100% 0 round 10px)'
            }}
            animate={
              isVisible
                ? {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0 0 0% 0 round 10px)'
                }
                : {
                  opacity: 0,
                  y: 24,
                  filter: 'blur(10px)',
                  clipPath: 'inset(0 0 100% 0 round 10px)'
                }
            }
            transition={{ duration: 0.86, delay: 0.14 + index * 0.2 }}
            className={`${styles.quoteLine} ${index === 0 ? styles.primaryLine : ''}`}
          >
            {Array.from(line).map((char, charIndex) => (
              <motion.span
                key={`${char}-${charIndex}`}
                className={styles.quoteChar}
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 16, filter: 'blur(8px)' }
                }
                transition={{
                  duration: 0.58,
                  delay: 0.2 + index * 0.2 + charIndex * 0.028
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
};

export default Motto;
