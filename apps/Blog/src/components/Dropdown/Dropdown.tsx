import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronRight } from 'lucide-react';
import styles from './Dropdown.module.scss';

gsap.registerPlugin(useGSAP);

interface DropdownOption {
  value: string;
  label: string;
  path: string;
}

interface DropdownProps {
  options: DropdownOption[];
  label: string;
  mainPath?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, label, mainPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    window.open(path, '_blank');
    setIsOpen(false);
  };

  const handleToggleClick = () => {
    if (mainPath) {
      window.open(mainPath, '_blank');
    } else {
      setIsOpen(!isOpen);
    }
  };

  // 箭头旋转 + 菜单进出动画
  useGSAP(
    () => {
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          rotation: isOpen ? 90 : 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (isOpen) {
        setShouldRenderMenu(true);
      } else if (menuRef.current) {
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -10,
          visibility: 'hidden',
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => setShouldRenderMenu(false),
        });
      } else {
        setShouldRenderMenu(false);
      }
    },
    { dependencies: [isOpen] }
  );

  // 菜单入场动画（在 shouldRenderMenu 变为 true 后执行）
  useGSAP(
    () => {
      if (shouldRenderMenu && menuRef.current) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -10, visibility: 'hidden' },
          {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            duration: 0.2,
            ease: 'power2.out',
          }
        );
      }
    },
    { dependencies: [shouldRenderMenu] }
  );

  const handleItemEnter = useCallback(
    (el: HTMLLIElement | null) => {
      if (!el) return;
      gsap.to(el, {
        backgroundColor: 'var(--accent)',
        color: '#ffffff',
        borderRadius: 8,
        duration: 0.2,
        ease: 'power2.out',
      });
    },
    []
  );

  const handleItemLeave = useCallback((el: HTMLLIElement | null) => {
    if (!el) return;
    gsap.to(el, {
      backgroundColor: 'transparent',
      color: 'inherit',
      borderRadius: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }, []);

  const handleItemDown = useCallback((el: HTMLLIElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 0.3, duration: 0.15, ease: 'power2.out' });
  }, []);

  const handleItemUp = useCallback((el: HTMLLIElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out' });
  }, []);

  return (
    <div
      className={styles.dropdown}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={styles.dropdownToggle}
        onClick={handleToggleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <span className={styles.dropdownArrow}>
          <span ref={arrowRef} style={{ display: 'inline-block' }}>
            <ChevronRight size={16} />
          </span>
        </span>
      </button>
      {shouldRenderMenu && (
        <ul className={styles.dropdownMenu} ref={menuRef}>
          {options.map((option) => (
            <li
              key={option.value}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option.path)}
              onMouseEnter={(e) => handleItemEnter(e.currentTarget)}
              onMouseLeave={(e) => handleItemLeave(e.currentTarget)}
              onMouseDown={(e) => handleItemDown(e.currentTarget)}
              onMouseUp={(e) => handleItemUp(e.currentTarget)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
