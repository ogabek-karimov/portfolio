import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './SubPage.css'

function CertificatesPage() {
  const { dict } = useLanguage()
  const { certificates } = dict

  return (
    <section className="subpage">
      <div className="container">
        <Link to="/" className="back-link">
          {certificates.backLink}
        </Link>

        <h1 className="section-title">{certificates.title}</h1>
        <p className="section-subtitle">{certificates.subtitle}</p>
        <p className="placeholder-note">{certificates.note}</p>

        <div className="cert-grid">
          {certificates.items.map((cert, i) => (
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
