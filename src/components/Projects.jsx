import { useLanguage } from '../i18n/LanguageContext'
import './Projects.css'
import todoImg from '../assets/project-todo.png'
import calculatorImg from '../assets/project-calculator.png'
import weatherImg from '../assets/project-weather.png'

const projectMeta = [
  {
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: todoImg,
    demo: '/portfolio/projects/todo-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/todo-app',
  },
  {
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: calculatorImg,
    demo: '/portfolio/projects/calculator/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/calculator',
  },
  {
    tags: ['JavaScript', 'Fetch API'],
    image: weatherImg,
    demo: '/portfolio/projects/weather-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/weather-app',
  },
]

function Projects() {
  const { dict } = useLanguage()
  const projects = projectMeta.map((meta, i) => ({ ...meta, ...dict.projects.items[i] }))

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{dict.projects.title}</h2>
        <p className="section-subtitle">{dict.projects.subtitle}</p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card" key={project.demo}>
              <a href={project.demo} className="project-thumb-link">
                <img src={project.image} alt={project.title} className="project-thumb" />
              </a>
              <div className="project-body">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.demo} className="btn btn-outline">
                    {dict.projects.liveDemo}
                  </a>
                  <a href={project.code} target="_blank" rel="noreferrer" className="btn btn-outline">
                    {dict.projects.github}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
