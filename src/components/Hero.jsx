import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Hero.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

function Hero() {
  const { dict } = useLanguage()
  const [resumeHidden, setResumeHidden] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => setResumeHidden(Boolean(data.resume && data.resume.hidden)))
      .catch(() => {})
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="container hero-inner">
        <p className="hero-kicker">{dict.hero.kicker}</p>
        <h1>
          {dict.hero.name}
          <br />
          <span>{dict.hero.role}</span>
        </h1>
        <p className="hero-text">{dict.hero.text}</p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            {dict.hero.ctaProjects}
          </a>
          <a href="#contact" className="btn btn-outline">
            {dict.hero.ctaContact}
          </a>
          {!resumeHidden && (
            <Link to="/resume" className="btn btn-outline">
              {dict.resume.downloadBtn}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
