import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Github, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const channels = [
  { icon: Mail, label: 'Email', value: 'nailuo@example.com', href: 'mailto:nailuo@example.com' },
  { icon: Github, label: 'GitHub', value: '@nailuo', href: 'https://github.com/nailuo' },
]

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-headline',
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
        '.contact-channel',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-channels',
            start: 'top 80%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.contact-form',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-[100dvh] py-16 md:py-24 px-5 md:px-8 flex items-center"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-3xl mx-auto w-full text-center">
        <h2
          className="contact-headline font-bold mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 8vw, 5.5rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            color: 'var(--text)',
          }}
        >
          一起做点东西
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          有项目想法、合作意向或技术问题，发邮件或在 GitHub 上找我。
          通常 24 小时内回复。
        </p>

        {/* Channels: minimal inline, not cards */}
        <div className="contact-channels flex flex-wrap justify-center gap-4 md:gap-8 mb-10 md:mb-14">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="contact-channel inline-flex items-center gap-2.5 transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Icon size={18} style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
                <span className="text-sm md:text-base">{channel.value}</span>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
              </a>
            )
          })}
        </div>

        {/* Minimal form */}
        <form
          className="contact-form max-w-xl mx-auto text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="你的邮箱"
              required
              className="flex-1 px-4 md:px-5 py-3 md:py-3.5 rounded-full outline-none transition-all duration-300"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <button
              type="submit"
              className="px-5 md:px-7 py-3 md:py-3.5 rounded-full font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg)',
                boxShadow: '0 0 24px rgba(25, 250, 198, 0.2)',
              }}
            >
              发送消息
            </button>
          </div>
          <textarea
            placeholder="简单说说你的想法"
            rows={3}
            className="w-full mt-3 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl outline-none transition-all duration-300 resize-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </form>
      </div>
    </section>
  )
}
