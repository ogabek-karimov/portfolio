import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import useDocumentTitle from '../hooks/useDocumentTitle'

function HomePage() {
  useDocumentTitle()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const el = document.querySelector(location.hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [location])

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Projects />
      <Contact />
    </>
  )
}

export default HomePage
