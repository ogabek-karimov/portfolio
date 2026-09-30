import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import { scrollToTop } from '../utils/scroll'
import LanguageMenu from './LanguageMenu'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { dict } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { isAdmin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setAboutOpen(false)
    setOpen(false)
  }, [location])

  // a menu opened on a phone-sized window must not stay open after resizing
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 960px)')
    const close = () => setOpen(false)
    mql.addEventListener('change', close)
    return () => mql.removeEventListener('change', close)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // The logo always brings you to the top of the home page.
  function handleLogoClick(e) {
    setOpen(false)
    if (location.pathname === '/') {
      e.preventDefault()
      if (location.hash) navigate('/', { replace: true })
      scrollToTop()
    } else {
      window.scrollTo(0, 0)
    }
  }

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  const sectionLinks = [
    { href: '/#skills', label: dict.nav.skills },
    { href: '/#services', label: dict.nav.services },
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
        <Link to="/" className="logo-link" onClick={handleLogoClick}>
          <span className="logo">Og'abek Karimov</span>
          <span className="logo-subtitle">Frontend Developer</span>
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

          {/* phones: the admin links live in the menu instead of a profile icon in the bar */}
          {isAdmin && (
            <div className="nav-admin">
              <Link to="/admin" onClick={() => setOpen(false)}>
                Admin panel
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  handleLogout()
                }}
              >
                Chiqish
              </button>
            </div>
          )}
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

          <LanguageMenu />

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
