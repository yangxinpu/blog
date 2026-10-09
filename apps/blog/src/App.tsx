import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from './pages/home';
import KnowledgeIntro from './pages/knowledge-intro';
import TravelDisplay from './pages/travel-display';
import Footer from './pages/footer';

import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// 参与整屏吸附的区块（顺序即屏幕顺序）
const SNAP_SELECTOR = '.home-section, .ki-section, .travel-display, .footer';
// 触控板/滚轮累计滚动阈值，超过才触发一次整屏切换
const WHEEL_THRESHOLD = 24;
// 无连续事件后累计值的重置时间
const WHEEL_RESET_MS = 220;
// 高于视口的区块判定为需要内部浏览（补底部对齐吸附点）
const TALL_RATIO = 1.05;
const FORM_CONTROL = 'input, textarea, select, [contenteditable="true"]';

interface SnapPoint {
  /** 吸附目标元素 */
  target: HTMLElement;
  /** 对齐方式：顶部对齐 / 底部对齐（不足一屏的 Footer） */
  position: 'top top' | 'bottom bottom';
  /** 对应的文档绝对滚动位置，用于索引匹配 */
  y: number;
}

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 尊重系统「减少动态效果」设置：此时使用原生滚动，不做整屏吸附
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !wrapperRef.current || !contentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      smoothTouch: 0,
    });

    // 仅桌面精细指针设备启用整屏吸附；触摸端保留原生滚动
    if (!window.matchMedia('(pointer: fine)').matches) {
      return () => smoother.kill();
    }

    let points: SnapPoint[] = [];
    let current = 0;
    let locked = false;
    let wheelDelta = 0;
    let wheelTimer: number | undefined;
    let resizeTimer: number | undefined;
    let snapTween: gsap.core.Tween | null = null;

    const closestIndex = (y: number): number =>
      points.reduce(
        (best, point, i) => (Math.abs(point.y - y) < Math.abs(points[best].y - y) ? i : best),
        0,
      );

    const calcPoints = () => {
      const vh = window.innerHeight;
      const sections = gsap.utils.toArray<HTMLElement>(SNAP_SELECTOR);
      const defs: { target: HTMLElement; position: SnapPoint['position'] }[] = [];

      sections.forEach((section, i) => {
        const isLast = i === sections.length - 1;
        if (isLast && section.offsetHeight < vh) {
          // Footer 不足一屏：吸附到底部对齐
          defs.push({ target: section, position: 'bottom bottom' });
        } else {
          defs.push({ target: section, position: 'top top' });
          // 矮窗口下高于视口的区块（如知识库）：补一个底部对齐点，保证内容完整可达
          if (section.offsetHeight > vh * TALL_RATIO) {
            defs.push({ target: section, position: 'bottom bottom' });
          }
        }
      });

      points = defs
        .map((def) => ({
          ...def,
          y: Math.round(smoother.offset(def.target, def.position, true)),
        }))
        .sort((a, b) => a.y - b.y);
      current = closestIndex(window.scrollY);
    };

    // 自建 tween 逐帧调用官方即时定位 smoother.scrollTop(v)：
    // ① 不要 gsap.to(smoother,{scrollTop})——setter 内会二次驱动内部滚动，
    //    长距离吸附会衰减、落点少一截；
    // ② 不依赖 ScrollTrigger 'scrollEnd' 事件解锁——其速度启发式在快速手势下偶发不触发，
    //    onComplete 是确定性的解锁时机
    const moveTo = (index: number) => {
      const next = gsap.utils.clamp(0, points.length - 1, index);
      if (next === current) return;
      locked = true;
      current = next;

      const proxy = { v: window.scrollY };
      snapTween?.kill();
      snapTween = gsap.to(proxy, {
        v: points[next].y,
        duration: 0.9,
        ease: 'power3.inOut',
        onUpdate: () => smoother.scrollTop(proxy.v),
        onComplete: () => {
          snapTween = null;
          locked = false;
        },
      });
    };

    // 事件 target 可能是 document/window（合成事件、失焦按键），它们没有 closest
    const isFormTarget = (e: Event): boolean =>
      e.target instanceof Element && e.target.closest(FORM_CONTROL) !== null;

    const onWheel = (e: WheelEvent) => {
      if (isFormTarget(e)) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      // 始终拦截，防止 ScrollSmoother 吃到原生滚动产生位移
      e.preventDefault();
      if (locked) return;

      wheelDelta += e.deltaY;
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        wheelDelta = 0;
      }, WHEEL_RESET_MS);

      if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) return;
      const dir = wheelDelta > 0 ? 1 : -1;
      wheelDelta = 0;
      moveTo(current + dir);
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (isFormTarget(e)) return;

      let index: number | null = null;
      if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = points.length - 1;
      else if (e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowDown') index = current + 1;
      else if (e.key === 'PageUp' || e.key === 'ArrowUp') index = current - 1;

      if (index === null) return;
      e.preventDefault();
      if (!locked) moveTo(index);
    };

    // 拖拽滚动条/其他来源的原生滚动：只同步当前屏索引，不打断用户
    const onScroll = () => {
      if (!locked) current = closestIndex(window.scrollY);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(calcPoints, 150);
    };

    // 延一帧：等子区块 effect（ScrollTrigger、IO）与布局稳定
    const raf = requestAnimationFrame(calcPoints);
    ScrollTrigger.addEventListener('refresh', calcPoints);

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener('refresh', calcPoints);
      window.removeEventListener('wheel', onWheel, true);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(resizeTimer);
      snapTween?.kill();
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
            <TravelDisplay />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
