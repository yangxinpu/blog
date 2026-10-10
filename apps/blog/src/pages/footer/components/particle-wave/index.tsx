import { useRef, useEffect } from 'react';
import './index.css';

export interface ParticleWaveProps {
  /** 粒子颜色（十六进制），远景（地平线方向）颜色，默认白色 */
  color?: string;
  /** 近景（屏幕底部几行）颜色；提供后粒子按纵深从 color 渐变到此色，默认不渐变 */
  nearColor?: string | null;
  /** 波浪运动速度倍率，默认 1 */
  speed?: number;
  /** 粒子疏密倍率，越小越密，默认 1 */
  density?: number;
  /** 地形行数（纵深方向），默认 16 */
  rows?: number;
  className?: string;
}

interface WaveConfig {
  color: string;
  nearColor: string | null;
  speed: number;
  density: number;
  rows: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(v.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** 两色按 m(0→1) 线性插值，返回十六进制 */
const mixHex = (from: string, to: string, m: number): string => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(
    a[0] + (b[0] - a[0]) * m,
    a[1] + (b[1] - a[1]) * m,
    a[2] + (b[2] - a[2]) * m,
  );
};

/**
 * 粒子波浪背景
 * 透视点阵地形：行向远处地平线收拢，多层正弦波横向传播形成连绵起伏；
 * 前景粒子更大更亮，波峰处亮度增强。Canvas 2D + 离屏精灵渲染。
 */
const ParticleWave = ({
  color = '#FFFFFF',
  nearColor = null,
  speed = 1,
  density = 1,
  rows = 16,
  className = '',
}: ParticleWaveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<WaveConfig>({ color, nearColor, speed, density, rows });

  // 在 effect 中同步最新 props，避免 render 阶段写入 ref
  useEffect(() => {
    propsRef.current = { color, nearColor, speed, density, rows };
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    // 柔边圆点精灵按颜色缓存：逐行渐变色下最多 rows 个，比逐帧 arc 填充性能好得多
    const spriteCache = new Map<string, HTMLCanvasElement>();

    const ensureSprite = (hex: string) => {
      const cached = spriteCache.get(hex);
      if (cached) return cached;
      const [r, g, b] = hexToRgb(hex);
      const size = 32;
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        const grad = offCtx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.55)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, size, size);
      }
      spriteCache.set(hex, off);
      return off;
    };

    // 某一纵深行 t (0=最远, 1=最近) 的几何参数
    const rowGeometry = (t: number) => {
      const horizonY = h * 0.1;
      // 行间距随纵深拉开，制造透视
      const y = horizonY + (h - horizonY) * Math.pow(t, 1.7);
      const gapX = (46 - 24 * t) * propsRef.current.density;
      const dotSize = 2.6 + 5 * t;
      const baseAlpha = 0.14 + 0.55 * t;
      return { y, gapX, dotSize, baseAlpha };
    };

    const render = (time: number) => {
      const p = propsRef.current;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < p.rows; i++) {
        const t = i / (p.rows - 1);
        const { y, gapX, dotSize, baseAlpha } = rowGeometry(t);
        // 颜色按纵深渐变：近景(t=1)近色 → 远景(t=0)远色；
        // easeIn 曲线（t^2.2）把近色压在底部几行，越过前景后快速过渡为远景白
        const rowHex = p.nearColor ? mixHex(p.color, p.nearColor, Math.pow(t, 2.2)) : p.color;
        const dot = ensureSprite(rowHex);
        const cols = Math.ceil(w / gapX) + 2;
        const offX = ((cols * gapX - w) % gapX) / 2;
        // 振幅越靠近前景越大，中景也要能看到明显山脊
        const amplitude = h * (0.02 + 0.075 * t);

        for (let c = 0; c < cols; c++) {
          const x = c * gapX - offX;
          // 三层波叠加：主波长缓慢横移、次波反向传播、短波制造细节
          const wave =
            0.6 * Math.sin(x * 0.005 + time * 0.8 + i * 0.22) +
            0.28 * Math.sin(x * 0.009 - time * 1.15 + i * 0.12) +
            0.12 * Math.sin(x * 0.016 + time * 0.55 + i * 0.35);
          const py = y + wave * amplitude;
          // 波峰波谷处提亮，形成连绵山脊的高光
          const crest = 0.9 + 0.45 * Math.abs(wave);
          ctx.globalAlpha = Math.min(baseAlpha * crest, 1);
          ctx.drawImage(dot, x - dotSize / 2, py - dotSize / 2, dotSize, dotSize);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      render((now / 1000) * propsRef.current.speed);
      raf = requestAnimationFrame(frame);
    };

    const rebuild = () => {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ro = new ResizeObserver(() => {
      rebuild();
      if (prefersReduced) render(0);
    });
    ro.observe(container);
    rebuild();

    // 离开视口时暂停 RAF，footer 在页面底部，节省滚动时的开销
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        const next = entries[0]?.isIntersecting ?? true;
        if (next === visible) return;
        visible = next;
        cancelAnimationFrame(raf);
        if (visible && !prefersReduced) {
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    if (prefersReduced) {
      // 减少动态效果：只渲染一帧静止地形
      render(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`particle-wave${className ? ` ${className}` : ''}`}>
      <canvas ref={canvasRef} className="particle-wave__canvas" aria-hidden="true" />
    </div>
  );
};

export default ParticleWave;
