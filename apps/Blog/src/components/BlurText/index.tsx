import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import './BlurText.css';

interface BlurTextProps {
  text: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  animateBy = 'words',
  direction = 'top',
  delay = 200,
  stepDuration = 0.35,
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
  className = '',
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  const animate = useCallback(() => {
    const containerEl = containerRef.current;
    if (!containerEl || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const items = containerEl.querySelectorAll<HTMLSpanElement>('.blur-text-item');
    if (!items.length) return;

    const offsetY = direction === 'top' ? -24 : 24;

    gsap.fromTo(
      items,
      {
        filter: 'blur(12px)',
        y: offsetY,
        opacity: 0,
      },
      {
        filter: 'blur(0px)',
        y: 0,
        opacity: 1,
        duration: stepDuration,
        ease: 'power3.out',
        stagger: {
          each: delay / 1000,
          from: 'start',
        },
        onComplete: () => {
          onAnimationComplete?.();
        },
      },
    );
  }, [direction, stepDuration, delay, onAnimationComplete]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [animate, threshold, rootMargin]);

  const renderText = () => {
    const hasSpaces = text.includes(' ');
    const useLetterMode = animateBy === 'letters' || !hasSpaces;

    if (useLetterMode) {
      return Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="blur-text-item"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }

    const words = text.split(' ');
    return words.map((word, index) => (
      <span key={`${word}-${index}`} className="blur-text-item">
        {word}
        {index < words.length - 1 && (
          <span className="blur-text-space">&nbsp;</span>
        )}
      </span>
    ));
  };

  return (
    <span ref={containerRef} className={`blur-text ${className}`}>
      {renderText()}
    </span>
  );
};

export default BlurText;