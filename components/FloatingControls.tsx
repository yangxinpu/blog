import React from 'react';
import { Moon, Sun, Languages } from 'lucide-react';
import { Theme, Language } from '../types';

interface FloatingControlsProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({ theme, setTheme, lang, setLang }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-3 rounded-full bg-nl-black/80 backdrop-blur-md border border-nl-dark shadow-[0_0_15px_rgba(25,250,198,0.3)] hover:scale-110 hover:shadow-[0_0_25px_rgba(25,250,198,0.6)] transition-all duration-300 group"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-nl-neon group-hover:rotate-90 transition-transform duration-500" />
        ) : (
          <Moon className="w-6 h-6 text-nl-light group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
        className="p-3 rounded-full bg-nl-black/80 backdrop-blur-md border border-nl-dark shadow-[0_0_15px_rgba(25,250,198,0.3)] hover:scale-110 hover:shadow-[0_0_25px_rgba(25,250,198,0.6)] transition-all duration-300 group"
      >
        <Languages className="w-6 h-6 text-nl-neon group-hover:scale-110 transition-transform" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-nl-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {lang === 'en' ? 'Switch to 中文' : 'Switch to English'}
        </span>
      </button>
    </div>
  );
};

export default FloatingControls;