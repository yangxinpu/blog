import { useState, useEffect, lazy, Suspense } from 'react';
import { Loading } from './components';
import logoImage from './assets/Images/logo.png';

const MainContent = lazy(() => import('./Layout/MainContent/MainContent'));

const LOAD_THRESHOLD = 800;
const pageLoadStartTime = performance.now();

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleLoad = () => {
      const loadTime = performance.now() - pageLoadStartTime;
      
      if (loadTime < LOAD_THRESHOLD) {
        const remainingTime = LOAD_THRESHOLD - loadTime;
        setTimeout(() => {
          setShowLoading(false);
        }, remainingTime);
      } else {
        setShowLoading(false);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (showLoading) {
    return <Loading logo={logoImage} text="NAILUO" />;
  }

  return (
    <Suspense fallback={<Loading logo={logoImage} text="NAILUO" />}>
      <MainContent theme={theme} toggleTheme={toggleTheme} />
    </Suspense>
  );
}

export default App;
