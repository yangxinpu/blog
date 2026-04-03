import { useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import styles from './FlowingLinesBackground.module.scss';

const VERTEX_SHADER = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float speed;
uniform float glowIntensity;
uniform vec3  color1;
uniform vec3  color2;
uniform vec3  color3;
uniform bool  isDark;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

vec3 getGradientColor(float t, vec3 c1, vec3 c2, vec3 c3) {
  vec3 col;
  if (t < 0.5) {
    col = mix(c1, c2, t * 2.0);
  } else {
    col = mix(c2, c3, (t - 0.5) * 2.0);
  }
  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  
  float time = iTime * speed;
  
  vec3 col = vec3(0.0);
  
  for (float i = 0.0; i < 4.0; i++) {
    float fi = i;
    float offset = fi * 0.618033988749895;
    
    vec2 p = uv * (0.6 + fi * 0.08);
    p.x += time * 0.05 * (1.0 + fi * 0.05);
    p.y += sin(time * 0.1 + offset) * 0.15;
    
    float n = fbm(p * 1.2 + vec2(time * 0.02, offset * 0.3));
    
    float wave1 = sin(uv.x * 1.8 + time * 0.3 + offset * 1.2) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 1.5 + time * 0.2 + offset) * 0.5 + 0.5;
    float wave = wave1 * wave2;
    
    float line = smoothstep(0.3, 0.7, n + wave * 0.2);
    line = pow(line, 3.0);
    
    float colorT = fract(fi / 4.0 + time * 0.01);
    vec3 lineColor = getGradientColor(colorT, color1, color2, color3);
    
    float glow = line * glowIntensity * (1.0 - fi / 6.0);
    col += lineColor * glow;
  }
  
  float vignette = 1.0 - length(uv) * 0.3;
  vignette = smoothstep(0.0, 1.0, vignette);
  col *= vignette;
  
  float alpha = max(max(col.r, col.g), col.b);
  
  if (isDark) {
    fragColor = vec4(col * 1.1, alpha * 0.7);
  } else {
    fragColor = vec4(col * 0.6, alpha * 0.4);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

interface FlowingLinesBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  glowIntensity?: number;
  isDark?: boolean;
}

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();

  if (value.startsWith('#')) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return new Vector3(r / 255, g / 255, b / 255);
}

function FlowingLinesBackground({
  primaryColor = '#19fac6',
  secondaryColor = '#13d6aa',
  accentColor = '#0ea387',
  speed = 0.08,
  glowIntensity = 0.25,
  isDark = true,
}: FlowingLinesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef<Clock | null>(null);
  const lastTimeRef = useRef<number>(0);

  const color1 = useMemo(() => hexToVec3(primaryColor), [primaryColor]);
  const color2 = useMemo(() => hexToVec3(secondaryColor), [secondaryColor]);
  const color3 = useMemo(() => hexToVec3(accentColor), [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
    renderer.setPixelRatio(1);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      speed: { value: speed },
      glowIntensity: { value: glowIntensity },
      color1: { value: color1 },
      color2: { value: color2 },
      color3: { value: color3 },
      isDark: { value: isDark },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    materialRef.current = material;

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();
    clockRef.current = clock;

    const setSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    setSize();

    const ro = new ResizeObserver(() => {
      setSize();
    });
    ro.observe(container);

    const FPS_LIMIT = 30;
    const FRAME_DURATION = 1000 / FPS_LIMIT;

    const renderLoop = () => {
      if (!materialRef.current || !rendererRef.current || !sceneRef.current || !clockRef.current) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= FRAME_DURATION) {
        lastTimeRef.current = currentTime - (deltaTime % FRAME_DURATION);

        materialRef.current.uniforms.iTime.value = clockRef.current.getElapsedTime();

        rendererRef.current.render(sceneRef.current, camera);
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }

      rendererRef.current = null;
      sceneRef.current = null;
      materialRef.current = null;
      clockRef.current = null;
    };
  }, [speed, glowIntensity, color1, color2, color3, isDark]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.isDark.value = isDark;
      materialRef.current.uniforms.glowIntensity.value = glowIntensity;
      materialRef.current.uniforms.color1.value = color1;
      materialRef.current.uniforms.color2.value = color2;
      materialRef.current.uniforms.color3.value = color3;
    }
  }, [isDark, glowIntensity, color1, color2, color3]);

  return (
    <div
      ref={containerRef}
      className={styles.flowingLinesBackground}
    />
  );
}

export default FlowingLinesBackground;
