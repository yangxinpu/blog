import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitText from 'gsap/SplitText';
import PixelBlast from '../../components/PixelBlast/PixelBlast';
import './Home.css';

gsap.registerPlugin(SplitText);

const Home: React.FC = () => {
  const accentColor =
    typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#17FBC6'
      : '#17FBC6';

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const ctx = gsap.context(() => {
      const leftEl = titleEl.querySelector('.home-title-part-left');
      const rightEl = titleEl.querySelector('.home-title-part-right');
      if (!leftEl || !rightEl) return;

      const splitLeft = new SplitText(leftEl, { type: 'chars' });

      gsap.set(splitLeft.chars, {
        opacity: 0,
        yPercent: 80,
        scale: 0.8,
      });

      gsap.set(rightEl, {
        opacity: 0,
        yPercent: 80,
        scale: 0.8,
      });

      gsap.to(splitLeft.chars, {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        stagger: { each: 0.04, from: 'start' },
        duration: 0.9,
        ease: 'expo.out',
        delay: 0.2,
      });

      gsap.to(rightEl, {
        opacity: 1,
        yPercent: 0,
        scale: 1,
        duration: 0.9,
        ease: 'expo.out',
        delay: 0.6,
      });
    });

    return () => ctx.revert();
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
        <h1 ref={titleRef} className="home-title">
          <span className="home-title-part-left">Humans Steer,</span>
          <span className="home-title-part-right home-title-accent">Agents Execute</span>
        </h1>
      </div>
    </section>
  );
};

export default Home;
