import Home from './pages/home';
import KnowledgeIntro from './pages/knowledge-intro';
import LogoSection from './pages/logo-section';
import './App.css';

function App() {
  return (
    <div className="app">
      <main>
        <Home />
        <KnowledgeIntro />
        <LogoSection />
      </main>
    </div>
  );
}

export default App;
