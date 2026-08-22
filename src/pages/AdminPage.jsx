import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import translations from '../i18n/translations'
import './AdminPage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

const EMPTY_EXPERIENCE_ITEM = { date: '', title: '', place: '', desc: '' }
const EMPTY_CERT_ITEM = { title: '', issuer: '', date: '', imageId: '' }

const DEFAULT_CONTENT = {
  experience: { uz: translations.uz.experience.items, ru: translations.ru.experience.items },
  certificates: {
    uz: translations.uz.certificates.items.map((c) => ({ ...c, imageId: '' })),
    ru: translations.ru.certificates.items.map((c) => ({ ...c, imageId: '' })),
  },
  resume: {
    contact: {
      email: 'bek8896ok@gmail.com',
      telegram: 't.me/bek_xacker',
      website: 'ogabek-karimov.github.io/portfolio',
    },
    uz: {
      name: "Karimov Og'abek",
      role: 'Frontend Developer',
      about:
        "Frontend dasturchiman, foydalanuvchi uchun qulay va chiroyli interfeyslar yarataman. HTML, CSS va JavaScript asosida boshlab, hozirda React kutubxonasi bilan ishlayman va Node.js yordamida loyihalarni yig'ish (build) va server tomonini ham o'rganib bormoqdaman.",
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Git / GitHub'],
    },
    ru: {
      name: 'Огабек Каримов',
      role: 'Frontend-разработчик',
      about:
        'Я frontend-разработчик, создаю удобные и красивые интерфейсы для пользователей. Начав с HTML, CSS и JavaScript, сейчас работаю с библиотекой React, а также изучаю сборку проектов и серверную часть с помощью Node.js.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Git / GitHub'],
    },
  },
}

function AdminPage() {
  const { lang, dict } = useLanguage()
  const t = dict.admin
  const { isAdmin, login } = useAdminAuth()

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('phone')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const editLang = lang
  const [tab, setTab] = useState('experience')
  const [experience, setExperience] = useState(DEFAULT_CONTENT.experience)
  const [certificates, setCertificates] = useState(DEFAULT_CONTENT.certificates)
  const [resume, setResume] = useState(DEFAULT_CONTENT.resume)
  const [loaded, setLoaded] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const itemRefs = useRef({})
  const [uploadingIndex, setUploadingIndex] = useState(null)

  useEffect(() => {
    setHighlightIndex(null)
  }, [tab, editLang])

  useEffect(() => {
    if (!isAdmin) return
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        setExperience(
          data.experience && (data.experience.uz.length || data.experience.ru.length)
            ? data.experience
            : DEFAULT_CONTENT.experience,
        )
        setCertificates(
          data.certificates && (data.certificates.uz.length || data.certificates.ru.length)
            ? data.certificates
            : DEFAULT_CONTENT.certificates,
        )
        setResume(data.resume && data.resume.contact ? data.resume : DEFAULT_CONTENT.resume)
        setLoaded(true)
      })
  }, [isAdmin])

  async function requestOtp(e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch(`${API_URL}/admin/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setStep('otp')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function verifyOtp(e) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch(`${API_URL}/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      login(data.token)
    } catch (err) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  function updateItem(section, index, field, value) {
    const setter = section === 'experience' ? setExperience : setCertificates
    setter((prev) => {
      const list = [...prev[editLang]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [editLang]: list }
    })
  }

  function addItem(section) {
    const currentState = section === 'experience' ? experience : certificates
    const setter = section === 'experience' ? setExperience : setCertificates
    const empty = section === 'experience' ? EMPTY_EXPERIENCE_ITEM : EMPTY_CERT_ITEM
    const newIndex = currentState[editLang].length

    setter((prev) => ({ ...prev, [editLang]: [...prev[editLang], { ...empty }] }))
    setHighlightIndex(newIndex)
    setTimeout(() => {
      itemRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    setTimeout(() => setHighlightIndex(null), 2000)
  }

  function removeItem(section, index) {
    const setter = section === 'experience' ? setExperience : setCertificates
    setter((prev) => ({ ...prev, [editLang]: prev[editLang].filter((_, i) => i !== index) }))
  }

  async function saveSection(section) {
    setSaveMsg(t.loading)
    const data = section === 'experience' ? experience : section === 'certificates' ? certificates : resume
    const token = localStorage.getItem('admin-token')
    try {
      const res = await fetch(`${API_URL}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section, data }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error')
      setSaveMsg(t.savedMsg)
    } catch (err) {
      setSaveMsg(`${t.errorPrefix} ${err.message}`)
    }
    setTimeout(() => setSaveMsg(''), 3000)
  }

  function updateResumeField(field, value) {
    setResume((prev) => ({ ...prev, [editLang]: { ...prev[editLang], [field]: value } }))
  }

  function updateResumeSkills(value) {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    setResume((prev) => ({ ...prev, [editLang]: { ...prev[editLang], skills } }))
  }

  function updateResumeContact(field, value) {
    setResume((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }))
  }

  async function uploadCertImage(index, file) {
    if (!file) return
    setUploadingIndex(index)
    const token = localStorage.getItem('admin-token')
    try {
      const res = await fetch(`${API_URL}/admin/cert-image`, {
        method: 'POST',
        headers: { 'Content-Type': file.type, Authorization: `Bearer ${token}` },
        body: file,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error')
      updateItem('certificates', index, 'imageId', result.id)
    } catch (err) {
      setSaveMsg(`${t.errorPrefix} ${err.message}`)
      setTimeout(() => setSaveMsg(''), 3000)
    } finally {
      setUploadingIndex(null)
    }
  }

  async function uploadResume(e) {
    const file = e.target.files[0]
    if (!file) return
    setSaveMsg(t.loading)
    const token = localStorage.getItem('admin-token')
    try {
      const res = await fetch(`${API_URL}/admin/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error')
      setSaveMsg(t.resumeUploadedMsg)
    } catch (err) {
      setSaveMsg(`${t.errorPrefix} ${err.message}`)
    }
    setTimeout(() => setSaveMsg(''), 3000)
  }

  if (!isAdmin) {
    return (
      <section className="admin-login">
        <div className="admin-login-card">
          <h1>{t.loginTitle}</h1>

          {step === 'phone' && (
            <form onSubmit={requestOtp}>
              <label>
                {t.phoneLabel}
                <input
                  type="tel"
                  placeholder="+998901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t.sendingBtn : t.getCodeBtn}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verifyOtp}>
              <label>
                {t.codeLabel}
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t.verifyingBtn : t.loginBtn}
              </button>
            </form>
          )}

          {msg && <p className="admin-msg">{msg}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>{t.panelTitle}</h1>
        </div>

        <div className="admin-toolbar">
          <div className="admin-tabs">
            <button className={tab === 'experience' ? 'active' : ''} onClick={() => setTab('experience')}>
              {t.tabExperience}
            </button>
            <button className={tab === 'certificates' ? 'active' : ''} onClick={() => setTab('certificates')}>
              {t.tabCertificates}
            </button>
            <button className={tab === 'resume' ? 'active' : ''} onClick={() => setTab('resume')}>
              {t.tabResume}
            </button>
          </div>

          {tab !== 'resume' && (
            <p className="admin-edit-lang-note">
              {t.editingNotePrefix} <strong>{editLang.toUpperCase()}</strong> {t.editingNoteSuffix}
            </p>
          )}
        </div>

        {!loaded ? (
          <p>{t.loading}</p>
        ) : (
          <>
            {tab === 'experience' && (
              <div className="admin-list">
                {experience[editLang].map((item, i) => (
                  <div
                    className={`admin-item ${highlightIndex === i ? 'highlight' : ''}`}
                    key={i}
                    ref={(el) => (itemRefs.current[i] = el)}
                  >
                    <div className="admin-item-head">
                      <span>
                        {t.entryLabel} №{i + 1}
                      </span>
                      <button
                        type="button"
                        className="icon-btn"
                        title={t.deleteLabel}
                        onClick={() => removeItem('experience', i)}
                      >
                        🗑️
                      </button>
                    </div>
                    <input
                      placeholder={t.datePlaceholder}
                      value={item.date}
                      onChange={(e) => updateItem('experience', i, 'date', e.target.value)}
                    />
                    <input
                      placeholder={t.titlePlaceholder}
                      value={item.title}
                      onChange={(e) => updateItem('experience', i, 'title', e.target.value)}
                    />
                    <input
                      placeholder={t.placePlaceholder}
                      value={item.place}
                      onChange={(e) => updateItem('experience', i, 'place', e.target.value)}
                    />
                    <textarea
                      placeholder={t.descPlaceholder}
                      rows="2"
                      value={item.desc}
                      onChange={(e) => updateItem('experience', i, 'desc', e.target.value)}
                    />
                  </div>
                ))}
                <button className="btn btn-outline" onClick={() => addItem('experience')}>
                  {t.addExperienceBtn}
                </button>
                <button className="btn btn-primary" onClick={() => saveSection('experience')}>
                  {t.saveBtn}
                </button>
              </div>
            )}

            {tab === 'certificates' && (
              <div className="admin-list">
                {certificates[editLang].map((item, i) => (
                  <div
                    className={`admin-item ${highlightIndex === i ? 'highlight' : ''}`}
                    key={i}
                    ref={(el) => (itemRefs.current[i] = el)}
                  >
                    <div className="admin-item-head">
                      <span>
                        {t.certLabel} №{i + 1}
                      </span>
                      <button
                        type="button"
                        className="icon-btn"
                        title={t.deleteLabel}
                        onClick={() => removeItem('certificates', i)}
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="cert-image-row">
                      {item.imageId ? (
                        <img
                          src={`${API_URL}/cert-image/${item.imageId}`}
                          alt=""
                          className="cert-image-preview"
                        />
                      ) : (
                        <div className="cert-image-placeholder">🏅</div>
                      )}
                      <label className="upload-btn">
                        {uploadingIndex === i ? t.uploadingLabel : t.uploadImageBtn}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => uploadCertImage(i, e.target.files[0])}
                        />
                      </label>
                    </div>

                    <input
                      placeholder={t.certTitlePlaceholder}
                      value={item.title}
                      onChange={(e) => updateItem('certificates', i, 'title', e.target.value)}
                    />
                    <input
                      placeholder={t.certIssuerPlaceholder}
                      value={item.issuer}
                      onChange={(e) => updateItem('certificates', i, 'issuer', e.target.value)}
                    />
                    <input
                      placeholder={t.certDatePlaceholder}
                      value={item.date}
                      onChange={(e) => updateItem('certificates', i, 'date', e.target.value)}
                    />
                  </div>
                ))}
                <button className="btn btn-outline" onClick={() => addItem('certificates')}>
                  {t.addCertBtn}
                </button>
                <button className="btn btn-primary" onClick={() => saveSection('certificates')}>
                  {t.saveBtn}
                </button>
              </div>
            )}

            {tab === 'resume' && (
              <div className="admin-resume-tabs">
                <div className="admin-item admin-resume-card">
                  <div className="admin-item-head">
                    <span>
                      {t.resumeCardTitlePrefix} ({editLang.toUpperCase()})
                    </span>
                  </div>
                  <p className="admin-resume-hint">{t.resumeHint}</p>
                  <input
                    placeholder={t.namePlaceholder}
                    value={resume[editLang].name}
                    onChange={(e) => updateResumeField('name', e.target.value)}
                  />
                  <input
                    placeholder={t.rolePlaceholder}
                    value={resume[editLang].role}
                    onChange={(e) => updateResumeField('role', e.target.value)}
                  />
                  <textarea
                    placeholder={t.aboutPlaceholder}
                    rows="3"
                    value={resume[editLang].about}
                    onChange={(e) => updateResumeField('about', e.target.value)}
                  />
                  <input
                    placeholder={t.skillsPlaceholder}
                    value={resume[editLang].skills.join(', ')}
                    onChange={(e) => updateResumeSkills(e.target.value)}
                  />

                  <div className="admin-resume-contact">
                    <span className="admin-resume-contact-label">{t.contactLabel}</span>
                    <input
                      placeholder={t.emailPlaceholder}
                      value={resume.contact.email}
                      onChange={(e) => updateResumeContact('email', e.target.value)}
                    />
                    <input
                      placeholder={t.telegramPlaceholder}
                      value={resume.contact.telegram}
                      onChange={(e) => updateResumeContact('telegram', e.target.value)}
                    />
                    <input
                      placeholder={t.websitePlaceholder}
                      value={resume.contact.website}
                      onChange={(e) => updateResumeContact('website', e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary" onClick={() => saveSection('resume')}>
                    {t.saveBtn}
                  </button>
                </div>

                <div className="admin-item admin-resume-card">
                  <div className="admin-item-head">
                    <span>{t.pdfCardTitle}</span>
                  </div>
                  <p className="admin-resume-hint">{t.pdfHint}</p>
                  <label className="upload-btn">
                    {t.chooseFileBtn}
                    <input type="file" accept="application/pdf" hidden onChange={uploadResume} />
                  </label>
                </div>
              </div>
            )}

            {saveMsg && <p className="admin-msg">{saveMsg}</p>}
          </>
        )}
      </div>
    </section>
  )
}

export default AdminPage
