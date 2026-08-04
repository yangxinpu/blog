import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './PixelTransition.css';

interface PixelTransitionProps {
  children: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  hoverPixelColor?: string;
  animationStepDuration?: number;
  hoverDuration?: number;
  className?: string;
  hoverText?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  children,
  gridSize = 12,
  pixelColor = '#111111',
  hoverPixelColor,
  animationStepDuration = 1.5,
  hoverDuration = 0.3,
  className = '',
  hoverText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const primaryAnimatedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const isHoverRef = useRef(false);
  const [isHoverState, setIsHoverState] = useState(false);

  const resolveColor = useCallback(
    (color?: string): string => {
      if (!color) return pixelColor;
      if (color.startsWith('var(')) {
        if (typeof window === 'undefined') return '#111111';
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(color.slice(4, -1))
          .trim();
        return value || '#111111';
      }
      return color;
    },
    [pixelColor],
  );

  const initPixels = useCallback(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    const resolvedHoverColor = resolveColor(hoverPixelColor);
    const count = gridSize * gridSize;
    for (let i = 0; i < count; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      pixel.style.backgroundColor = resolvedHoverColor;

      const size = 100 / gridSize;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      pixel.style.width = `${size}%`;
      pixel.style.height = `${size}%`;
      pixel.style.left = `${col * size}%`;
      pixel.style.top = `${row * size}%`;

      pixelGridEl.appendChild(pixel);
    }
  }, [gridSize, hoverPixelColor, resolveColor]);

  const showText = useCallback(() => {
    const textEl = textOverlayRef.current;
    if (!textEl) return;
    gsap.fromTo(
      textEl,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' },
    );
  }, []);

  const hideText = useCallback(() => {
    const textEl = textOverlayRef.current;
    if (!textEl) return;
    gsap.to(textEl, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
    });
  }, []);

  const animateOut = useCallback(
    (duration: number) => {
      const pixelGridEl = pixelGridRef.current;
      if (!pixelGridEl) return;

      const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixel');
      if (!pixels.length) return;

      isAnimatingRef.current = true;

      const resolvedColor = resolveColor(hoverPixelColor);
      gsap.set(pixelGridEl, { display: 'block' });
      gsap.set(pixels, { opacity: 1, backgroundColor: resolvedColor });

      gsap.to(pixels, {
        opacity: 0,
        duration,
        stagger: {
          each: 0.02,
          from: 'random',
        },
        ease: 'power2.inOut',
        onComplete: () => {
          isAnimatingRef.current = false;
          gsap.set(pixelGridEl, { display: 'none' });
          hideText();
        },
      });
    },
    [hoverPixelColor, resolveColor, hideText],
  );

  const animateIn = useCallback(
    (duration: number) => {
      const pixelGridEl = pixelGridRef.current;
      if (!pixelGridEl) return;

      if (isAnimatingRef.current) {
        gsap.killTweensOf(pixelGridEl.querySelectorAll('.pixel'));
      }

      const textEl = textOverlayRef.current;
      const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixel');
      if (!pixels.length) return;

      isAnimatingRef.current = true;

      if (textEl) {
        gsap.set(textEl, { opacity: 0, scale: 0.9 });
      }

      gsap.set(pixelGridEl, { display: 'block' });
      gsap.set(pixels, { opacity: 0 });

      gsap.to(pixels, {
        opacity: 1,
        duration,
        stagger: {
          each: 0.02,
          from: 'random',
        },
        ease: 'power2.inOut',
        onComplete: () => {
          isAnimatingRef.current = false;
          showText();
        },
      });
    },
    [showText],
  );

  const handleMouseEnter = useCallback(() => {
    isHoverRef.current = true;
    setIsHoverState(true);
    if (!primaryAnimatedRef.current) return;
    animateIn(hoverDuration);
  }, [hoverDuration, animateIn]);

  const handleMouseLeave = useCallback(() => {
    isHoverRef.current = false;
    setIsHoverState(false);
    if (!primaryAnimatedRef.current) return;
    animateOut(hoverDuration);
  }, [hoverDuration, animateOut]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    initPixels();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !primaryAnimatedRef.current) {
            primaryAnimatedRef.current = true;
            animateOut(animationStepDuration);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(containerEl);

    if (hoverText) {
      containerEl.addEventListener('mouseenter', handleMouseEnter);
      containerEl.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      observer.disconnect();
      if (hoverText) {
        containerEl.removeEventListener('mouseenter', handleMouseEnter);
        containerEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [initPixels, animateOut, animationStepDuration, hoverText, handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={containerRef} className={`pixel-container ${className}`}>
      <div className="pixel-content">{children}</div>
      {hoverText && (
        <div
          ref={textOverlayRef}
          className={`pixel-text-overlay ${isHoverState ? 'visible' : ''}`}
        >
          {hoverText}
        </div>
      )}
      <div ref={pixelGridRef} className="pixel-grid" />
    </div>
  );
};

export default PixelTransition;
