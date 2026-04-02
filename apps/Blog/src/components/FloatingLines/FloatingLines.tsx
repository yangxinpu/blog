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
import styles from './FloatingLines.module.scss';

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
uniform float animationSpeed;
uniform float brightness;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform bool isDarkTheme;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 0) {
    return vec3(0.0);
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * brightness;
}

float wave(vec2 uv, float offset) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  vec3 col = vec3(0.0);
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi
      ) * 0.25;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi
      ) * 0.15;
    }
  }

  if (isDarkTheme) {
    fragColor = vec4(col, 1.0);
  } else {
    // For light theme, we want colored lines on a transparent background
    // Since col is premultiplied, we just need alpha = max component
    float alpha = max(col.r, max(col.g, col.b));
    fragColor = vec4(col, alpha);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

interface WavePosition {
  x: number;
  y: number;
  rotate: number;
}

interface FloatingLinesProps {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
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

function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  mixBlendMode = 'screen',
  isDark = false,
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef<Clock | null>(null);
  const lastTimeRef = useRef<number>(0);

  const brightness = useMemo(() => {
    return isDark ? 0.3 : 0.6;
  }, [isDark]);

  const topLineCount = useMemo(() => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes('top')) return 0;
    return lineCount[enabledWaves.indexOf('top')] ?? 6;
  }, [lineCount, enabledWaves]);

  const middleLineCount = useMemo(() => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes('middle')) return 0;
    return lineCount[enabledWaves.indexOf('middle')] ?? 6;
  }, [lineCount, enabledWaves]);

  const bottomLineCount = useMemo(() => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes('bottom')) return 0;
    return lineCount[enabledWaves.indexOf('bottom')] ?? 6;
  }, [lineCount, enabledWaves]);

  const topLineDistance = useMemo(() => {
    if (typeof lineDistance === 'number') return lineDistance * 0.01;
    if (!enabledWaves.includes('top')) return 0.01;
    return (lineDistance[enabledWaves.indexOf('top')] ?? 5) * 0.01;
  }, [lineDistance, enabledWaves]);

  const middleLineDistance = useMemo(() => {
    if (typeof lineDistance === 'number') return lineDistance * 0.01;
    if (!enabledWaves.includes('middle')) return 0.01;
    return (lineDistance[enabledWaves.indexOf('middle')] ?? 5) * 0.01;
  }, [lineDistance, enabledWaves]);

  const bottomLineDistance = useMemo(() => {
    if (typeof lineDistance === 'number') return lineDistance * 0.01;
    if (!enabledWaves.includes('bottom')) return 0.01;
    return (lineDistance[enabledWaves.indexOf('bottom')] ?? 5) * 0.01;
  }, [lineDistance, enabledWaves]);

  const gradientColors = useMemo(() => {
    if (!linesGradient || linesGradient.length === 0) {
      return Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1));
    }
    const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
    const colors = Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1));
    stops.forEach((hex, i) => {
      const color = hexToVec3(hex);
      colors[i].set(color.x, color.y, color.z);
    });
    return colors;
  }, [linesGradient]);

  const gradientCount = useMemo(() => {
    return linesGradient?.length ?? 0;
  }, [linesGradient]);

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
      animationSpeed: { value: 1 },
      brightness: { value: 0 },

      enableTop: { value: false },
      enableMiddle: { value: false },
      enableBottom: { value: false },

      topLineCount: { value: 0 },
      middleLineCount: { value: 0 },
      bottomLineCount: { value: 0 },

      topLineDistance: { value: 0 },
      middleLineDistance: { value: 0 },
      bottomLineDistance: { value: 0 },

      topWavePosition: { value: new Vector3(0, 0, 0) },
      middleWavePosition: { value: new Vector3(0, 0, 0) },
      bottomWavePosition: { value: new Vector3(0, 0, 0) },

      lineGradient: { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount: { value: 0 },
      isDarkTheme: { value: true },
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

    let lastWidth = 0;
    let lastHeight = 0;
    const setSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;

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
  }, []); // Run only once on mount

  // Update uniforms when props change
  useEffect(() => {
    if (!materialRef.current) return;
    const uniforms = materialRef.current.uniforms;
    
    uniforms.animationSpeed.value = animationSpeed;
    uniforms.brightness.value = brightness;
    
    uniforms.enableTop.value = enabledWaves.includes('top');
    uniforms.enableMiddle.value = enabledWaves.includes('middle');
    uniforms.enableBottom.value = enabledWaves.includes('bottom');
    
    uniforms.topLineCount.value = topLineCount;
    uniforms.middleLineCount.value = middleLineCount;
    uniforms.bottomLineCount.value = bottomLineCount;
    
    uniforms.topLineDistance.value = topLineDistance;
    uniforms.middleLineDistance.value = middleLineDistance;
    uniforms.bottomLineDistance.value = bottomLineDistance;
    
    uniforms.topWavePosition.value.set(
      topWavePosition?.x ?? 10.0,
      topWavePosition?.y ?? 0.5,
      topWavePosition?.rotate ?? -0.4
    );
    uniforms.middleWavePosition.value.set(
      middleWavePosition?.x ?? 5.0,
      middleWavePosition?.y ?? 0.0,
      middleWavePosition?.rotate ?? 0.2
    );
    uniforms.bottomWavePosition.value.set(
      bottomWavePosition?.x ?? 2.0,
      bottomWavePosition?.y ?? -0.7,
      bottomWavePosition?.rotate ?? 0.4
    );
    
    uniforms.lineGradient.value = gradientColors;
    uniforms.lineGradientCount.value = gradientCount;
    uniforms.isDarkTheme.value = isDark;
  }, [
    animationSpeed,
    brightness,
    enabledWaves,
    topLineCount,
    middleLineCount,
    bottomLineCount,
    topLineDistance,
    middleLineDistance,
    bottomLineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    gradientColors,
    gradientCount,
    isDark,
  ]);

  return (
    <div
      ref={containerRef}
      className={styles.floatingLinesContainer}
      style={{
        mixBlendMode: isDark ? mixBlendMode : 'normal',
      }}
    />
  );
}

export default FloatingLines;
