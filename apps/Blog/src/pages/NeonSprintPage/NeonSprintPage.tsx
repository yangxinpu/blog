import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './NeonSprintPage.module.scss';
import { useSectionActivity } from '../../libs/hooks/useSectionActivity';

function GeometricAnimation({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      width = rect.width;
      height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const rings = [
      {
        radius: 0.18,
        speed: 0.3,
        opacity: 0.15,
        dashArray: [8, 12],
        width: 1.5,
      },
      {
        radius: 0.26,
        speed: -0.25,
        opacity: 0.12,
        dashArray: [12, 8],
        width: 1.2,
      },
      { radius: 0.34, speed: 0.2, opacity: 0.1, dashArray: [6, 10], width: 1 },
      {
        radius: 0.42,
        speed: -0.15,
        opacity: 0.08,
        dashArray: [10, 6],
        width: 0.8,
      },
    ];

    const animate = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      ctx.clearRect(0, 0, width, height);

      timeRef.current += 0.016;

      rings.forEach((ring, index) => {
        const radius = maxRadius * ring.radius;
        const rotation = timeRef.current * ring.speed;
        const breathe = 1 + Math.sin(timeRef.current * 0.5 + index) * 0.02;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.scale(breathe, breathe);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(25, 250, 198, ${ring.opacity})`;
        ctx.lineWidth = ring.width;
        ctx.setLineDash(ring.dashArray);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
      });

      const hexagonLayers = [
        { radius: 0.22, speed: 0.18, opacity: 0.2, sides: 6 },
        { radius: 0.38, speed: -0.12, opacity: 0.12, sides: 6 },
      ];

      hexagonLayers.forEach((layer) => {
        const radius = maxRadius * layer.radius;
        const rotation = timeRef.current * layer.speed;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        ctx.beginPath();
        for (let i = 0; i <= layer.sides; i++) {
          const angle = (i / layer.sides) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(25, 250, 198, ${layer.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      });

      const dotCount = 24;
      const dotRadius = maxRadius * 0.48;
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + timeRef.current * 0.1;
        const x = centerX + Math.cos(angle) * dotRadius;
        const y = centerY + Math.sin(angle) * dotRadius;
        const pulse = 0.5 + Math.sin(timeRef.current * 2 + i * 0.5) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, 2 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(25, 250, 198, ${0.3 + pulse * 0.3})`;
        ctx.fill();
      }

      const lineCount = 8;
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const innerRadius = maxRadius * 0.12;
        const outerRadius = maxRadius * 0.52;
        const pulse = Math.sin(timeRef.current * 1.5 + i * 0.8) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * innerRadius,
          centerY + Math.sin(angle) * innerRadius
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * outerRadius,
          centerY + Math.sin(angle) * outerRadius
        );
        ctx.strokeStyle = `rgba(25, 250, 198, ${0.05 + pulse * 0.08})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      const coreRadius = maxRadius * 0.08;
      const corePulse = 1 + Math.sin(timeRef.current * 2) * 0.15;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        coreRadius * corePulse * 2
      );
      gradient.addColorStop(0, 'rgba(25, 250, 198, 0.4)');
      gradient.addColorStop(0.5, 'rgba(25, 250, 198, 0.15)');
      gradient.addColorStop(1, 'rgba(25, 250, 198, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * corePulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(25, 250, 198, 0.6)';
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

function NeonSprintPage() {
  const { t, i18n } = useTranslation();
  const { ref: sectionRef, isActive } = useSectionActivity<HTMLElement>({
    rootMargin: '30% 0px 30% 0px',
    threshold: 0.15,
  });
  const isZh = i18n.language === 'zh-CN';

  const copy = t('neonSprintPage.copy');

  const segments = useMemo(
    () => (isZh ? Array.from(copy) : copy.split(' ')),
    [copy, isZh]
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.textPane}>
          <p className={styles.copy}>
            {segments.map((segment, index) => (
              <motion.span
                key={`${segment}-${index}`}
                className={styles.copyToken}
                initial={{
                  opacity: 0,
                  y: 28,
                  rotateX: 70,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.58,
                  delay: index * 0.024,
                  ease: 'easeOut',
                }}
              >
                {!isZh && index > 0 ? '\u00A0' : ''}
                {segment}
              </motion.span>
            ))}
          </p>
        </div>

        <div className={styles.visualPane}>
          <GeometricAnimation isActive={isActive} />
        </div>
      </div>
    </section>
  );
}

export default NeonSprintPage;
