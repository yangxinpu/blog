import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { Github, Mail } from 'lucide-react';
import styles from './Footer.module.scss';

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

interface FooterProps {
  onCopyEmail: () => void;
}

function Footer({ onCopyEmail }: FooterProps) {
  const { t } = useTranslation();
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

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

  const wordmarkText = t('footer.wordmark');
  const wordmarkChars = wordmarkText.split('');

  return (
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
                  onClick={onCopyEmail}
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
  );
}

export default Footer;
