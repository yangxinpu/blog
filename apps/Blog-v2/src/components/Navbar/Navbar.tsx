import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/Images/logo.png'

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'techstack', label: '技术' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const activeSectionRef = useRef('home')
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsScrolled(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId = activeSectionRef.current
        let bestRatio = 0
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = entry.target.id
          }
        }
        if (bestRatio > 0 && bestId !== activeSectionRef.current) {
          activeSectionRef.current = bestId
          setActiveSection(bestId)
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navBgStyle = isScrolled
    ? { background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }
    : { background: 'transparent', backdropFilter: 'none', borderBottom: 'none' }

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top"
        style={{ height: '64px', ...navBgStyle }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('home')
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <img src={logo} alt="NaiLuo" className="h-8 md:h-9 w-auto object-contain" />
            <span
              className="text-lg md:text-xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
            >
              NaiLuo
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7 h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm transition-colors duration-200 whitespace-nowrap relative py-1"
                style={{
                  color: activeSection === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-transform duration-300 origin-center"
                  style={{
                    background: 'var(--accent)',
                    transform: activeSection === item.id ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg transition-colors shrink-0"
            style={{ color: 'var(--text)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="切换菜单"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed top-[64px] left-0 right-0 bottom-0 safe-bottom overflow-y-auto"
            style={{
              background: 'var(--navbar-bg-mobile)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col px-5 py-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left py-4 text-lg font-medium transition-colors duration-200 border-b"
                  style={{
                    color: activeSection === item.id ? 'var(--accent)' : 'var(--text)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
