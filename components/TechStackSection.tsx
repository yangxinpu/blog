import React, { useRef } from 'react';
import { motion, useTransform, useScroll, useMotionValue, useSpring } from 'framer-motion';
import { TechItem } from '../types';

interface TechStackSectionProps {
  items: TechItem[];
  title: string;
  subtitle: string;
  theme: 'dark' | 'light';
}

const TechStackSection: React.FC<TechStackSectionProps> = ({ items, title, subtitle, theme }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-90%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] z-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden perspective-1000">
        <div className="absolute top-24 md:top-32 left-8 md:left-20 z-50 pointer-events-none">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-4"
             >
                 <h2 className={`text-5xl md:text-7xl font-black drop-shadow-2xl ${theme === 'dark' ? 'text-nl-neon' : 'text-nl-dark'}`}>
                    {title}
                 </h2>
             </motion.div>
             <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-nl-dark'} drop-shadow-md`}
             >
                {subtitle}
             </motion.p>
        </div>
        <motion.div style={{ x }} className="flex gap-12 pl-[10vw] md:pl-[30vw] items-center h-full py-10">
          {items.map((tech) => (
            <TechCard key={tech.name} tech={tech} theme={theme} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TechCard: React.FC<{ tech: TechItem; theme: 'dark' | 'light' }> = ({ tech, theme }) => {
  const isDark = theme === 'dark';
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized position (-0.5 to 0.5)
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative h-[60vh] w-[80vw] md:w-[400px] flex-shrink-0 rounded-3xl transition-all duration-300
      ${isDark ? 'bg-nl-black/80' : 'bg-white/80'}
      `}
    >
        {/* Border & Shadow Container */}
        <div className={`absolute inset-0 rounded-3xl border transition-colors duration-300
             ${isDark ? 'border-nl-dark/50' : 'border-gray-200'}
             group-hover:border-[rgba(25,250,198,0.5)]
             shadow-lg group-hover:shadow-2xl`}
             style={{ transform: "translateZ(0px)" }}
        />

       {/* Dynamic Glare Effect */}
       <motion.div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay"
          style={{ 
            background: useTransform(
                [glareX, glareY],
                ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.3) 0%, transparent 80%)`
            )
          }}
       />

       {/* Gradient Background */}
       <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl overflow-hidden"
          style={{ 
              background: `linear-gradient(135deg, ${tech.color}, transparent)`,
              transform: "translateZ(-10px)" // Push back slightly
          }}
       />

      <div className="relative h-full flex flex-col p-10 z-10" style={{ transform: "translateZ(50px)" }}>
        <div className="flex items-center gap-6 mb-12">
            <motion.div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm"
                style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
                    border: `1px solid ${tech.color}40`,
                    transform: "translateZ(30px)" // Pop out more
                }}
            >
                <img 
                    src={tech.logo} 
                    alt={tech.name} 
                    className="w-12 h-12 object-contain drop-shadow-lg"
                />
            </motion.div>
            <h3 className="text-4xl font-bold tracking-tight" style={{ color: tech.color }}>
                {tech.name}
            </h3>
        </div>

        <div className="flex-grow">
            <p className={`text-xl leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tech.description}
            </p>
        </div>

        <div className="mt-auto pt-8 border-t border-dashed border-gray-500/30 flex justify-between items-center opacity-60 font-mono text-sm">
            <span>// STACK_ID: {tech.name.toUpperCase()}</span>
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: tech.color }}></span>
        </div>
      </div>
    </motion.div>
  );
};

export default TechStackSection;
