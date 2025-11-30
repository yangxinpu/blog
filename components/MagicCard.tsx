import React, { useRef, MouseEvent } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MagicCardProps extends HTMLMotionProps<'div'> {
  gradientSize?: number;
  gradientColor?: string;
  children: React.ReactNode;
}

const MagicCard: React.FC<MagicCardProps> = ({ children, className = '', gradientSize = 300, gradientColor = '#19fac6', link, ...props }) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.current = clientX - left;
    mouseY.current = clientY - top;

    currentTarget.style.setProperty('--mouse-x', `${mouseX.current}px`);
    currentTarget.style.setProperty('--mouse-y', `${mouseY.current}px`);
  }
  function handleClick() {
    window.open(link || '', '_blank');
  }
  return (
    <motion.div onMouseMove={handleMouseMove} onClick={handleClick} className={`group relative overflow-hidden ${className}`} {...props}>
      {/* Spotlight Effect Layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-10 mix-blend-plus-lighter"
        style={{
          background: `radial-gradient(${gradientSize}px circle at var(--mouse-x) var(--mouse-y), ${gradientColor}, transparent 100%)`,
        }}
      />

      {/* Content Layer */}
      <div className="relative h-full z-20">{children}</div>
    </motion.div>
  );
};

export default MagicCard;
