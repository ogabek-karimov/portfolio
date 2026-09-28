import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './ResumePage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

const DEFAULT_RESUME = {
  contact: {
    email: 'bek8896ok@gmail.com',
    telegram: 't.me/Uzswlu_rttm',
    website: 'ogabek-karimov.github.io/portfolio',
  },
  uz: {
    name: "Karimov Og'abek",
    role: 'Frontend Developer',
    about:
      "Frontend dasturchiman, foydalanuvchi uchun qulay va chiroyli interfeyslar yarataman. HTML, CSS va JavaScript asosida boshlab, hozirda React kutubxonasi bilan ishlayman va Node.js yordamida loyihalarni yig'ish (build) va server tomonini ham o'rganib bormoqdaman.",
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Figma', 'Photoshop', 'Node.js', 'Python', 'Telegram botlar', 'Git / GitHub'],
  },
  ru: {
    name: 'Огабек Каримов',
    role: 'Frontend-разработчик',
    about:
      'Я frontend-разработчик, создаю удобные и красивые интерфейсы для пользователей. Начав с HTML, CSS и JavaScript, сейчас работаю с библиотекой React, а также изучаю сборку проектов и серверную часть с помощью Node.js.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Figma', 'Photoshop', 'Node.js', 'Python', 'Telegram-боты', 'Git / GitHub'],
  },
  en: {
    name: "Og'abek Karimov",
    role: 'Frontend Developer',
    about:
      "I'm a frontend developer who builds friendly, good-looking interfaces. I started with HTML, CSS and JavaScript, now work with the React library, and I'm learning project builds and the server side with Node.js.",
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Figma', 'Photoshop', 'Node.js', 'Python', 'Telegram bots', 'Git / GitHub'],
  },
}

const LABELS = {
  uz: {
    backLink: '← Bosh sahifaga qaytish',
    print: 'Chop etish (PDF)',
    pdfLink: 'yoki tayyor PDF faylni yuklab olish',
    about: 'Men haqimda',
    skills: "Ko'nikmalar",
    experience: "Ta'lim va tajriba",
    projects: 'Loyihalar',
    unavailable: 'Rezyume hozircha mavjud emas.',
  },
  ru: {
    backLink: '← Вернуться на главную',
    print: 'Печать (PDF)',
    pdfLink: 'или скачать готовый PDF (на узбекском)',
    about: 'Обо мне',
    skills: 'Навыки',
    experience: 'Образование и опыт',
    projects: 'Проекты',
    unavailable: 'Резюме пока недоступно.',
  },
  en: {
    backLink: '← Back to home',
    print: 'Print (PDF)',
    pdfLink: 'or download the ready-made PDF (in Uzbek)',
    about: 'About me',
    skills: 'Skills',
    experience: 'Education & experience',
    projects: 'Projects',
    unavailable: 'The resume is not available yet.',
  },
}

function ResumePage() {
  const { lang, dict } = useLanguage()
  useDocumentTitle(dict.nav.resume)
  const [resume, setResume] = useState(null)
  const [experienceItems, setExperienceItems] = useState(dict.experience.items)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setResume(data.resume && data.resume.contact ? data.resume : DEFAULT_RESUME)
        if (data.experience && Array.isArray(data.experience[lang]) && data.experience[lang].length > 0) {
          setExperienceItems(data.experience[lang].filter((item) => !item.hidden))
        } else {
          setExperienceItems(dict.experience.items)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResume(DEFAULT_RESUME)
          setExperienceItems(dict.experience.items)
        }
      })
    return () => {
      cancelled = true
    }
  }, [lang, dict.experience.items])

  const t = LABELS[lang]
  const projects = dict.projects.items

  if (!resume) return null

  // content saved before a language existed falls back to the built-in text
  const p = resume[lang] || DEFAULT_RESUME[lang]

  if (resume.hidden) {
    return (
      <section className="resume-page">
        <div className="resume-toolbar no-print">
          <Link to="/" className="back-link">
            {t.backLink}
          </Link>
        </div>
        <p className="resume-unavailable">{t.unavailable}</p>
      </section>
    )
  }

  return (
    <section className="resume-page">
      <div className="resume-toolbar no-print">
        <Link to="/" className="back-link">
          {t.backLink}
        </Link>
        <div className="resume-actions">
          <button type="button" className="btn btn-primary resume-print-btn" onClick={() => window.print()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 9V3h10v6" />
              <path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
              <path className="print-sheet" d="M7 14h10v7H7z" />
            </svg>
            {t.print}
          </button>
          <a href={`${API_URL}/resume.pdf`} className="resume-pdf-link">
            {t.pdfLink}
          </a>
        </div>
      </div>

      <div className="resume-sheet">
        <header className="resume-header">
          <h1>{p.name}</h1>
          <p className="resume-role">{p.role}</p>
          <div className="resume-contact-row">
            <span>✉️ {resume.contact.email}</span>
            <span>💬 {resume.contact.telegram}</span>
            <span>🌐 {resume.contact.website}</span>
          </div>
        </header>

        <section className="resume-section">
          <h2>{t.about}</h2>
          <p>{p.about}</p>
        </section>

        <section className="resume-section">
          <h2>{t.skills}</h2>
          <div className="resume-skills">
            {p.skills.map((s) => (
              <span key={s} className="resume-skill-pill">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>{t.experience}</h2>
          {experienceItems.map((item, i) => (
            <div className="resume-timeline-item" key={i}>
              <div className="resume-timeline-top">
                <h3>{item.title}</h3>
                <span>{item.date}</span>
              </div>
              <div className="resume-timeline-place">{item.place}</div>
              <p>{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>{t.projects}</h2>
          {projects.map((proj) => (
            <div className="resume-project-item" key={proj.title}>
              <h3>{proj.title}</h3>
              <p>{proj.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}

export default ResumePage
