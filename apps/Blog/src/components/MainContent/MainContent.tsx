import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../index';
import styles from './MainContent.module.scss';

const personMeta = {
  email: '1813481502@qq.com',
};

const Header = lazy(() => import('../Header/Header'));
const Footer = lazy(() => import('../Footer/Footer'));
const Home = lazy(() => import('../../pages/Home/Home'));
const Motto = lazy(() => import('../../pages/Motto/Motto'));
const Thoughts = lazy(() => import('../../pages/Thoughts/Thoughts'));
const TextAnimation = lazy(() => import('../../pages/TextAnimation/TextAnimation'));
const AuroraRisePage = lazy(() => import('../../pages/AuroraRisePage/AuroraRisePage'));
const NeonSprintPage = lazy(() => import('../../pages/NeonSprintPage/NeonSprintPage'));

interface MainContentProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function MainContent({ theme, toggleTheme }: MainContentProps) {
  const { t, i18n } = useTranslation();

  const [showHeaderFooter, setShowHeaderFooter] = useState(false);

  const [message, setMessage] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    text: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeaderFooter(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className={styles.app}>
      {message.visible && (
        <Message
          type={message.type}
          message={message.text}
          duration={3000}
          onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}
        />
      )}

      {showHeaderFooter && (
        <Suspense fallback={null}>
          <Header
            theme={theme}
            toggleTheme={toggleTheme}
            changeLanguage={changeLanguage}
            scrollToSection={scrollToSection}
          />
        </Suspense>
      )}

      <main className={styles.main}>
        <Suspense fallback={null}>
          <Home />
        </Suspense>
        <Suspense fallback={null}>
          <Motto />
        </Suspense>
        <Suspense fallback={null}>
          <Thoughts />
        </Suspense>
        <Suspense fallback={null}>
          <TextAnimation />
        </Suspense>
        <Suspense fallback={null}>
          <AuroraRisePage />
        </Suspense>
        <Suspense fallback={null}>
          <NeonSprintPage />
        </Suspense>
      </main>

      {showHeaderFooter && (
        <Suspense fallback={null}>
          <Footer onCopyEmail={copyEmail} />
        </Suspense>
      )}
    </div>
  );
}

export default MainContent;
