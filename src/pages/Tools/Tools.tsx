import { motion } from 'motion/react';
import { ArrowUpRight, Code2, Palette, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Tools.module.scss';

type ToolItem = {
  name: string;
  description: string;
  url: string;
  tags?: string[];
};

type ToolGroup = {
  key: string;
  title: string;
  description: string;
  items: ToolItem[];
};

const groupIcons = {
  frontend: Code2,
  design: Palette,
  dev: Wrench
};

const lightOrbs = [
  {
    top: '-22%',
    left: '-16%',
    width: '42rem',
    height: '26rem',
    duration: 14,
    delay: 0
  },
  {
    top: '8%',
    left: '42%',
    width: '34rem',
    height: '22rem',
    duration: 12.5,
    delay: -1.5
  },
  {
    top: '42%',
    left: '64%',
    width: '30rem',
    height: '24rem',
    duration: 13.8,
    delay: -3
  }
];

function Tools() {
  const { t } = useTranslation();

  const groups = t('toolsPage.groups', {
    returnObjects: true
  }) as unknown as ToolGroup[];

  return (
    <section className={styles.section}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />

        {lightOrbs.map((orb, index) => (
          <motion.span
            key={`orb-${index}`}
            className={styles.orb}
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.width,
              height: orb.height
            }}
            animate={{
              x: [0, 26, -18, 0],
              y: [0, -22, 16, 0],
              scale: [1, 1.08, 0.94, 1]
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

        <div className={styles.sparkLayer}>
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={`spark-${index}`} className={styles.spark} />
          ))}
        </div>
      </div>

      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className={styles.eyebrow}>{t('toolsPage.eyebrow')}</span>
          <h2>{t('toolsPage.title')}</h2>
          <p>{t('toolsPage.subtitle')}</p>
        </motion.header>

        <div className={styles.groups}>
          {groups.map((group, groupIndex) => {
            const Icon =
              groupIcons[group.key as keyof typeof groupIcons] ?? Wrench;

            return (
              <motion.section
                key={group.key}
                className={styles.group}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.08, ease: 'easeOut' }}
              >
                <div className={styles.groupHead}>
                  <span className={styles.groupIcon}>
                    <Icon size={16} />
                  </span>
                  <h3>{group.title}</h3>
                </div>
                <p className={styles.groupDescription}>{group.description}</p>

                <div className={styles.cardGrid}>
                  {group.items.map((item, itemIndex) => (
                    <motion.a
                      key={`${group.key}-${item.name}-${itemIndex}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.card}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.cardHead}>
                        <h4>{item.name}</h4>
                        <span className={styles.cardAction}>
                          {t('toolsPage.visit')}
                          <ArrowUpRight size={14} />
                        </span>
                      </div>

                      <p>{item.description}</p>

                      <div className={styles.cardFoot}>
                        <span className={styles.url}>
                          {item.url.replace(/^https?:\/\//, '')}
                        </span>
                        <div className={styles.tags}>
                          {(item.tags ?? []).map((tag) => (
                            <span key={`${item.name}-${tag}`} className={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Tools;
