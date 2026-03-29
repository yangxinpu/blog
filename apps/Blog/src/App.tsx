import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';
import { Message } from './components';
import Loading from '@blog/ui';
import styles from './App.module.scss';
import logoImage from './assets/Images/logo.png';

const Header = lazy(() => import('./components/Header/Header'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const Home = lazy(() => import('./pages/Home/Home'));
const Motto = lazy(() => import('./pages/Motto/Motto'));
const Thoughts = lazy(() => import('./pages/Thoughts/Thoughts'));
const TextAnimation = lazy(() => import('./pages/TextAnimation/TextAnimation'));
const AuroraRisePage = lazy(() => import('./pages/AuroraRisePage/AuroraRisePage'));
const NeonSprintPage = lazy(() => import('./pages/NeonSprintPage/NeonSprintPage'));

const personMeta = {
  email: '1813481502@qq.com',
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

  const [loadedCount, setLoadedCount] = useState(0);
  const totalLazyComponents = 8;
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

        <Suspense fallback={null}>
          <LazyWrapper onLoaded={handleComponentLoaded}>
            <Header
              theme={theme}
              toggleTheme={toggleTheme}
              changeLanguage={changeLanguage}
              scrollToSection={scrollToSection}
            />
          </LazyWrapper>
        </Suspense>

        <main className={styles.main}>
          <Suspense fallback={null}>
            <LazyWrapper onLoaded={handleComponentLoaded}>
              <Home />
            </LazyWrapper>
          </Suspense>
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

        <Suspense fallback={null}>
          <LazyWrapper onLoaded={handleComponentLoaded}>
            <Footer onCopyEmail={copyEmail} />
          </LazyWrapper>
        </Suspense>
      </div>
    </>
  );
}

export default App;
