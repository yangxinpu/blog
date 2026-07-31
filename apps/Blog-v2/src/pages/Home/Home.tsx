import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const HERO_IMAGE_URL =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'abstract 3d geometric wireframe shapes and flowing data particles in teal cyan on near black background, modern developer aesthetic, depth of field, cinematic'
  ) +
  '&image_size=landscape_16_9'

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

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

      gsap.set(spans, { y: 24 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
      })
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
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
    },
    { scope: containerRef }
  )

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const visual = containerRef.current?.querySelector('[data-hero-visual]') as HTMLElement | null
    if (!visual) return

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const xPercent = (e.clientX / innerWidth - 0.5) * 2
      const yPercent = (e.clientY / innerHeight - 0.5) * 2
      gsap.to(visual, {
        x: xPercent * 12,
        y: yPercent * 8,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <div className="relative z-10 min-h-[100dvh] flex items-center pt-24 md:pt-28 pb-16 px-5 md:px-8">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Text */}
          <div>
            <p
              ref={roleRef}
              className="text-sm md:text-base mb-4 md:mb-5 font-medium tracking-wide"
              style={{ color: 'var(--accent)' }}
            >
              前端工程师 / 动效开发
            </p>

            <h1
              ref={titleRef}
              data-text="NaiLuo"
              className="font-bold mb-5 md:mb-7 leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text)',
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                letterSpacing: '-0.04em',
              }}
            >
              NaiLuo
            </h1>

            <p
              ref={subRef}
              className="text-base md:text-lg xl:text-xl leading-relaxed mb-7 md:mb-9 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              用 React 与 TypeScript 构建可交互的界面，用 GSAP 编排有节奏的动效。
              关注组件结构、渲染性能与细节反馈。
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                className="btn-primary w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                查看项目
              </button>
              <a
                href="https://github.com/nailuo"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <div
              data-hero-visual
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={HERO_IMAGE_URL}
                alt="抽象几何线框与流动粒子构成的开发者视觉"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'var(--hero-overlay)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
