import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Xabar: ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nEmail: ${form.email}`)
    window.location.href = `mailto:sizning-emailingiz@example.com?subject=${subject}&body=${body}`
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
              Email
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
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
          <button type="submit" className="btn btn-primary">
            Yuborish
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
