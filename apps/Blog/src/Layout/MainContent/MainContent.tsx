import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../components/index';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../../pages/Home/Home';
import Motto from '../../pages/Motto/Motto';
import Thoughts from '../../pages/Thoughts/Thoughts';
import TextAnimation from '../../pages/TextAnimation/TextAnimation';
import AuroraRisePage from '../../pages/AuroraRisePage/AuroraRisePage';
import NeonSprintPage from '../../pages/NeonSprintPage/NeonSprintPage';
import styles from './MainContent.module.scss';

const personMeta = {
  email: '1813481502@qq.com',
};

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
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          changeLanguage={changeLanguage}
          scrollToSection={scrollToSection}
        />
      )}

      <main className={styles.main}>
        <Home />
        <Motto />
        <Thoughts />
        <TextAnimation />
        <AuroraRisePage />
        <NeonSprintPage />
      </main>

      {showHeaderFooter && <Footer onCopyEmail={copyEmail} />}
    </div>
  );
}

export default MainContent;
