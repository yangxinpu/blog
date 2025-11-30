import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  fullScreen?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = '', delay = 0.1, fullScreen = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 50, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, delay: delay, ease: 'easeOut' }}
      className={`relative z-10 ${fullScreen ? 'min-h-screen flex flex-col justify-center' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;
