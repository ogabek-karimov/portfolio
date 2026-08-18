import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, dict } = useLanguage()

  const links = [
    { href: '#about', label: dict.nav.about },
    { href: '#skills', label: dict.nav.skills },
    { href: '#projects', label: dict.nav.projects },
    { href: '#contact', label: dict.nav.contact },
  ]

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="logo">
          Og'abek Karimov
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-right">
          <div className="lang-switch">
            <button
              type="button"
              className={lang === 'uz' ? 'active' : ''}
              onClick={() => setLang('uz')}
            >
              UZ
            </button>
            <button
              type="button"
              className={lang === 'ru' ? 'active' : ''}
              onClick={() => setLang('ru')}
            >
              RU
            </button>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-label={dict.nav.menuToggle}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
