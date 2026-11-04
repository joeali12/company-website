import { CompanyIntro } from './components/CompanyIntro'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowWeWork } from './components/HowWeWork'
import { Products } from './components/Products'
import { Team } from './components/Team'

function App() {
  return (
    <>
      <a
        href="#main"
        className="absolute left-4 top-4 z-[100] -translate-y-16 rounded-full bg-cyan-400 px-4 py-2 font-semibold text-navy-950 outline-none transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <CompanyIntro />
        <Products />
        <HowWeWork />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
