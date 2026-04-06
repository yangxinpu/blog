import { useEffect, useRef, useState } from 'react';

interface UseSectionActivityOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useSectionActivity<T extends HTMLElement>({
  rootMargin = '20% 0px 20% 0px',
  threshold = 0.1,
}: UseSectionActivityOptions = {}) {
  const ref = useRef<T | null>(null);
  const isObserverSupported = typeof IntersectionObserver !== 'undefined';

  const [isActive, setIsActive] = useState(() => !isObserverSupported);
  const [hasEnteredView, setHasEnteredView] = useState(() => !isObserverSupported);

  useEffect(() => {
    if (!isObserverSupported) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsActive = entry.isIntersecting;
        setIsActive(nextIsActive);

        if (nextIsActive) {
          setHasEnteredView(true);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, isObserverSupported]);

  return {
    ref,
    isActive,
    hasEnteredView,
  };
}
