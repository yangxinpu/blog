import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  color: string
  alpha: number
  currentAlpha: number
}

interface ParticleBackgroundProps {
  dotRadius?: number
  dotSpacing?: number
  cursorRadius?: number
  bulgeStrength?: number
  waveAmplitude?: number
  sparkle?: boolean
  baseColor?: string
  accentColor?: string
  speed?: number
}

export function ParticleBackground({
  dotRadius = 1.5,
  dotSpacing = 20,
  cursorRadius = 200,
  bulgeStrength = 50,
  waveAmplitude = 3,
  sparkle = true,
  baseColor = 'rgba(23, 251, 198, 0.15)',
  accentColor = 'rgba(23, 251, 198, 0.6)',
  speed = 0.02,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const timeRef = useRef(0)
  const animationIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createParticles = (width: number, height: number) => {
      const particles: Particle[] = []
      const cols = Math.ceil(width / dotSpacing) + 1
      const rows = Math.ceil(height / dotSpacing) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSpacing
          const y = j * dotSpacing
          const alpha = 0.3 + Math.random() * 0.4
          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            radius: dotRadius,
            color: baseColor,
            alpha,
            currentAlpha: alpha,
          })
        }
      }
      return particles
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current
      const time = timeRef.current

      for (const p of particlesRef.current) {
        if (reduce) {
          p.x = p.baseX
          p.y = p.baseY
          p.radius = dotRadius
          p.currentAlpha = p.alpha
        } else {
          const waveOffset =
            waveAmplitude * Math.sin(time * 2 + p.baseX * 0.01 + p.baseY * 0.01)
          p.y = p.baseY + waveOffset

          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < cursorRadius) {
            const force = (1 - dist / cursorRadius) * bulgeStrength
            const angle = Math.atan2(dy, dx)
            p.x = p.baseX + Math.cos(angle) * force
            p.y = p.baseY + Math.sin(angle) * force + waveOffset
            p.color = accentColor
            p.radius = dotRadius + (1 - dist / cursorRadius) * 2
          } else {
            p.x += (p.baseX - p.x) * 0.1
            p.y += (p.baseY + waveOffset - p.y) * 0.1
            p.color = baseColor
            p.radius = dotRadius
          }

          p.currentAlpha = p.alpha
          if (sparkle && Math.random() < 0.003) {
            p.currentAlpha = 1
            p.radius = dotRadius * 2
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.currentAlpha
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const animate = () => {
      if (!reduce) {
        timeRef.current += speed
      }
      draw()
      animationIdRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationIdRef.current)
    }
  }, [
    dotRadius,
    dotSpacing,
    cursorRadius,
    bulgeStrength,
    waveAmplitude,
    sparkle,
    baseColor,
    accentColor,
    speed,
  ])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
