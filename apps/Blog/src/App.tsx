import { useState, useEffect, lazy, Suspense } from 'react';
import Loading from '@blog/ui';
import logoImage from './assets/Images/logo.png';

const MainContent = lazy(() => import('./components/MainContent/MainContent'));

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Suspense fallback={<Loading logo={logoImage} text="NAILUO" />}>
      <MainContent theme={theme} toggleTheme={toggleTheme} />
    </Suspense>
  );
}

export default App;
