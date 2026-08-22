import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { lang, setLang, dict } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { isAdmin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setAboutOpen(false)
    setOpen(false)
  }, [location])

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

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
          <div
            className="nav-dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <Link to="/#about" onClick={() => setOpen(false)}>
              {dict.nav.about}
            </Link>
            <div className={`nav-dropdown-menu ${aboutOpen ? 'open' : ''}`}>
              {aboutSubLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => {
                    setOpen(false)
                    setAboutOpen(false)
                  }}
                >
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

          {isAdmin && (
            <div className="profile-menu" ref={profileRef}>
              <button
                type="button"
                className="profile-icon"
                aria-label="Admin profil"
                onClick={() => setProfileOpen((v) => !v)}
              >
                👤
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <strong>Administrator</strong>
                    <span>Siz tizimga admin sifatida kirgansiz</span>
                  </div>
                  <Link to="/admin" onClick={() => setProfileOpen(false)}>
                    Admin panel
                  </Link>
                  <button type="button" className="logout-btn" onClick={handleLogout}>
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          )}

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
