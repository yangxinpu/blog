import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useScroll, useTransform, motion } from 'framer-motion';
import { COLORS } from '../constants';

interface GalaxySectionProps {
  theme: 'dark' | 'light';
}

const GalaxySection: React.FC<GalaxySectionProps> = ({ theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Map scroll progress to galaxy rotation and tilt
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const rotationX = useTransform(scrollYProgress, [0, 1], [0.5, 0]);
  const cameraZ = useTransform(scrollYProgress, [0, 1], [6, 3]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Galaxy Parameters ---
    const parameters = {
      count: 30000,
      size: 0.015,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: COLORS.neonGreen,
      outsideColor: COLORS.darkGreen,
    };

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateGalaxy = () => {
      // Clean up old geometry
      if (points !== null) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY * (radius * 0.2); // Flatter galaxy
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: theme === 'dark' ? 0.9 : 0.6
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    generateGalaxy();

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Idle Rotation
      if (points) {
        points.rotation.y = elapsedTime * 0.05 + rotationY.get();
        points.rotation.x = rotationX.get();
      }

      // Camera Scroll Zoom
      camera.position.z = cameraZ.get();
      // Look slightly down as we move up
      camera.lookAt(0, -0.5, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry?.dispose();
      material?.dispose();
      renderer.dispose();
    };
  }, [theme, rotationY, rotationX, cameraZ]);

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-transparent">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Optional overlay text that fades out */}
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-30">
                EXPLORE THE UNIVERSE
            </h2>
        </motion.div>
      </div>
    </div>
  );
};

export default GalaxySection;