import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Github, Mail, Moon, Sun } from 'lucide-react';
import Home from './pages/Home/Home';
import { Message, Dropdown } from './components';
import Loading from '@blog/ui';
import styles from './App.module.scss';
import logoImage from './assets/Images/logo.png';

const Motto = lazy(() => import('./pages/Motto/Motto'));
const Thoughts = lazy(() => import('./pages/Thoughts/Thoughts'));
const TextAnimation = lazy(() => import('./pages/TextAnimation/TextAnimation'));
const AuroraRisePage = lazy(() => import('./pages/AuroraRisePage/AuroraRisePage'));
const NeonSprintPage = lazy(() => import('./pages/NeonSprintPage/NeonSprintPage'));

const personMeta = {
  nickname: 'NaiLuo',
  capitalNickname: 'NAILUO',
  githubLink: 'https://github.com/yangxinpu',
  email: '1813481502@qq.com',
};

const footerData = {
  techStack: [
    {
      name: 'React',
      link: 'https://react.dev/',
      icon: 'https://cdn.simpleicons.org/react/61DAFB',
    },
    {
      name: 'TypeScript',
      link: 'https://www.typescriptlang.org/',
      icon: 'https://cdn.simpleicons.org/typescript/3178C6',
    },
    {
      name: 'Next.js',
      link: 'https://nextjs.org/',
      icon: 'https://cdn.simpleicons.org/nextdotjs/00D5C4',
    },
    {
      name: 'Tailwind CSS',
      link: 'https://tailwindcss.com/',
      icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    },
    {
      name: 'JavaScript',
      link: 'https://developer.mozilla.org/docs/Web/JavaScript',
      icon: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    },
    {
      name: 'Vue',
      link: 'https://vuejs.org/',
      icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    },
    {
      name: 'Vite',
      link: 'https://vite.dev/',
      icon: 'https://cdn.simpleicons.org/vite/646CFF',
    },
    {
      name: 'Webpack',
      link: 'https://webpack.js.org/',
      icon: 'https://cdn.simpleicons.org/webpack/8DD6F9',
    },
    {
      name: 'Sass',
      link: 'https://sass-lang.com/',
      icon: 'https://cdn.simpleicons.org/sass/CC6699',
    },
    {
      name: 'Node.js',
      link: 'https://nodejs.org/',
      icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E',
    },
    {
      name: 'Bun',
      link: 'https://bun.sh/',
      icon: 'https://bun.sh/logo.svg',
    },
  ],
};

interface LazyWrapperProps {
  children: React.ReactNode;
  onLoaded: () => void;
}

function LazyWrapper({ children, onLoaded }: LazyWrapperProps) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return <>{children}</>;
}

function App() {
  const { t, i18n } = useTranslation();
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const totalLazyComponents = 5;
  const isLoading = loadedCount < totalLazyComponents;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const [message, setMessage] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    text: '',
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleComponentLoaded = useCallback(() => {
    setLoadedCount((prev) => prev + 1);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wordmarkRef,
    offset: ['start end', 'end start'],
  });
  const wordmarkFillWidth = useTransform(
    scrollYProgress,
    [0, 0.22, 1],
    ['0%', '100%', '100%']
  );
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [34, -20]);
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.24, 0.94],
    [0, 1, 0.94]
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyEmail = useCallback(() => {
    navigator.clipboard
      .writeText(personMeta.email)
      .then(() => {
        setMessage({
          visible: true,
          type: 'success',
          text: t('footer.emailCopied'),
        });
        setTimeout(() => {
          setMessage((prev) => ({ ...prev, visible: false }));
        }, 3000);
      })
      .catch(() => {
        setMessage({
          visible: true,
          type: 'error',
          text: t('footer.emailCopyFailed'),
        });
        setTimeout(() => {
          setMessage((prev) => ({ ...prev, visible: false }));
        }, 3000);
      });
  }, [t]);

  const wordmarkText = t('footer.wordmark');
  const wordmarkChars = wordmarkText.split('');
  const langToggleText =
    i18n.language === 'zh-CN'
      ? t('common.lang.enShort')
      : t('common.lang.zhShort');

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loading logo={logoImage} text="NAILUO" />}
      </AnimatePresence>

      <div className={styles.app}>
        {message.visible && (
          <Message
            type={message.type}
            message={message.text}
            duration={3000}
            onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}
          />
        )}

        <header className={styles.header}>
          <div className={styles.logo}>
            <a href="/" className={styles.logoLink}>
              <img
                src={logoImage}
                alt={t('common.logoAlt')}
                className={styles.logoImg}
              />
              <span className={styles.logoText}>
                {personMeta.capitalNickname}
              </span>
            </a>
          </div>

          <div className={styles.rightSection}>
            <nav className={styles.mainNav}>
              <div className={styles.navMenu}>
                <button
                  type="button"
                  className={styles.navMenuLink}
                  onClick={() => scrollToSection('home')}
                >
                  {t('home')}
                </button>
                <button
                  type="button"
                  className={styles.navMenuLink}
                  onClick={() => scrollToSection('thoughts')}
                >
                  {t('thoughts')}
                </button>
                <button
                  type="button"
                  className={styles.navMenuLink}
                  onClick={() => scrollToSection('contact')}
                >
                  {t('contact')}
                </button>

                <Dropdown
                  options={[
                    {
                      value: 'react',
                      label: t('react'),
                      path: `${import.meta.env.VITE_KB_BASE_URL}/zh/React/React基础.html`,
                    },
                    {
                      value: 'vue',
                      label: t('vue'),
                      path: `${import.meta.env.VITE_KB_BASE_URL}/zh/Vue/Vue基础.html`,
                    },
                    {
                      value: 'javascript',
                      label: t('javascript'),
                      path: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
                    },
                    {
                      value: 'frontendEngineering',
                      label: t('frontendEngineering'),
                      path: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
                    },
                    {
                      value: 'nodejs',
                      label: t('nodejs'),
                      path: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
                    },
                  ]}
                  label={t('knowledgeBase')}
                  mainPath={`${import.meta.env.VITE_KB_BASE_URL}/zh/`}
                />
              </div>
            </nav>

            <div className={styles.controls}>
              <button
                className={styles.langToggle}
                onClick={() =>
                  changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')
                }
              >
                {langToggleText}
              </button>

              <button className={styles.themeSwitch} onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <Home />
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <Motto />
            </LazyWrapper>
          </Suspense>
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <Thoughts />
            </LazyWrapper>
          </Suspense>
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <TextAnimation />
            </LazyWrapper>
          </Suspense>
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <AuroraRisePage />
            </LazyWrapper>
          </Suspense>
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <NeonSprintPage />
            </LazyWrapper>
          </Suspense>
        </main>

        <footer id="contact" className={styles.footer}>
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
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Github size={20} />
                    </motion.a>

                    <motion.button
                      className={styles.socialLink}
                      onClick={copyEmail}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Mail size={20} />
                    </motion.button>
                  </div>

                  <div className={styles.footerCopyright}>
                    (c) {new Date().getFullYear()} {personMeta.capitalNickname}.{' '}
                    {t('footer.allRightsReserved')}
                  </div>
                </div>

                <div className={styles.footerTechStack}>
                  <h4>{t('footer.techStack')}</h4>

                  <div className={styles.techStackTags}>
                    {footerData.techStack.map((item, index) => (
                      <motion.a
                        key={`${item.name}-${index}`}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.techTag}
                        whileHover={{ y: -5, scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 18,
                        }}
                        title={item.name}
                      >
                        <motion.img
                          src={item.icon}
                          alt={t('common.logoWithName', { name: item.name })}
                          loading="lazy"
                          className={styles.techTagIcon}
                          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                          transition={{ duration: 0.45, ease: 'easeInOut' }}
                        />
                        <span>{item.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerWordmark} ref={wordmarkRef}>
            <div className={styles.footerWordmarkSticky}>
              <motion.div
                className={styles.footerWordmarkStage}
                style={{ y: wordmarkY, opacity: wordmarkOpacity }}
              >
                <h2 className={styles.footerWordmarkGhost}>{wordmarkText}</h2>
                <motion.h2
                  className={styles.footerWordmarkFill}
                  style={{ width: wordmarkFillWidth }}
                >
                  {wordmarkChars.map((char, index) => (
                    <motion.span
                      key={`${char}-${index}`}
                      whileHover={{
                        y: -18,
                        rotate: index % 2 === 0 ? -6 : 6,
                        scale: 1.12,
                      }}
                      transition={{ type: 'spring', stiffness: 340, damping: 15 }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.h2>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
