import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import avatarPhoto from '../assets/profile-card.jpg'
import { playUnlockSound } from '../utils/sounds'
import { isInUzbekistan } from '../i18n/detectLanguage'
import SectionHeading from './SectionHeading'
import './Contact.css'

const RELAY_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'
const UZ_PHONE_RE = /^\+998\d{9}$/
// any other country: "+" and 8-15 digits (the international E.164 length)
const INTL_PHONE_RE = /^\+(?!998)\d{8,15}$/

function isValidPhone(value) {
  const normalized = value.replace(/[\s()-]/g, '')
  return UZ_PHONE_RE.test(normalized) || INTL_PHONE_RE.test(normalized)
}

const PHONE_PREFIX = '+998 ('
const INTL_PREFIX = '+'
const PHONE_TEMPLATE = '+998 (XX) XXX-XX-XX'

function extractDigits(value) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('998')) digits = digits.slice(3)
  return digits.slice(0, 9)
}

function formatPhoneDigits(digits) {
  let result = ''
  let di = 0
  for (const ch of PHONE_TEMPLATE) {
    if (ch === 'X') {
      if (di < digits.length) {
        result += digits[di]
        di += 1
      } else {
        break
      }
    } else {
      result += ch
    }
  }
  return result.replace(/\s+$/, '')
}

const VOWELS = 'aeiouаеёиоуыэюя'

function isGibberish(text) {
  const trimmed = text.trim()
  if (trimmed.length < 15) return true
  if (!/\s/.test(trimmed)) return true

  const letters = trimmed.toLowerCase().replace(/[^a-zа-яёʻʼ]/g, '')
  if (letters.length === 0) return true

  const vowels = [...letters].filter((ch) => VOWELS.includes(ch))
  if (vowels.length / letters.length < 0.15) return true

  let run = 0
  let maxRun = 0
  for (const ch of letters) {
    if (VOWELS.includes(ch)) {
      run = 0
    } else {
      run += 1
      maxRun = Math.max(maxRun, run)
    }
  }
  return maxRun >= 6
}

// Below this width the phone frame is dropped and the chat is shown directly.
const COMPACT_QUERY = '(max-width: 600px)'
const MESSAGE_MAX_HEIGHT = 96

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])
  return now
}

function formatTime(date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

function StatusIcons() {
  return (
    <span className="ios-status-icons" aria-hidden="true">
      <svg viewBox="0 0 18 12" width="18" height="12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg viewBox="0 0 16 12" width="16" height="12" fill="currentColor">
        <path d="M8 2.6c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 8 1 9.6 9.6 0 0 0 1.2 3.8l1.1 1.1A8 8 0 0 1 8 2.6zm0 3.2c1.3 0 2.5.5 3.4 1.4l1.1-1.1A6.4 6.4 0 0 0 8 4.2c-1.8 0-3.4.7-4.5 1.9l1.1 1.1c.9-.9 2.1-1.4 3.4-1.4zm0 3.2c-.5 0-1 .2-1.3.6L8 11l1.3-1.4A1.8 1.8 0 0 0 8 9z" />
      </svg>
      <svg viewBox="0 0 27 13" width="27" height="13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  )
}

function Contact() {
  const { lang, dict } = useLanguage()
  const t = dict.contact
  const now = useClock()
  const compact = useMediaQuery(COMPACT_QUERY)
  const [opened, setOpened] = useState(false)
  const appOpen = opened || compact

  // visitors in Uzbekistan start from the +998 mask, everyone else from a bare "+"
  const [form, setForm] = useState(() => ({
    name: '',
    phone: isInUzbekistan() ? PHONE_PREFIX : INTL_PREFIX,
    message: '',
    website: '',
  }))
  const [fieldError, setFieldError] = useState(null)
  const [sending, setSending] = useState(false)
  const [thread, setThread] = useState([])
  const [typing, setTyping] = useState(false)

  const threadRef = useRef(null)
  const nameRef = useRef(null)
  const messageRef = useRef(null)
  const nextId = useRef(1)
  const timers = useRef([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // Keep the newest bubble in view inside the phone, without moving the page.
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [thread, typing])

  useEffect(() => {
    if (!opened) return undefined
    const id = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 450)
    return () => clearTimeout(id)
  }, [opened])

  function later(fn, ms) {
    timers.current.push(setTimeout(fn, ms))
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (fieldError === e.target.name) setFieldError(null)
  }

  function handleMessageChange(e) {
    handleChange(e)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MESSAGE_MAX_HEIGHT)}px`
  }

  function handleMessageKeyDown(e) {
    // Enter sends like a desktop messenger; Shift+Enter keeps a new line.
    if (e.key === 'Enter' && !e.shiftKey && !compact && !e.nativeEvent.isComposing) {
      e.preventDefault()
      e.currentTarget.form.requestSubmit()
    }
  }

  function handlePhoneChange(e) {
    const raw = e.target.value
    const allDigits = raw.replace(/\D/g, '')
    if (fieldError === 'phone') setFieldError(null)

    // any other country code is typed freely
    if (!allDigits.startsWith('998')) {
      setForm({ ...form, phone: INTL_PREFIX + allDigits.slice(0, 15) })
      return
    }

    // Uzbek numbers keep the familiar +998 (XX) XXX-XX-XX mask
    let digits = extractDigits(raw)
    if (raw.length < form.phone.length) {
      const prevDigits = extractDigits(form.phone)
      if (digits.length === prevDigits.length) {
        if (digits.length === 0) {
          // erasing past the mask steps out of +998 so another code can be typed
          setForm({ ...form, phone: '+99' })
          return
        }
        digits = digits.slice(0, -1)
      }
    }
    setForm({ ...form, phone: formatPhoneDigits(digits) })
  }

  function updateBubble(id, patch) {
    setThread((list) => list.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  async function deliver(id, payload) {
    setSending(true)
    try {
      const res = await fetch(RELAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        updateBubble(id, { status: 'failed', error: data.error || null })
        return
      }

      updateBubble(id, { status: 'delivered' })
      later(() => setTyping(true), 700)
      later(() => {
        setTyping(false)
        setThread((list) => [...list, { id: nextId.current++, from: 'bot' }])
      }, 2400)
    } catch {
      updateBubble(id, { status: 'failed', error: null })
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (sending) return

    if (!form.name.trim()) {
      setFieldError('name')
      return
    }
    if (!isValidPhone(form.phone)) {
      setFieldError('phone')
      return
    }
    if (isGibberish(form.message)) {
      setFieldError('message')
      return
    }

    setFieldError(null)
    const payload = { ...form, message: form.message.trim(), lang }
    const id = nextId.current++
    setThread((list) => [...list, { id, from: 'me', text: payload.message, status: 'sending', payload }])
    setForm({ ...form, message: '' })
    if (messageRef.current) messageRef.current.style.height = ''
    deliver(id, payload)
  }

  function retry(bubble) {
    if (sending) return
    updateBubble(bubble.id, { status: 'sending', error: null })
    deliver(bubble.id, bubble.payload)
  }

  const errorText = { name: t.errorName, phone: t.errorPhone, message: t.errorGibberish }[fieldError]
  const lastMineId = [...thread].reverse().find((b) => b.from === 'me')?.id
  const [weekday, day, month] = [t.weekdays[now.getDay()], now.getDate(), t.months[now.getMonth()]]
  const dateLine = {
    uz: `${weekday}, ${day}-${month}`,
    ru: `${weekday}, ${day} ${month}`,
    en: `${weekday}, ${month} ${day}`,
  }[lang]

  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionHeading title={t.title} subtitle={t.subtitle} />

        <div className={`iphone${appOpen ? ' is-open' : ''}`}>
          <span className="iphone-key iphone-key-action" aria-hidden="true" />
          <span className="iphone-key iphone-key-vol-up" aria-hidden="true" />
          <span className="iphone-key iphone-key-vol-down" aria-hidden="true" />
          <span className="iphone-key iphone-key-power" aria-hidden="true" />
          <span className="iphone-key iphone-key-camera" aria-hidden="true" />

          <div className="iphone-screen">
            <span className="iphone-island" aria-hidden="true" />
            <div className="ios-status" aria-hidden="true">
              <span className="ios-status-time">{formatTime(now)}</span>
              <StatusIcons />
            </div>

            <div className="ios-lock" inert={appOpen}>
              <div className="ios-lock-top">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1zm2 0h6V7a3 3 0 0 0-6 0v3z" />
                </svg>
                <p className="ios-lock-date">{dateLine}</p>
                <p className="ios-lock-time">{formatTime(now)}</p>
              </div>
              <button
                type="button"
                className="ios-lock-open"
                onClick={() => {
                  playUnlockSound()
                  setOpened(true)
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5-.2 1.4-.9 2.7-2 3.6 2 .1 3.9-.6 5.3-1.8 1 .3 2 .4 3.1.4 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
                </svg>
                {t.openApp}
              </button>
            </div>

            <div className="ios-app" inert={!appOpen}>
              <header className="ios-app-head">
                {!compact && (
                  <button type="button" className="ios-back" onClick={() => setOpened(false)} aria-label={t.back}>
                    <svg viewBox="0 0 12 20" width="12" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 2 2 10l8 8" />
                    </svg>
                  </button>
                )}
                <img src={avatarPhoto} alt="" className="ios-avatar" />
                <span className="ios-contact-name">Og'abek Karimov</span>
              </header>

              <form className="ios-form" onSubmit={handleSubmit} noValidate>
                <div className="ios-from">
                  <label className={`ios-from-row${fieldError === 'name' ? ' has-error' : ''}`}>
                    <span>{t.fromName}</span>
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                    />
                  </label>
                  <label className={`ios-from-row${fieldError === 'phone' ? ' has-error' : ''}`}>
                    <span>{t.fromPhone}</span>
                    <input
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      onFocus={(e) => {
                        const len = e.target.value.length
                        e.target.setSelectionRange(len, len)
                      }}
                    />
                  </label>
                </div>

                <div className="ios-thread" ref={threadRef} aria-live="polite">
                  <p className="ios-stamp">
                    {t.today} {formatTime(now)}
                  </p>
                  <div className="ios-bubble is-in">{t.greeting}</div>

                  {thread.map((b) =>
                    b.from === 'bot' ? (
                      <div className="ios-bubble is-in is-new" key={b.id}>
                        {t.autoReply}
                      </div>
                    ) : (
                      <div className={`ios-out${b.status === 'failed' ? ' is-failed' : ''}`} key={b.id}>
                        <div className="ios-out-row">
                          <div className="ios-bubble is-out">{b.text}</div>
                          {b.status === 'failed' && (
                            <span className="ios-fail-icon" aria-hidden="true">
                              !
                            </span>
                          )}
                        </div>
                        {b.status === 'sending' && <span className="ios-receipt">{t.sending}</span>}
                        {b.status === 'delivered' && b.id === lastMineId && <span className="ios-receipt">{t.delivered}</span>}
                        {b.status === 'failed' && (
                          <span className="ios-receipt is-failed">
                            {t.failed}. {b.error || t.errorGeneric}{' '}
                            <button type="button" onClick={() => retry(b)}>
                              {t.retry}
                            </button>
                          </span>
                        )}
                      </div>
                    )
                  )}

                  {typing && (
                    <div className="ios-bubble is-in ios-typing" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                </div>

                {errorText && (
                  <p className="ios-error" role="alert">
                    {errorText}
                  </p>
                )}

                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="hp-field"
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="ios-composer">
                  <span className="ios-plus" aria-hidden="true">
                    +
                  </span>
                  <div className={`ios-input${fieldError === 'message' ? ' has-error' : ''}`}>
                    <textarea
                      ref={messageRef}
                      name="message"
                      rows="1"
                      value={form.message}
                      onChange={handleMessageChange}
                      onKeyDown={handleMessageKeyDown}
                      placeholder={t.messageLabel}
                      aria-label={t.messageLabel}
                    />
                    <button type="submit" className="ios-send" disabled={!form.message.trim() || sending} aria-label={t.send}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 19V5 M6 11l6-6 6 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <span className="iphone-home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
