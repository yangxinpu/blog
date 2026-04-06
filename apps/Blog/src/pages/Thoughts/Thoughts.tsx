import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Thoughts.module.scss';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

type ThoughtArticle = {
  date: string;
  tags: string[];
  title: string;
  description: string;
  featured?: boolean;
};

function Thoughts() {
  const { t } = useTranslation();
  const { ref: sectionRef, isActive } = useSectionActivity<HTMLElement>({
    rootMargin: '25% 0px 25% 0px',
    threshold: 0.15,
  });
  const fireflyCount = 10;

  const articles = t('thoughtsPage.articles', {
    returnObjects: true,
  }) as unknown as ThoughtArticle[];

  return (
    <section
      id="thoughts"
      ref={sectionRef}
      className={`${styles.section} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.fireflies} aria-hidden="true">
        {Array.from({ length: fireflyCount }).map((_, index) => (
          <span key={index} className={styles.firefly} />
        ))}
      </div>

      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2>{t('thoughtsPage.title')}</h2>
          <p>{t('thoughtsPage.subtitle')}</p>
        </motion.header>

        <div className={styles.grid}>
          {articles.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              className={`${styles.card} ${item.featured ? styles.featured : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
            >
              <div className={styles.meta}>
                <time>{item.date}</time>
                <span className={styles.dot}>&middot;</span>
                <span className={styles.tags}>
                  {item.tags.map((tag) => `# ${tag}`).join('   ')}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={styles.cardAction}>
                {t('thoughtsPage.action')}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Thoughts;
