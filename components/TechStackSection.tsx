import React, { useRef } from 'react';
import { motion, useTransform, useScroll, useMotionValue, useSpring, useInView } from 'framer-motion';
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
    offset: ['start start', 'end end']
  });

  // 基础滚动变换 - 调整滚动范围以适应更多动画效果
  const containerX = useTransform(scrollYProgress, [0, 1], ['10%', '-85%']);
  
  // 视差效果 - 不同元素以不同速度移动
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -50, -100]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.3, 0]);
  
  // 生成一些装饰性关键词，跟随滚动显示 - 使用技术相关的关键词并添加颜色
  const keywords = [
    { text: "创新", color: '#19fac6' },
    { text: "性能", color: '#61DAFB' },
    { text: "体验", color: '#F7DF1E' },
    { text: "前沿", color: '#4FC08D' },
    { text: "可扩展", color: '#1572B6' },
    { text: "高效", color: '#F9DC3E' },
    { text: "稳定", color: '#4B32C3' },
    { text: "优雅", color: '#F7B93E' }
  ];

  return (
    <section ref={targetRef} className="relative h-[400vh] z-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden perspective-1500">
        {/* 背景装饰效果 */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: theme === 'dark' 
              ? 'radial-gradient(circle at 50% 50%, rgba(25,250,198,0.03) 0%, transparent 70%)' 
              : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 70%)'
          }}
        />
        
        {/* 标题区域 - 添加视差效果和额外的文字动画 */}
        <div className="absolute top-24 md:top-32 left-8 md:left-20 z-50 pointer-events-none">
          <motion.div 
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            viewport={{ once: true }} 
            className="mb-4"
          >
            {/* 给标题添加滚动动画效果 */}
            <motion.h2 
              className={`text-5xl md:text-7xl font-black drop-shadow-2xl ${theme === 'dark' ? 'text-nl-neon' : 'text-nl-dark'}`}
              animate={{
                // 添加微妙的上下浮动效果
                y: useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -5, 0, 5, 0]),
                // 添加文字缩放效果
                scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]),
                // 添加文字颜色变化效果
                color: useTransform(scrollYProgress, [0, 0.5, 1], 
                  [theme === 'dark' ? '#19fac6' : '#366454', 
                   theme === 'dark' ? '#61DAFB' : '#38967a', 
                   theme === 'dark' ? '#19fac6' : '#366454']
                )
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {title}
            </motion.h2>
          </motion.div>
          <motion.p
            style={{ opacity: subtitleOpacity }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-nl-dark'} drop-shadow-md`}
          >
            {subtitle}
          </motion.p>
        </div>
        
        {/* 关键词跟随动画 - 根据滚动位置显示不同关键词，添加色彩 */}
        {keywords.map((keyword, index) => (
          <motion.div
            key={keyword.text}
            className={`absolute font-bold text-7xl md:text-9xl opacity-10 select-none pointer-events-none`}
            style={{
              left: `${10 + index * 8}%`,
              top: `${30 + Math.sin(index) * 15}%`,
              opacity: useTransform(scrollYProgress, [index * 0.1, index * 0.1 + 0.3, index * 0.1 + 0.5], [0, 0.15, 0]),
              scale: useTransform(scrollYProgress, [index * 0.1, index * 0.1 + 0.3, index * 0.1 + 0.5], [0.8, 1, 1.2]),
              rotate: useTransform(scrollYProgress, [index * 0.1, index * 0.1 + 0.5], [0, Math.sin(index) * 10]),
              color: keyword.color // 使用关键词指定的颜色
            }}
          >
            {keyword.text}
          </motion.div>
        ))}
        
        {/* 卡片容器 - 添加滚动效果 */}
        <motion.div 
          style={{ x: containerX }}
          className="flex gap-20 md:gap-32 pl-[10vw] md:pl-[30vw] items-center h-full py-10"
        >
          {items.map((tech, index) => (
            <AnimatedTechCard 
              key={tech.name} 
              tech={tech} 
              theme={theme} 
              index={index} 
              total={items.length} 
            />
          ))}
        </motion.div>
        
        {/* 删除底部的进度条 */}
      </div>
    </section>
  );
};

// 增强的技术卡片组件，添加更多动画效果
const AnimatedTechCard: React.FC<{ 
  tech: TechItem; 
  theme: 'dark' | 'light';
  index: number;
  total: number;
}> = ({ tech, theme, index }) => {
  const isDark = theme === 'dark';
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // 基于索引的动画延迟
  const baseDelay = 0;
  
  // 滚动进度相关动画值
  const { scrollYProgress } = useScroll();
  
  // 基于滚动位置的卡片动画
  const cardProgress = useTransform(
    scrollYProgress,
    [(index - 1) * 0.25, index * 0.25, (index + 1) * 0.25],
    [0, 1, 0]
  );
  
  // 卡片缩放和透明度动画 - 增加缩放值使卡片更突出，增加透明度
  const cardScale = useTransform(cardProgress, [0, 0.8, 1], [0.8, 1, 1.1]);
  const cardOpacity = useTransform(cardProgress, [0, 0.8, 1], [0.5, 0.95, 0.95]);
  
  // 鼠标悬浮时的透明度变化
  const hoverOpacity = useMotionValue(0.95); // 默认透明度更高
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-15deg', '15deg']);

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  // 卡片内元素的3D深度效果
  const titleZ = useTransform(cardProgress, [0, 1], [0, 60]);
  const descriptionZ = useTransform(cardProgress, [0, 0.6, 1], [0, 30, 40]);
  const logoZ = useTransform(cardProgress, [0, 0.8, 1], [0, 80, 100]);

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

  const handleMouseEnter = () => {
    // 鼠标悬浮时透明度更高
    hoverOpacity.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // 鼠标离开时恢复默认透明度
    hoverOpacity.set(0.95);
  };

  // 为Next.js添加特殊处理，因为它的颜色是白色
  const borderColor = tech.name === 'Next.js' ? 'rgba(255, 255, 255, 0.8)' : tech.color;

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        scale: cardScale,
        opacity: hoverOpacity // 使用hoverOpacity控制透明度
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative h-[60vh] w-[80vw] md:w-[450px] flex-shrink-0 rounded-3xl transition-all duration-700
      ${isDark ? 'bg-nl-black/95' : 'bg-white/95'} 
      backdrop-blur-xl
      shadow-xl 
      `}
    >
      {/* 使用技术自带的颜色作为边框 */}
      <motion.div
        className={`absolute inset-0 rounded-3xl transition-all duration-500
             shadow-lg group-hover:shadow-2xl`}
        style={{
          border: `3px solid ${borderColor}80`, // 使用技术自带的颜色作为边框，增加边框宽度
          boxShadow: `0 0 20px ${borderColor}40`, // 添加发光效果
          transform: 'translateZ(0px)'
        }}
      />
      {/* 增强的动态光晕效果 */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay"
        style={{
          background: useTransform([glareX, glareY], ([x, y]) => 
            `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.4) 0%, transparent 70%)`
          ),
        }}
      />

      {/* 动态背景渐变 - 随滚动变化 */}
      <motion.div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-all duration-700 rounded-3xl overflow-hidden"
        style={{
          background: useTransform(cardProgress, [0, 1], [
            `linear-gradient(135deg, ${tech.color}20, transparent)`,
            `linear-gradient(45deg, ${tech.color}40, transparent)`
          ]),
          transform: useTransform(cardProgress, [0, 1], ['translateZ(-10px)', 'translateZ(-20px)']),
        }}
      />

      <div className="relative h-full flex flex-col p-10 z-10" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex items-center gap-6 mb-12">
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${tech.color}40`,
              transform: useTransform(logoZ, z => `translateZ(${z}px)`),
            }}
          >
            <img src={tech.logo} alt={tech.name} className="w-12 h-12 object-contain drop-shadow-lg" />
          </motion.div>
          <motion.h3 
            className="text-4xl font-bold tracking-tight" 
            style={{ 
              color: tech.color,
              transform: useTransform(titleZ, z => `translateZ(${z}px)`),
              textShadow: `0 0 15px ${tech.color}40`
            }}
          >
            {tech.name}
          </motion.h3>
        </div>

        <motion.div 
          className="flex-grow"
          style={{ transform: useTransform(descriptionZ, z => `translateZ(${z}px)`) }}
        >
          <motion.p 
            className={`text-xl leading-relaxed font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: baseDelay + 0.2, duration: 0.8 }}
          >
            {tech.description}
          </motion.p>
        </motion.div>

        {/* 技术特性标签 */}https://www.trae.ai/
        {tech.tags && tech.tags.length > 0 && (
          <motion.div 
            className="mt-8 space-y-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: baseDelay + 0.4, duration: 0.6 }}
          >
            {tech.tags.map((tag, idx) => (
              <motion.span 
                key={tag}
                className="inline-block px-4 py-2 m-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${tech.color}20`,
                  color: tech.color,
                  border: `1px solid ${tech.color}40`,
                  transform: useTransform(cardProgress, [0, 1], [
                    `translateZ(0px) translateY(${10 - idx * 2}px)`,
                    `translateZ(30px) translateY(0px)`
                  ])
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: baseDelay + 0.5 + idx * 0.1, duration: 0.4 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        <div className="mt-auto pt-8 border-t border-dashed border-gray-500/30 flex justify-between items-center opacity-60 font-mono text-sm">
          <span>// STACK_ID: {tech.name.toUpperCase()}</span>
          <motion.span 
            className="w-3 h-3 rounded-full" 
            style={{ background: tech.color }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TechStackSection;