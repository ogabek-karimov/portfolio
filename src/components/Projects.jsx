import './Projects.css'

const projects = [
  {
    title: 'Loyiha nomi 1',
    desc: 'Loyiha haqida qisqacha tavsif. Qanday muammoni hal qilgani va qanday texnologiyalar ishlatilgani.',
    tags: ['React', 'CSS'],
    link: '#',
  },
  {
    title: 'Loyiha nomi 2',
    desc: 'Loyiha haqida qisqacha tavsif. Qanday muammoni hal qilgani va qanday texnologiyalar ishlatilgani.',
    tags: ['JavaScript', 'HTML'],
    link: '#',
  },
  {
    title: 'Loyiha nomi 3',
    desc: 'Loyiha haqida qisqacha tavsif. Qanday muammoni hal qilgani va qanday texnologiyalar ishlatilgani.',
    tags: ['React', 'Node.js'],
    link: '#',
  },
]

function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Loyihalar</h2>
        <p className="section-subtitle">Ba'zi ishlarim</p>

        <div className="projects-grid">
          {projects.map((project) => (
            <a href={project.link} className="project-card" key={project.title}>
              <div className="project-thumb" aria-hidden="true" />
              <div className="project-body">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
