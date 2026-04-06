import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Motto.module.scss';
import CanvasWaves from './CanvasWaves';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

function Motto() {
  const { t } = useTranslation();
  const { ref: sectionRef, isActive, hasEnteredView } =
    useSectionActivity<HTMLElement>({
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

      <motion.div
        className={styles.quoteStack}
        initial={{ opacity: 0 }}
        animate={hasEnteredView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {quoteLines.map((line, index) => (
          <motion.div
            key={`${line}-${index}`}
            className={styles.quoteLineWrapper}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={
              hasEnteredView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 30, scale: 0.95 }
            }
            transition={{
              duration: 0.8,
              delay: 0.1 + index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <p className={`${styles.quoteLine} ${index === 0 ? styles.primaryLine : ''}`}>
              {line}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Motto;
