import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Motto.module.scss';

const waves = [
  {
    path: 'M -220 290 C 60 210, 310 380, 610 312 S 1180 214, 1760 332',
    duration: 7.2,
    delay: 0,
    opacity: 0.9,
    width: 2.8
  },
  {
    path: 'M -240 340 C 120 250, 340 440, 700 356 S 1220 232, 1780 286',
    duration: 8.1,
    delay: -1.8,
    opacity: 0.52,
    width: 2.2
  },
  {
    path: 'M -180 400 C 140 300, 420 500, 820 414 S 1290 260, 1760 188',
    duration: 8.8,
    delay: -3.4,
    opacity: 0.34,
    width: 1.8
  },
  {
    path: 'M -200 470 C 80 360, 380 560, 760 500 S 1300 312, 1800 412',
    duration: 9.4,
    delay: -4.2,
    opacity: 0.26,
    width: 1.6
  },
  {
    path: 'M -200 240 C 160 150, 440 320, 760 280 S 1250 190, 1760 348',
    duration: 7.8,
    delay: -1.2,
    opacity: 0.42,
    width: 2
  }
];

const Motto: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.glowSecondary} />

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

      <motion.p
        className={styles.quote}
        initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
        animate={
          isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined
        }
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {t('mottoSection.quote')}
      </motion.p>
    </section>
  );
};

export default Motto;
