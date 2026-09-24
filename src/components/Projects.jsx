import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

const AUTO_STEP_MS = 3000
const SLIDE_MS = 700
const GAP_PX = 24

function ChevronIcon({ direction }) {
  const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function BotChatMock({ chat, icon }) {
  return (
    <div className="project-thumb-placeholder bot-thumb">
      <div className="chat-mock" aria-hidden="true">
        <div className="chat-mock-header">
          <span className="chat-mock-avatar">{icon}</span>
          <div className="chat-mock-title">
            <strong>{chat.name}</strong>
            <span>{chat.status}</span>
          </div>
        </div>
        <div className="chat-mock-body">
          {chat.chip && <span className="chat-chip">{chat.chip}</span>}
          {chat.user && (
            <div className="chat-bubble chat-out chat-step-1">
              {chat.user}
              <em className="chat-meta">{chat.time} ✓✓</em>
            </div>
          )}
          <div className="chat-slot">
            <div className="chat-typing">
              <i />
              <i />
              <i />
            </div>
            <div className="chat-bubble chat-in chat-step-2">
              {chat.reply.map((line) => (
                <div key={line}>{line}</div>
              ))}
              {chat.link && <div className="chat-link">{chat.link}</div>}
              <em className="chat-meta">{chat.time}</em>
            </div>
          </div>
          {chat.buttons && (
            <div className="chat-buttons chat-step-3">
              {chat.buttons.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, dict }) {
  return (
    <div className="project-card">
      {project.image ? (
        <a href={project.demo} target="_blank" rel="noreferrer" className="project-thumb-link">
          <img src={project.image} alt={project.title} className="project-thumb" draggable={false} />
        </a>
      ) : project.chat ? (
        <BotChatMock chat={project.chat} icon={project.icon} />
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
  const count = projects.length
  // Three copies so there are always real cards on both sides while dragging or stepping.
  const loopedProjects = [...projects, ...projects, ...projects]

  const trackRef = useRef(null)
  const [index, setIndex] = useState(count)
  const [animate, setAnimate] = useState(true)
  const [stepPx, setStepPx] = useState(0)
  const [dragPx, setDragPx] = useState(0)
  const [dragging, setDragging] = useState(false)

  const hoverRef = useRef(false)
  const movingRef = useRef(false)
  const dragRef = useRef({ active: false, startX: 0, dx: 0, moved: false })

  useLayoutEffect(() => {
    function measure() {
      const first = trackRef.current?.children[0]
      if (first) setStepPx(first.getBoundingClientRect().width + GAP_PX)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const unlockTimerRef = useRef(null)
  const indexRef = useRef(index)
  useEffect(() => {
    indexRef.current = index
  }, [index])

  function finishMove() {
    clearTimeout(unlockTimerRef.current)
    movingRef.current = false
    const current = indexRef.current
    const normalized = ((((current - count) % count) + count) % count) + count
    if (normalized !== current) {
      setAnimate(false)
      setIndex(normalized)
    }
  }

  function lockMoving() {
    movingRef.current = true
    clearTimeout(unlockTimerRef.current)
    // transitionend never fires in a hidden tab; don't let that freeze the carousel.
    unlockTimerRef.current = setTimeout(finishMove, SLIDE_MS + 200)
  }

  function go(delta) {
    if (movingRef.current || delta === 0) return
    lockMoving()
    setAnimate(true)
    setIndex((i) => i + delta)
  }

  const goRef = useRef(go)
  useEffect(() => {
    goRef.current = go
  })

  useEffect(() => {
    const id = setInterval(() => {
      if (!hoverRef.current && !dragRef.current.active) goRef.current(1)
    }, AUTO_STEP_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (animate) return undefined
    // Re-enable the transition only after the instant wrap-around jump has painted.
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [animate, dragging])

  function handleTransitionEnd(e) {
    if (e.target !== e.currentTarget) return
    finishMove()
  }

  function handlePointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { active: true, startX: e.clientX, dx: 0, moved: false }
  }

  function handlePointerMove(e) {
    const drag = dragRef.current
    if (!drag.active) return
    drag.dx = e.clientX - drag.startX
    if (!drag.moved && Math.abs(drag.dx) > 6) {
      drag.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)
    }
    if (drag.moved) setDragPx(drag.dx)
  }

  function endDrag() {
    const drag = dragRef.current
    if (!drag.active) return
    drag.active = false
    setDragging(false)
    if (!drag.moved) return

    let steps = stepPx ? Math.round(-drag.dx / stepPx) : 0
    if (steps === 0 && Math.abs(drag.dx) > stepPx * 0.15) steps = drag.dx < 0 ? 1 : -1
    setDragPx(0)
    setAnimate(true)
    lockMoving()
    setIndex((i) => i + steps)
  }

  function handleClickCapture(e) {
    if (dragRef.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragRef.current.moved = false
    }
  }

  const translate = -(index * stepPx) + dragPx
  const trackStyle = {
    transform: `translateX(${translate}px)`,
    transition: animate && !dragging ? `transform ${SLIDE_MS}ms ease` : 'none',
  }

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{dict.projects.title}</h2>
        <p className="section-subtitle">{dict.projects.subtitle}</p>
      </div>

      <div
        className="projects-carousel"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        <button
          type="button"
          className="carousel-arrow carousel-arrow-left"
          onClick={() => go(-1)}
          aria-label={dict.projects.prevLabel}
        >
          <ChevronIcon direction="left" />
        </button>

        <div
          className={`projects-track-viewport ${dragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          <div className="projects-track" ref={trackRef} style={trackStyle} onTransitionEnd={handleTransitionEnd}>
            {loopedProjects.map((project, i) => (
              <ProjectCard project={project} dict={dict} key={`${project.code}-${i}`} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="carousel-arrow carousel-arrow-right"
          onClick={() => go(1)}
          aria-label={dict.projects.nextLabel}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  )
}

export default Projects
