import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Github, Mail, Moon, Sun } from 'lucide-react';
import Home from './pages/Home/Home';
import { personMeta, footerData } from './content/meta';
import { Message, Dropdown } from './components';
import styles from './App.module.scss';
import logoImage from './assets/Images/logo.png';

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light');
  });
  const [message, setMessage] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; text: string }>({
    visible: false,
    type: 'success',
    text: ''
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



  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(personMeta.email)
      .then(() => {
        setMessage({
          visible: true,
          type: 'success',
          text: t('footer.emailCopied')
        });
        setTimeout(() => {
          setMessage(prev => ({ ...prev, visible: false }));
        }, 3000);
      })
      .catch(() => {
        setMessage({
          visible: true,
          type: 'error',
          text: t('footer.emailCopyFailed')
        });
        setTimeout(() => {
          setMessage(prev => ({ ...prev, visible: false }));
        }, 3000);
      });
  }, [t]);

  return (
    <div className={styles.app}>
      {message.visible && (
        <Message
          type={message.type}
          message={message.text}
          duration={3000}
          onClose={() => setMessage(prev => ({ ...prev, visible: false }))}
        />
      )}
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/">
            <img 
              src={logoImage} 
              alt="Logo" 
              className={styles.logoImg}
            />
          </a>
        </div>
        <div className={styles.rightSection}>
          <nav className={styles.mainNav}>
            <div className={styles.navMenu}>
              <a href="/" className={styles.navMenuLink}>{t('home')}</a>
              <Dropdown
                  options={[
                    { value: 'javascript', label: t('javascript'), path: '/javascript' },
                    { value: 'vue', label: t('vue'), path: '/vue' },
                    { value: 'react', label: t('react'), path: '/react' }
                  ]}
                  label={t('knowledgeBase')}
              />
              <a href="/contact" className={styles.navMenuLink}>{t('contact')}</a>
            </div>
          </nav>
          <div className={styles.controls}>
            <button 
              className={styles.langToggle}
              onClick={() => changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')}
              aria-label="Change language"
            >
              {i18n.language === 'zh-CN' ? 'EN' : '中文'}
            </button>
            <button 
              className={styles.themeSwitch}
              onClick={toggleTheme}
              aria-label={t(`theme.${theme === 'light' ? 'dark' : 'light'}`)}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
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
        <div className={styles.footerContent}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerInfo}>
                <h3 className={styles.footerTitle}>{personMeta.capitalNickname}</h3>
                <p className={styles.footerDescription}>{t('footer.description')}</p>
                <div className={styles.footerSocial}>
                  <motion.a 
                    href={personMeta.githubLink} 
                    className={styles.socialLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                  </motion.a>
                  <motion.a 
                    className={styles.socialLink}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onDoubleClick={copyEmail}
                    title={t('footer.doubleClickToCopy')}
                  >
                    <Mail size={20} />
                  </motion.a>
                </div>
                <div className={styles.footerBottom}>
                  <p className={styles.copyright}>
                    © {new Date().getFullYear()} {personMeta.capitalNickname}. {t('footer.allRightsReserved')}
                  </p>
                </div>
              </div>
              <div className={styles.footerTechStack}>
                <h4 className={styles.footerSectionTitle}>{t('footer.techStack')}</h4>
                <ul className={styles.techStackList}>
                  {footerData.techStack.map((item, index) => (
                    <li key={index}>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;