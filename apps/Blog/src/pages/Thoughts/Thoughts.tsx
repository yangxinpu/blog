import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import styles from './Thoughts.module.scss';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  const innerRef = useRef<HTMLDivElement | null>(null);

  // 头部 + 卡片滚动进入动画
  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner) return;

      const header = inner.querySelector<HTMLElement>(`.${styles.header}`);
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }

      const cards = inner.querySelectorAll<HTMLElement>(`.${styles.card}`);
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: index * 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });
    },
    { scope: innerRef, dependencies: [articles] }
  );

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

      <div className={styles.inner} ref={innerRef}>
        <header className={styles.header}>
          <h2>{t('thoughtsPage.title')}</h2>
          <p>{t('thoughtsPage.subtitle')}</p>
        </header>

        <div className={styles.grid}>
          {articles.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`${styles.card} ${item.featured ? styles.featured : ''}`}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Thoughts;
