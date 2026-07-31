import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function ScrollBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const grid = containerRef.current?.querySelector('[data-layer="grid"]')
    const shapes = containerRef.current?.querySelectorAll('[data-layer="shape"]')
    const dots = containerRef.current?.querySelector('[data-layer="dots"]')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    })

    if (grid) {
      tl.to(grid, {
        rotateX: 12,
        rotateZ: 2,
        yPercent: -5,
        ease: 'none',
      }, 0)
    }

    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 0.3
      tl.to(shape, {
        y: () => -window.innerHeight * 0.08 * depth,
        rotateX: 6 * depth,
        rotateY: -4 * depth,
        ease: 'none',
      }, 0)
    })

    if (dots) {
      tl.to(dots, {
        yPercent: -3,
        rotateX: 4,
        ease: 'none',
      }, 0)
    }
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Layer 1: Wireframe grid - far back */}
      <div
        data-layer="grid"
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-400px)',
          backgroundImage: `
            linear-gradient(rgba(25, 250, 198, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25, 250, 198, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />

      {/* Layer 2: Floating geometric wireframes - mid depth */}
      <div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          data-layer="shape"
          className="absolute"
          style={{
            top: '20%',
            left: '10%',
            width: '120px',
            height: '120px',
            border: '1px solid rgba(25, 250, 198, 0.03)',
            borderRadius: '12px',
            transform: 'translateZ(-250px) rotate(15deg)',
          }}
        />
        <div
          data-layer="shape"
          className="absolute"
          style={{
            top: '60%',
            right: '15%',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(25, 250, 198, 0.025)',
            borderRadius: '50%',
            transform: 'translateZ(-200px)',
          }}
        />
        <div
          data-layer="shape"
          className="absolute"
          style={{
            top: '40%',
            right: '30%',
            width: '50px',
            height: '50px',
            border: '1px solid rgba(25, 250, 198, 0.02)',
            transform: 'translateZ(-180px) rotate(45deg)',
          }}
        />
      </div>

      {/* Layer 3: Subtle dot pattern - near */}
      <div
        data-layer="dots"
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-80px)',
          backgroundImage: 'radial-gradient(circle, rgba(25, 250, 198, 0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 60%)',
        }}
      />
    </div>
  )
}
