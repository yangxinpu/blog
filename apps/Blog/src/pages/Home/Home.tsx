import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import styles from './Home.module.scss';
import avatarImage from '../../assets/Images/cat.webp';
import { FloatingLines } from '../../components/index';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

gsap.registerPlugin(useGSAP);

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
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/React/React基础`,
  },
  vue: {
    logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    link: 'https://vuejs.org/',
    kbLink: `${import.meta.env.VITE_KB_BASE_URL}/zh/Vue/Vue基础`,
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
  const { ref: sectionRef, isActive: isHomeActive } =
    useSectionActivity<HTMLDivElement>({
      rootMargin: '35% 0px 25% 0px',
      threshold: 0.05,
    });
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const cardsDataRef = useRef<Array<{ rect: DOMRect; element: HTMLElement }>>(
    []
  );

  const themeGradientColors = [
    '#d3fff3',
    '#97fce4',
    '#19fac6',
    '#13d6aa',
    '#0ea387',
  ];

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !isHomeActive) {
      cardsDataRef.current.forEach(({ element }) => {
        element.classList.remove(styles.cardLightActive);
      });
      return;
    }

    const activeClassName = styles.cardLightActive;
    let isPointerInside = false;
    let resizeObserver: ResizeObserver | null = null;
    let viewportFrame = 0;

    const clearCardLight = () => {
      cardsDataRef.current.forEach(({ element }) => {
        element.classList.remove(activeClassName);
      });
    };

    const updateCardsData = () => {
      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>('[data-card-id]')
      );
      cardsDataRef.current = cards.map((element) => ({
        rect: element.getBoundingClientRect(),
        element,
      }));
    };

    const updateCardLightPositions = () => {
      rafRef.current = 0;

      if (!isPointerInside) {
        clearCardLight();
        return;
      }

      const mouse = mouseRef.current;

      cardsDataRef.current.forEach(({ rect, element }) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceToCenter = Math.hypot(
          mouse.x - centerX,
          mouse.y - centerY
        );
        const maxDistance =
          BORDER_LIGHT_RADIUS + Math.max(rect.width, rect.height) / 2;

        if (distanceToCenter > maxDistance) {
          element.classList.remove(activeClassName);
          return;
        }

        const closestX = Math.max(rect.left, Math.min(mouse.x, rect.right));
        const closestY = Math.max(rect.top, Math.min(mouse.y, rect.bottom));
        const distanceToEdge = Math.hypot(
          mouse.x - closestX,
          mouse.y - closestY
        );

        if (distanceToEdge > BORDER_LIGHT_RADIUS) {
          element.classList.remove(activeClassName);
          return;
        }

        element.style.setProperty('--mouse-x', `${mouse.x - rect.left}px`);
        element.style.setProperty('--mouse-y', `${mouse.y - rect.top}px`);
        element.style.setProperty('--light-radius', `${BORDER_LIGHT_RADIUS}px`);
        element.classList.add(activeClassName);
      });
    };

    const requestCardLightUpdate = () => {
      if (rafRef.current !== 0) return;
      rafRef.current = requestAnimationFrame(updateCardLightPositions);
    };

    const handlePointerMove = (event: PointerEvent) => {
      isPointerInside = true;
      mouseRef.current = { x: event.clientX, y: event.clientY };
      requestCardLightUpdate();
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
      clearCardLight();
    };

    const flushViewportChange = () => {
      viewportFrame = 0;
      updateCardsData();

      if (isPointerInside) {
        requestCardLightUpdate();
      } else {
        clearCardLight();
      }
    };

    const handleViewportChange = () => {
      if (viewportFrame !== 0) return;
      viewportFrame = requestAnimationFrame(flushViewportChange);
    };

    updateCardsData();
    resizeObserver = new ResizeObserver(handleViewportChange);
    resizeObserver.observe(grid);
    cardsDataRef.current.forEach(({ element }) =>
      resizeObserver?.observe(element)
    );

    grid.addEventListener('pointermove', handlePointerMove);
    grid.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      grid.removeEventListener('pointermove', handlePointerMove);
      grid.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
      resizeObserver?.disconnect();
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(viewportFrame);
      rafRef.current = 0;
      clearCardLight();
    };
  }, [isHomeActive]);

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

  // 首页入场动画（hero + 各卡片错峰）
  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const hero = root.querySelector<HTMLElement>(`.${styles.hero}`);
      if (hero) {
        gsap.fromTo(
          hero,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      }

      const titleChars = root.querySelectorAll<HTMLElement>(
        `.${styles.title} span`
      );
      if (titleChars.length > 0) {
        gsap.fromTo(
          titleChars,
          { opacity: 0, y: 44, scale: 0.7 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: 'back.out(2)',
          }
        );
      }

      const subtitle = root.querySelector<HTMLElement>(`.${styles.subtitle}`);
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.12,
            ease: 'power2.out',
          }
        );
      }

      const desc = root.querySelector<HTMLElement>(`.${styles.desc}`);
      if (desc) {
        gsap.fromTo(
          desc,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.24,
            ease: 'power2.out',
          }
        );
      }

      const featuredCard = root.querySelector<HTMLElement>(
        `.${styles.featuredCard}`
      );
      if (featuredCard) {
        gsap.fromTo(
          featuredCard,
          { opacity: 0, y: -28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.12,
            ease: 'power2.out',
          }
        );
      }

      const avatar = root.querySelector<HTMLElement>(`.${styles.avatar}`);
      if (avatar) {
        gsap.fromTo(
          avatar,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }

      const tags = root.querySelectorAll<HTMLElement>(`.${styles.tag}`);
      tags.forEach((tag: HTMLElement, index: number) => {
        gsap.fromTo(
          tag,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.5 + index * 0.06,
            ease: 'power2.out',
          }
        );
      });

      const interestCard = root.querySelector<HTMLElement>(
        `.${styles.interestCard}`
      );
      if (interestCard) {
        gsap.fromTo(
          interestCard,
          { opacity: 0, y: -28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }

      const techCardsEls = root.querySelectorAll<HTMLElement>(
        `.${styles.techCard}`
      );
      techCardsEls.forEach((card: HTMLElement, index: number) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.28 + index * 0.05,
            ease: 'power2.out',
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [techCards, profileTags, interests] }
  );

  // 标签 hover：scale1.05 + y-2
  const handleTagEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      scale: 1.05,
      y: -2,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  };
  const handleTagLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <div id="home" ref={sectionRef} className={styles.home}>
      <div className={styles.floatingLinesBackground}>
        <FloatingLines
          linesGradient={themeGradientColors}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[4, 6, 3]}
          lineDistance={[4, 3, 5]}
          animationSpeed={0.6}
          mixBlendMode="screen"
          isDark={isDark}
          isActive={isHomeActive}
        />
      </div>

      <div className={styles.hero}>
        <h1 className={styles.title}>
          {t('homePage.hero.title')
            .split('')
            .map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
        </h1>

        <p className={styles.subtitle}>{t('homePage.hero.subtitle')}</p>

        <p className={styles.desc}>{t('homePage.hero.desc')}</p>
      </div>

      <section className={styles.content}>
        <div className={styles.gridLayout} ref={gridRef}>
          <article
            data-card-id="profile"
            className={styles.featuredCard}
          >
            <div className={styles.profileHeader}>
              <img
                src={avatarImage}
                alt="Avatar"
                className={styles.avatar}
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
                <span
                  key={`${tag}-${index}`}
                  className={styles.tag}
                  onMouseEnter={(e) => handleTagEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleTagLeave(e.currentTarget)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <article
            data-card-id="interests"
            className={styles.interestCard}
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
          </article>

          {techCards.map((card, index) => (
            <article
              key={card.key}
              data-card-id={card.key}
              className={`${styles.techCard} ${styles[`techCard${index + 1}`]}`}
            >
              <div className={styles.cardBackdrop} aria-hidden="true">
                <span className={styles.cardBackdropGlow} />
                <span className={styles.cardBackdropGrid} />
              </div>

              <div className={styles.techHero}>
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
                    <span className={styles.cardActionArrow}>→</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
