import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Github, Twitter, Linkedin } from 'lucide-react'
import logo from '../../assets/Images/logo.png'

const socials = [
  { icon: Github, href: 'https://github.com/nailuo' },
  { icon: Twitter, href: 'https://twitter.com/nailuo' },
  { icon: Linkedin, href: 'https://linkedin.com/in/nailuo' },
]

const navLinks = [
  { href: '#about', label: '关于' },
  { href: '#projects', label: '项目' },
  { href: '#blog', label: '博客' },
  { href: '#contact', label: '联系' },
]

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    gsap.fromTo(
      '.footer-content',
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    )
  }, { scope: containerRef })

  return (
    <footer
      ref={containerRef}
      className="py-10 md:py-12 px-5 md:px-8"
      style={{
        background: 'var(--bg-translucent)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto footer-content flex flex-col md:flex-row justify-between items-center gap-8">
        <a
          href="#home"
          className="flex items-center gap-2"
        >
          <img src={logo} alt="NaiLuo" className="h-8 md:h-9 w-auto object-contain" />
          <span
            className="text-base md:text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
          >
            NaiLuo
          </span>
        </a>

        <nav className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-3">
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--accent)',
                }}
                aria-label={social.href}
              >
                <Icon size={16} strokeWidth={1.5} />
              </a>
            )
          })}
        </div>
      </div>

      <p
        className="max-w-6xl mx-auto mt-8 text-center text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        © 2026 NaiLuo. 用 React、GSAP 与 Tailwind 构建。
      </p>
    </footer>
  )
}
