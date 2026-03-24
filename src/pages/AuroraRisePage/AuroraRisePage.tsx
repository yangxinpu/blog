import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import MagicRingsBackground from '../../components/MagicRingsBackground/MagicRingsBackground';
import styles from './AuroraRisePage.module.scss';

function AuroraRisePage() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';

  return (
    <section className={styles.section}>
      <MagicRingsBackground />

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
