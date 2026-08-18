import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './SubPage.css'

function ExperiencePage() {
  const { dict } = useLanguage()
  const { experience } = dict

  return (
    <section className="subpage">
      <div className="container">
        <Link to="/" className="back-link">
          {experience.backLink}
        </Link>

        <h1 className="section-title">{experience.title}</h1>
        <p className="section-subtitle">{experience.subtitle}</p>

        <div className="timeline">
          {experience.items.map((item, i) => (
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
      </div>
    </section>
  )
}

export default ExperiencePage
