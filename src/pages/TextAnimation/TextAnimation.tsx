import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Compass,
  Flame,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './TextAnimation.module.scss';

type IconItem = {
  key: string;
  label: string;
  className: string;
  Icon: ComponentType<{ size?: number }>;
};

function TextAnimation() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const words = useMemo(
    () =>
      (t('textAnimation.words', { returnObjects: true }) as unknown as string[]) ?? [
        'NAILUO',
        'UNLIMITED',
        'PROGRESS',
        'GROWTH'
      ],
    [t]
  );
  const railWords = useMemo(() => [...words, ...words], [words]);

  useEffect(() => {
    if (words.length === 0) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [words]);

  const iconItems: IconItem[] = [
    { key: 'rocket', label: 'Launch', className: styles.iconOne, Icon: Rocket },
    { key: 'spark', label: 'Spark', className: styles.iconTwo, Icon: Sparkles },
    { key: 'star', label: 'Create', className: styles.iconThree, Icon: Star },
    { key: 'flame', label: 'Drive', className: styles.iconFour, Icon: Flame },
    { key: 'trend', label: 'Boost', className: styles.iconFive, Icon: TrendingUp },
    { key: 'target', label: 'Aim', className: styles.iconSix, Icon: Target },
    { key: 'zap', label: 'Flow', className: styles.iconSeven, Icon: Zap },
    { key: 'compass', label: 'Focus', className: styles.iconEight, Icon: Compass },
    { key: 'bulb', label: 'Vision', className: styles.iconNine, Icon: Lightbulb },
    { key: 'trophy', label: 'Win', className: styles.iconTen, Icon: Trophy }
  ];

  const activeWord = words[activeIndex] ?? 'NAILUO';

  const handleSelectWord = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.stage}>
          <div className={styles.iconLayer} aria-hidden="true">
            {iconItems.map(({ key, Icon, label, className }, index) => (
              <motion.div
                key={key}
                className={`${styles.iconBadge} ${className}`}
                animate={{
                  y: [0, -9, 0, 7, 0],
                  rotate: [0, 5, -4, 0],
                  scale: [1, 1.06, 1]
                }}
                transition={{
                  duration: 4.2 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.25
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>

          <div className={styles.wordViewport}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWord}
                className={styles.word}
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(10px)' }}
                transition={{ duration: 0.66, ease: 'easeInOut' }}
              >
                {Array.from(activeWord).map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    className={styles.wordChar}
                    initial={{ opacity: 0, y: 14, rotateX: 80 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -14, rotateX: -80 }}
                    transition={{
                      duration: 0.56,
                      delay: index * 0.04
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.railMask}>
            <motion.div
              className={styles.railTrack}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            >
              {railWords.map((word, index) => {
                const originalIndex = index % words.length;
                const isSelected = originalIndex === activeIndex;

                return (
                  <motion.button
                    key={`${word}-${index}`}
                    type="button"
                    className={`${styles.railItem} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleSelectWord(originalIndex)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {word}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TextAnimation;
