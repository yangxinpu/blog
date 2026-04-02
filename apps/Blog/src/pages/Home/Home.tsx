import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Home.module.scss';
import avatarImage from '../../assets/Images/cat.webp';
import { FloatingLines } from '../../components/index';

type TechKey =
  | 'react'
  | 'vue'
  | 'javascript'
  | 'frontendEngineering'
  | 'nodejs';

type LogoSource =
  | string
  | {
      light: string;
      dark: string;
    };

type MultiLogoItem = {
  logo: LogoSource[];
  link: string;
  kbLink?: string;
};

type TechCardI18n = {
  name: string;
  focus: string;
  description: string;
  highlights: string[];
};

const techCardOrder: TechKey[] = [
  'react',
  'vue',
  'javascript',
  'frontendEngineering',
  'nodejs',
];

const techAssets: Record<
  TechKey,
  { logo: LogoSource; link: string; kbLink?: string } | MultiLogoItem
> = {
  react: {
    logo: 'https://cdn.simpleicons.org/react/61DAFB',
    link: 'https://react.dev/',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/React/React基础.html`,
  },
  vue: {
    logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    link: 'https://vuejs.org/',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/Vue/Vue基础.html`,
  },
  javascript: {
    logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    link: 'https://developer.mozilla.org/docs/Web/JavaScript',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
  },
  frontendEngineering: {
    logo: [
      'https://cdn.simpleicons.org/vite/646CFF',
      'https://cdn.simpleicons.org/webpack/8DD6F9',
    ],
    link: 'https://vite.dev/',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
  },
  nodejs: {
    logo: 'https://cdn.simpleicons.org/nodedotjs/5FA04E',
    link: 'https://nodejs.org/',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/`,
  },
};

function isMultiLogoItem(
  asset: { logo: LogoSource; link: string } | MultiLogoItem
): asset is MultiLogoItem {
  return Array.isArray(asset.logo);
}

function resolveLogo(source: LogoSource, isDark: boolean): string {
  if (typeof source === 'string') return source;
  return isDark ? source.dark : source.light;
}

const BORDER_LIGHT_RADIUS = 300;

function Home() {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const [cardLightPositions, setCardLightPositions] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const cardsDataRef = useRef<Map<string, { rect: DOMRect; element: HTMLElement }>>(
    new Map()
  );

  const themeGradientColors = [
    '#d3fff3',
    '#97fce4',
    '#19fac6',
    '#13d6aa',
    '#0ea387',
  ];

  const updateCardLightPositions = useCallback(() => {
    if (!gridRef.current) return;

    const mouse = mouseRef.current;
    const newPositions: Record<string, { x: number; y: number; visible: boolean }> = {};

    cardsDataRef.current.forEach((data, id) => {
      const { rect, element } = data;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceToCenter = Math.sqrt(
        (mouse.x - centerX) ** 2 + (mouse.y - centerY) ** 2
      );

      const maxDistance = BORDER_LIGHT_RADIUS + Math.max(rect.width, rect.height) / 2;

      if (distanceToCenter <= maxDistance) {
        const closestX = Math.max(rect.left, Math.min(mouse.x, rect.right));
        const closestY = Math.max(rect.top, Math.min(mouse.y, rect.bottom));
        const distanceToEdge = Math.sqrt(
          (mouse.x - closestX) ** 2 + (mouse.y - closestY) ** 2
        );

        if (distanceToEdge <= BORDER_LIGHT_RADIUS) {
          const relativeX = mouse.x - rect.left;
          const relativeY = mouse.y - rect.top;

          element.style.setProperty('--mouse-x', `${relativeX}px`);
          element.style.setProperty('--mouse-y', `${relativeY}px`);
          element.style.setProperty('--light-radius', `${BORDER_LIGHT_RADIUS}px`);

          newPositions[id] = { x: relativeX, y: relativeY, visible: true };
          return;
        }
      }

      newPositions[id] = { x: 0, y: 0, visible: false };
    });

    setCardLightPositions(newPositions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCardLightPositions);
    };

    const updateCardsData = () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('[data-card-id]');
      cardsDataRef.current.clear();
      cards.forEach((card) => {
        const element = card as HTMLElement;
        const id = element.dataset.cardId;
        if (id) {
          cardsDataRef.current.set(id, {
            rect: element.getBoundingClientRect(),
            element,
          });
        }
      });
    };

    updateCardsData();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateCardsData);
    window.addEventListener('scroll', updateCardsData, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCardsData);
      window.removeEventListener('scroll', updateCardsData, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateCardLightPositions]);

  const getCardLightClass = useCallback(
    (id: string) => {
      const pos = cardLightPositions[id];
      return pos?.visible ? styles.cardLightActive : '';
    },
    [cardLightPositions]
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () =>
      setIsDark(root.getAttribute('data-theme') === 'dark');

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const profileTags = t('homePage.profile.tags', {
    returnObjects: true,
  }) as unknown as string[];

  const interests = t('homePage.interests.items', {
    returnObjects: true,
  }) as unknown as { icon: string; text: string }[];

  const techCards = techCardOrder.map((key) => {
    const item = t(`homePage.cards.${key}`, {
      returnObjects: true,
    }) as unknown as TechCardI18n;

    const asset = techAssets[key];

    if (isMultiLogoItem(asset)) {
      return {
        key,
        ...item,
        logos: asset.logo.map((src) => resolveLogo(src, isDark)),
        link: asset.link,
        kbLink: asset.kbLink,
      };
    }

    return {
      key,
      ...item,
      logo: resolveLogo(asset.logo, isDark),
      link: asset.link,
      kbLink: asset.kbLink,
    };
  });

  return (
    <div id="home" className={styles.home}>
      <div className={styles.floatingLinesBackground}>
        <FloatingLines
          linesGradient={themeGradientColors}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[4, 6, 3]}
          lineDistance={[4, 3, 5]}
          animationSpeed={0.6}
          mixBlendMode="screen"
          isDark={isDark}
        />
      </div>

      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>
          {t('homePage.hero.title')
            .split('')
            .map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{
                  opacity: 0,
                  y: 44,
                  scale: 0.7,
                  filter: 'blur(10px)',
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  type: 'spring',
                  stiffness: 120,
                }}
              >
                {char}
              </motion.span>
            ))}
        </h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {t('homePage.hero.subtitle')}
        </motion.p>

        <motion.p
          className={styles.desc}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          {t('homePage.hero.desc')}
        </motion.p>
      </motion.div>

      <section className={styles.content}>
        <div className={styles.gridLayout} ref={gridRef}>
          <motion.article
            data-card-id="profile"
            className={`${styles.featuredCard} ${getCardLightClass('profile')}`}
            initial={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <div className={styles.profileHeader}>
              <motion.img
                src={avatarImage}
                alt="Avatar"
                className={styles.avatar}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <div className={styles.profileInfo}>
                <p className={styles.nickname}>
                  <span className={styles.nicknameEn}>
                    {t('homePage.profile.nickname')}
                  </span>
                  <span className={styles.nicknameCn}>
                    {t('homePage.profile.nicknameCn')}
                  </span>
                </p>
                <p className={styles.roleText}>{t('homePage.profile.role')}</p>
              </div>
            </div>
            <p className={styles.featuredText}>
              {t('homePage.profile.description')}
            </p>

            <div className={styles.tagsGrid}>
              {profileTags.map((tag, index) => (
                <motion.span
                  key={`${tag}-${index}`}
                  className={styles.tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.01 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.article>

          <motion.article
            data-card-id="interests"
            className={`${styles.interestCard} ${getCardLightClass('interests')}`}
            initial={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>{t('homePage.interests.title')}</h3>
            <p className={styles.featuredText}>
              {t('homePage.interests.description')}
            </p>

            <ul className={styles.interestList}>
              {interests.map((item, index) => (
                <li key={`interest-${index}`}>
                  <span className={styles.interestIcon}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.article>

          {techCards.map((card, index) => (
            <motion.article
              key={card.key}
              data-card-id={card.key}
              className={`${styles.techCard} ${getCardLightClass(card.key)}`}
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: 0.28 + index * 0.05 }}
            >
              <div className={styles.techHead}>
                <span className={styles.logoBox}>
                  {'logos' in card ? (
                    card.logos.map((logo, i) => (
                      <img
                        key={`${logo}-${i}`}
                        src={logo}
                        alt={t('common.logoWithName', { name: card.name })}
                        loading="lazy"
                      />
                    ))
                  ) : (
                    <img
                      src={card.logo}
                      alt={t('common.logoWithName', { name: card.name })}
                      loading="lazy"
                    />
                  )}
                </span>

                <div className={styles.techNameWrap}>
                  <h4>{card.name}</h4>
                  <span>{card.focus}</span>
                </div>
              </div>

              <p className={styles.techDescription}>{card.description}</p>

              <ul className={styles.highlightList}>
                {card.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className={styles.cardActions}>
                {card.kbLink && (
                  <a
                    href={card.kbLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.cardAction}
                  >
                    {t('homePage.openKb')}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
