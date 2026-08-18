import { useLanguage } from '../i18n/LanguageContext'
import './Skills.css'

const skills = [
  { name: 'HTML5', level: 90 },
  { name: 'CSS3', level: 85 },
  { name: 'JavaScript', level: 80 },
  { name: 'React', level: 75 },
  { name: 'Node.js', level: 65 },
  { name: 'Git / GitHub', level: 70 },
]

function Skills() {
  const { dict } = useLanguage()

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">{dict.skills.title}</h2>
        <p className="section-subtitle">{dict.skills.subtitle}</p>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <div className="skill-head">
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-bar-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
