import { useState, useEffect, lazy, Suspense } from 'react';
import { Loading } from './components';
import logoImage from './assets/Images/logo.png';

const MainContent = lazy(() => import('./Layout/MainContent/MainContent'));

const LOAD_THRESHOLD = 800;
const pageLoadStartTime = performance.now();

function App() {
  const [showLoading, setShowLoading] = useState(true);

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

  if (showLoading) {
    return <Loading logo={logoImage} text="NAILUO" />;
  }

  return (
    <Suspense fallback={<Loading logo={logoImage} text="NAILUO" />}>
      <MainContent />
    </Suspense>
  );
}

export default App;
