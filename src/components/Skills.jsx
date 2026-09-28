import { useLanguage } from '../i18n/LanguageContext'
import { skills } from '../data/skills'
import { brandIcons } from '../data/brandIcons'
import useInView from '../hooks/useInView'
import SectionHeading from './SectionHeading'
import './Skills.css'

// Faint code texture behind the section.
const CODE_BACKDROP = `const developer = {
  name: "Og'abek Karimov",
  role: 'Frontend Developer',
  stack: ['HTML', 'CSS', 'JavaScript', 'React'],
  learning: ['Node.js'],
}

function buildInterface(idea) {
  const layout = design(idea)
  return layout.map((block) => render(block))
}

export default function App() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
  }, [])
  return <Portfolio projects={projects} />
}`

// Seconds per skill: sets how fast the strip runs, whatever the number of skills.
const SECONDS_PER_SKILL = 1.7

function Skills() {
  const { lang, dict } = useLanguage()
  const [stripRef, inView] = useInView(0.3)
  // Two back-to-back copies make the strip loop without a seam.
  const strip = [...skills, ...skills]

  return (
    <section id="skills" className="skills">
      <pre className="skills-backdrop" aria-hidden="true">
        {CODE_BACKDROP}
      </pre>
      <span className="skills-deco" aria-hidden="true">
        &lt;/&gt;
      </span>

      <div className="container">
        <SectionHeading title={dict.skills.title} subtitle={dict.skills.subtitle} />

        <div className={`skills-marquee${inView ? ' is-visible' : ''}`} ref={stripRef}>
          <ul className="skills-track" style={{ '--duration': `${skills.length * SECONDS_PER_SKILL}s` }}>
            {strip.map((skill, i) => {
              const copy = i >= skills.length
              const name = typeof skill.name === 'string' ? skill.name : skill.name[lang]
              return (
                <li
                  className="skill"
                  key={`${skill.id}-${i}`}
                  aria-hidden={copy || undefined}
                  style={{
                    '--brand': skill.color,
                    '--icon-bg': skill.iconBg,
                    '--icon-fg': skill.iconFg,
                    '--i': i % skills.length,
                  }}
                >
                  <div className="skill-ring">
                    <svg className="skill-ring-svg" viewBox="0 0 120 120" aria-hidden="true">
                      <circle className="skill-ring-track" cx="60" cy="60" r="56" pathLength="100" />
                      <circle
                        className="skill-ring-fill"
                        cx="60"
                        cy="60"
                        r="56"
                        pathLength="100"
                        style={{ strokeDashoffset: inView ? 100 - skill.level : 100 }}
                      />
                    </svg>
                    <span className="skill-icon">
                      <svg viewBox={skill.iconBox || '0 0 24 24'} width="38" height="38" fill="currentColor" aria-hidden="true">
                        <path d={brandIcons[skill.icon]} fillRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <span className="skill-name">{name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Skills
