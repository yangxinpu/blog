import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import Home from './pages/Home/Home';
import { meta } from './content/meta';
import styles from './App.module.scss';

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.app}>
      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.logo}>
              <a href="/">My Blog</a>
            </div>
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <a href="/" className={styles.navLink}>{t('welcome')}</a>
                </li>
                <li className={styles.navItem}>
                  <a href="/about" className={styles.navLink}>{t('about')}</a>
                </li>
                <li className={styles.navItem}>
                  <a href="/posts" className={styles.navLink}>{t('posts')}</a>
                </li>
                <li className={styles.navItem}>
                  <a href="/contact" className={styles.navLink}>{t('contact')}</a>
                </li>
              </ul>
            </nav>
            <div className={styles.headerActions}>
              <button 
                className={styles.languageToggle}
                onClick={() => changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')}
                aria-label="Change language"
              >
                {i18n.language === 'zh-CN' ? 'EN' : '中文'}
              </button>
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={t(`theme.${theme === 'light' ? 'dark' : 'light'}`)}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.main}>
          <Home />
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.container}>
              <motion.div 
                className={styles.metaInfo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.a 
                  href={meta.githubLink} 
                  className={styles.metaItem} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.metaLabel}>GitHub</span>
                </motion.a>
                <motion.a 
                  href={meta.giteeLink} 
                  className={styles.metaItem} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.metaLabel}>Gitee</span>
                </motion.a>
                <motion.a 
                  href={meta.juejinLink} 
                  className={styles.metaItem} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.metaLabel}>掘金</span>
                </motion.a>
                <motion.a 
                  href={`mailto:${meta.email}`} 
                  className={styles.metaItem}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.metaLabel}>邮箱</span>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Logo Section */}
      <motion.div 
        className={styles.footerLogo}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div 
          className={styles.logoContainer}
          initial={{ opacity: 0, y: 50, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.h2 
            className={styles.logoText}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "back.out(1.7)" }}
            whileHover={{ scale: 1}}
          >
            {meta.capitalNickname}
          </motion.h2>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;