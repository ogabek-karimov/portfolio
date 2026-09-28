import { brandIcons } from '../data/brandIcons'
import './ProjectCard.css'

// Address shown in the card's browser bar.
function siteLabel(project) {
  if (!project.demo) return 'Telegram'
  if (project.demo.startsWith('/')) return `ogabek-karimov.github.io${project.demo}`
  return new URL(project.demo).host
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
      <div className="project-chrome" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{siteLabel(project)}</span>
      </div>
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
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn project-btn project-btn-demo">
              {dict.projects.liveDemo}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7 M8 7h9v9" />
              </svg>
            </a>
          )}
          <a href={project.code} target="_blank" rel="noreferrer" className="btn project-btn project-btn-code">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
              <path d={brandIcons.github} />
            </svg>
            {dict.projects.github}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
