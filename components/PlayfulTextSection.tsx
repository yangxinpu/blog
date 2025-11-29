import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Language } from '../types';

interface PlayfulTextSectionProps {
  lang: Language;
  theme: 'dark' | 'light';
}

const TEXT_CONTENT = {
  en: {
    top: "Coding with Zen 🌸",
    middle: "Bugs? Just Features 🍃",
    bottom: "To Infinity ⭐️",
    sub: "Growing everyday 🌳"
  },
  zh: {
    top: "代码如诗 🌸",
    middle: "Bug? 不，是特性 🍃",
    bottom: "浩瀚星辰 ⭐️",
    sub: "每天都在成长 🌳"
  }
};

const PlayfulTextSection: React.FC<PlayfulTextSectionProps> = ({ lang, theme }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  const springScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const xRight = useTransform(springScroll, [0, 1], ["-20%", "10%"]);
  const xLeft = useTransform(springScroll, [0, 1], ["20%", "-10%"]);
  const rotate = useTransform(springScroll, [0, 1], [5, -5]);
  const scale = useTransform(springScroll, [0.3, 0.7], [0.8, 1.2]);

  const t = TEXT_CONTENT[lang];
  const isDark = theme === 'dark';

  return (
    <section ref={targetRef} className="py-40 overflow-hidden relative flex flex-col items-center justify-center min-h-[80vh]">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
             <motion.div 
                style={{ y: useTransform(springScroll, [0, 1], [0, -200]), x: "10%" }} 
                className="absolute top-20 right-10 text-6xl blur-[2px]"
            >
                🍃
            </motion.div>
            <motion.div 
                style={{ y: useTransform(springScroll, [0, 1], [0, -100]), x: "-20%" }} 
                className="absolute bottom-20 left-10 text-8xl blur-[4px]"
            >
                🌳
            </motion.div>
        </div>

        <motion.div style={{ x: xRight }} className="relative z-10">
            <h2 className={`text-6xl md:text-8xl lg:text-9xl font-black whitespace-nowrap ${isDark ? 'text-nl-dark/20' : 'text-gray-200'}`}>
                {t.top}
            </h2>
        </motion.div>
        
        <motion.div style={{ scale, rotate }} className="relative z-20 my-16 text-center transform origin-center">
            <h3 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nl-light to-nl-neon drop-shadow-lg">
                {t.middle}
            </h3>
            <p className={`mt-6 text-xl md:text-2xl font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.sub}
            </p>
        </motion.div>

        <motion.div style={{ x: xLeft }} className="relative z-10">
            <h2 className={`text-6xl md:text-8xl lg:text-9xl font-black whitespace-nowrap ${isDark ? 'text-nl-dark/20' : 'text-gray-200'}`}>
                 {t.bottom}
            </h2>
        </motion.div>
    </section>
  );
};

export default PlayfulTextSection;