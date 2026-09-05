import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from './pages/home';
import KnowledgeIntro from './pages/knowledge-intro';
import LogoSection from './pages/logo-section';
import TravelDisplay from './pages/travel-display';
import Preloader from './components/preloader';
import { ALL_PRELOAD_IMAGES } from './assets/preload';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 尊重系统「减少动态效果」设置：此时使用原生滚动
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !wrapperRef.current || !contentRef.current || isLoading) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      smoothTouch: 0,
    });

    return () => {
      smoother.kill();
    };
  }, [isLoading]);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="app">
      {isLoading && (
        <Preloader images={ALL_PRELOAD_IMAGES} onComplete={handleLoadComplete} />
      )}
      <div
        id="smooth-wrapper"
        ref={wrapperRef}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.8s ease' }}
      >
        <div id="smooth-content" ref={contentRef}>
          <main>
            <Home />
            <KnowledgeIntro />
            <LogoSection />
            <TravelDisplay />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
