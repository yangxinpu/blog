import React, { useRef, useEffect, useState } from 'react';
import PixelTransition from '../../components/PixelTransition';
import catImage from '../../assets/Images/cat.webp';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="about-section">
      <div ref={containerRef} className="about-container">
        <div className={`about-text ${animateIn ? 'animate-in' : ''}`}>
          <h2 className="about-title">
            代码即
            <span className="about-title-accent">艺术</span>，
            <br />
            产品即
            <span className="about-title-accent">哲学</span>
          </h2>

          <p className="about-description">
            你好，我是 <strong className="about-highlight">NaiLuo</strong>，一个热爱技术的全栈开发者。
            我相信优秀的代码应该像散文一样流畅，好的产品应该像诗歌一样动人。
          </p>

          <p className="about-description">
            我在前端、后端、AI 等领域持续探索，热衷于用代码构建优雅的解决方案。
            在这里记录我的学习笔记与技术思考。
          </p>

          <div className="about-tags">
            <span className="about-tag">#前端开发</span>
            <span className="about-tag">#AI应用</span>
            <span className="about-tag">#全栈工程师</span>
          </div>
        </div>

        <div className={`about-image ${animateIn ? 'animate-in' : ''}`}>
          <PixelTransition
            gridSize={6}
            pixelColor="#111111"
            hoverPixelColor="var(--bg)"
            animationStepDuration={1.5}
            hoverDuration={0.25}
            className="about-image-wrapper"
            hoverText="NaiLuo"
          >
            <img src={catImage} alt="About" className="about-img" />
          </PixelTransition>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
