import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import FlowingLinesBackground from '../../components/FlowingLinesBackground/FlowingLinesBackground';
import styles from './AuroraRisePage.module.scss';

function AuroraRisePage() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(root.getAttribute('data-theme') === 'dark');
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <FlowingLinesBackground
        primaryColor="#19fac6"
        secondaryColor="#13d6aa"
        accentColor="#0ea387"
        speed={0.08}
        glowIntensity={0.25}
        isDark={isDark}
      />

      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
        >
          {isZh
            ? '每天进步一点，未来就会发光。'
            : 'Small progress every day builds a glowing future.'}
        </motion.h2>
      </div>

      <motion.p
        className={styles.bottomNote}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
      >
        {isZh
          ? '微光会汇成星河，耐心会长成力量。'
          : 'Small lights become constellations, and patience turns into power.'}
      </motion.p>
    </section>
  );
}

export default AuroraRisePage;
