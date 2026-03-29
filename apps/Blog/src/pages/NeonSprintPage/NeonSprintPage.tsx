import { useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './NeonSprintPage.module.scss';

const blobs = [
  {
    left: '50%',
    top: '52%',
    size: 138,
    duration: 8.2,
    delay: 0,
    x: [0, -28, 22, 0],
    y: [0, 12, -14, 0],
  },
  {
    left: '36%',
    top: '46%',
    size: 84,
    duration: 7,
    delay: -0.8,
    x: [0, 22, -16, 0],
    y: [0, -10, 14, 0],
  },
  {
    left: '64%',
    top: '42%',
    size: 74,
    duration: 7.4,
    delay: -1.3,
    x: [0, -14, 18, 0],
    y: [0, 16, -10, 0],
  },
  {
    left: '56%',
    top: '32%',
    size: 68,
    duration: 6.5,
    delay: -0.6,
    x: [0, 14, -12, 0],
    y: [0, -14, 12, 0],
  },
  {
    left: '69%',
    top: '58%',
    size: 64,
    duration: 6.2,
    delay: -1.1,
    x: [0, -12, 10, 0],
    y: [0, 10, -10, 0],
  },
  {
    left: '30%',
    top: '34%',
    size: 56,
    duration: 5.8,
    delay: -0.7,
    x: [0, 10, -8, 0],
    y: [0, -10, 8, 0],
  },
  {
    left: '74%',
    top: '36%',
    size: 58,
    duration: 6.1,
    delay: -1.6,
    x: [0, -8, 10, 0],
    y: [0, 10, -8, 0],
  },
  {
    left: '59%',
    top: '68%',
    size: 66,
    duration: 7.1,
    delay: -0.9,
    x: [0, 12, -10, 0],
    y: [0, 10, -12, 0],
  },
  {
    left: '43%',
    top: '69%',
    size: 60,
    duration: 6.7,
    delay: -1.2,
    x: [0, -10, 12, 0],
    y: [0, -8, 10, 0],
  },
];

function NeonSprintPage() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [isPointerInside, setIsPointerInside] = useState(false);

  const copy = isZh
    ? '专注打磨每一次输出，把复杂拆成可执行的小步，持续前进，你会看见自己的跃迁。'
    : 'Refine every output, break complexity into executable steps, keep moving, and your growth will compound.';

  const segments = useMemo(
    () => (isZh ? Array.from(copy) : copy.split(' ')),
    [copy, isZh]
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setPointer({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    });
  };

  const resetPointer = () => {
    setPointer({ x: 0.5, y: 0.5 });
    setIsPointerInside(false);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textPane}>
          <p className={styles.copy}>
            {segments.map((segment, index) => (
              <motion.span
                key={`${segment}-${index}`}
                className={styles.copyToken}
                initial={{
                  opacity: 0,
                  y: 28,
                  filter: 'blur(10px)',
                  rotateX: 70,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  rotateX: 0,
                }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.58,
                  delay: index * 0.024,
                  ease: 'easeOut',
                }}
              >
                {!isZh && index > 0 ? '\u00A0' : ''}
                {segment}
              </motion.span>
            ))}
          </p>
        </div>

        <div
          className={styles.visualPane}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setIsPointerInside(true)}
          onPointerLeave={resetPointer}
        >
          <div className={styles.metaBalls} aria-hidden="true">
            <svg className={styles.filterSvg}>
              <filter id="neon-meta-goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="11"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </svg>

            <div className={styles.gooWrap}>
              {blobs.map((blob, index) => (
                <motion.span
                  key={`blob-${index}`}
                  className={styles.ballWrap}
                  style={{
                    left: blob.left,
                    top: blob.top,
                    width: `${blob.size}px`,
                    height: `${blob.size}px`,
                  }}
                >
                  <motion.span
                    className={styles.ball}
                    animate={{
                      x: blob.x,
                      y: blob.y,
                      scale: [1, 1.08, 0.92, 1],
                    }}
                    transition={{
                      duration: blob.duration,
                      delay: blob.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.span>
              ))}

              <motion.span
                className={styles.mouseBallWrap}
                style={{
                  left: `${pointer.x * 100}%`,
                  top: `${pointer.y * 100}%`,
                }}
                animate={{
                  opacity: isPointerInside ? 0.96 : 0,
                  scale: isPointerInside ? 1 : 0.4,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span className={styles.mouseBall} />
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NeonSprintPage;
