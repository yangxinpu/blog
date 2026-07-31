import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Home } from './pages/Home/Home'
import { FluidBackground, type FluidParams } from './components/FluidBackground/FluidBackground'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fluid Motion Narrative — 流体运动叙事
 *
 * 单一 WebGL 流体引擎，GSAP timeline 基于滚动进度动画 shader uniform，
 * 使流体在 6 个 section 中呈现连续的运动形态演变：
 *   A 静谧流动 → B 湍流漩涡 → C 波浪涌动 → D 结晶凝固 → E 极光散射 → F 星云归寂
 */

const PARAMS_A: FluidParams = {
  speed: 0.3,
  scale: 1.8,
  turbulence: 0.6,
  fluidity: 0.1,
  rimWidth: 0.3,
  sharpness: 2.0,
  shimmer: 0.8,
  glow: 0.7,
  flowX: 0,
  flowY: -1,
}

const PARAMS_B: FluidParams = {
  speed: 0.8,
  scale: 1.2,
  turbulence: 2.2,
  fluidity: 0.15,
  rimWidth: 0.18,
  sharpness: 3.5,
  shimmer: 2.0,
  glow: 0.9,
  flowX: 0,
  flowY: -1,
}

const PARAMS_C: FluidParams = {
  speed: 0.45,
  scale: 2.2,
  turbulence: 0.7,
  fluidity: 0.08,
  rimWidth: 0.55,
  sharpness: 1.5,
  shimmer: 0.3,
  glow: 0.6,
  flowX: -1,
  flowY: 0,
}

const PARAMS_D: FluidParams = {
  speed: 0.12,
  scale: 2.8,
  turbulence: 0.25,
  fluidity: 0.05,
  rimWidth: 0.08,
  sharpness: 6.0,
  shimmer: 0.1,
  glow: 1.0,
  flowX: 0,
  flowY: -1,
}

const PARAMS_E: FluidParams = {
  speed: 0.2,
  scale: 2.4,
  turbulence: 1.2,
  fluidity: 0.12,
  rimWidth: 0.12,
  sharpness: 3.5,
  shimmer: 1.8,
  glow: 0.85,
  flowX: 1,
  flowY: 1,
}

const PARAMS_F: FluidParams = {
  speed: 0.08,
  scale: 3.5,
  turbulence: 0.15,
  fluidity: 0.04,
  rimWidth: 0.7,
  sharpness: 1.0,
  shimmer: 0.2,
  glow: 0.5,
  flowX: 0.3,
  flowY: -0.2,
}

const SECTIONS = [
  { id: 'section-0', label: '静谧流动', en: 'Calm Flow' },
  { id: 'section-1', label: '湍流漩涡', en: 'Turbulent Vortex' },
  { id: 'section-2', label: '波浪涌动', en: 'Wave Surge' },
  { id: 'section-3', label: '结晶凝固', en: 'Crystallization' },
  { id: 'section-4', label: '极光散射', en: 'Aurora Scatter' },
  { id: 'section-5', label: '星云归寂', en: 'Nebula Serenity' },
] as const

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const paramsRef = useRef<FluidParams>({ ...PARAMS_A })

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const p = paramsRef.current

      // Scroll-driven timeline animating fluid parameters
      // Timeline position = scroll progress (0 → 1)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
        },
      })

      // A → B: 20%~42% transition (turbulence surge, sharpening)
      tl.to(p, {
        speed: PARAMS_B.speed,
        turbulence: PARAMS_B.turbulence,
        scale: PARAMS_B.scale,
        sharpness: PARAMS_B.sharpness,
        shimmer: PARAMS_B.shimmer,
        glow: PARAMS_B.glow,
        rimWidth: PARAMS_B.rimWidth,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.2)

      // B → C: 42%~65% transition (calm, widen, shift to horizontal flow)
      tl.to(p, {
        speed: PARAMS_C.speed,
        turbulence: PARAMS_C.turbulence,
        scale: PARAMS_C.scale,
        sharpness: PARAMS_C.sharpness,
        shimmer: PARAMS_C.shimmer,
        glow: PARAMS_C.glow,
        rimWidth: PARAMS_C.rimWidth,
        flowX: PARAMS_C.flowX,
        flowY: PARAMS_C.flowY,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.42)

      // C → D: 65%~83% transition (slow, sharpen, crystallize)
      tl.to(p, {
        speed: PARAMS_D.speed,
        turbulence: PARAMS_D.turbulence,
        scale: PARAMS_D.scale,
        sharpness: PARAMS_D.sharpness,
        shimmer: PARAMS_D.shimmer,
        glow: PARAMS_D.glow,
        rimWidth: PARAMS_D.rimWidth,
        flowX: PARAMS_D.flowX,
        flowY: PARAMS_D.flowY,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.65)

      // D → E: 83%~91% transition (crystal shatters into aurora)
      tl.to(p, {
        speed: PARAMS_E.speed,
        turbulence: PARAMS_E.turbulence,
        scale: PARAMS_E.scale,
        sharpness: PARAMS_E.sharpness,
        shimmer: PARAMS_E.shimmer,
        glow: PARAMS_E.glow,
        rimWidth: PARAMS_E.rimWidth,
        flowX: PARAMS_E.flowX,
        flowY: PARAMS_E.flowY,
        duration: 0.12,
        ease: 'power2.inOut',
      }, 0.83)

      // E → F: 91%~100% transition (aurora dissolves into nebula)
      tl.to(p, {
        speed: PARAMS_F.speed,
        turbulence: PARAMS_F.turbulence,
        scale: PARAMS_F.scale,
        sharpness: PARAMS_F.sharpness,
        shimmer: PARAMS_F.shimmer,
        glow: PARAMS_F.glow,
        rimWidth: PARAMS_F.rimWidth,
        flowX: PARAMS_F.flowX,
        flowY: PARAMS_F.flowY,
        fluidity: PARAMS_F.fluidity,
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
      {/* Single fluid engine — params animated by GSAP scroll timeline */}
      <FluidBackground paramsRef={paramsRef} />

      <main>
        {/* Section 0: Calm Flow + Hero content */}
        <section
          id="section-0"
          className="relative min-h-[100dvh]"
          style={{ zIndex: 1 }}
        >
          <Home />
        </section>

        {/* Section 1: Turbulent Vortex */}
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

        {/* Section 2: Wave Surge */}
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

        {/* Section 3: Crystallization */}
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

        {/* Section 4: Aurora Scatter */}
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

        {/* Section 5: Nebula Serenity */}
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
