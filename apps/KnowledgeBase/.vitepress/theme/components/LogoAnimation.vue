<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { useRoute } from 'vitepress';
import { loadingStateRef } from '../composables/useLoadingState';

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  a: number;
  ta: number;
  phase: number;
  isEdge: boolean;
  isAccent: boolean;
  wanderAngle: number;
  wanderSpeed: number;
  wanderRadius: number;
}

const route = useRoute();
const container = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const isReducedMotion = ref(false);
const rawParticlesCache = ref<Particle[]>([]);

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationId = 0;
let mouseX = 0;
let mouseY = 0;
let mouseActive = false;
let particleCtx: gsap.Context | undefined;
let time = 0;

const LOGO_URL = '/logo.png';
const MOUSE_RADIUS = 80;
const REPULSION_STRENGTH = 3.0;
const RETURN_STRENGTH = 0.07;
const BREATH_SPEED = 0.015;
const BREATH_AMPLITUDE = 0.04;

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isEdgePixel(
  pixels: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
  threshold: number
): boolean {
  const check = (cx: number, cy: number) => {
    if (cx < 0 || cx >= w || cy < 0 || cy >= h) return false;
    return pixels[(cy * w + cx) * 4 + 3] > threshold;
  };
  if (!check(x, y)) return false;
  return !(check(x - 1, y) && check(x + 1, y) && check(x, y - 1) && check(x, y + 1));
}

async function extractLogoShape(): Promise<Particle[]> {
  try {
    const img = await loadImage(LOGO_URL);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return generateFallbackShape();

    const maxDim = 180;
    const scale = maxDim / Math.max(img.width, img.height);
    tempCanvas.width = Math.round(img.width * scale);
    tempCanvas.height = Math.round(img.height * scale);
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

    let pixels: Uint8ClampedArray;
    try {
      pixels = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    } catch (e) {
      console.warn('getImageData failed', e);
      return generateFallbackShape();
    }

    const w = tempCanvas.width;
    const h = tempCanvas.height;
    const pList: Particle[] = [];
    const step = 2;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const alpha = pixels[idx + 3];
        if (alpha < 25) continue;

        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        let nr = r, ng = g, nb = b;
        if (b > g + 50 && b > 160) {
          nr = 65; ng = 140; nb = 255;
        } else if (g > 160 && b > 130 && r < 130) {
          nr = 15; ng = 220; nb = 200;
        } else if (r < 70 && g < 70 && b < 70) {
          nr = 25; ng = 25; nb = 25;
        }

        const edge = isEdgePixel(pixels, w, h, x, y, 25);
        const accent = Math.random() < 0.035;

        const jitterX = (Math.random() - 0.5) * 0.6;
        const jitterY = (Math.random() - 0.5) * 0.6;

        let size = 1.0 + Math.random() * 0.6;
        let targetAlpha = 0.55 + Math.random() * 0.3;

        if (edge) {
          size = 1.3 + Math.random() * 0.5;
          targetAlpha = 0.75 + Math.random() * 0.2;
        }
        if (accent) {
          size = 2.2 + Math.random() * 1.2;
          targetAlpha = 0.85 + Math.random() * 0.15;
        }

        pList.push({
          x: 0, y: 0,
          tx: x + jitterX,
          ty: y + jitterY,
          vx: 0, vy: 0,
          size,
          r: nr, g: ng, b: nb,
          a: 0,
          ta: targetAlpha,
          phase: Math.random() * Math.PI * 2,
          isEdge: edge,
          isAccent: accent,
          wanderAngle: Math.random() * Math.PI * 2,
          wanderSpeed: 0.002 + Math.random() * 0.003,
          wanderRadius: accent ? 1.5 + Math.random() * 2 : 0,
        });
      }
    }

    if (pList.length === 0) return generateFallbackShape();
    return pList;
  } catch (e) {
    console.warn('extractLogoShape failed', e);
    return generateFallbackShape();
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

function generateFallbackShape(): Particle[] {
  const pList: Particle[] = [];
  const w = 160;
  const h = 140;
  const cx = w / 2;
  const step = 2;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const t = y / h;
      const topW = 90 * (1 - t * 0.12);
      const inShape = x >= cx - topW / 2 && x <= cx + topW / 2;
      if (!inShape) continue;

      const triangleCut = y < h * 0.5 && y > h * 0.15 &&
                          x > cx - 24 * (y / (h * 0.5)) &&
                          x < cx + 24 * (y / (h * 0.5));
      if (triangleCut) continue;

      let r = 15, g = 220, b = 200;
      if (x < cx - 10 || x > cx + 10) {
        r = 65; g = 140; b = 255;
      }

      const edge = x <= cx - topW / 2 + step || x >= cx + topW / 2 - step ||
                   y <= step || y >= h - step;
      const accent = Math.random() < 0.03;

      let size = 1.0 + Math.random() * 0.6;
      let targetAlpha = 0.55 + Math.random() * 0.3;
      if (edge) {
        size = 1.3 + Math.random() * 0.5;
        targetAlpha = 0.75 + Math.random() * 0.2;
      }
      if (accent) {
        size = 2.2 + Math.random() * 1.2;
        targetAlpha = 0.85 + Math.random() * 0.15;
      }

      pList.push({
        x: 0, y: 0,
        tx: x + (Math.random() - 0.5) * 0.6,
        ty: y + (Math.random() - 0.5) * 0.6,
        vx: 0, vy: 0,
        size,
        r, g, b,
        a: 0, ta: targetAlpha,
        phase: Math.random() * Math.PI * 2,
        isEdge: edge,
        isAccent: accent,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: 0.008 + Math.random() * 0.012,
        wanderRadius: accent ? 4 + Math.random() * 6 : 0,
      });
    }
  }
  return pList;
}

function initParticles(rawParticles: Particle[]) {
  if (!canvas.value || rawParticles.length === 0) return;

  const rect = canvas.value.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const minX = Math.min(...rawParticles.map((p) => p.tx));
  const maxX = Math.max(...rawParticles.map((p) => p.tx));
  const minY = Math.min(...rawParticles.map((p) => p.ty));
  const maxY = Math.max(...rawParticles.map((p) => p.ty));

  const shapeW = maxX - minX;
  const shapeH = maxY - minY;
  const scale = Math.min(rect.width / shapeW, rect.height / shapeH) * 0.8;

  const offsetX = cx - ((minX + maxX) / 2) * scale;
  const offsetY = cy - ((minY + maxY) / 2) * scale;

  particles = rawParticles.map((p) => ({
    ...p,
    x: cx + (Math.random() - 0.5) * rect.width * 2.5,
    y: cy + (Math.random() - 0.5) * rect.height * 2.5,
    tx: offsetX + p.tx * scale,
    ty: offsetY + p.ty * scale,
    wanderRadius: p.wanderRadius * scale,
    a: 0,
  }));
}

function animate() {
  if (!ctx || !canvas.value) return;

  time += BREATH_SPEED;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (const p of particles) {
    if (mouseActive) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const mult = p.isAccent ? 1.4 : 1;
        p.vx += (dx / dist) * force * REPULSION_STRENGTH * mult;
        p.vy += (dy / dist) * force * REPULSION_STRENGTH * mult;
      }
    }

    p.vx += (p.tx - p.x) * RETURN_STRENGTH;
    p.vy += (p.ty - p.y) * RETURN_STRENGTH;
    p.vx *= 0.89;
    p.vy *= 0.89;

    p.x += p.vx;
    p.y += p.vy;

    if (p.a > 0.03) {
      const breath = 1 + Math.sin(time + p.phase) * BREATH_AMPLITUDE;
      const drawA = Math.max(0.03, Math.min(1, p.a * breath));

      if (p.isAccent) {
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${drawA * 0.12})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${drawA})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  animationId = requestAnimationFrame(animate);
}

function startEntranceAnimation() {
  if (isReducedMotion.value || particles.length === 0 || !canvas.value) return;

  const avgX = particles.reduce((s, p) => s + p.tx, 0) / particles.length;
  const avgY = particles.reduce((s, p) => s + p.ty, 0) / particles.length;
  const width = canvas.value.width;
  const height = canvas.value.height;

  particleCtx = gsap.context(() => {
    particles.forEach((p) => {
      const dist = Math.sqrt(
        Math.pow(p.tx - avgX, 2) +
        Math.pow(p.ty - avgY, 2)
      );
      const maxDist = Math.sqrt(
        Math.pow(width / 2, 2) +
        Math.pow(height / 2, 2)
      );
      const delay = (dist / maxDist) * 0.9;

      gsap.to(p, {
        x: p.tx,
        y: p.ty,
        a: p.ta,
        duration: 1.3 + Math.random() * 0.5,
        delay,
        ease: 'power2.out',
      });
    });
  });
}

function handleMouseMove(e: MouseEvent) {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  mouseActive = true;
}

function handleMouseLeave() {
  mouseActive = false;
}

function handleResize() {
  if (!canvas.value || !container.value) return;
  const rect = container.value.getBoundingClientRect();
  canvas.value.width = rect.width;
  canvas.value.height = rect.height;
}

function reinitAndAnimate() {
  if (!canvas.value || !container.value || rawParticlesCache.value.length === 0) return;
  
  particleCtx?.revert();
  
  handleResize();
  initParticles(rawParticlesCache.value);
  
  if (particles.length === 0) return;
  
  if (!animationId) {
    animate();
  }
  
  if (!isReducedMotion.value) {
    startEntranceAnimation();
  } else {
    particles.forEach((p) => {
      p.x = p.tx;
      p.y = p.ty;
      p.a = p.ta;
    });
  }
}

onMounted(async () => {
  if (!canvas.value || !container.value) return;

  isReducedMotion.value = getReducedMotion();

  const ctxRef = canvas.value.getContext('2d');
  if (!ctxRef) return;
  ctx = ctxRef;

  handleResize();

  const rawParticles = await extractLogoShape();
  rawParticlesCache.value = rawParticles;
  initParticles(rawParticles);

  if (particles.length === 0) return;

  animate();

  if (isReducedMotion.value) {
    particles.forEach((p) => {
      p.x = p.tx;
      p.y = p.ty;
      p.a = p.ta;
    });
  } else {
    setTimeout(() => {
      startEntranceAnimation();
    }, 800);
  }

  watch(
    () => route.path,
    () => {
      const delay = loadingStateRef.isLoading ? 500 : 200;
      setTimeout(() => {
        reinitAndAnimate();
      }, delay);
    }
  );

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  particleCtx?.revert();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div
    ref="container"
    class="logo-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    role="img"
    aria-label="NaiLuo 粒子 Logo"
  >
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<style scoped>
.logo-container {
  position: relative;
  width: 360px;
  height: 380px;
  cursor: pointer;
}

.particle-canvas {
  width: 100%;
  height: 100%;
}

@media (max-width: 640px) {
  .logo-container {
    width: 280px;
    height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle-canvas {
    animation: none !important;
  }
}
</style>
