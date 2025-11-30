import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0,
  as: Component = 'span', // 改为默认使用 span 而不是 div，这样可以安全地放在 p 标签内
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  // Split text into words
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 20,
    },
  };

  // 对于 span 和其他行内元素，使用不同的包装方式
  const isInline = ['span'].includes(Component);

  return (
    <motion.span // 始终使用 span 作为最外层容器以避免 p 标签内的 div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`${isInline ? 'inline' : 'block'} ${className}`}
      custom={1}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default BlurText;
