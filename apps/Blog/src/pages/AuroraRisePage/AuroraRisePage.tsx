import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import styles from './AuroraRisePage.module.scss';

interface SilkLine {
  y: number;
  baseY: number;
  speed: number;
  amplitude: number;
  frequency: number;
  thickness: number;
  opacity: number;
  color: string;
  phase: number;
  waveOffset: number;
}

function FlowingLinesBackground({
  primaryColor,
  secondaryColor,
  accentColor,
  speed,
  glowIntensity,
  isDark,
}: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  speed: number;
  glowIntensity: number;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const linesRef = useRef<SilkLine[]>([]);
  const timeRef = useRef(0);

  const initLines = useCallback((_width: number, height: number) => {
    const lineCount = Math.floor(height / 60) + 5;
    const colors = [primaryColor, secondaryColor, accentColor];
    
    linesRef.current = Array.from({ length: lineCount }, (_, i) => ({
      y: (i / lineCount) * height,
      baseY: (i / lineCount) * height,
      speed: speed * (0.5 + Math.random() * 0.5),
      amplitude: 20 + Math.random() * 40,
      frequency: 0.003 + Math.random() * 0.002,
      thickness: 0.5 + Math.random() * 1.5,
      opacity: 0.08 + Math.random() * 0.15,
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
      waveOffset: Math.random() * 1000,
    }));
  }, [speed, primaryColor, secondaryColor, accentColor]);

  const drawLine = useCallback((
    ctx: CanvasRenderingContext2D,
    line: SilkLine,
    time: number,
    width: number,
    _height: number
  ) => {
    ctx.beginPath();
    
    const segments = Math.ceil(width / 2);
    const points: { x: number; y: number }[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const wave1 = Math.sin(x * line.frequency + time * line.speed * 0.3 + line.phase) * line.amplitude;
      const wave2 = Math.sin(x * line.frequency * 0.6 + time * line.speed * 0.5 + line.phase * 1.5) * (line.amplitude * 0.6);
      const wave3 = Math.cos(x * line.frequency * 1.2 + time * line.speed * 0.2 + line.waveOffset) * (line.amplitude * 0.3);
      const y = line.y + wave1 + wave2 + wave3;
      points.push({ x, y });
    }

    if (points.length < 2) return;

    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.15, line.color);
    gradient.addColorStop(0.5, line.color);
    gradient.addColorStop(0.85, line.color);
    gradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = line.thickness;
    ctx.globalAlpha = line.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.shadowColor = line.color;
    ctx.shadowBlur = 20 * glowIntensity;
    
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [glowIntensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initLines(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      timeRef.current += 0.016;
      
      linesRef.current.forEach(line => {
        line.y += line.speed * 15;
        
        if (line.y > rect.height + 100) {
          line.y = -50;
          line.baseY = -50;
        }
        
        drawLine(ctx, line, timeRef.current, rect.width, rect.height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initLines, drawLine]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isDark ? 1 : 0.5,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
}

function AuroraRisePage() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh-CN';
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(root.getAttribute('data-theme') === 'dark');
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <FlowingLinesBackground
        primaryColor="#19fac6"
        secondaryColor="#13d6aa"
        accentColor="#0ea387"
        speed={0.08}
        glowIntensity={0.25}
        isDark={isDark}
      />

      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
        >
          {isZh
            ? '每天进步一点，未来就会发光。'
            : 'Small progress every day builds a glowing future.'}
        </motion.h2>
      </div>

      <motion.p
        className={styles.bottomNote}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
      >
        {isZh
          ? '微光会汇成星河，耐心会长成力量。'
          : 'Small lights become constellations, and patience turns into power.'}
      </motion.p>
    </section>
  );
}

export default AuroraRisePage;
