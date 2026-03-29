import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { Dropdown } from '../index';
import styles from './Header.module.scss';
import logoImage from '../../assets/Images/logo.png';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  changeLanguage: (lang: string) => void;
  scrollToSection: (id: string) => void;
}

const personMeta = {
  capitalNickname: 'NAILUO',
};

function Header({
  theme,
  toggleTheme,
  changeLanguage,
  scrollToSection,
}: HeaderProps) {
  const { t, i18n } = useTranslation();

  const langToggleText =
    i18n.language === 'zh-CN'
      ? t('common.lang.enShort')
      : t('common.lang.zhShort');

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/" className={styles.logoLink}>
          <img
            src={logoImage}
            alt={t('common.logoAlt')}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>{personMeta.capitalNickname}</span>
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
  );
}

export default Header;
