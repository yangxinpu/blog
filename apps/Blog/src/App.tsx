import Home from './pages/Home';
import KnowledgeIntro from './pages/KnowledgeIntro';
import LogoSection from './pages/LogoSection';
import AboutSection from './pages/AboutSection';
import QuoteSection from './pages/QuoteSection';
import './App.css';

function App() {
  return (
    <div className="app">
      <main>
        <Home />
        <KnowledgeIntro />
        <LogoSection />
        <AboutSection />
        <QuoteSection />
      </main>
    </div>
  );
}

export default App;
