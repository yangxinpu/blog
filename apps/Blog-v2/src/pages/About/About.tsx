import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '4.5+', label: '年前端经验' },
  { value: '80+', label: '上线项目' },
  { value: '12', label: '开源仓库' },
  { value: '3.2k', label: '社区 stars' },
]

const focus = [
  '现代 Web 架构与组件设计',
  'GSAP 滚动动效与微交互',
  '渲染性能与首屏优化',
  'TypeScript 类型系统实践',
]

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-headline',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.about-body',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-body',
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.about-stat',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.about-focus-item',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-focus',
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-[100dvh] py-20 md:py-24 px-5 md:px-8 flex items-center"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
        <div className="md:col-span-7">
          <h2
            className="about-headline font-bold mb-8 md:mb-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            关于我
          </h2>

          <div className="about-body space-y-5 max-w-xl">
            <p
              className="text-base md:text-xl leading-relaxed"
              style={{ color: 'var(--text)' }}
            >
              我是 NaiLuo，一名前端工程师。过去四年多里，我用 React、TypeScript 和 GSAP
              把设计稿翻译成可交互的产品界面，也负责维护几个内部组件库。
            </p>
            <p
              className="text-sm md:text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              更在意的事情：组件边界是否清晰、首屏渲染是否够快、动效是否服务于内容
              而不是干扰它。代码写得慢一点没关系，能被读懂才重要。
            </p>
          </div>

          <ul className="about-focus mt-8 md:mt-10 space-y-3">
            {focus.map((item) => (
              <li
                key={item}
                className="about-focus-item flex items-baseline gap-4 text-sm md:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span
                  className="font-mono text-xs shrink-0"
                  style={{ color: 'var(--accent)', opacity: 0.7 }}
                >
                  /
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <div
            className="about-stats grid grid-cols-2 gap-px"
            style={{ background: 'var(--border-subtle)' }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="about-stat p-5 md:p-8"
                style={{ background: 'var(--bg)' }}
              >
                <div
                  className="font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                    lineHeight: 1,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs md:text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}