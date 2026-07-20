import React from 'react';
import { motion } from 'motion/react';
import styles from './Loading.module.scss';

interface LoadingProps {
  logo?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ logo, text = 'NAILUO' }) => {
  return (
    <motion.div
      className={styles.loadingContainer}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.background}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <div className={styles.content}>
        <motion.div
          className={styles.logoWrapper}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.ringContainer}>
            <motion.div
              className={styles.ring}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={styles.ringReverse}
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={styles.ringDotted}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <motion.div
            className={styles.logoGlow}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {logo && (
            <motion.img
              src={logo}
              alt="Logo"
              className={styles.logo}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          <motion.div
            className={styles.pulseRing}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>

        <motion.div
          className={styles.textContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h2 className={styles.brandText}>
            {text.split('').map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className={styles.char}
                animate={{
                  color: ['var(--accent)', '#ffffff', 'var(--accent)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            className={styles.loadingText}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.p>
        </motion.div>

        <div className={styles.particles}>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              style={
                {
                  '--delay': `${i * 0.2}s`,
                  '--distance': `${80 + i * 15}px`,
                  '--angle': `${i * 30}deg`,
                } as React.CSSProperties
              }
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
