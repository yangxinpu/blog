import { useEffect, useRef } from 'react';

interface WaveOptions {
  speed?: number;
  density?: number;
  lineWidthMultiplier?: number;
}

interface CanvasWavesProps {
  isVisible: boolean;
  isActive: boolean;
  options?: WaveOptions;
}

interface WaveConfig {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  yOffset: number;
  width: number;
  opacity: number;
}

export default function CanvasWaves({
  isVisible,
  isActive,
  options = {},
}: CanvasWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<WaveConfig[]>([]);
  const progressRef = useRef(0);
  const animationRef = useRef<number>(0);
  // Theme is fixed to dark; accent color is read once from CSS variables.
  // Default to #13d6aa (the dark-theme accent fallback) so the first frame
  // is already correct before the effect below runs.
  const themeColorRef = useRef({
    line: '#13d6aa',
    glow: '#13d6aa',
  });

  const { speed = 1.2, density = 5, lineWidthMultiplier = 1.5 } = options;

  // Read accent color from CSS variables (theme is fixed to dark)
  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const accent =
      computedStyle.getPropertyValue('--accent').trim() || '#13d6aa';

    themeColorRef.current = {
      line: accent,
      glow: accent,
    };
  }, []);

  // Initialize wave parameters
  useEffect(() => {
    const waves: WaveConfig[] = [];
    for (let i = 0; i < density; i++) {
      waves.push({
        amplitude: 60 + Math.random() * 80,
        frequency: 0.001 + Math.random() * 0.0015,
        phase: Math.random() * Math.PI * 2,
        speed: (0.0004 + Math.random() * 0.0006) * speed,
        yOffset: (i - density / 2) * 50,
        width: (1.5 + Math.random() * 1.5) * lineWidthMultiplier,
        opacity: 0.2 + Math.random() * 0.6,
      });
    }
    wavesRef.current = waves;
  }, [density, speed, lineWidthMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    if (!isActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;
    let dpr = window.devicePixelRatio || 1;

    // Resize handler with RAF throttle
    let resizeTimeout: number;
    const handleResize = () => {
      if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        w = rect.width;
        h = rect.height;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, w, h);

      // Smooth scroll-in animation with easing
      if (isVisible) {
        // Easing function: easeOutQuart-like approach
        const target = 1;
        const diff = target - progressRef.current;
        if (diff > 0.001) {
          progressRef.current += diff * 0.04 * (dt / 16);
        } else {
          progressRef.current = 1;
        }
      } else {
        progressRef.current = 0;
      }

      const p = progressRef.current;

      if (p > 0) {
        wavesRef.current.forEach((wave) => {
          ctx.beginPath();
          // Animate the line drawing from left to right
          const drawWidth = w * p;

          for (let x = 0; x <= drawWidth; x += 10) {
            // Add a slight tilt or offset for visual interest
            const y =
              h / 2 +
              wave.yOffset +
              Math.sin(x * wave.frequency + wave.phase + time * wave.speed) *
                wave.amplitude;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Add glow effect
          ctx.shadowBlur = 12;
          ctx.shadowColor = themeColorRef.current.glow;

          ctx.lineWidth = wave.width;
          ctx.strokeStyle = themeColorRef.current.line;
          ctx.globalAlpha = wave.opacity * (0.2 + 0.8 * p); // Fade in opacity while sweeping
          ctx.stroke();

          // Reset shadow for next path to avoid compounded glow issues
          ctx.shadowBlur = 0;
        });
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
