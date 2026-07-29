import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './TextAnimation.module.scss';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

gsap.registerPlugin(useGSAP);

type IconItem = {
  key: string;
  label: string;
  className: string;
  Icon: ComponentType<{ size?: number }>;
};

function TextAnimation() {
  const { t } = useTranslation();
  const { ref: sectionRef, isActive } = useSectionActivity<HTMLElement>({
    rootMargin: '25% 0px 25% 0px',
    threshold: 0.15,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const words = useMemo(
    () =>
      (t('textAnimation.words', {
        returnObjects: true,
      }) as unknown as string[]) ?? ['NAILUO', 'UNLIMITED', 'PROGRESS', 'GROWTH'],
    [t]
  );
  const railWords = useMemo(() => [...words, ...words], [words]);

  // 当前展示的词（用于 AnimatePresence mode="wait" 替代）
  const [displayWord, setDisplayWord] = useState<string>(
    () => words[0] ?? 'NAILUO'
  );

  const activeWord = words[activeIndex] ?? 'NAILUO';

  // 词切换：activeIndex 改变 → 退场动画 → 切换 displayWord
  useEffect(() => {
    if (activeWord === displayWord) return;

    const node = wordRef.current;
    if (!node) {
      // ref 尚未挂载，延迟到下一帧再切换
      const rafId = requestAnimationFrame(() => {
        setDisplayWord(activeWord);
      });
      return () => cancelAnimationFrame(rafId);
    }

    const chars = node.querySelectorAll<HTMLElement>(`.${styles.wordChar}`);
    const tl = gsap.timeline();
    tl.to(node, {
      opacity: 0,
      y: -24,
      duration: 0.66,
      ease: 'power1.inOut',
    }).to(
      chars,
      {
        opacity: 0,
        y: -14,
        rotateX: -80,
        duration: 0.56,
        stagger: 0.04,
        ease: 'power1.inOut',
      },
      0
    );
    tl.eventCallback('onComplete', () => {
      setDisplayWord(activeWord);
    });

    return () => {
      tl.kill();
    };
  }, [activeWord, displayWord]);

  // displayWord 改变后播放入场动画
  useLayoutEffect(() => {
    if (!displayWord) return;
    const node = wordRef.current;
    if (!node) return;

    const chars = node.querySelectorAll<HTMLElement>(`.${styles.wordChar}`);
    const tl = gsap.timeline();
    tl.fromTo(
      node,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.66, ease: 'power1.inOut' }
    ).fromTo(
      chars,
      { opacity: 0, y: 14, rotateX: 80 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.56,
        stagger: 0.04,
        ease: 'power1.inOut',
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [displayWord]);

  useEffect(() => {
    if (!isActive || words.length === 0) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [isActive, words]);

  const iconItems: IconItem[] = [
    { key: 'rocket', label: 'Launch', className: styles.iconOne, Icon: Rocket },
    { key: 'spark', label: 'Spark', className: styles.iconTwo, Icon: Sparkles },
    { key: 'star', label: 'Create', className: styles.iconThree, Icon: Star },
    { key: 'flame', label: 'Drive', className: styles.iconFour, Icon: Flame },
    {
      key: 'trend',
      label: 'Boost',
      className: styles.iconFive,
      Icon: TrendingUp,
    },
    { key: 'target', label: 'Aim', className: styles.iconSix, Icon: Target },
    { key: 'zap', label: 'Flow', className: styles.iconSeven, Icon: Zap },
    {
      key: 'compass',
      label: 'Focus',
      className: styles.iconEight,
      Icon: Compass,
    },
    {
      key: 'bulb',
      label: 'Vision',
      className: styles.iconNine,
      Icon: Lightbulb,
    },
    { key: 'trophy', label: 'Win', className: styles.iconTen, Icon: Trophy },
  ];

  const wordRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // 图标徽章循环动画 + 轨道滑动
  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const iconBadges = stage.querySelectorAll<HTMLElement>(
        `.${styles.iconBadge}`
      );
      const railTrack = stage.querySelector<HTMLElement>(`.${styles.railTrack}`);

      if (isActive) {
        iconBadges.forEach((badge, index) => {
          gsap.to(badge, {
            keyframes: {
              y: [0, -9, 0, 7, 0],
              rotation: [0, 5, -4, 0],
              scale: [1, 1.06, 1],
            },
            duration: 4.2 + index * 0.5,
            repeat: -1,
            delay: index * 0.25,
            ease: 'power1.inOut',
          });
        });

        if (railTrack) {
          gsap.fromTo(
            railTrack,
            { x: '0%' },
            {
              x: '-50%',
              duration: 20,
              repeat: -1,
              ease: 'none',
            }
          );
        }
      } else {
        iconBadges.forEach((badge) => {
          gsap.to(badge, {
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
        if (railTrack) {
          gsap.to(railTrack, { x: '0%', duration: 0.5, ease: 'power2.out' });
        }
      }
    },
    { scope: stageRef, dependencies: [isActive] }
  );

  const handleSelectWord = (index: number) => {
    setActiveIndex(index);
  };

  // 轨道按钮 hover：y-2，按下 scale0.95
  const handleRailEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { y: -2, duration: 0.2, ease: 'power2.out' });
  };
  const handleRailLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { y: 0, duration: 0.2, ease: 'power2.out' });
  };
  const handleRailDown = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 0.95, duration: 0.15, ease: 'power2.out' });
  };
  const handleRailUp = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.stage} ref={stageRef}>
          <div className={styles.iconLayer} aria-hidden="true">
            {iconItems.map(({ key, Icon, label, className }) => (
              <div
                key={key}
                className={`${styles.iconBadge} ${className}`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className={styles.wordViewport}>
            <div className={styles.word} ref={wordRef} key={displayWord}>
              {displayWord !== '' &&
                Array.from(displayWord).map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className={styles.wordChar}
                  >
                    {char}
                  </span>
                ))}
            </div>
          </div>

          <div className={styles.railMask}>
            <div className={styles.railTrack}>
              {railWords.map((word, index) => {
                const originalIndex = index % words.length;
                const isSelected = originalIndex === activeIndex;

                return (
                  <button
                    key={`${word}-${index}`}
                    type="button"
                    className={`${styles.railItem} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleSelectWord(originalIndex)}
                    onMouseEnter={(e) => handleRailEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleRailLeave(e.currentTarget)}
                    onMouseDown={(e) => handleRailDown(e.currentTarget)}
                    onMouseUp={(e) => handleRailUp(e.currentTarget)}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TextAnimation;
