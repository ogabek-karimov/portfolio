import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { scrollToTop } from '../utils/scroll'
import './MobileNav.css'

const PHONE_QUERY = '(max-width: 600px)'
// stays out of the way on the first screen
const SHOW_AFTER_PX = 300
// ignore small scroll jitters when deciding the direction
const DIRECTION_THRESHOLD = 6

const SECTIONS = [
  { id: 'about', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0' },
  { id: 'skills', icon: 'M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16' },
  { id: 'projects', icon: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z' },
  { id: 'contact', icon: 'M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z' },
]

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

// Phone-only quick menu: slides up while the reader scrolls back up, hides while
// they read downwards, and marks the section currently on screen.
function MobileNav() {
  const { dict } = useLanguage()
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const [state, setState] = useState({ visible: false, active: -1, lift: 0 })

  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    let scrollingUp = false

    function update() {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY
      if (y < lastY - DIRECTION_THRESHOLD) scrollingUp = true
      else if (y > lastY + DIRECTION_THRESHOLD) scrollingUp = false
      if (Math.abs(y - lastY) > DIRECTION_THRESHOLD) lastY = y

      // the section crossing 40% of the screen height is the one being read
      const line = vh * 0.4
      const active = SECTIONS.findIndex(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top <= line && r.bottom > line
      })

      // never cover the footer icons, and step away while someone types in the chat
      const footer = document.querySelector('.footer')
      const lift = footer ? Math.max(0, vh - footer.getBoundingClientRect().top) : 0
      const typing = document.activeElement?.closest?.('.iphone') != null

      const visible = window.matchMedia(PHONE_QUERY).matches && y > SHOW_AFTER_PX && scrollingUp && !typing
      setState((prev) =>
        prev.visible === visible && prev.active === active && prev.lift === lift ? prev : { visible, active, lift }
      )
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('focusin', schedule)
    document.addEventListener('focusout', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('focusin', schedule)
      document.removeEventListener('focusout', schedule)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  function goToSection(e, id) {
    if (!onHome) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const { visible, active, lift } = state
  const tab = visible ? 0 : -1

  return (
    <nav
      className={`mobile-nav${visible ? ' is-visible' : ''}`}
      style={{ '--lift': `${lift}px`, '--active': active }}
      aria-label={dict.nav.quickMenu}
      aria-hidden={!visible}
    >
      {active >= 0 && <span className="mobile-nav-indicator" aria-hidden="true" />}
      {SECTIONS.map(({ id, icon }, i) => (
        <Link
          key={id}
          to={`/#${id}`}
          className={`mobile-nav-item${i === active ? ' is-active' : ''}`}
          onClick={(e) => goToSection(e, id)}
          tabIndex={tab}
          aria-current={i === active ? 'true' : undefined}
        >
          <Icon path={icon} />
          <span>{dict.nav[id]}</span>
        </Link>
      ))}
      <button type="button" className="mobile-nav-item mobile-nav-top" onClick={scrollToTop} tabIndex={tab}>
        <Icon path="M12 19V5 M6 11l6-6 6 6" />
        <span>{dict.nav.toTop}</span>
      </button>
    </nav>
  )
}

export default MobileNav
