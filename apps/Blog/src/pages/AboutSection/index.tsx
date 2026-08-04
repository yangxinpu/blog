import React, { useRef, useEffect, useState } from 'react';
import PixelTransition from '../../components/PixelTransition';
import BlurText from '../../components/BlurText';
import catImage from '../../assets/Images/cat.webp';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageAnimateIn, setImageAnimateIn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageAnimateIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
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
        <div className="about-text">
          <h2 className="about-title">
            <BlurText
              text="代码即"
              animateBy="letters"
              direction="top"
              delay={80}
              stepDuration={0.4}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
            <span className="about-title-accent">
              <BlurText
                text="艺术"
                animateBy="letters"
                direction="top"
                delay={80}
                stepDuration={0.4}
                threshold={0.1}
                rootMargin="0px 0px -50px 0px"
              />
            </span>
            <BlurText
              text="，"
              animateBy="letters"
              direction="top"
              delay={80}
              stepDuration={0.4}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
            <br />
            <BlurText
              text="产品即"
              animateBy="letters"
              direction="top"
              delay={80}
              stepDuration={0.4}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
            <span className="about-title-accent">
              <BlurText
                text="哲学"
                animateBy="letters"
                direction="top"
                delay={80}
                stepDuration={0.4}
                threshold={0.1}
                rootMargin="0px 0px -50px 0px"
              />
            </span>
          </h2>

          <p className="about-description">
            <BlurText
              text="你好，我是"
              animateBy="words"
              direction="bottom"
              delay={60}
              stepDuration={0.35}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
            {' '}
            <strong className="about-highlight">
              <BlurText
                text="NaiLuo"
                animateBy="letters"
                direction="bottom"
                delay={100}
                stepDuration={0.4}
                threshold={0.1}
                rootMargin="0px 0px -50px 0px"
              />
            </strong>
            {' '}
            <BlurText
              text="，一个热爱技术的全栈开发者。我相信优秀的代码应该像散文一样流畅，好的产品应该像诗歌一样动人。"
              animateBy="words"
              direction="bottom"
              delay={60}
              stepDuration={0.35}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
          </p>

          <p className="about-description">
            <BlurText
              text="我在前端、后端、AI 等领域持续探索，热衷于用代码构建优雅的解决方案。在这里记录我的学习笔记与技术思考。"
              animateBy="words"
              direction="bottom"
              delay={60}
              stepDuration={0.35}
              threshold={0.1}
              rootMargin="0px 0px -50px 0px"
            />
          </p>

          <div className="about-tags">
            <span className="about-tag">#前端开发</span>
            <span className="about-tag">#AI应用</span>
            <span className="about-tag">#全栈工程师</span>
          </div>
        </div>

        <div className={`about-image ${imageAnimateIn ? 'animate-in' : ''}`}>
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
