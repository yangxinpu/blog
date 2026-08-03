import React, { useEffect, useRef } from 'react';
import { Github } from 'lucide-react';
import PixelBlast from '../../components/PixelBlast/PixelBlast';
import './Home.css';

const Home: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const accentColor =
    typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#17FBC6'
      : '#17FBC6';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('animate-in');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    const elements = [titleRef.current, buttonsRef.current].filter(Boolean);

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="home-section">
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color={accentColor}
        patternScale={2}
        patternDensity={1.2}
        speed={0.5}
        edgeFade={0.2}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.08}
        rippleIntensityScale={1.2}
      />

      <div className="home-overlay" />

      <div className="home-content">
        <h1 ref={titleRef} className="home-title animate-delay-0">
          Humans Steer,{' '}
          <span className="home-title-accent">Agents Execute</span>
        </h1>

        <div ref={buttonsRef} className="home-buttons animate-delay-1">
          <a
            href="https://github.com/yangxinpu"
            target="_blank"
            rel="noopener noreferrer"
            className="home-btn home-btn-primary"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>

          <a
            href="https://nailuo-knowledge-base.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="home-btn home-btn-secondary"
          >
            <span>知识库</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
