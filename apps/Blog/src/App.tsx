import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from './pages/home';
import KnowledgeIntro from './pages/knowledge-intro';
import LogoSection from './pages/logo-section';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 尊重系统「减少动态效果」设置：此时使用原生滚动
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !wrapperRef.current || !contentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      smoothTouch: 0,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div className="app">
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <main>
            <Home />
            <KnowledgeIntro />
            <LogoSection />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
