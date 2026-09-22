import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Projects.css'
import todoImg from '../assets/project-todo.png'
import calculatorImg from '../assets/project-calculator.png'
import weatherImg from '../assets/project-weather.png'
import chorvabozorImg from '../assets/project-chorvabozor.png'

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
  {
    tags: ['Cloudflare Workers', 'D1', 'React'],
    image: chorvabozorImg,
    demo: 'https://chorvabozor.bek8896ok.workers.dev',
    code: 'https://github.com/ogabek-karimov/livestock-marketplace',
  },
  {
    tags: ['Cloudflare Workers', 'Telegram Bot API', 'Cron'],
    icon: '🎥',
    code: 'https://github.com/ogabek-karimov/zoom-elon-bot',
  },
  {
    tags: ['Python', 'aiogram', 'Telegram Mini App'],
    icon: '📚',
    code: 'https://github.com/ogabek-karimov/talim-yordamchisi-bot',
  },
]

const PAGE_SIZE = 3
const AUTO_ROTATE_MS = 5000

function ChevronIcon({ direction }) {
  const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function chunk(items, size) {
  const pages = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }
  return pages
}

function Projects() {
  const { dict } = useLanguage()
  const projects = projectMeta.map((meta, i) => ({ ...meta, ...dict.projects.items[i] }))
  const pages = chunk(projects, PAGE_SIZE)
  const totalPages = pages.length

  const [page, setPage] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (totalPages <= 1) return undefined
    const interval = setInterval(() => {
      if (pausedRef.current) return
      setPage((p) => (p + 1) % totalPages)
    }, AUTO_ROTATE_MS)
    return () => clearInterval(interval)
  }, [totalPages])

  function goTo(next) {
    setPage((next + totalPages) % totalPages)
  }

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{dict.projects.title}</h2>
        <p className="section-subtitle">{dict.projects.subtitle}</p>
      </div>

      <div
        className="projects-carousel"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {totalPages > 1 && (
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={() => goTo(page - 1)}
            aria-label={dict.projects.prevLabel}
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        <div className="projects-track-viewport">
          <div className="projects-track" style={{ transform: `translateX(-${page * 100}%)` }}>
            {pages.map((pageItems, pageIndex) => (
              <div className="projects-grid" key={pageIndex}>
                {pageItems.map((project) => (
                  <div className="project-card" key={project.code}>
                    {project.image ? (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="project-thumb-link">
                        <img src={project.image} alt={project.title} className="project-thumb" />
                      </a>
                    ) : (
                      <div className="project-thumb-placeholder">
                        <span>{project.icon}</span>
                      </div>
                    )}
                    <div className="project-body">
                      <h3>{project.title}</h3>
                      <p>{project.desc}</p>
                      <div className="project-tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="project-links">
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-outline">
                            {dict.projects.liveDemo}
                          </a>
                        )}
                        <a href={project.code} target="_blank" rel="noreferrer" className="btn btn-outline">
                          {dict.projects.github}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={() => goTo(page + 1)}
            aria-label={dict.projects.nextLabel}
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>
    </section>
  )
}

export default Projects
