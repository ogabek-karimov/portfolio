import { useState } from 'react'
import './Contact.css'

const RELAY_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'
const UZ_PHONE_RE = /^\+998\d{9}$/

function isValidPhone(value) {
  const normalized = value.replace(/[\s()-]/g, '')
  return UZ_PHONE_RE.test(normalized)
}

function isGibberish(text) {
  const trimmed = text.trim()
  if (trimmed.length < 15) return true
  if (!/\s/.test(trimmed)) return true

  const letters = trimmed.toLowerCase().replace(/[^a-zʻʼ]/g, '')
  if (letters.length === 0) return true

  const vowels = letters.match(/[aeiou]/g) || []
  if (vowels.length / letters.length < 0.15) return true

  let run = 0
  let maxRun = 0
  for (const ch of letters) {
    if ('aeiou'.includes(ch)) {
      run = 0
    } else {
      run += 1
      maxRun = Math.max(maxRun, run)
    }
  }
  return maxRun >= 6
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!isValidPhone(form.phone)) {
      setStatus('error')
      setErrorMsg("Telefon raqamni +998XXXXXXXXX ko'rinishida to'liq kiriting")
      return
    }

    if (isGibberish(form.message)) {
      setStatus('error')
      setErrorMsg("Iltimos, tushunarli xabar yozing (kamida 15 ta belgi, ma'noli matn)")
      return
    }

    setStatus('sending')

    try {
      const res = await fetch(RELAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrorMsg(data.error || "Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring.")
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', phone: '', message: '', website: '' })
    } catch {
      setErrorMsg("Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring.")
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Aloqa</h2>
        <p className="section-subtitle">
          Loyiha bo'yicha taklifingiz bormi? Yozing!
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Ismingiz
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Ismingiz"
              />
            </label>
            <label>
              Telefon raqam
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
              />
            </label>
          </div>
          <label>
            Xabar
            <textarea
              name="message"
              rows="5"
              required
              minLength={15}
              value={form.message}
              onChange={handleChange}
              placeholder="Xabaringizni shu yerga to'liq va tushunarli yozing..."
            />
          </label>
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
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>
          {status === 'success' && (
            <p className="form-status success">Xabaringiz yuborildi, rahmat!</p>
          )}
          {status === 'error' && <p className="form-status error">{errorMsg}</p>}
        </form>
      </div>
    </section>
  )
}

export default Contact
