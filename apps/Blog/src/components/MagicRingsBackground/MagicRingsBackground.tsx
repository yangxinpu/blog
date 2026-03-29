import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import styles from './MagicRingsBackground.module.scss';

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
  return (
    <div className={styles.root} aria-hidden="true">
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
          <motion.span
            key={`ring-${index}`}
            className={styles.ring}
            style={ringStyle}
            animate={{ rotate: ring.reverse ? -360 : 360 }}
            transition={{
              duration: ring.duration,
              delay: ring.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

export default MagicRingsBackground;
