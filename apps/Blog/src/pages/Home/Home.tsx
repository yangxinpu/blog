import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './Home.module.scss';
import avatarImage from '../../assets/Images/cat.webp';

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
  { logo: LogoSource; link: string } | MultiLogoItem
> = {
  react: {
    logo: 'https://cdn.simpleicons.org/react/61DAFB',
    link: 'https://react.dev/',
  },
  vue: {
    logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    link: 'https://vuejs.org/',
  },
  javascript: {
    logo: 'https://cdn.simpleicons.org/javascript/F7DF1E',
    link: 'https://developer.mozilla.org/docs/Web/JavaScript',
  },
  frontendEngineering: {
    logo: [
      'https://cdn.simpleicons.org/vite/646CFF',
      'https://cdn.simpleicons.org/webpack/8DD6F9',
    ],
    link: 'https://vite.dev/',
  },
  nodejs: {
    logo: 'https://cdn.simpleicons.org/nodedotjs/5FA04E',
    link: 'https://nodejs.org/',
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

function Home() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId = 0;

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#00d5c4';
    const mouse = { x: width / 2, y: height / 2 };

    canvas.width = width;
    canvas.height = height;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 300;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          particle.x -= dx * 0.006;
          particle.y -= dy * 0.006;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = isDark ? 0.45 : 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = Math.max(0, 0.45 - distance / 220);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

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
      };
    }

    return {
      key,
      ...item,
      logo: resolveLogo(asset.logo, isDark),
      link: asset.link,
    };
  });

  return (
    <div id="home" className={styles.home}>
      <canvas ref={canvasRef} className={styles.canvas} />

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
        <div className={styles.gridLayout}>
          <motion.article
            className={styles.featuredCard}
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
            className={styles.interestCard}
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
            <motion.a
              key={card.key}
              href={card.link}
              target="_blank"
              rel="noreferrer"
              className={styles.techCard}
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

              <span className={styles.cardAction}>{t('homePage.openDoc')}</span>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
