import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { COLORS } from '../constants';

interface ManifestoSectionProps {
  theme: 'dark' | 'light';
}

const ManifestoSection: React.FC<ManifestoSectionProps> = ({ theme, word }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Scroll Animation Logic ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.5"] // Extended range for smoother reading flow
  });

  // Flatten words to calculate global progress, but keep structure for rendering
  const structure = useMemo(() => {
    // Determine language from the first element
    const lang = word[0];
    // Exclude the first element (language code) from the content
    const contentLines = word.slice(1);

    return contentLines.map(line => {
        // Logic for Chinese
        if (lang == 'zh') {
            // Use Intl.Segmenter for proper Chinese word segmentation
            if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
            const segmenter = new (Intl as any).Segmenter('zh-CN', { granularity: 'word' });
                return Array.from(segmenter.segment(line))
                    .map((segment: any) => segment.segment)
                    .filter((s: any) => s.trim().length > 0); // Remove pure whitespace
            }
            // Fallback for environments without Segmenter
            return line.split("").filter(s => s.trim().length > 0);
        }else{
            return line.split(" ").filter(s => s.trim().length > 0);
        }
    });
  }, [word]);
  const totalWords = structure.reduce((acc, line) => acc + line.length, 0);

  // --- Particle System Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    // Initialize mouse off-screen
    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5; // Slower, more ambient
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 2 + 0.5;
        this.life = 1.0;
        
        // Theme specific particle colors
        const darkPalette = [COLORS.neonGreen, '#10b981', '#ffffff', '#059669'];
        const lightPalette = ['#0f0f0e', '#334155', '#94a3b8', COLORS.neonGreen];
        const palette = theme === 'dark' ? darkPalette : lightPalette;
        
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.015; 
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        // Spawn fewer particles for cleaner look
        for(let i=0; i<2; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
        animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
    };

  }, [theme]); // Re-run if theme changes to update particle colors

  let globalWordIndex = 0;

  return (
    <section 
        ref={containerRef} 
        className={`relative min-h-screen flex items-center justify-center py-32 px-4 md:px-12 lg:px-24 overflow-hidden ${theme === 'dark' ? 'text-white' : 'text-nl-black'}`}
    >
        {/* Particle Canvas Layer */}
        <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col gap-12 md:gap-16">
                {structure.map((lineWords, lineIndex) => (
                    <div key={lineIndex} className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-3 leading-tight">
                        {lineWords.map((word, wordIndex) => {
                            const currentGlobalIndex = globalWordIndex;
                            globalWordIndex++;
                            
                            // Calculate specific range for this word based on total words
                            const start = currentGlobalIndex / totalWords;
                            const end = start + (1 / totalWords); // Add buffer

                            return (
                                <InteractiveWord 
                                    key={`${lineIndex}-${wordIndex}`} 
                                    word={word} 
                                    progress={scrollYProgress} 
                                    range={[start, end + 0.1]} 
                                    theme={theme}
                                />
                            );
                        })}
                    </div>
                ))}
             </div>
        </div>
    </section>
  );
};

interface WordProps {
    word: string;
    progress: MotionValue<number>;
    range: [number, number];
    theme: 'dark' | 'light';
}

const InteractiveWord: React.FC<WordProps> = ({ word, progress, range, theme }) => {
    // --- Scroll Transform Logic ---
    const opacity = useTransform(progress, range, [0.1, 1]);
    const y = useTransform(progress, range, [15, 0]);
    const filter = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
    
    // Color transition based on scroll: starts dim/grey, becomes primary text color
    const color = useTransform(progress, range, 
        theme === 'dark' 
        ? ["#334155", "#ffffff"] 
        : ["#cbd5e1", "#0f0f0e"]
    );

    return (
        <motion.span 
            className="relative inline-block text-3xl md:text-5xl lg:text-6xl font-bold cursor-default select-none"
            style={{ 
                opacity, 
                y, 
                filter,
                color 
            }}
            // --- Hover Interaction ---
            whileHover={{ 
                scale: 1.15,
                color: theme === 'dark' ? COLORS.neonGreen : COLORS.midGreen,
                textShadow: theme === 'dark' 
                    ? `0 0 20px ${COLORS.neonGreen}, 0 0 10px ${COLORS.neonGreen}` 
                    : `0 0 20px ${COLORS.lightGreen}`,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
        >
            {word}
        </motion.span>
    );
};

export default ManifestoSection;
