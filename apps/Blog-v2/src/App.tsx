import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Home } from './pages/Home/Home'
import { FluidBackground, type FluidParams } from './components/FluidBackground/FluidBackground'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lightfall Narrative — React Bits Lightfall 风格流式光束叙事
 *
 * 单 WebGL 光束引擎（对齐 reactbits.dev/backgrounds/lightfall），
 * GSAP timeline 基于滚动进度动画 shader uniform，
 * 使光束在 6 个 section 中呈现连续的向上运动形态演变：
 *   A 静谧晨露 → B 急流骤升 → C 侧向风涌 → D 凝固星芒 → E 极光射流 → F 星云升腾
 */

// A：首屏 — 稀疏、缓慢上升
const PARAMS_A: FluidParams = {
  speed: 0.5,
  streakCount: 1,
  streakWidth: 1,
  streakLength: 1,
  glow: 1,
  density: 0.4,
  twinkle: 1,
  zoom: 3.5,
  backgroundGlow: 0.5,
}

// B：急流骤升 Turbulent Rise — 快速、中等稀疏、明亮
const PARAMS_B: FluidParams = {
  speed: 1.8,
  streakCount: 2,
  streakWidth: 1.2,
  streakLength: 1.2,
  glow: 1.2,
  density: 0.7,
  twinkle: 1.5,
  zoom: 2.8,
  backgroundGlow: 0.8,
}

// C：侧向风涌 Crosswind Surge — 宽光束、中速、稀疏
const PARAMS_C: FluidParams = {
  speed: 0.9,
  streakCount: 2,
  streakWidth: 2.0,
  streakLength: 1.5,
  glow: 0.9,
  density: 0.5,
  twinkle: 0.6,
  zoom: 3.2,
  backgroundGlow: 0.6,
}

// D：凝固星芒 Frozen Stardust — 极慢、稀疏、尖锐短尾
const PARAMS_D: FluidParams = {
  speed: 0.15,
  streakCount: 1,
  streakWidth: 0.8,
  streakLength: 0.4,
  glow: 1.1,
  density: 0.25,
  twinkle: 0.2,
  zoom: 4.5,
  backgroundGlow: 0.9,
}

// E：极光射流 Aurora Jets — 强上升、高闪烁、中等稀疏
const PARAMS_E: FluidParams = {
  speed: 0.8,
  streakCount: 2,
  streakWidth: 1.0,
  streakLength: 0.8,
  glow: 1.3,
  density: 0.6,
  twinkle: 2.0,
  zoom: 2.3,
  backgroundGlow: 1.0,
}

// F：星云升腾 Nebula Ascent — 超宽、极慢、极柔、极稀疏
const PARAMS_F: FluidParams = {
  speed: 0.2,
  streakCount: 1,
  streakWidth: 3.0,
  streakLength: 2.0,
  glow: 0.6,
  density: 0.2,
  twinkle: 0.3,
  zoom: 4.0,
  backgroundGlow: 0.4,
}

const SECTIONS = [
  { id: 'section-0', label: '静谧晨露', en: 'Calm Dew' },
  { id: 'section-1', label: '急流骤升', en: 'Turbulent Rise' },
  { id: 'section-2', label: '侧向风涌', en: 'Crosswind Surge' },
  { id: 'section-3', label: '凝固星芒', en: 'Frozen Stardust' },
  { id: 'section-4', label: '极光射流', en: 'Aurora Jets' },
  { id: 'section-5', label: '星云升腾', en: 'Nebula Ascent' },
] as const

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const paramsRef = useRef<FluidParams>({ ...PARAMS_A })

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const p = paramsRef.current

      // Scroll-driven timeline animating Lightfall shader parameters
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
        },
      })

      // A → B: 20%~42% (calm dew → turbulent shower)
      tl.to(p, {
        speed: PARAMS_B.speed,
        streakCount: PARAMS_B.streakCount,
        streakWidth: PARAMS_B.streakWidth,
        streakLength: PARAMS_B.streakLength,
        glow: PARAMS_B.glow,
        density: PARAMS_B.density,
        twinkle: PARAMS_B.twinkle,
        zoom: PARAMS_B.zoom,
        backgroundGlow: PARAMS_B.backgroundGlow,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.2)

      // B → C: 42%~65% (turbulent → crosswind)
      tl.to(p, {
        speed: PARAMS_C.speed,
        streakCount: PARAMS_C.streakCount,
        streakWidth: PARAMS_C.streakWidth,
        streakLength: PARAMS_C.streakLength,
        glow: PARAMS_C.glow,
        density: PARAMS_C.density,
        twinkle: PARAMS_C.twinkle,
        zoom: PARAMS_C.zoom,
        backgroundGlow: PARAMS_C.backgroundGlow,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.42)

      // C → D: 65%~83% (crosswind → frozen stardust)
      tl.to(p, {
        speed: PARAMS_D.speed,
        streakCount: PARAMS_D.streakCount,
        streakWidth: PARAMS_D.streakWidth,
        streakLength: PARAMS_D.streakLength,
        glow: PARAMS_D.glow,
        density: PARAMS_D.density,
        twinkle: PARAMS_D.twinkle,
        zoom: PARAMS_D.zoom,
        backgroundGlow: PARAMS_D.backgroundGlow,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.65)

      // D → E: 83%~91% (frozen → aurora)
      tl.to(p, {
        speed: PARAMS_E.speed,
        streakCount: PARAMS_E.streakCount,
        streakWidth: PARAMS_E.streakWidth,
        streakLength: PARAMS_E.streakLength,
        glow: PARAMS_E.glow,
        density: PARAMS_E.density,
        twinkle: PARAMS_E.twinkle,
        zoom: PARAMS_E.zoom,
        backgroundGlow: PARAMS_E.backgroundGlow,
        duration: 0.12,
        ease: 'power2.inOut',
      }, 0.83)

      // E → F: 91%~100% (aurora → nebula)
      tl.to(p, {
        speed: PARAMS_F.speed,
        streakCount: PARAMS_F.streakCount,
        streakWidth: PARAMS_F.streakWidth,
        streakLength: PARAMS_F.streakLength,
        glow: PARAMS_F.glow,
        density: PARAMS_F.density,
        twinkle: PARAMS_F.twinkle,
        zoom: PARAMS_F.zoom,
        backgroundGlow: PARAMS_F.backgroundGlow,
        duration: 0.12,
        ease: 'power2.inOut',
      }, 0.91)

      // Section labels: fade in while scrolling
      SECTIONS.forEach((_, i) => {
        gsap.fromTo(
          `.section-label-${i}`,
          { opacity: 0, y: 20 },
          {
            opacity: 0.2,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: `#section-${i}`,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.5,
            },
          }
        )
      })
    },
    { scope: containerRef }
  )

  return (
    <div className="app" ref={containerRef}>
      {/* Single Lightfall engine — params animated by GSAP scroll timeline */}
      <FluidBackground
        paramsRef={paramsRef}
        colors={['#E6FFF8', '#17FBC6', '#086550']}
        backgroundColor="#0a2a26"
        mouseStrength={0.5}
        mouseRadius={1}
      />

      <main>
        {/* Section 0: Calm Dew + Hero content */}
        <section
          id="section-0"
          className="relative min-h-[100dvh]"
          style={{ zIndex: 1 }}
        >
          <Home />
        </section>

        {/* Section 1: Turbulent Rise */}
        <section
          id="section-1"
          className="relative min-h-[100dvh] flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="section-label-1 text-center flex flex-col items-center gap-2">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              {SECTIONS[1].label}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: "'SF Mono', Monaco, monospace" }}
            >
              02 — {SECTIONS[1].en}
            </span>
          </div>
        </section>

        {/* Section 2: Crosswind Surge */}
        <section
          id="section-2"
          className="relative min-h-[100dvh] flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="section-label-2 text-center flex flex-col items-center gap-2">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              {SECTIONS[2].label}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: "'SF Mono', Monaco, monospace" }}
            >
              03 — {SECTIONS[2].en}
            </span>
          </div>
        </section>

        {/* Section 3: Frozen Stardust */}
        <section
          id="section-3"
          className="relative min-h-[100dvh] flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="section-label-3 text-center flex flex-col items-center gap-2">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              {SECTIONS[3].label}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: "'SF Mono', Monaco, monospace" }}
            >
              04 — {SECTIONS[3].en}
            </span>
          </div>
        </section>

        {/* Section 4: Aurora Jets */}
        <section
          id="section-4"
          className="relative min-h-[100dvh] flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="section-label-4 text-center flex flex-col items-center gap-2">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              {SECTIONS[4].label}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: "'SF Mono', Monaco, monospace" }}
            >
              05 — {SECTIONS[4].en}
            </span>
          </div>
        </section>

        {/* Section 5: Nebula Ascent */}
        <section
          id="section-5"
          className="relative min-h-[100dvh] flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="section-label-5 text-center flex flex-col items-center gap-2">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              {SECTIONS[5].label}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: "'SF Mono', Monaco, monospace" }}
            >
              06 — {SECTIONS[5].en}
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App