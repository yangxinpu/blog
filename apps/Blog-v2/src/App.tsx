import { Navbar } from './components/Navbar/Navbar'
import { Home } from './pages/Home/Home'
import { About } from './pages/About/About'
import { TechStack } from './pages/TechStack/TechStack'
import { Projects } from './pages/Projects/Projects'
import { Blog } from './pages/Blog/Blog'
import { Contact } from './pages/Contact/Contact'
import { Footer } from './pages/Footer/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Home />
        <About />
        <TechStack />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App