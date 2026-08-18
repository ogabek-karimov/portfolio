import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './NotFoundPage.css'

function NotFoundPage() {
  const { dict } = useLanguage()
  const starsRef = useRef(null)

  useEffect(() => {
    const container = starsRef.current
    if (!container || container.childElementCount > 0) return
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = Math.random() * 100 + '%'
      star.style.top = Math.random() * 100 + '%'
      star.style.animationDelay = Math.random() * 3 + 's'
      container.appendChild(star)
    }
  }, [])

  return (
    <section className="not-found">
      <div className="stars" ref={starsRef} />
      <div className="not-found-content">
        <span className="astro">🧑‍🚀</span>
        <h1>{dict.notFound.title}</h1>
        <h2>{dict.notFound.subtitle}</h2>
        <p>{dict.notFound.desc}</p>
        <Link to="/" className="btn btn-primary">
          {dict.notFound.backBtn}
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
