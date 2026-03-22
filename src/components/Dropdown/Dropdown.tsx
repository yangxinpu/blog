import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import styles from './Dropdown.module.scss';

interface DropdownOption {
  value: string;
  label: string;
  path: string;
}

interface DropdownProps {
  options: DropdownOption[];
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleSelect = (path: string) => {
    // 使用window.location.assign来避免TypeScript错误
    window.location.assign(path);
  };

  return (
    <div 
      className={styles.dropdown} 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={styles.dropdownToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <span className={styles.dropdownArrow}>
          {isOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={16} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={16} />
            </motion.div>
          )}
        </span>
      </button>
      {isOpen && (
        <motion.ul
          className={styles.dropdownMenu}
          initial={{ opacity: 0, y: -10, visibility: 'hidden' }}
          animate={{ opacity: 1, y: 0, visibility: 'visible' }}
          exit={{ opacity: 0, y: -10, visibility: 'hidden' }}
          transition={{ duration: 0.2 }}
        >
          {options.map(option => (
            <motion.li
              key={option.value}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option.path)}
              whileHover={{ backgroundColor: 'var(--accent)', color: 'white',borderRadius: 8 }}
              whileTap={{ scale: 0.3 }}
            >
              {option.label}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dropdown;