import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './index.css';
import TravelMarquee, { type MarqueeRow } from './components/travel-marquee';
import { travelImages } from '../../assets/travel';

// 三行无限滚动海报墙：速度各不相同，中间行反向；行高自上而下递减，前两行卡片更宽
const marqueeRows: MarqueeRow[] = [
  { images: travelImages.slice(0, 4), duration: 75, widthScale: 1.22 },
  { images: travelImages.slice(4, 8), duration: 100, reverse: true, widthScale: 1.12 },
  { images: travelImages.slice(8, 12), duration: 85 },
];

export default function TravelDisplay() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // 整屏切换模式下不再 pin（每屏天然钉住）：
    // 文案在海报屏进入视口时从更下方大幅上滑淡入，完全离开后复位，再次进入可重播
    const tween = gsap.fromTo(
      overlay,
      { autoAlpha: 0, y: 100 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', paused: true },
    );

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tween.play();
        else tween.pause(0);
      },
      { threshold: 0.45 },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="travel-display">
      <TravelMarquee rows={marqueeRows} />

      {/* 纯色压暗层，保证文字可读 */}
      <div className="travel-display__scrim" />
      {/* 底部黑色阴影：海报向底部渐隐，承托文字浮层 */}
      <div className="travel-display__shade" />

      <div ref={overlayRef} className="travel-display__overlay">
        <h1 className="travel-display__title">
          <span>Nature</span>{' '}
          <span className="travel-display__title-grad">and</span>{' '}
          <span className="travel-display__title-life">Life</span>
        </h1>
        <p className="travel-display__subtitle">所有的出发，都是为了更好的回来 —— All departures are for a better comeback.</p>
      </div>
    </section>
  );
}
