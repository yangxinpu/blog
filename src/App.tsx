import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Github, Mail, Moon, Sun } from 'lucide-react';
import Home from './pages/Home/Home';
import Motto from './pages/Motto/Motto';
import { personMeta, footerData } from './content/meta';
import { Message, Dropdown } from './components';
import styles from './App.module.scss';
import logoImage from './assets/Images/logo.png';

function App() {
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const [message, setMessage] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    text: ''
  });

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHoveringTech, setIsHoveringTech] = useState(false);

  const [tagPositions, setTagPositions] = useState<
    { x: number; y: number }[]
  >([]);

  const techStackRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const updatePositions = () => {
      const positions = tagRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };

        const rect = el.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      });

      setTagPositions(positions);
    };

    updatePositions();

    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({
      x: e.clientX,
      y: e.clientY
    });
  };

  const getMagneticStyle = (index: number) => {
    if (!isHoveringTech) return { x: 0, y: 0, rotate: 0 };

    const pos = tagPositions[index];
    if (!pos) return { x: 0, y: 0, rotate: 0 };

    const dx = mouse.x - pos.x;
    const dy = mouse.y - pos.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDist = 180;
    const strength = Math.max(0, 1 - distance / maxDist);

    const depth = 0.35 + index * 0.04;

    // 微浮动
    const floatX = Math.sin(index * 1.5) * 2;
    const floatY = Math.cos(index * 1.2) * 2;

    return {
      x: dx * strength * depth + floatX,
      y: dy * strength * depth + floatY,
      rotate: dx * 0.015 * strength
    };
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
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
          <a href="/" className={styles.logoLink}>
            <img src={logoImage} alt="Logo" className={styles.logoImg} />
            <span className={styles.logoText}>
              {personMeta.capitalNickname}
            </span>
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
              onClick={() =>
                changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')
              }
            >
              {i18n.language === 'zh-CN' ? 'EN' : '中文'}
            </button>

            <button
              className={styles.themeSwitch}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <Home />
        <Motto />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div className={styles.footerInfo}>
                <h3>{personMeta.capitalNickname}</h3>
                <p>{t('footer.description')}</p>

                <div className={styles.footerSocial}>
                  <motion.a
                    href={personMeta.githubLink}
                    className={styles.socialLink}
                    target="_blank"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Github size={20} />
                  </motion.a>

                  <motion.a
                    className={styles.socialLink}
                    onClick={copyEmail}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Mail size={20} />
                  </motion.a>
                </div>

                <div className={styles.footerCopyright}>
                  © {new Date().getFullYear()} {personMeta.capitalNickname}. {t('footer.allRightsReserved')}
                </div>
              </div>

              <div
                className={styles.footerTechStack}
                ref={techStackRef}
                onMouseEnter={() => setIsHoveringTech(true)}
                onMouseLeave={() => setIsHoveringTech(false)}
                onMouseMove={handleMouseMove}
              >
                <h4>{t('footer.techStack')}</h4>

                <div className={styles.techStackTags}>
                  {footerData.techStack.map((item, index) => {
                    const motionStyle = getMagneticStyle(index);

                    return (
                      <motion.a
                        key={index}
                        ref={(el) => { tagRefs.current[index] = el; }}
                        href={item.link}
                        className={styles.techStackTag}
                        style={{
                          backgroundColor: item.color,
                          color: item.color === '#000000' ? '#fff' : '#000'
                        }}
                        whileHover={{
                          scale: 1.2,
                          rotate: 6,
                          zIndex: 20
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={motionStyle}
                        transition={{
                          type: 'spring',
                          stiffness: 130,
                          damping: 12,
                          mass: 0.7
                        }}
                      >
                        {item.name}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;