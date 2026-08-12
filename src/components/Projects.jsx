import './Projects.css'
import todoImg from '../assets/project-todo.png'
import calculatorImg from '../assets/project-calculator.png'
import weatherImg from '../assets/project-weather.png'

const projects = [
  {
    title: 'To-Do List',
    desc: "Vazifalarni qo'shish, bajarilganini belgilash va filtrlash imkoniyatiga ega, ma'lumotlar brauzer xotirasida (localStorage) saqlanadi.",
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: todoImg,
    demo: '/portfolio/projects/todo-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/todo-app',
  },
  {
    title: 'Kalkulyator',
    desc: "Asosiy arifmetik amallarni bajaradigan, klaviatura va sichqoncha bilan boshqariladigan kalkulyator ilovasi.",
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: calculatorImg,
    demo: '/portfolio/projects/calculator/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/calculator',
  },
  {
    title: 'Ob-havo',
    desc: "Shahar nomi bo'yicha joriy ob-havo ma'lumotlarini bepul ochiq API orqali real vaqtda ko'rsatadigan ilova.",
    tags: ['JavaScript', 'Fetch API'],
    image: weatherImg,
    demo: '/portfolio/projects/weather-app/',
    code: 'https://github.com/ogabek-karimov/portfolio/tree/master/public/projects/weather-app',
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
            <div className="project-card" key={project.title}>
              <a href={project.demo} target="_blank" rel="noreferrer" className="project-thumb-link">
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
                  <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-outline">
                    Live demo
                  </a>
                  <a href={project.code} target="_blank" rel="noreferrer" className="btn btn-outline">
                    GitHub
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
