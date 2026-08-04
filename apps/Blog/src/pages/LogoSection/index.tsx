import React, { useEffect, useRef } from 'react';
import LogoLoop from '../../components/LogoLoop/LogoLoop';
import './LogoSection.css';

const techLogos = [
  { src: 'https://cdn.simpleicons.org/react/FFFFFF', alt: 'React', title: 'React' },
  { src: 'https://cdn.simpleicons.org/typescript/FFFFFF', alt: 'TypeScript', title: 'TypeScript' },
  { src: 'https://cdn.simpleicons.org/javascript/FFFFFF', alt: 'JavaScript', title: 'JavaScript' },
  { src: 'https://cdn.simpleicons.org/vuedotjs/FFFFFF', alt: 'Vue', title: 'Vue' },
  { src: 'https://cdn.simpleicons.org/vite/FFFFFF', alt: 'Vite', title: 'Vite' },
  { src: 'https://cdn.simpleicons.org/tailwindcss/FFFFFF', alt: 'Tailwind CSS', title: 'Tailwind CSS' },
  { src: 'https://cdn.simpleicons.org/threedotjs/FFFFFF', alt: 'Three.js', title: 'Three.js' },
  { src: 'https://cdn.simpleicons.org/nodedotjs/FFFFFF', alt: 'Node.js', title: 'Node.js' },
  { src: 'https://cdn.simpleicons.org/python/FFFFFF', alt: 'Python', title: 'Python' },
  { src: 'https://cdn.simpleicons.org/git/FFFFFF', alt: 'Git', title: 'Git' },
  { src: 'https://cdn.simpleicons.org/docker/FFFFFF', alt: 'Docker', title: 'Docker' },
  { src: 'https://cdn.simpleicons.org/nginx/FFFFFF', alt: 'Nginx', title: 'Nginx' },
  { src: 'https://cdn.simpleicons.org/postgresql/FFFFFF', alt: 'PostgreSQL', title: 'PostgreSQL' },
  { src: 'https://cdn.simpleicons.org/redis/FFFFFF', alt: 'Redis', title: 'Redis' },
  { src: 'https://cdn.simpleicons.org/linux/FFFFFF', alt: 'Linux', title: 'Linux' },
];

const LogoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="logo-section">
      <div ref={sectionRef} className="logo-content">
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="left"
          logoHeight={56}
          gap={90}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="#111111"
          scaleOnHover
          className="logo-loop"
        />
      </div>
    </section>
  );
};

export default LogoSection;
