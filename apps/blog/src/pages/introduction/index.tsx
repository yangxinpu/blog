import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CrystalizedBall from './components/crystalized-ball';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const left = leftRef.current;
      const right = rightRef.current;

      if (left) {
        gsap.fromTo(
          left,
          { x: -120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'top 20%',
              toggleActions: 'restart none none none',
            },
          },
        );
      }

      if (right) {
        gsap.fromTo(
          right,
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'top 20%',
              toggleActions: 'restart none none none',
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="intro-section" ref={sectionRef}>
      <div className="intro-side intro-side--left" ref={leftRef}>
        <span className="intro-title intro-title-accent">探索</span>
        <span className="intro-title intro-title-accent">热爱</span>
      </div>

      <div className="intro-ball">
        <CrystalizedBall color="#17FBC6" color2="#3AA1FE" size={0.92} strands={1} glow={0} interactive={false} />
      </div>

      <div className="intro-side intro-side--right" ref={rightRef}>
        <span className="intro-title intro-title-blue">无限</span>
        <span className="intro-title intro-title-blue">生活</span>
      </div>
    </section>
  );
}

export default Introduction;
