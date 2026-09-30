import { useLanguage } from '../i18n/LanguageContext'
import SectionHeading from './SectionHeading'
import ServicesBackdrop from './ServicesBackdrop'
import './Services.css'

// One outline icon per service, in the same order as dict.services.items.
const ICONS = [
  'M3 5h18v14H3z M3 9h18 M7 13h6 M7 16h4',
  'M8 9h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z M12 5v4 M9.5 14h.01 M14.5 14h.01',
  'M12 3l9 5-9 5-9-5 9-5z M3 13l9 5 9-5',
  'M3 6h18v12H3z M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5.5 15a3 3 0 0 1 5 0 M14 9h4 M14 12h4 M14 15h2',
]

function Services() {
  const { dict } = useLanguage()
  const t = dict.services

  return (
    <section id="services" className="services">
      <ServicesBackdrop />
      <div className="container">
        <SectionHeading title={t.title} subtitle={t.subtitle} />

        <div className="services-grid">
          {t.items.map((item, i) => (
            <article className="service-card" key={item.title}>
              <span className="service-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICONS[i]} />
                </svg>
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="service-foot">
                <span className="service-price">{t.price}</span>
                <a href="#contact" className="service-cta">
                  {t.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
