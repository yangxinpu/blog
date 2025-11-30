import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { 
  ChevronDown, Layers, ExternalLink, Github, ArrowRight,
  BookOpen, Camera, Activity, Plane, Film, Music, Hash
} from 'lucide-react';
import { CONTENT } from './constants';
import { Language, Theme } from './types';
import CanvasBackground from './components/CanvasBackground';
import FloatingControls from './components/FloatingControls';
import SectionWrapper from './components/SectionWrapper';
import TechStackSection from './components/TechStackSection';
import GalaxySection from './components/GalaxySection';
import ScrollingText from './components/ScrollingText';
import BlurText from './components/BlurText';
import MagicCard from './components/MagicCard';
import PlayfulTextSection from './components/PlayfulTextSection';
import ManifestoSection from './components/ManifestoSection';
import VideoShowcase from './components/VideoShowcase';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('dark');
  const t = CONTENT[lang];
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0f0f0e';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f3f4f6';
    }
  }, [theme]);

  // Styling helper for cards based on theme
  const cardClass = `
    p-8 rounded-2xl border backdrop-blur-md transition-all duration-300
    ${theme === 'dark' 
      ? 'bg-nl-black/40 border-nl-dark/50 text-gray-200' 
      : 'bg-white/60 border-gray-200 text-gray-800 shadow-xl'
    }
  `;

  // Magic Card Gradient Color
  const magicGradient = theme === 'dark' ? 'rgba(25, 250, 198, 0.15)' : 'rgba(54, 100, 84, 0.1)';

  // Icon mapping for hobbies
  const HobbyIcon = ({ name, className }: { name: string, className?: string }) => {
    switch (name) {
        case 'book': return <BookOpen className={className} />;
        case 'camera': return <Camera className={className} />;
        case 'activity': return <Activity className={className} />;
        case 'plane': return <Plane className={className} />;
        case 'film': return <Film className={className} />;
        case 'music': return <Music className={className} />;
        default: return <Activity className={className} />;
    }
  };

  // Helper for "Converging" animations
  const getEntranceVariant = (index: number): Variants => {
    // 0: Left, 1: Bottom, 2: Right, 3: Top (Cycle)
    const directions = [
        { x: -100, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 0 },
        { x: 0, y: -100 },
    ];
    return {
        hidden: { opacity: 0, ...directions[index % 4] },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-nl-neon selection:text-nl-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-nl-dark via-nl-light to-nl-neon transform origin-left z-50"
        style={{ scaleX }}
      />

      <FloatingControls theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />

      {/* Main Content Layer - Scrolls over fixed footer */}
      {/* marginBottom: 100vh ensures we can scroll 'past' the content to reveal the footer */}
      <div 
        className={`relative z-10 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f0f0e]' : 'bg-[#f3f4f6]'}`}
        style={{ marginBottom: '300px' }}
      >
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
          
          {/* BACKGROUND ONLY FOR HERO */}
          <CanvasBackground theme={theme} />

          <SectionWrapper className="text-center z-10 flex flex-col items-center">
            {/* MOTTO - Main Focus */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-12"
            >
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-nl-light to-nl-neon drop-shadow-lg">
                 {t.hero.motto}
              </h1>
            </motion.div>

            {/* NAME & AVATAR CONTAINER */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col md:flex-row items-center gap-6 mb-8"
            >
                 <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-nl-neon to-nl-dark rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                    <img 
                        src="./images/cat.webp" 
                        alt="NaiLuo Avatar" 
                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-nl-black object-cover transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    />
                 </div>
                 
                 <div className="text-center md:text-left">
                     <BlurText 
                        text={t.hero.name} 
                        as="h2" 
                        className="text-4xl md:text-5xl font-mono font-bold text-nl-light block"
                        delay={0.6}
                     />
                 </div>
            </motion.div>

            {/* SUBTITLE */}
            <div className={`max-w-2xl mx-auto text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
               <BlurText text={t.hero.subtitle} delay={1} />
            </div>
          </SectionWrapper>
          
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12"
          >
            <ChevronDown className="w-12 h-12 text-nl-neon opacity-80" />
            <span className="sr-only">{t.hero.scroll}</span>
          </motion.div>
        </section>

        {/* GALAXY SECTION (Scroll transition from Hero to Tech) */}
        <GalaxySection theme={theme} />

        {/* TECH STACK */}
        <div className="relative z-20">
            <ScrollingText text="TECHNOLOGY • INNOVATION • PERFORMANCE • " />
            <TechStackSection 
                items={t.stack.items} 
                title={t.stack.title} 
                subtitle={t.stack.subtitle}
                theme={theme}
            />
        </div>

        {/* PLAYFUL TEXT SECTION */}
        <PlayfulTextSection lang={lang} theme={theme} />

        {/* PROJECTS */}
        <section className="min-h-screen flex items-center py-20 px-4 md:px-12 bg-gradient-to-b from-transparent to-nl-black/30 relative overflow-hidden">
          <ScrollingText text="PROJECTS • DEVELOPMENT • CREATIVITY • " />
          <div className="container mx-auto z-10">
            <SectionWrapper>
                <div className="text-center mb-20">
                    <BlurText text={t.projects.title} as="h2" className="text-4xl md:text-5xl font-bold mb-4" />
                    <div className="w-20 h-1 bg-nl-neon mx-auto rounded-full mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.projects.items.map((project, idx) => (
                    <MagicCard 
                        key={project.id}
                        variants={getEntranceVariant(idx)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className={`${cardClass} flex flex-col justify-between h-[400px]`}
                        gradientColor={magicGradient}
                        link={project.link}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-gradient-to-br from-nl-dark to-nl-black rounded-xl shadow-lg group-hover:shadow-nl-neon/20 transition-shadow">
                                    <Layers className="w-8 h-8 text-nl-neon" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-nl-light transition-colors">{project.title}</h3>
                            <p className="text-lg opacity-70 mb-6 overflow-hidden text-ellipsis line-clamp-3">{project.description}</p>
                        </div>
                        
                        <div className="mt-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.map(t => (
                                <span key={t} className="px-2 py-1 text-xs font-mono rounded bg-nl-light/10 text-nl-light border border-nl-light/20">
                                    {t}
                                </span>
                                ))}
                            </div>
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-nl-dark to-transparent opacity-50 group-hover:via-nl-neon transition-all duration-500" />
                            <div className="flex items-center gap-2 mt-4 text-sm font-bold text-nl-neon opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                View Case Study <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </MagicCard>
                ))}
                </div>
            </SectionWrapper>
          </div>
        </section>

        {/* THOUGHTS & INSIGHTS */}
        <section className="min-h-screen flex items-center py-20 px-4 md:px-12 relative">
            <div className="absolute top-20 left-0 w-full opacity-5">
                 <ScrollingText text="INSIGHTS • THOUGHTS • IDEAS • " />
            </div>
            <div className="container mx-auto z-10">
                <SectionWrapper>
                    <div className="mb-20">
                        <BlurText text={t.thoughts.title} as="h2" className="text-4xl md:text-5xl font-bold mb-4" />
                        <p className="text-xl opacity-60 max-w-2xl mt-4">
                             <BlurText text={t.thoughts.subtitle} delay={0.2} />
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {t.thoughts.items.map((thought, idx) => (
                            <MagicCard
                                key={thought.id}
                                variants={getEntranceVariant(idx)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                className={`p-8 rounded-2xl border transition-all duration-300 ${
                                    theme === 'dark' ? 'bg-nl-black/60 border-nl-dark/30' : 'bg-white border-gray-200'
                                }`}
                                gradientColor={magicGradient}
                            >
                                <div className="flex items-center gap-4 mb-6 text-sm font-mono opacity-60">
                                    <span>{thought.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-nl-neon" />
                                    <div className="flex gap-2">
                                        {thought.tags.map(tag => (
                                            <span key={tag} className="flex items-center text-nl-light">
                                                <Hash className="w-3 h-3 mr-0.5" />{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-nl-light transition-colors">{thought.title}</h3>
                                <p className="opacity-80 leading-relaxed mb-6">{thought.summary}</p>
                                <button className="flex items-center gap-2 text-nl-neon font-bold group-hover:translate-x-2 transition-transform">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </button>
                            </MagicCard>
                        ))}
                    </div>
                </SectionWrapper>
            </div>
        </section>

        {/* MANIFESTO SECTION */}
        <ManifestoSection theme={theme} word={t.manifesto} />

        {/* HOBBIES */}
        <section className="min-h-screen flex items-center py-20 px-4 md:px-12 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-nl-dark/10 to-nl-neon/5 rounded-full blur-[100px] pointer-events-none" />
            <ScrollingText text="LIFE • HOBBIES • PASSION • " />

            <div className="container mx-auto relative z-10 mt-10">
                <SectionWrapper>
                    <div className="text-center mb-20">
                        <BlurText text={t.hobbies.title} as="h2" className="text-4xl md:text-5xl font-bold mb-4" />
                        <p className="text-xl opacity-60 mt-4">
                            <BlurText text={t.hobbies.subtitle} delay={0.2} />
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {t.hobbies.items.map((hobby, i) => (
                            <MagicCard
                                key={hobby.id}
                                variants={getEntranceVariant(i)}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className={`
                                    relative p-8 rounded-3xl overflow-hidden
                                    ${theme === 'dark' ? 'bg-nl-black/40 border-nl-dark/30' : 'bg-white/80 border-gray-100 shadow-xl'}
                                `}
                                gradientColor={magicGradient}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                                        bg-gradient-to-br 
                                        ${i === 0 ? 'from-blue-500 to-cyan-500' : 
                                          i === 1 ? 'from-orange-500 to-red-500' : 
                                          i === 2 ? 'from-green-500 to-emerald-500' : 
                                          i === 3 ? 'from-indigo-500 to-purple-500' : 
                                          i === 4 ? 'from-pink-500 to-rose-500' : 
                                          'from-violet-500 to-fuchsia-500'}
                                    `}>
                                        <HobbyIcon name={hobby.iconKey} className="w-8 h-8" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-3">{hobby.name}</h3>
                                    <p className="opacity-70 leading-relaxed text-sm">
                                        {hobby.description}
                                    </p>
                                </div>
                            </MagicCard>
                        ))}
                    </div>
                </SectionWrapper>
            </div>
        </section>
        <VideoShowcase theme={theme} lang={lang} />
        <footer className="w-full py-12 text-center relative z-20 border-t border-nl-dark/20 bg-nl-black">
            <div className="flex justify-center gap-8 mb-6">
                <a href="https://github.com/yangxinpu/blog" target="_blank">
                    <Github className="w-8 h-8 hover:text-white cursor-pointer transition-colors" />
                </a>        
           </div>
           <p className="text-sm font-mono opacity-60">© {new Date().getFullYear()} NaiLuo. All rights reserved.</p>
        </footer>              
      </div>
      <div 
        className={`fixed bottom-0 left-0 w-full z-0 flex flex-col justify-end overflow-hidden ${theme === 'dark' ? 'bg-nl-neon' : 'bg-nl-light'}`}
      >
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className={`py-24 relative overflow-hidden flex-1 flex flex-col justify-center ${theme === 'dark' ? 'bg-nl-neon' : 'bg-nl-light'}`}
        >
            <div className="container mx-auto text-center">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative inline-block"
                >
                    <h2 className="text-8xl md:text-[100px] lg:text-[200px] font-black tracking-tighter">
                        {"NAILUO".split('').map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    scale: 1.2,
                                    rotate: Math.sin(index) * 5,
                                    color: "rgba(0,0,0,0.8)",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    transition: { duration: 0.1 }
                                }}
                                className="inline-block text-black cursor-pointer"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h2>
                    <motion.div
                        className="absolute -bottom-6 left-0 h-1 bg-black/80"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.8,
                            duration: 1,
                            ease: "easeOut"
                        }}
                    />
                </motion.div>
            </div>
        </motion.section>
      </div>

    </div>
  );
};
export default App;