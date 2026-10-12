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
  { name: '王者荣耀', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img1.png' },
  { name: '英雄联盟手游', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img3.png' },
  { name: '和平精英', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img2.png' },
  { name: '穿越火线', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img4.png' },
  { name: '三角洲行动', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img11.png' },
  { name: '无畏契约', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img12.png' },
  { name: '金铲铲之战', image: 'https://game.gtimg.cn/images/game/web202406/imgs_pc/home/part1-swp-img6.png' },
];

const LOOP_COPIES = 3;
const CENTER_COPY_INDEX = 1;
const LOOPED_GAMES = Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
  GAMES.map((game, itemIndex) => ({
    ...game,
    itemIndex,
    copyIndex,
  })),
).flat();

function Game() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<number | undefined>(undefined);
  const initLoopRef = useRef(false);

  const normalizeLoop = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return 0;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('.game-card'));
    if (cards.length < GAMES.length * LOOP_COPIES) return 0;

    const firstCopyCard = cards[0];
    const middleCopyCard = cards[GAMES.length * CENTER_COPY_INDEX];
    if (!firstCopyCard || !middleCopyCard) return 0;

    const cycleWidth = middleCopyCard.offsetLeft - firstCopyCard.offsetLeft;
    if (cycleWidth <= 0) return 0;

    const viewportCenter = wrap.scrollLeft + wrap.clientWidth / 2;
    const middleStartCenter = middleCopyCard.offsetLeft + middleCopyCard.offsetWidth / 2;
    const lowerBoundary = middleStartCenter - cycleWidth / 2;
    const upperBoundary = middleStartCenter + cycleWidth * 1.5;
    let adjustment = 0;

    if (viewportCenter < lowerBoundary) {
      adjustment = cycleWidth;
    } else if (viewportCenter >= upperBoundary) {
      adjustment = -cycleWidth;
    }

    if (adjustment !== 0) {
      wrap.scrollLeft += adjustment;
    }

    return adjustment;
  }, []);

  const centerRenderedCard = useCallback((renderIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('.game-card'));
    const card = cards[renderIndex];
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (wrapRect.left + wrapRect.width / 2);

    if (behavior === 'auto') {
      wrap.scrollLeft += delta;
      normalizeLoop();
      return;
    }

    wrap.scrollBy({ left: delta, behavior });
  }, [normalizeLoop]);

  // cover-flow 效果：根据卡片中心与容器中心的距离动态缩放/透明度/z-index
  const applyCoverFlow = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('.game-card'));
    if (!cards.length) return;

    const wrapRect = wrap.getBoundingClientRect();
    const centerX = wrapRect.left + wrapRect.width / 2;
    const maxDistance = Math.max(wrapRect.width / 2, 1);

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      const ratio = Math.min(distance / maxDistance, 1);
      // 中心卡片横向更宽，纵向保持克制，避免重新把卡片视觉高度拉高
      const scaleX = 1.24 - ratio * 0.44;
      const scaleY = 1.12 - ratio * 0.34;
      // 中心不透明，边缘半透明
      const opacity = 1 - ratio * 0.55;
      // 中心卡片层级最高
      const zIndex = Math.round((1 - ratio) * 100);
      card.style.transform = `scale(${scaleX}, ${scaleY})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = Array.from(section.querySelectorAll<HTMLElement>('.game-card'));

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

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

      // 卡片内容入场：只动画内层，避免覆盖 cover-flow 写在 .game-card 上的 transform
      if (cards.length) {
        const cardReveals = Array.from(
          section.querySelectorAll<HTMLElement>('.game-card-reveal'),
        );

        gsap.fromTo(
          cardReveals,
          {
            y: 42,
            opacity: 0,
            filter: 'blur(14px)',
            rotateX: -10,
            transformOrigin: '50% 100%',
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            rotateX: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: {
              amount: 0.38,
              from: 'center',
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'restart none none none',
            },
            onComplete: () => {
              cardReveals.forEach((reveal) => {
                gsap.set(reveal, { clearProps: 'transform,opacity,filter,transformOrigin' });
              });
              applyCoverFlow();
            },
          },
        );
      }
    }, sectionRef);

    const wrap = wrapRef.current;
    if (!wrap) return () => ctx.revert();

    const initLoop = () => {
      if (!initLoopRef.current) {
        initLoopRef.current = true;
        centerRenderedCard(GAMES.length * CENTER_COPY_INDEX, 'auto');
      }
      applyCoverFlow();
    };

    const raf = requestAnimationFrame(initLoop);
    const onScroll = () => {
      normalizeLoop();
      applyCoverFlow();
    };

    const onResize = () => {
      normalizeLoop();
      applyCoverFlow();
    };

    // 触摸/指针拖拽横向滚动，区分点击与拖动
    let dragState: {
      pointerId: number;
      startX: number;
      startY: number;
      startScrollLeft: number;
      dragging: boolean;
    } | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrap) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startScrollLeft: wrap.scrollLeft,
        dragging: false,
      };
      // 不在此处 setPointerCapture，避免点击时 click target 被劫持到 wrap
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!wrap || !dragState || dragState.pointerId !== e.pointerId) return;
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (!dragState.dragging) {
        // 垂直意图交给页面滚动；只有明确横向移动才接管走马灯
        if (absY > 8 && absY > absX) {
          dragState = null;
          return;
        }

        if (absX > 8 && absX > absY) {
          dragState.dragging = true;
          wrap.classList.add('is-dragging');
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
      dragState.startScrollLeft += normalizeLoop();
      applyCoverFlow();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!wrap || !dragState || dragState.pointerId !== e.pointerId) return;
      if (dragState.dragging) {
        wrap.classList.remove('is-dragging');
        try {
          wrap.releasePointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
        // 拖拽结束：阻止 click 触发，避免误触卡片选中
        e.preventDefault();
        e.stopPropagation();
        suppressClickRef.current = true;
        window.clearTimeout(suppressClickTimerRef.current);
        suppressClickTimerRef.current = window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 120);
      }
      dragState = null;
    };

    const onPointerCancel = () => {
      wrap?.classList.remove('is-dragging');
      dragState = null;
    };

    const onWheel = (e: WheelEvent) => {
      // 走马灯只支持拖动与点击滚动，不响应横向滚轮/触控板平移。
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove, { passive: false });
    wrap.addEventListener('pointerup', onPointerUp);
    wrap.addEventListener('pointercancel', onPointerCancel);
    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
      window.clearTimeout(suppressClickTimerRef.current);
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('pointercancel', onPointerCancel);
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [applyCoverFlow, centerRenderedCard, normalizeLoop]);

  // 点击卡片：滚动到容器正中
  const handleCardClick = useCallback((renderIndex: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    const wrap = wrapRef.current;
    if (!wrap) return;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('.game-card'));
    const itemIndex = renderIndex % GAMES.length;
    const viewportCenter = wrap.getBoundingClientRect().left + wrap.clientWidth / 2;
    const candidateIndex = [0, 1, 2]
      .map((copyIndex) => copyIndex * GAMES.length + itemIndex)
      .reduce((closest, current) => {
        const closestCard = cards[closest];
        const currentCard = cards[current];
        if (!closestCard || !currentCard) return closest;

        const closestRect = closestCard.getBoundingClientRect();
        const currentRect = currentCard.getBoundingClientRect();
        const closestDistance = Math.abs(closestRect.left + closestRect.width / 2 - viewportCenter);
        const currentDistance = Math.abs(currentRect.left + currentRect.width / 2 - viewportCenter);
        return currentDistance < closestDistance ? current : closest;
      }, GAMES.length * CENTER_COPY_INDEX + itemIndex);

    centerRenderedCard(candidateIndex);

    let frames = 0;
    const followSmoothScroll = () => {
      normalizeLoop();
      applyCoverFlow();
      frames += 1;
      if (frames < 36) requestAnimationFrame(followSmoothScroll);
    };
    requestAnimationFrame(followSmoothScroll);
  }, [applyCoverFlow, centerRenderedCard, normalizeLoop]);

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
          <div className="game-track">
            {LOOPED_GAMES.map((game, index) => (
              <div
                className="game-card"
                key={`${game.copyIndex}-${game.itemIndex}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="game-card-reveal">
                  <img
                    src={game.image}
                    alt={game.copyIndex === CENTER_COPY_INDEX ? game.name : ''}
                    aria-hidden={game.copyIndex !== CENTER_COPY_INDEX}
                    loading="eager"
                    className="game-card-img"
                    draggable={false}
                    onLoad={applyCoverFlow}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Game;
