import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './SubPage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

function ExperiencePage() {
  const { lang, dict } = useLanguage()
  const { experience } = dict
  const [items, setItems] = useState(null)

  useEffect(() => {
    let cancelled = false
    setItems(null)

    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.experience && Array.isArray(data.experience[lang]) && data.experience[lang].length > 0) {
          setItems(data.experience[lang].filter((item) => !item.hidden))
        } else {
          setItems(experience.items)
        }
      })
      .catch(() => {
        if (!cancelled) setItems(experience.items)
      })

    return () => {
      cancelled = true
    }
  }, [lang, experience.items])

  return (
    <section className="subpage">
      <div className="container">
        <Link to="/" className="back-link">
          {experience.backLink}
        </Link>

        <h1 className="section-title">{experience.title}</h1>
        <p className="section-subtitle">{experience.subtitle}</p>

        {items && (
          <div className="timeline">
            {items.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p className="timeline-place">{item.place}</p>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ExperiencePage
