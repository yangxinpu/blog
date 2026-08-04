import React, { useRef, useEffect, useState, Suspense } from 'react';
import Antigravity from '../../components/Antigravity/Antigravity';
import './QuoteSection.css';

const QuoteSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const target = sectionRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="quote-section"
      onMouseMove={handleMouseMove}
    >
      <div className="quote-antigravity-bg">
        <Suspense fallback={null}>
          <Antigravity
            count={250}
            magnetRadius={7}
            ringRadius={3.5}
            waveSpeed={0.3}
            waveAmplitude={0.5}
            particleSize={1.2}
            lerpSpeed={0.06}
            color="#17FBC6"
            autoAnimate={true}
            particleVariance={0.8}
            rotationSpeed={0.4}
            depthFactor={1.2}
            pulseSpeed={1.5}
            particleShape="sphere"
            fieldStrength={5}
            active={true}
            mouseX={mousePos.x}
            mouseY={mousePos.y}
          />
        </Suspense>
      </div>

      <div className="quote-container">
        <div className={`quote-content ${animateIn ? 'animate-in' : ''}`}>
          <p className="quote-text">
            不积跬步，无以至千里
          </p>
          <p className="quote-author">
            —— 《荀子·劝学》
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
