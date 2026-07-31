import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

export interface FluidParams {
  speed: number
  scale: number
  turbulence: number
  fluidity: number
  rimWidth: number
  sharpness: number
  shimmer: number
  glow: number
  flowX: number
  flowY: number
}

interface FluidBackgroundProps {
  paramsRef: React.MutableRefObject<FluidParams>
  colors?: string[]
  backgroundColor?: string
  mouseStrength?: number
  mouseRadius?: number
  mouseDampening?: number
  className?: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const num = parseInt(full, 16)
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

const VERT = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform vec2 uFlow;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uMouseActive;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
        dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  p *= uScale;

  float t = uTime * uSpeed;

  vec2 m = uMouse * uMouseRadius;
  float md = length(p - m);
  float mouseBulge = uMouseStrength * exp(-md * md * 2.0) * uMouseActive;

  float distort = uTurbulence * 0.6;
  vec2 q = p + distort * vec2(fbm(p + t * 0.3), fbm(p + t * 0.3 + 5.2));
  q += vec2(t * uFlow.x, t * uFlow.y);

  float n1 = fbm(q);
  float n2 = fbm(q * 1.6 + 10.0 + t * 0.15);

  float h = mix(n1, n2, uFluidity);
  h += mouseBulge * 0.8;

  float contour = fract(h * 2.0 + t * 0.03);
  float rim = smoothstep(0.5 - uRimWidth, 0.5, contour)
            - smoothstep(0.5, 0.5 + uRimWidth, contour);
  rim = pow(max(rim, 0.0), uSharpness * 0.5 + 0.5);

  float sh = snoise(p * 6.0 + t * 1.5);
  rim *= 1.0 - uShimmer * 0.4 * (1.0 - sh);

  float spike = mouseBulge * 1.0;

  vec3 col = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, h));
  col = mix(col, uColor3, smoothstep(0.0, 1.0, h + spike * 0.2));

  col = col * rim * uGlow * 0.65;
  col += uColor3 * spike * 0.25;

  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.6;
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`

export function FluidBackground({
  paramsRef,
  colors = ['#0a6f5d', '#19fac6', '#7be9c9'],
  backgroundColor = '#121212',
  mouseStrength = 1,
  mouseRadius = 0.35,
  mouseDampening = 0.15,
  className,
}: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 1.5),
      alpha: false,
      antialias: false,
    })
    const gl = renderer.gl
    gl.clearColor(...hexToRgb(backgroundColor), 1)
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uColor1: { value: hexToRgb(colors[0] ?? '#0a6f5d') },
        uColor2: { value: hexToRgb(colors[1] ?? '#19fac6') },
        uColor3: { value: hexToRgb(colors[2] ?? '#d3fff3') },
        uSpeed: { value: paramsRef.current.speed },
        uScale: { value: paramsRef.current.scale },
        uTurbulence: { value: paramsRef.current.turbulence },
        uFluidity: { value: paramsRef.current.fluidity },
        uRimWidth: { value: paramsRef.current.rimWidth },
        uSharpness: { value: paramsRef.current.sharpness },
        uShimmer: { value: paramsRef.current.shimmer },
        uGlow: { value: paramsRef.current.glow },
        uFlow: { value: [paramsRef.current.flowX, paramsRef.current.flowY] },
        uMouse: { value: [0, 0] },
        uMouseStrength: { value: mouseStrength },
        uMouseRadius: { value: mouseRadius },
        uMouseActive: { value: reduce ? 0 : 1 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    const target = { x: 0.5, y: 0.5 }
    const current = { x: 0.5, y: 0.5 }

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }
    const onPointerLeave = () => {
      target.x = 0.5
      target.y = 0.5
    }

    if (!reduce) {
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerleave', onPointerLeave)
    }

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [w, h]
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const start = performance.now()
    let raf = 0
    let last = start

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now

      if (!reduce) {
        const k = mouseDampening > 0 ? 1 - Math.exp(-dt / mouseDampening) : 1
        current.x += (target.x - current.x) * k
        current.y += (target.y - current.y) * k
      }

      const p = paramsRef.current
      program.uniforms.uTime.value = (now - start) / 1000
      program.uniforms.uSpeed.value = p.speed
      program.uniforms.uScale.value = p.scale
      program.uniforms.uTurbulence.value = p.turbulence
      program.uniforms.uFluidity.value = p.fluidity
      program.uniforms.uRimWidth.value = p.rimWidth
      program.uniforms.uSharpness.value = p.sharpness
      program.uniforms.uShimmer.value = p.shimmer
      program.uniforms.uGlow.value = p.glow
      program.uniforms.uFlow.value = [p.flowX, p.flowY]
      program.uniforms.uMouse.value = [
        (current.x - 0.5) * 2,
        (current.y - 0.5) * 2,
      ]
      renderer.render({ scene: mesh })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (!reduce) {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
      }
      geometry?.remove()
      program?.remove()
      const loseCtx = gl.getExtension('WEBGL_lose_context')
      loseCtx?.loseContext()
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas)
      }
    }
  }, [colors, backgroundColor, mouseStrength, mouseRadius, mouseDampening, paramsRef])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden ${className ?? ''}`}
      style={{ zIndex: 0 }}
    />
  )
}
