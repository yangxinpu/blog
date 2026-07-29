import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Mail } from 'lucide-react';
import styles from './Footer.module.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLHeadingElement | null>(null);

  const wordmarkText = t('footer.wordmark');
  const wordmarkChars = wordmarkText.split('');

  // 滚动联动：wordmark 位移/透明度 + 填充宽度
  useGSAP(
    () => {
      const stage = stageRef.current;
      const fill = fillRef.current;
      const trigger = wordmarkRef.current;
      if (!stage || !fill || !trigger) return;

      const st = ScrollTrigger.create({
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // wordmarkY: [0,1] -> [34,-20]
          const y = gsap.utils.mapRange(0, 1, 34, -20, p);
          // wordmarkOpacity: [0.06,0.24,0.94] -> [0,1,0.94]
          let opacity: number;
          if (p <= 0.06) {
            opacity = 0;
          } else if (p <= 0.24) {
            opacity = gsap.utils.mapRange(0.06, 0.24, 0, 1, p);
          } else if (p <= 0.94) {
            opacity = gsap.utils.mapRange(0.24, 0.94, 1, 0.94, p);
          } else {
            opacity = 0.94;
          }
          gsap.set(stage, { y, opacity });

          // wordmarkFillWidth: [0,0.22,1] -> ['0%','100%','100%']
          const widthPct = p <= 0.22 ? gsap.utils.mapRange(0, 0.22, 0, 100, p) : 100;
          gsap.set(fill, { width: `${widthPct}%` });
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: wordmarkRef, dependencies: [wordmarkText] }
  );

  // 社交链接 hover：scale1.1 + rotate5
  const handleSocialEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      scale: 1.1,
      rotation: 5,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  };
  const handleSocialLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out' });
  };

  // 技术标签 hover：y-5 + scale1.04，按下 scale0.95
  const handleTagEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      y: -5,
      scale: 1.04,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  };
  const handleTagLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
  };
  const handleTagDown = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 0.95, duration: 0.15, ease: 'power2.out' });
  };
  const handleTagUp = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1.04, duration: 0.2, ease: 'power2.out' });
  };

  // 技术标签图标 hover：rotate keyframes + scale1.1
  const handleTagIconEnter = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      keyframes: {
        rotation: [0, -8, 8, 0],
        scale: [1, 1.1, 1.1, 1.1],
      },
      duration: 0.45,
      ease: 'power1.inOut',
    });
  };
  const handleTagIconLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // wordmark 字符 hover：y-18 + rotate(±6) + scale1.12
  const handleCharEnter = (el: HTMLElement | null, index: number) => {
    if (!el) return;
    gsap.to(el, {
      y: -18,
      rotation: index % 2 === 0 ? -6 : 6,
      scale: 1.12,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });
  };
  const handleCharLeave = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <div className={styles.footerInfo}>
              <h3>{personMeta.capitalNickname}</h3>
              <p>{t('footer.description')}</p>

              <div className={styles.footerSocial}>
                <a
                  href={personMeta.githubLink}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={(e) => handleSocialEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleSocialLeave(e.currentTarget)}
                >
                  <Github size={20} />
                </a>

                <button
                  className={styles.socialLink}
                  onClick={onCopyEmail}
                  onMouseEnter={(e) => handleSocialEnter(e.currentTarget)}
                  onMouseLeave={(e) => handleSocialLeave(e.currentTarget)}
                >
                  <Mail size={20} />
                </button>
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
                  <a
                    key={`${item.name}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.techTag}
                    title={item.name}
                    onMouseEnter={(e) => handleTagEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleTagLeave(e.currentTarget)}
                    onMouseDown={(e) => handleTagDown(e.currentTarget)}
                    onMouseUp={(e) => handleTagUp(e.currentTarget)}
                  >
                    <img
                      src={item.icon}
                      alt={t('common.logoWithName', { name: item.name })}
                      loading="lazy"
                      className={styles.techTagIcon}
                      onMouseEnter={(e) => handleTagIconEnter(e.currentTarget)}
                      onMouseLeave={(e) => handleTagIconLeave(e.currentTarget)}
                    />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerWordmark} ref={wordmarkRef}>
        <div className={styles.footerWordmarkSticky}>
          <div
            className={styles.footerWordmarkStage}
            ref={stageRef}
          >
            <h2 className={styles.footerWordmarkGhost}>{wordmarkText}</h2>
            <h2
              className={styles.footerWordmarkFill}
              ref={fillRef}
            >
              {wordmarkChars.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  onMouseEnter={(e) =>
                    handleCharEnter(e.currentTarget, index)
                  }
                  onMouseLeave={(e) => handleCharLeave(e.currentTarget)}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
