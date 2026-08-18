import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, dict } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const sectionLinks = [
    { href: '/#skills', label: dict.nav.skills },
    { href: '/#projects', label: dict.nav.projects },
    { href: '/#contact', label: dict.nav.contact },
  ]

  const aboutSubLinks = [
    { href: '/experience', label: dict.nav.experience },
    { href: '/certificates', label: dict.nav.certificates },
  ]

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          Og'abek Karimov
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <div className="nav-dropdown">
            <Link to="/#about" onClick={() => setOpen(false)}>
              {dict.nav.about}
            </Link>
            <div className="nav-dropdown-menu">
              {aboutSubLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {sectionLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Mavzuni almashtirish"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

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
