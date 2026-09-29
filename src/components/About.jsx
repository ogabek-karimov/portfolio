import profilePhoto from '../assets/profile.jpg'
import { useLanguage } from '../i18n/LanguageContext'
import SectionHeading from './SectionHeading'
import './About.css'

const TECH_RE = /(HTML|CSS|JavaScript|React|Node\.js)/g

// Paint technology names in the accent color, the way an editor highlights keywords.
function highlightTech(text) {
  return text.split(TECH_RE).map((part, i) =>
    i % 2 === 1 ? (
      <span className="about-kw" key={i}>
        {part}
      </span>
    ) : (
      part
    )
  )
}

function About() {
  const { dict } = useLanguage()

  return (
    <section id="about" className="about">
      <div className="container">
        <SectionHeading title={dict.about.title} boxed />

        <div className="about-grid">
          <figure className="about-photo">
            <img src={profilePhoto} alt="Og'abek Karimov" />
          </figure>

          <div className="about-card">
            <span className="code-tag">&lt;p&gt;</span>
            <p>{highlightTech(dict.about.p1)}</p>
            <p>{highlightTech(dict.about.p2)}</p>
            <p>{highlightTech(dict.about.p3)}</p>
            <span className="code-tag">&lt;/p&gt;</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
