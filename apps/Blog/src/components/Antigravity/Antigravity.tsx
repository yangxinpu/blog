import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// R3F JSX elements as type assertions for React 19 compatibility
const R3F = {
  InstancedMesh: 'instancedMesh' as unknown as React.ElementType,
  MeshStandardMaterial: 'meshStandardMaterial' as unknown as React.ElementType,
  AmbientLight: 'ambientLight' as unknown as React.ElementType,
  PointLight: 'pointLight' as unknown as React.ElementType,
};

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'sphere' | 'capsule' | 'box';
  fieldStrength?: number;
  className?: string;
  active?: boolean;
  mouseX?: number;
  mouseY?: number;
}

interface ParticleData {
  positions: Float32Array;
  basePositions: Float32Array;
  randoms: Float32Array;
}

function ParticleRing({
  count,
  magnetRadius,
  ringRadius,
  waveSpeed,
  waveAmplitude,
  particleSize,
  lerpSpeed,
  autoAnimate,
  particleVariance,
  rotationSpeed,
  depthFactor,
  pulseSpeed,
  particleShape,
  fieldStrength,
  mouseRef,
  active,
  color,
}: {
  count: number;
  magnetRadius: number;
  ringRadius: number;
  waveSpeed: number;
  waveAmplitude: number;
  particleSize: number;
  lerpSpeed: number;
  autoAnimate: boolean;
  particleVariance: number;
  rotationSpeed: number;
  depthFactor: number;
  pulseSpeed: number;
  particleShape: 'sphere' | 'capsule' | 'box';
  fieldStrength: number;
  mouseRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  active: boolean;
  color: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const particleDataRef = useRef<ParticleData | null>(null);
  const dummyRef = useRef(new THREE.Object3D());
  const clockRef = useRef(0);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const y = Math.sin(angle) * ringRadius;
      const z = (Math.random() - 0.5) * depthFactor * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      randoms[i] = Math.random();
    }

    particleDataRef.current = { positions, basePositions, randoms };
  }, [count, ringRadius, depthFactor]);

  const geometry = useMemo(() => {
    switch (particleShape) {
      case 'capsule':
        return new THREE.CapsuleGeometry(0.15, 0.4, 4, 8);
      case 'box':
        return new THREE.BoxGeometry(0.25, 0.25, 0.25);
      default:
        return new THREE.SphereGeometry(0.2, 8, 8);
    }
  }, [particleShape]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const particleData = particleDataRef.current;
    if (!particleData) return;

    clockRef.current += delta;
    const t = clockRef.current;
    const dummy = dummyRef.current;

    const mouse = mouseRef.current;
    const worldWidth = viewport.width * 0.5;
    const worldHeight = viewport.height * 0.5;
    const mouseWorld = new THREE.Vector3(
      mouse.x * worldWidth,
      mouse.y * worldHeight,
      0,
    );

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const rand = particleData.randoms[i];

      const bx = particleData.basePositions[i3];
      const by = particleData.basePositions[i3 + 1];
      const bz = particleData.basePositions[i3 + 2];

      let targetX = bx;
      let targetY = by;

      if (waveAmplitude > 0) {
        const wave = Math.sin(t * waveSpeed + rand * Math.PI * 2) * waveAmplitude;
        const angle = Math.atan2(by, bx);
        targetX += Math.cos(angle) * wave;
        targetY += Math.sin(angle) * wave;
      }

      const px = particleData.positions[i3];
      const py = particleData.positions[i3 + 1];

      if ((active || autoAnimate) && mouse.active) {
        const dx = px - mouseWorld.x;
        const dy = py - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magnetRadius && dist > 0.01) {
          const force = (1 - dist / magnetRadius) * fieldStrength;
          targetX += (dx / dist) * force;
          targetY += (dy / dist) * force;
        }
      }

      particleData.positions[i3] = px + (targetX - px) * lerpSpeed;
      particleData.positions[i3 + 1] = py + (targetY - py) * lerpSpeed;
      particleData.positions[i3 + 2] = bz;

      dummy.position.set(
        particleData.positions[i3],
        particleData.positions[i3 + 1],
        particleData.positions[i3 + 2],
      );

      const pulse = 1 + Math.sin(t * pulseSpeed + rand * Math.PI * 2) * 0.3;
      const variance = 1 - particleVariance * 0.5 + rand * particleVariance;
      const s = particleSize * pulse * variance;

      dummy.scale.set(s, s, s);
      dummy.rotation.z += delta * rotationSpeed;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <R3F.InstancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <R3F.MeshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    </R3F.InstancedMesh>
  );
}

const Antigravity: React.FC<AntigravityProps> = ({
  count = 200,
  magnetRadius = 7,
  ringRadius = 3.5,
  waveSpeed = 0.4,
  waveAmplitude = 0.5,
  particleSize = 1.2,
  lerpSpeed = 0.08,
  color = '#17FBC6',
  autoAnimate = false,
  particleVariance = 0.8,
  rotationSpeed = 0.5,
  depthFactor = 1,
  pulseSpeed = 2,
  particleShape = 'sphere',
  fieldStrength = 5,
  className = '',
  active = true,
  mouseX = 0,
  mouseY = 0,
}) => {
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
    mouseRef.current.active = active;
  }, [mouseX, mouseY, active, mouseRef]);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <R3F.AmbientLight intensity={0.3} />
        <R3F.PointLight position={[5, 5, 5]} intensity={0.8} color={color} />
        <ParticleRing
          count={count}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          autoAnimate={autoAnimate}
          particleVariance={particleVariance}
          rotationSpeed={rotationSpeed}
          depthFactor={depthFactor}
          pulseSpeed={pulseSpeed}
          particleShape={particleShape}
          fieldStrength={fieldStrength}
          mouseRef={mouseRef}
          active={active}
          color={color}
        />
      </Canvas>
    </div>
  );
};

export default Antigravity;
