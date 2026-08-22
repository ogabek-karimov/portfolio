import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './SubPage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

function CertificatesPage() {
  const { lang, dict } = useLanguage()
  const { certificates } = dict
  const [items, setItems] = useState(null)
  const [isCustom, setIsCustom] = useState(false)
  const [selectedCert, setSelectedCert] = useState(null)

  useEffect(() => {
    let cancelled = false
    setItems(null)
    setIsCustom(false)

    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (
          data.certificates &&
          Array.isArray(data.certificates[lang]) &&
          data.certificates[lang].length > 0
        ) {
          setItems(data.certificates[lang].filter((item) => !item.hidden))
          setIsCustom(true)
        } else {
          setItems(certificates.items)
        }
      })
      .catch(() => {
        if (!cancelled) setItems(certificates.items)
      })

    return () => {
      cancelled = true
    }
  }, [lang, certificates.items])

  useEffect(() => {
    if (!selectedCert) return
    function handleKey(e) {
      if (e.key === 'Escape') setSelectedCert(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [selectedCert])

  return (
    <section className="subpage">
      <div className="container">
        <Link to="/" className="back-link">
          {certificates.backLink}
        </Link>

        <h1 className="section-title">{certificates.title}</h1>
        <p className="section-subtitle">{certificates.subtitle}</p>
        {items && !isCustom && <p className="placeholder-note">{certificates.note}</p>}

        {items && (
          <div className="cert-grid">
            {items.map((cert, i) => (
              <div
                className={`cert-card ${cert.imageId ? 'clickable' : ''}`}
                key={i}
                onClick={() => cert.imageId && setSelectedCert(cert)}
              >
                {cert.imageId ? (
                  <img
                    src={`${API_URL}/cert-image/${cert.imageId}`}
                    alt={cert.title}
                    className="cert-icon-img"
                  />
                ) : (
                  <div className="cert-icon">🏅</div>
                )}
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <span className="cert-date">{cert.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCert && (
        <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cert-modal-close"
              onClick={() => setSelectedCert(null)}
              aria-label="Yopish"
            >
              ✕
            </button>
            <img
              src={`${API_URL}/cert-image/${selectedCert.imageId}`}
              alt={selectedCert.title}
              className="cert-modal-image"
            />
            <div className="cert-modal-info">
              <h2>{selectedCert.title}</h2>
              <p className="cert-modal-issuer">{selectedCert.issuer}</p>
              <span className="cert-date">{selectedCert.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CertificatesPage
