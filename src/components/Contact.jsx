import { useState } from 'react'
import './Contact.css'

const RELAY_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(RELAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus('success')
      setForm({ name: '', phone: '', message: '', website: '' })
    } catch {
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
              value={form.message}
              onChange={handleChange}
              placeholder="Xabaringizni shu yerga yozing..."
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
          {status === 'error' && (
            <p className="form-status error">
              Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
