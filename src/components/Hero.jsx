import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { skills } from '../data/skills'
import cardPhoto from '../assets/profile-card.jpg'
import './Hero.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'
const CODING_SINCE = 2024
const CARD_TAGS = ['HTML', 'CSS', 'JS', 'React']
const MAX_TILT = 4

const icon = {
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  pin: 'M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  send: 'M21 3 3 10.5l7 2.5 2.5 7L21 3z M10 13l4.5-4.5',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
}

function Icon({ path, size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="dl-arrow" d="M12 4v11 M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}

function Hero() {
  const { dict } = useLanguage()
  const [resumeHidden, setResumeHidden] = useState(false)
  const cardRef = useRef(null)

  // The card turns to face the mouse and a light spot follows it. The pointer is
  // measured on the untransformed scene so the tilt itself never skews the reading.
  function handleCardMove(e) {
    if (e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const card = cardRef.current
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
    card.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT}deg`)
    card.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT}deg`)
  }

  function handleCardLeave() {
    cardRef.current.style.setProperty('--rx', '0deg')
    cardRef.current.style.setProperty('--ry', '0deg')
  }

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => setResumeHidden(Boolean(data.resume && data.resume.hidden)))
      .catch(() => {})
  }, [])

  const stats = [
    { value: dict.projects.items.length, label: dict.hero.statProjects },
    { value: skills.length, label: dict.hero.statTech },
    { value: `${new Date().getFullYear() - CODING_SINCE}+`, label: dict.hero.statYears },
  ]

  return (
    <section className="hero" id="hero">
      <span className="hero-watermark" aria-hidden="true">
        Developer
      </span>

      <div className="container hero-grid">
        <div className="hero-intro">
          <span className="code-tag">&lt;h1&gt;</span>
          <h1>
            {dict.hero.kicker} <span className="hero-name">{dict.hero.firstName}</span>,
            <br />
            {dict.hero.role}
          </h1>
          <span className="code-tag">&lt;/h1&gt;</span>

          <span className="code-tag">&lt;p&gt;</span>
          <p className="hero-text">{dict.hero.text}</p>
          <span className="code-tag">&lt;/p&gt;</span>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary hero-cta">
              {dict.hero.ctaProjects}
              <span className="hero-cta-arrow">
                <Icon path={icon.arrow} size={18} />
              </span>
            </a>
            <a href="#contact" className="hero-talk">
              {dict.hero.ctaContact}
              <span className="hero-talk-icon">
                <Icon path={icon.mail} />
              </span>
            </a>
          </div>

          <dl className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="hero-card-scene" onPointerMove={handleCardMove} onPointerLeave={handleCardLeave}>
          <div className="hero-card" ref={cardRef}>
            <div className="hero-card-photo">
              <img src={cardPhoto} alt="Og'abek Karimov" className="hero-card-avatar" />
            </div>
            <h2 className="hero-card-name">Og'abek Karimov</h2>
            <p className="hero-card-role">Frontend Developer</p>
            <p className="hero-card-status">
              <span className="hero-card-status-dot" aria-hidden="true" />
              {dict.hero.status}
            </p>

            <ul className="hero-card-info">
              <li>
                <Icon path={icon.mail} />
                <a href="mailto:bek8896ok@gmail.com">{dict.hero.cardEmail}</a>
              </li>
              <li>
                <Icon path={icon.pin} />
                <span>{dict.hero.location}</span>
              </li>
              <li>
                <Icon path={icon.send} />
                <a href="https://t.me/Uzswlu_rttm" target="_blank" rel="noreferrer">
                  {dict.hero.cardTelegram}
                </a>
              </li>
            </ul>

            <div className="hero-card-tags">
              {CARD_TAGS.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            {!resumeHidden && (
              <Link to="/resume" className="btn btn-primary hero-card-cv">
                {dict.resume.downloadBtn}
                <DownloadIcon />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Hero
