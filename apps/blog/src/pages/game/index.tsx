import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

interface GameItem {
  name: string;
  image: string;
}

const GAMES: GameItem[] = [
  { name: '王者荣耀', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img9.png' },
  { name: '英雄联盟手游', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img3.png' },
  { name: '和平精英', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img8.png' },
  { name: '穿越火线', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img4.png' },
  { name: '三角洲行动', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img11-h.png' },
  { name: '无畏契约', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img12.png' },
  { name: '金铲铲之战', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img6.png' },
];

function Game() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.game-card');

    const ctx = gsap.context(() => {
      // 标题入场
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'restart none none none',
            },
          },
        );
      }

      // 卡片入场
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'restart none none none',
            },
          },
        );
      }
    }, sectionRef);

    // 居中卡片放大效果：根据卡片中心与容器中心的距离动态缩放
    const track = trackRef.current;
    const wrap = wrapRef.current;
    let updateScale: (() => void) | null = null;
    if (track && cards.length) {
      updateScale = () => {
        const wrapRect = wrap?.getBoundingClientRect() ?? track.getBoundingClientRect();
        const centerX = wrapRect.left + wrapRect.width / 2;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - centerX);
          const maxDistance = wrapRect.width / 2;
          const ratio = Math.min(distance / maxDistance, 1);
          const scale = 1 + (1 - ratio) * 0.3;
          card.style.transform = `scale(${scale})`;
        });
      };

      updateScale();
      track.addEventListener('scroll', updateScale, { passive: true });
      window.addEventListener('resize', updateScale);
    }

    // 滚轮转横向滚动：capture 阶段拦截，阻止 ScrollSmoother/整屏吸附吃掉事件
    const onWheel = (e: WheelEvent) => {
      if (!wrap) return;
      e.preventDefault();
      e.stopPropagation();
      wrap.scrollLeft += e.deltaY;
    };
    wrap?.addEventListener('wheel', onWheel, { passive: false, capture: true });

    // 触摸/指针拖拽横向滚动（小屏幕可用），区分点击与拖动
    let dragState: {
      pointerId: number;
      startX: number;
      startScrollLeft: number;
      dragging: boolean;
    } | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrap) return;
      dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScrollLeft: wrap.scrollLeft,
        dragging: false,
      };
      wrap.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!wrap || !dragState || dragState.pointerId !== e.pointerId) return;
      const deltaX = e.clientX - dragState.startX;
      if (!dragState.dragging) {
        // 首次判定：水平位移超过阈值才视为拖拽
        if (Math.abs(deltaX) > 6) {
          dragState.dragging = true;
        } else {
          return;
        }
      }
      e.preventDefault();
      e.stopPropagation();
      wrap.scrollLeft = dragState.startScrollLeft - deltaX;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!wrap || !dragState || dragState.pointerId !== e.pointerId) return;
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      // 若判定为拖拽，阻止 click 触发
      if (dragState.dragging) {
        e.preventDefault();
        e.stopPropagation();
      }
      dragState = null;
    };

    const onPointerCancel = () => {
      dragState = null;
    };

    wrap?.addEventListener('pointerdown', onPointerDown, { capture: true });
    wrap?.addEventListener('pointermove', onPointerMove, { passive: false, capture: true });
    wrap?.addEventListener('pointerup', onPointerUp, { capture: true });
    wrap?.addEventListener('pointercancel', onPointerCancel, { capture: true });

    return () => {
      ctx.revert();
      wrap?.removeEventListener('wheel', onWheel, { capture: true });
      wrap?.removeEventListener('pointerdown', onPointerDown, { capture: true });
      wrap?.removeEventListener('pointermove', onPointerMove, { capture: true });
      wrap?.removeEventListener('pointerup', onPointerUp, { capture: true });
      wrap?.removeEventListener('pointercancel', onPointerCancel, { capture: true });
      if (updateScale) {
        track?.removeEventListener('scroll', updateScale);
        window.removeEventListener('resize', updateScale);
      }
    };
  }, []);

  return (
    <section className="game-section" ref={sectionRef}>
      <video
        className="game-bg-video"
        src="https://game.igcdn.cn/Ggame/videos/video1.94041431.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="game-overlay" />

      <div className="game-content">
        <h2 className="game-title" ref={titleRef}>
          <span className="game-title-accent">我喜欢的</span>
          <span className="game-title-blue">游戏</span>
        </h2>

        <div className="game-track-wrap" ref={wrapRef}>
          <div className="game-track" ref={trackRef}>
            {GAMES.map((game) => (
              <div className="game-card" key={game.name}>
                <img
                  src={game.image}
                  alt={game.name}
                  loading="eager"
                  className="game-card-img"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Game;
