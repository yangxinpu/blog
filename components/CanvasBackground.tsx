import React, { useRef, useEffect } from 'react';
import { COLORS } from '../constants';

interface CanvasBackgroundProps {
  theme?: 'dark' | 'light';
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let animationFrameId: number;

    // Mouse state
    const mouse = { x: -1000, y: -1000 };

    // Configuration Constants
    const THEME_COLOR = theme === 'dark' ? COLORS.neonGreen : COLORS.darkGreen;
    const BG_COLOR = theme === 'dark' ? '#0f0f0e' : '#f3f4f6';
    const POINT_COUNT_FACTOR = 9000; // Screen area divided by this gives point count
    const CONNECTION_DISTANCE = 140; // Max distance to draw a line
    const MOUSE_DISTANCE = 200; // Interaction radius
    const POINT_RADIUS = 1.5;
    const LINE_WIDTH = 0.5;
    const SPEED_FACTOR = 0.4; // Base movement speed

    // Initialize Canvas and Points
    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const area = width * height;
      const numPoints = Math.floor(area / POINT_COUNT_FACTOR);

      points = [];
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * SPEED_FACTOR,
          vy: (Math.random() - 0.5) * SPEED_FACTOR,
        });
      }
    };

    // Draw Function
    const draw = () => {
      // Clear screen
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Update Points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Move standard velocity
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interaction with mouse (repel effect)
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < MOUSE_DISTANCE) {
          const forceDirectionX = dxMouse / distMouse;
          const forceDirectionY = dyMouse / distMouse;
          const force = (MOUSE_DISTANCE - distMouse) / MOUSE_DISTANCE;

          // Gentle push
          const repelStrength = 2;
          p.x += forceDirectionX * force * repelStrength;
          p.y += forceDirectionY * force * repelStrength;
        }

        // Draw Point
        ctx.beginPath();
        ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = THEME_COLOR;
        ctx.fill();
      }

      // Draw Lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            // Calculate opacity based on distance (closer = more opaque)
            const opacity = 1 - dist / CONNECTION_DISTANCE;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Use rgba with dynamic opacity
            const rgbColor = THEME_COLOR === COLORS.neonGreen ? 'rgba(25, 250, 198, ' : 'rgba(54, 100, 84, ';
            ctx.strokeStyle = `${rgbColor}${opacity})`;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
          }
        }

        // Connect to mouse if close enough
        const dxMouse = points[i].x - mouse.x;
        const dyMouse = points[i].y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < CONNECTION_DISTANCE + 50) {
          const opacity = 1 - distMouse / (CONNECTION_DISTANCE + 50);
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const rgbColor = THEME_COLOR === COLORS.neonGreen ? 'rgba(25, 250, 198, ' : 'rgba(54, 100, 84, ';
          ctx.strokeStyle = `${rgbColor}${opacity})`;
          ctx.lineWidth = LINE_WIDTH;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Event Handlers
    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Get correct coordinates relative to canvas
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Start
    init();
    draw();

    // Listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

export default CanvasBackground;
