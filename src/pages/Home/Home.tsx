import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>{t('welcome')}</h1>
          <p className={styles.heroSubtitle}>
            A place to share my thoughts on technology, programming, and more.
          </p>
          <div className={styles.heroButtons}>
            <a href="/posts" className={styles.heroButton}>{t('posts')}</a>
            <a href="/about" className={styles.heroButtonSecondary}>{t('about')}</a>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Posts</h2>
          <div className={styles.postsGrid}>
            <div className={styles.postCard}>
              <h3 className={styles.postTitle}>
                <a href="/posts/1">Getting Started with React</a>
              </h3>
              <p className={styles.postExcerpt}>
                Learn the basics of React and how to build your first application.
              </p>
              <p className={styles.postDate}>March 20, 2026</p>
            </div>
            <div className={styles.postCard}>
              <h3 className={styles.postTitle}>
                <a href="/posts/2">Understanding TypeScript</a>
              </h3>
              <p className={styles.postExcerpt}>
                Explore the features of TypeScript and how it can improve your code.
              </p>
              <p className={styles.postDate}>March 15, 2026</p>
            </div>
            <div className={styles.postCard}>
              <h3 className={styles.postTitle}>
                <a href="/posts/3">CSS Grid Layout</a>
              </h3>
              <p className={styles.postExcerpt}>
                Master CSS Grid and create responsive layouts for your websites.
              </p>
              <p className={styles.postDate}>March 10, 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('about')}</h2>
          <p className={styles.aboutText}>
            This blog is a personal project where I share my knowledge and experiences
            in the world of technology. I cover topics such as web development,
            programming languages, and software engineering best practices.
          </p>
          <p className={styles.aboutText}>
            Whether you're a beginner or an experienced developer, I hope you find
            something useful here. Feel free to explore the posts and reach out if
            you have any questions or suggestions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;