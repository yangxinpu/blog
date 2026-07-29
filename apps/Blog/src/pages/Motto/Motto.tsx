import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import styles from './Motto.module.scss';
import CanvasWaves from './CanvasWaves';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

gsap.registerPlugin(useGSAP);

function Motto() {
  const { t } = useTranslation();
  const {
    ref: sectionRef,
    isActive,
    hasEnteredView,
  } = useSectionActivity<HTMLElement>({
    rootMargin: '30% 0px 30% 0px',
    threshold: 0.2,
  });
  const sparkleCount = 12;

  const quoteLinesRaw = t('mottoSection.quotes', {
    returnObjects: true,
  }) as unknown;

  const quoteLines =
    Array.isArray(quoteLinesRaw) && quoteLinesRaw.length > 0
      ? (quoteLinesRaw as string[])
      : [t('mottoSection.quote')];

  const stackRef = useRef<HTMLDivElement | null>(null);

  // 进入视口后逐行展开引语
  useGSAP(
    () => {
      const stack = stackRef.current;
      if (!stack) return;

      const lineWraps = stack.querySelectorAll<HTMLElement>(
        `.${styles.quoteLineWrapper}`
      );

      if (hasEnteredView) {
        gsap.to(stack, {
          opacity: 1,
          duration: 0.3,
          ease: 'none',
        });
        gsap.fromTo(
          lineWraps,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            stagger: 0.15,
            delay: 0.1,
          }
        );
      } else {
        gsap.to(stack, {
          opacity: 0,
          duration: 0.3,
          ease: 'none',
        });
        gsap.to(lineWraps, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.3,
          ease: 'none',
        });
      }
    },
    { scope: stackRef, dependencies: [hasEnteredView] }
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.container} ${hasEnteredView ? styles.visible : ''} ${isActive ? styles.active : ''}`}
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

        <CanvasWaves
          isVisible={hasEnteredView}
          isActive={isActive}
          options={{
            speed: 1.2,
            density: 5,
            lineWidthMultiplier: 1.5,
          }}
        />
      </div>

      <div className={styles.quoteStack} ref={stackRef}>
        {quoteLines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            className={styles.quoteLineWrapper}
          >
            <p
              className={`${styles.quoteLine} ${index === 0 ? styles.primaryLine : ''}`}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Motto;
