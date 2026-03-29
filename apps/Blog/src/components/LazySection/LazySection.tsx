import {
  useState,
  useEffect,
  useRef,
  Suspense,
  type ComponentType,
} from 'react';
import styles from './LazySection.module.scss';

interface LazySectionProps {
  lazyComponent: ComponentType;
  minHeight?: string;
  className?: string;
}

function LazySection({
  lazyComponent: LazyComponent,
  minHeight = '400px',
  className,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '0px 0px 50% 0px',
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.lazySection} ${className || ''}`}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      {isVisible ? (
        <Suspense
          fallback={<div className={styles.skeleton} style={{ minHeight }} />}
        >
          <LazyComponent />
        </Suspense>
      ) : (
        <div className={styles.skeleton} style={{ minHeight }} />
      )}
    </div>
  );
}

export default LazySection;
