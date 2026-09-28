import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { scrollToTop } from '../utils/scroll'
import './BackToTop.css'

const SHOW_AFTER_PX = 600
const SIZE = 48
const GAP = 20
// on phones the bottom quick menu carries its own "to top" button
const PHONE_QUERY = '(max-width: 600px)'

function BackToTop() {
  const { dict } = useLanguage()
  const location = useLocation()
  const [state, setState] = useState({ visible: false, progress: 0, lift: 0, blocked: false })

  useEffect(() => {
    let raf = 0

    function update() {
      raf = 0
      const vh = window.innerHeight
      const vw = window.innerWidth
      const max = document.documentElement.scrollHeight - vh
      const y = window.scrollY

      // ride above the footer instead of covering its icons
      const footer = document.querySelector('.footer')
      const lift = footer ? Math.max(0, vh - footer.getBoundingClientRect().top) : 0

      // step aside when the contact chat's send button is under this corner (phones)
      const bottom = vh - GAP - lift
      const box = { top: bottom - SIZE, bottom, left: vw - GAP - SIZE, right: vw - GAP }
      const composer = document.querySelector('.ios-composer')
      let blocked = false
      if (composer) {
        const r = composer.getBoundingClientRect()
        blocked = r.top < box.bottom && r.bottom > box.top && r.left < box.right && r.right > box.left
      }

      const visible = y > SHOW_AFTER_PX && !window.matchMedia(PHONE_QUERY).matches
      setState({ visible, progress: max > 0 ? Math.min(1, y / max) : 0, lift, blocked })
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [location.pathname])

  const shown = state.visible && !state.blocked

  return (
    <button
      type="button"
      className={`back-to-top${shown ? ' is-visible' : ''}`}
      style={{ '--lift': `${state.lift}px` }}
      onClick={scrollToTop}
      aria-label={dict.nav.backToTop}
      title={dict.nav.backToTop}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      <svg className="back-to-top-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="back-to-top-track" cx="24" cy="24" r="22.5" pathLength="100" />
        <circle
          className="back-to-top-fill"
          cx="24"
          cy="24"
          r="22.5"
          pathLength="100"
          style={{ strokeDashoffset: 100 - state.progress * 100 }}
        />
      </svg>
      <span className="back-to-top-arrow">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5 M6 11l6-6 6 6" />
        </svg>
      </span>
    </button>
  )
}

export default BackToTop
