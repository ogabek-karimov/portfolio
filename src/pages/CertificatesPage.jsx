import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './SubPage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

function CertificatesPage() {
  const { lang, dict } = useLanguage()
  const { certificates } = dict
  const [items, setItems] = useState(certificates.items)
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    setItems(certificates.items)
    setIsCustom(false)
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        if (
          data.certificates &&
          Array.isArray(data.certificates[lang]) &&
          data.certificates[lang].length > 0
        ) {
          setItems(data.certificates[lang])
          setIsCustom(true)
        }
      })
      .catch(() => {})
  }, [lang, certificates.items])

  return (
    <section className="subpage">
      <div className="container">
        <Link to="/" className="back-link">
          {certificates.backLink}
        </Link>

        <h1 className="section-title">{certificates.title}</h1>
        <p className="section-subtitle">{certificates.subtitle}</p>
        {!isCustom && <p className="placeholder-note">{certificates.note}</p>}

        <div className="cert-grid">
          {items.map((cert, i) => (
            <div className="cert-card" key={i}>
              <div className="cert-icon">🏅</div>
              <h3>{cert.title}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <span className="cert-date">{cert.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CertificatesPage
