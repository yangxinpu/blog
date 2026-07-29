import { useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './MagicRingsBackground.module.scss';

gsap.registerPlugin(useGSAP);

type RingConfig = {
  size: string;
  stroke: number;
  color: string;
  duration: number;
  delay: number;
  reverse?: boolean;
  opacity: number;
};

const ringConfigs: RingConfig[] = [
  {
    size: '72vmin',
    stroke: 2,
    color: '#8af7ff',
    duration: 26,
    delay: 0,
    opacity: 0.22,
  },
  {
    size: '60vmin',
    stroke: 3,
    color: '#6ab7ff',
    duration: 22,
    delay: -1.2,
    reverse: true,
    opacity: 0.26,
  },
  {
    size: '48vmin',
    stroke: 2,
    color: '#8b8dff',
    duration: 18,
    delay: -0.8,
    opacity: 0.28,
  },
  {
    size: '36vmin',
    stroke: 3,
    color: '#5effd1',
    duration: 14,
    delay: -1.4,
    reverse: true,
    opacity: 0.32,
  },
  {
    size: '28vmin',
    stroke: 2,
    color: '#d1f7ff',
    duration: 12,
    delay: -2,
    opacity: 0.34,
  },
];

function MagicRingsBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 五圈无限旋转
  useGSAP(
    () => {
      const rings = rootRef.current?.querySelectorAll<HTMLElement>(
        `.${styles.ring}`
      );
      if (!rings) return;

      rings.forEach((ring, index) => {
        const config = ringConfigs[index];
        if (!config) return;

        gsap.to(ring, {
          rotation: config.reverse ? -360 : 360,
          duration: config.duration,
          delay: config.delay,
          repeat: -1,
          ease: 'none',
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div className={styles.root} aria-hidden="true" ref={rootRef}>
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      {ringConfigs.map((ring, index) => {
        const ringStyle = {
          width: ring.size,
          height: ring.size,
          borderWidth: `${ring.stroke}px`,
          color: ring.color,
          opacity: ring.opacity,
        } as CSSProperties;

        return (
          <span
            key={`ring-${index}`}
            className={styles.ring}
            style={ringStyle}
          />
        );
      })}
    </div>
  );
}

export default MagicRingsBackground;
