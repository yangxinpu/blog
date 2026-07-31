import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  Atom,
  Code2,
  Zap,
  Film,
  Box,
  Palette,
  Heart,
  Server,
} from 'lucide-react'

type IconType = typeof Atom

interface Skill {
  name: string
  level: number
  icon: IconType
  years: string
}

const skills: Skill[] = [
  { name: 'React', level: 95, icon: Atom, years: '4.5y' },
  { name: 'TypeScript', level: 92, icon: Code2, years: '4y' },
  { name: 'Vite', level: 88, icon: Zap, years: '3y' },
  { name: 'GSAP', level: 85, icon: Film, years: '3y' },
  { name: 'Three.js', level: 78, icon: Box, years: '2y' },
  { name: 'Tailwind CSS', level: 90, icon: Palette, years: '3y' },
  { name: 'Vue 3', level: 80, icon: Heart, years: '2y' },
  { name: 'Node.js', level: 76, icon: Server, years: '3y' },
]

export function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.fromTo(
      '.tech-headline',
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
      '.tech-cell',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tech-bento',
          start: 'top 75%',
          once: true,
        },
      }
    )
  }, { scope: containerRef })

  return (
    <section
      id="techstack"
      ref={containerRef}
      className="relative min-h-[100dvh] py-16 md:py-24 px-5 md:px-8 flex items-center"
      style={{ background: 'var(--bg-secondary-translucent)' }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <h2
          className="tech-headline font-bold mb-10 md:mb-14"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          技术栈
        </h2>

        <div
          className="tech-bento grid grid-cols-2 md:grid-cols-6 gap-px"
          style={{ background: 'var(--border-subtle)' }}
        >
          {skills.map((skill, i) => {
            const Icon = skill.icon
            const spanClass =
              i === 0 || i === 1
                ? 'md:col-span-3'
                : i === 2 || i === 3 || i === 4
                  ? 'md:col-span-2'
                  : i === 5
                    ? 'md:col-span-3'
                    : i === 6
                      ? 'md:col-span-1'
                      : 'md:col-span-2'
            const isHero = i === 0 || i === 1
            const isPattern = i === 5

            return (
              <div
                key={skill.name}
                className={`tech-cell p-4 md:p-8 flex flex-col justify-between min-h-[100px] md:min-h-[180px] ${spanClass}`}
                style={{
                  background: isHero
                    ? 'var(--accent-gradient-hero)'
                    : isPattern
                      ? 'var(--bg-tertiary)'
                      : 'var(--bg)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon size={24} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {skill.years}
                  </span>
                </div>

                <div className="mt-6">
                  <h3
                    className="font-semibold mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)',
                      fontSize: isHero ? 'clamp(1rem, 3vw, 1.5rem)' : 'clamp(0.85rem, 2.5vw, 1.1rem)',
                    }}
                  >
                    {skill.name}
                  </h3>

                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--accent)',
                        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {skill.level}
                      <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>%</span>
                    </span>
                    <span
                      className="h-[2px] rounded-full"
                      style={{
                        width: `${skill.level}%`,
                        maxWidth: '120px',
                        background: 'var(--accent)',
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
