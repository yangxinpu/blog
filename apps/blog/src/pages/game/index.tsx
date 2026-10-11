import { useCallback, useEffect, useRef } from 'react';
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

  // cover-flow 效果：根据卡片中心与容器中心的距离动态缩放/透明度/z-index
  const applyCoverFlow = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!track) return;
    const cards = gsap.utils.toArray<HTMLElement>('.game-card');
    if (!cards.length) return;

    const wrapRect = wrap?.getBoundingClientRect() ?? track.getBoundingClientRect();
    const centerX = wrapRect.left + wrapRect.width / 2;
    const maxDistance = wrapRect.width / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      const ratio = Math.min(distance / maxDistance, 1);
      // 中心卡片最大 (1.12)，边缘最小 (0.78)
      const scale = 1.12 - ratio * 0.34;
      // 中心不透明，边缘半透明
      const opacity = 1 - ratio * 0.55;
      // 中心卡片层级最高
      const zIndex = Math.round((1 - ratio) * 100);
      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);
    });
  }, []);

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
            onComplete: () => {
              // 入场动画结束后清除 GSAP 写入的 transform/opacity，交由 cover-flow 接管
              cards.forEach((card) => {
                gsap.set(card, { clearProps: 'transform,opacity' });
              });
              applyCoverFlow();
            },
          },
        );
      }
    }, sectionRef);

    const track = trackRef.current;
    const wrap = wrapRef.current;

    if (track && cards.length) {
      applyCoverFlow();
      track.addEventListener('scroll', applyCoverFlow, { passive: true });
      window.addEventListener('resize', applyCoverFlow);
    }

    // 触摸/指针拖拽横向滚动，区分点击与拖动
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
      // 不在此处 setPointerCapture，避免点击时 click target 被劫持到 wrap
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!wrap || !dragState || dragState.pointerId !== e.pointerId) return;
      const deltaX = e.clientX - dragState.startX;
      if (!dragState.dragging) {
        // 首次判定：水平位移超过阈值才视为拖拽
        if (Math.abs(deltaX) > 6) {
          dragState.dragging = true;
          // 确认拖拽后才捕获指针，保证后续 move/up 都发到 wrap
          try {
            wrap.setPointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
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
      if (dragState.dragging) {
        try {
          wrap.releasePointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
        // 拖拽结束：阻止 click 触发，避免误触卡片选中
        e.preventDefault();
        e.stopPropagation();
      }
      dragState = null;
    };

    const onPointerCancel = () => {
      dragState = null;
    };

    wrap?.addEventListener('pointerdown', onPointerDown);
    wrap?.addEventListener('pointermove', onPointerMove, { passive: false });
    wrap?.addEventListener('pointerup', onPointerUp);
    wrap?.addEventListener('pointercancel', onPointerCancel);

    return () => {
      ctx.revert();
      wrap?.removeEventListener('pointerdown', onPointerDown);
      wrap?.removeEventListener('pointermove', onPointerMove);
      wrap?.removeEventListener('pointerup', onPointerUp);
      wrap?.removeEventListener('pointercancel', onPointerCancel);
      track?.removeEventListener('scroll', applyCoverFlow);
      window.removeEventListener('resize', applyCoverFlow);
    };
  }, [applyCoverFlow]);

  // 点击卡片：滚动到容器正中
  const handleCardClick = useCallback((index: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = gsap.utils.toArray<HTMLElement>('.game-card');
    const card = cards[index];
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (wrapRect.left + wrapRect.width / 2);
    wrap.scrollBy({ left: delta, behavior: 'smooth' });
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
            {GAMES.map((game, index) => (
              <div
                className="game-card"
                key={game.name}
                onClick={() => handleCardClick(index)}
              >
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
