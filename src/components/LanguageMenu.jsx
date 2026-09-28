import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import Flag from './Flag'
import './LanguageMenu.css'

// Shown as flag + code; the native name stays as the tooltip and accessible label.
const OPTIONS = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]

function LanguageMenu() {
  const { lang, setLang, dict } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function choose(code) {
    setLang(code)
    setOpen(false)
  }

  return (
    <div className={`lang-menu${open ? ' is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="lang-menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.nav.language}
        onClick={() => setOpen((o) => !o)}
      >
        <Flag code={lang} />
        <span>{lang.toUpperCase()}</span>
        <svg className="lang-menu-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="lang-menu-list" role="menu">
          {OPTIONS.map((o) => (
            <li key={o.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={o.code === lang}
                className={o.code === lang ? 'is-active' : ''}
                onClick={() => choose(o.code)}
                aria-label={o.label}
                title={o.label}
              >
                <Flag code={o.code} />
                <span className="lang-menu-code">{o.code.toUpperCase()}</span>
                {o.code === lang && (
                  <svg className="lang-menu-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageMenu
