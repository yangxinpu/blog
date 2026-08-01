import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const title = titleRef.current
      if (!title) return

      const text = title.dataset.text ?? ''
      title.textContent = ''
      const chars = text.split('')
      const spans: HTMLSpanElement[] = []
      chars.forEach((ch) => {
        const span = document.createElement('span')
        span.textContent = ch
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        title.appendChild(span)
        spans.push(span)
      })

      gsap.set(spans, { y: 28 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
      })
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.35'
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.2'
        )
    },
    { scope: containerRef }
  )

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const tween = gsap.to(scrollRef.current, {
      y: 8,
      duration: 1.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      {/* 文字背后的径向暗化，保证可读性 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at center, rgba(10, 10, 10, 0.55) 0%, rgba(10, 10, 10, 0.25) 45%, transparent 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-24 text-center flex flex-col items-center">
        <p
          ref={roleRef}
          className="text-xs md:text-sm mb-5 md:mb-7 font-medium tracking-[0.25em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          前端工程师 / 动效开发
        </p>

        <h1
          ref={titleRef}
          data-text="NaiLuo"
          className="font-bold mb-6 md:mb-8 leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
            fontSize: 'clamp(3.5rem, 14vw, 8rem)',
            letterSpacing: '-0.045em',
            textShadow: '0 0 60px rgba(23, 251, 198, 0.15)',
          }}
        >
          NaiLuo
        </h1>

        <p
          ref={subRef}
          className="text-base md:text-lg xl:text-xl leading-relaxed mb-9 md:mb-11 max-w-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          用 React 与 TypeScript 构建可交互的界面，用 GSAP 编排有节奏的动效。
          关注组件结构、渲染性能与细节反馈。
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <a
            href="https://github.com/nailuo"
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div
        ref={scrollRef}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={16} strokeWidth={1.5} />
      </div>
    </section>
  )
}
