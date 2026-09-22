import { useEffect, useRef } from 'react'
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

const SPEED_PX_PER_SEC = 26
const GAP_PX = 24

function ChevronIcon({ direction }) {
  const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function ProjectCard({ project, dict }) {
  return (
    <div className="project-card">
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
  )
}

function Projects() {
  const { dict } = useLanguage()
  const projects = projectMeta.map((meta, i) => ({ ...meta, ...dict.projects.items[i] }))
  const loopedProjects = [...projects, ...projects]

  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    offsetRef.current = 0
    lastTsRef.current = null

    function tick(timestamp) {
      const track = trackRef.current
      if (track) {
        if (lastTsRef.current === null) lastTsRef.current = timestamp
        const dt = (timestamp - lastTsRef.current) / 1000
        lastTsRef.current = timestamp

        if (!pausedRef.current) {
          const singleSetWidth = track.scrollWidth / 2
          let next = offsetRef.current + SPEED_PX_PER_SEC * dt
          if (next >= singleSetWidth) next -= singleSetWidth
          offsetRef.current = next
          track.style.transform = `translateX(-${next}px)`
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [projects.length])

  function step(direction) {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.children[0]
    if (!firstCard) return
    const cardStep = firstCard.getBoundingClientRect().width + GAP_PX
    const singleSetWidth = track.scrollWidth / 2

    let next = offsetRef.current + direction * cardStep
    next = ((next % singleSetWidth) + singleSetWidth) % singleSetWidth
    offsetRef.current = next
    track.style.transform = `translateX(-${next}px)`
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
        <button
          type="button"
          className="carousel-arrow carousel-arrow-left"
          onClick={() => step(-1)}
          aria-label={dict.projects.prevLabel}
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="projects-track-viewport">
          <div className="projects-track" ref={trackRef}>
            {loopedProjects.map((project, i) => (
              <ProjectCard project={project} dict={dict} key={`${project.code}-${i}`} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="carousel-arrow carousel-arrow-right"
          onClick={() => step(1)}
          aria-label={dict.projects.nextLabel}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  )
}

export default Projects
