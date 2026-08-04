import React, { useRef, useEffect } from 'react';

interface CursorGridProps {
  className?: string;
  gridSize?: number;
  maxDistance?: number;
  lineWidth?: number;
  hoverColor?: string;
  baseColor?: string;
  fadeSpeed?: number;
  idleDelay?: number;
}

const EDGE_BLUR = 80;

const CursorGrid: React.FC<CursorGridProps> = ({
  className = '',
  gridSize = 50,
  maxDistance = 120,
  lineWidth = 1,
  hoverColor = '#17FBC6',
  baseColor = 'rgba(23, 251, 198, 0.12)',
  fadeSpeed = 0.03,
  idleDelay = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const opacityRef = useRef(0);
  const idleTimerRef = useRef<number>(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement('canvas');
    }

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const maskCanvas = maskCanvasRef.current!;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      maskCanvas.width = rect.width;
      maskCanvas.height = rect.height;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      createMask(rect.width, rect.height);
    };

    const createMask = (w: number, h: number) => {
      const maskCanvas = maskCanvasRef.current!;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      maskCtx.clearRect(0, 0, w, h);

      // 中心区域完全可见
      maskCtx.fillStyle = 'rgba(255, 255, 255, 1)';
      maskCtx.fillRect(0, 0, w, h);

      // 顶部边缘模糊 (从透明到可见)
      const topGradient = maskCtx.createLinearGradient(0, 0, 0, EDGE_BLUR);
      topGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      topGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      maskCtx.fillStyle = topGradient;
      maskCtx.fillRect(0, 0, w, EDGE_BLUR);

      // 底部边缘模糊
      const bottomGradient = maskCtx.createLinearGradient(0, h - EDGE_BLUR, 0, h);
      bottomGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      bottomGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      maskCtx.fillStyle = bottomGradient;
      maskCtx.fillRect(0, h - EDGE_BLUR, w, EDGE_BLUR);

      // 左侧边缘模糊
      const leftGradient = maskCtx.createLinearGradient(0, 0, EDGE_BLUR, 0);
      leftGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      leftGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      maskCtx.fillStyle = leftGradient;
      maskCtx.fillRect(0, 0, EDGE_BLUR, h);

      // 右侧边缘模糊
      const rightGradient = maskCtx.createLinearGradient(w - EDGE_BLUR, 0, w, 0);
      rightGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      rightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      maskCtx.fillStyle = rightGradient;
      maskCtx.fillRect(w - EDGE_BLUR, 0, EDGE_BLUR, h);
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      const maskCanvas = maskCanvasRef.current;

      ctx.clearRect(0, 0, rect.width, rect.height);

      const opacity = opacityRef.current;

      if (opacity > 0.01) {
        const cols = Math.floor(rect.width / gridSize) + 1;
        const rows = Math.floor(rect.height / gridSize) + 1;

        ctx.save();

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCanvas.width = rect.width;
          tempCanvas.height = rect.height;

          for (let col = 0; col <= cols; col++) {
            const x = col * gridSize;
            tempCtx.strokeStyle = baseColor;
            tempCtx.globalAlpha = opacity;
            tempCtx.lineWidth = lineWidth;
            tempCtx.beginPath();
            tempCtx.moveTo(x, 0);
            tempCtx.lineTo(x, rect.height);
            tempCtx.stroke();
          }

          for (let row = 0; row <= rows; row++) {
            const y = row * gridSize;
            tempCtx.strokeStyle = baseColor;
            tempCtx.globalAlpha = opacity;
            tempCtx.lineWidth = lineWidth;
            tempCtx.beginPath();
            tempCtx.moveTo(0, y);
            tempCtx.lineTo(rect.width, y);
            tempCtx.stroke();
          }

          const clipX = Math.max(0, mouse.x - maxDistance);
          const clipY = Math.max(0, mouse.y - maxDistance);
          const clipW = Math.min(maxDistance * 2, rect.width - clipX);
          const clipH = Math.min(maxDistance * 2, rect.height - clipY);

          tempCtx.save();
          tempCtx.beginPath();
          tempCtx.rect(clipX, clipY, clipW, clipH);
          tempCtx.clip();

          const startCol = Math.max(0, Math.floor(clipX / gridSize));
          const endCol = Math.min(cols, Math.ceil((clipX + clipW) / gridSize));
          const startRow = Math.max(0, Math.floor(clipY / gridSize));
          const endRow = Math.min(rows, Math.ceil((clipY + clipH) / gridSize));

          for (let col = startCol; col <= endCol; col++) {
            const x = col * gridSize;
            const distToMouse = Math.abs(x - mouse.x);

            if (distToMouse < maxDistance) {
              const intensity = 1 - distToMouse / maxDistance;
              tempCtx.strokeStyle = hoverColor;
              tempCtx.globalAlpha = intensity * 0.9 * opacity;
              tempCtx.lineWidth = lineWidth + 0.5;
              tempCtx.beginPath();
              tempCtx.moveTo(x, clipY);
              tempCtx.lineTo(x, clipY + clipH);
              tempCtx.stroke();
            }
          }

          for (let row = startRow; row <= endRow; row++) {
            const y = row * gridSize;
            const distToMouse = Math.abs(y - mouse.y);

            if (distToMouse < maxDistance) {
              const intensity = 1 - distToMouse / maxDistance;
              tempCtx.strokeStyle = hoverColor;
              tempCtx.globalAlpha = intensity * 0.9 * opacity;
              tempCtx.lineWidth = lineWidth + 0.5;
              tempCtx.beginPath();
              tempCtx.moveTo(clipX, y);
              tempCtx.lineTo(clipX + clipW, y);
              tempCtx.stroke();
            }
          }

          for (let col = startCol; col <= endCol; col++) {
            for (let row = startRow; row <= endRow; row++) {
              const x = col * gridSize;
              const y = row * gridSize;
              const dx = x - mouse.x;
              const dy = y - mouse.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < maxDistance) {
                const intensity = 1 - distance / maxDistance;
                tempCtx.beginPath();
                tempCtx.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2);
                tempCtx.fillStyle = hoverColor;
                tempCtx.globalAlpha = intensity * opacity;
                tempCtx.fill();
              }
            }
          }

          tempCtx.restore();

          if (maskCanvas) {
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(maskCanvas, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
          } else {
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.lineWidth = lineWidth;
      animationRef.current = requestAnimationFrame(animate);
    };

    initCanvas();
    animationRef.current = requestAnimationFrame(animate);

    const showGrid = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = 0;
      }
    };

    const hideGrid = () => {
      if (idleTimerRef.current) return;
      idleTimerRef.current = window.setTimeout(() => {
        idleTimerRef.current = 0;
      }, idleDelay);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const isOverContainer =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverContainer) {
        isHoveringRef.current = true;
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        showGrid();
        opacityRef.current = Math.min(1, opacityRef.current + fadeSpeed * 3);
        hideGrid();
      } else {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          mouseRef.current = { x: -1000, y: -1000 };
          if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = 0;
          }
          opacityRef.current = 0;
        }
      }
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      mouseRef.current = { x: -1000, y: -1000 };
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = 0;
      }
      opacityRef.current = 0;
    };

    const handleResize = () => {
      initCanvas();
    };

    const fadeInterval = window.setInterval(() => {
      if (!idleTimerRef.current && opacityRef.current > 0) {
        opacityRef.current = Math.max(0, opacityRef.current - fadeSpeed);
      }
    }, 16);

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(fadeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [gridSize, maxDistance, lineWidth, hoverColor, baseColor, fadeSpeed, idleDelay]);

  return (
    <div ref={containerRef} className={`cursor-grid-container ${className}`}>
      <canvas ref={canvasRef} className="cursor-grid-canvas" />
    </div>
  );
};

export default CursorGrid;
