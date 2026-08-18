import { useLanguage } from '../i18n/LanguageContext'
import './Hero.css'

function Hero() {
  const { dict } = useLanguage()

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
          <a
            href="https://portfolio-contact-relay.bek8896ok.workers.dev/resume.pdf"
            className="btn btn-outline"
          >
            {dict.resume.downloadBtn}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
