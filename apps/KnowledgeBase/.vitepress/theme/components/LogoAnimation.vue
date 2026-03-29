<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isHovering = ref(false);
const isAnimating = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const particles = ref<
  Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
  }>
>([]);
const containerRef = ref<HTMLElement | null>(null);

const colors = [
  '#00d5c4',
  '#19fac6',
  '#00b8a9',
  '#00ffcc',
  '#4FC08D',
  '#61DAFB',
];

const generateParticles = () => {
  const newParticles = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    newParticles.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: i * 0.05,
    });
  }
  particles.value = newParticles;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left - rect.width / 2;
  mouseY.value = e.clientY - rect.top - rect.height / 2;
};

const handleMouseEnter = () => {
  isHovering.value = true;
  isAnimating.value = true;
  generateParticles();
};

const handleMouseLeave = () => {
  isHovering.value = false;
  setTimeout(() => {
    isAnimating.value = false;
    particles.value = [];
  }, 300);
};

const handleClick = () => {
  generateParticles();
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 1000);
};

let animationFrame: number;
const rotateX = ref(0);
const rotateY = ref(0);

const animate = () => {
  if (isHovering.value) {
    rotateX.value += (mouseY.value * 0.1 - rotateX.value) * 0.1;
    rotateY.value += (-mouseX.value * 0.1 - rotateY.value) * 0.1;
  } else {
    rotateX.value += (0 - rotateX.value) * 0.05;
    rotateY.value += (0 - rotateY.value) * 0.05;
  }
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  generateParticles();
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <div
    ref="containerRef"
    class="logo-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <div
      class="logo-wrapper"
      :style="{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }"
    >
      <div class="logo-glow"></div>
      <img
        src="/assets/logo.png"
        alt="Logo"
        class="logo-image"
        :class="{ 'logo-hover': isHovering }"
      />
      <div class="logo-ring ring-1"></div>
      <div class="logo-ring ring-2"></div>
      <div class="logo-ring ring-3"></div>
    </div>

    <Transition name="particle">
      <div v-if="isAnimating" class="particles-container">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="particle"
          :style="{
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
            '--size': `${particle.size}px`,
            '--color': particle.color,
            '--delay': `${particle.delay}s`,
          }"
        ></div>
      </div>
    </Transition>

    <div class="floating-dots">
      <span v-for="i in 6" :key="i" class="dot" :style="{ '--i': i }"></span>
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  position: relative;
  width: 200px;
  height: 200px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle,
    rgba(0, 213, 196, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  filter: drop-shadow(0 10px 30px rgba(0, 213, 196, 0.3));
}

.logo-image.logo-hover {
  transform: scale(1.1);
  filter: drop-shadow(0 15px 40px rgba(0, 213, 196, 0.5));
}

.logo-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: ring-rotate 8s linear infinite;
}

.ring-1 {
  inset: -15px;
  border-color: rgba(0, 213, 196, 0.3);
  animation-duration: 8s;
}

.ring-2 {
  inset: -25px;
  border-color: rgba(25, 250, 198, 0.2);
  animation-duration: 12s;
  animation-direction: reverse;
}

.ring-3 {
  inset: -35px;
  border-color: rgba(0, 184, 169, 0.15);
  animation-duration: 16s;
}

.particles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  animation: particle-float 1.5s ease-out infinite;
  animation-delay: var(--delay);
  box-shadow: 0 0 10px var(--color);
}

.particle::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  border-radius: 50%;
  animation: particle-pulse 0.5s ease-out infinite;
}

@keyframes particle-float {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%)
      translate(calc(var(--x) * 1.5), calc(var(--y) * 1.5)) scale(0);
    opacity: 0;
  }
}

@keyframes particle-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes ring-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.floating-dots {
  position: absolute;
  inset: -50px;
  pointer-events: none;
}

.dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: dot-float 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.3s);
  opacity: 0.6;
}

.dot:nth-child(1) {
  top: 10%;
  left: 20%;
}
.dot:nth-child(2) {
  top: 30%;
  right: 10%;
}
.dot:nth-child(3) {
  bottom: 20%;
  left: 10%;
}
.dot:nth-child(4) {
  bottom: 10%;
  right: 30%;
}
.dot:nth-child(5) {
  top: 50%;
  left: 5%;
}
.dot:nth-child(6) {
  top: 5%;
  right: 50%;
}

@keyframes dot-float {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.particle-enter-active {
  animation: fade-in 0.3s ease-out;
}

.particle-leave-active {
  animation: fade-out 0.3s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
