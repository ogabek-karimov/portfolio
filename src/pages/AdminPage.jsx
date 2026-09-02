import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import translations from '../i18n/translations'
import './AdminPage.css'

const API_URL = 'https://portfolio-contact-relay.bek8896ok.workers.dev'

const EMPTY_EXPERIENCE_ITEM = { date: '', title: '', place: '', desc: '', hidden: false }
const EMPTY_CERT_ITEM = { title: '', issuer: '', date: '', imageId: '', hidden: false }

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function ChevronIcon({ direction }) {
  const d = direction === 'up' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const DEFAULT_CONTENT = {
  experience: {
    uz: translations.uz.experience.items.map((i) => ({ ...i, hidden: false })),
    ru: translations.ru.experience.items.map((i) => ({ ...i, hidden: false })),
  },
  certificates: {
    uz: translations.uz.certificates.items.map((c) => ({ ...c, imageId: '', hidden: false })),
    ru: translations.ru.certificates.items.map((c) => ({ ...c, imageId: '', hidden: false })),
  },
  resume: {
    hidden: false,
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
  const [savedSnapshots, setSavedSnapshots] = useState({ experience: '', certificates: '', resume: '' })

  useEffect(() => {
    setHighlightIndex(null)
  }, [tab, editLang])

  useEffect(() => {
    if (!isAdmin) return
    fetch(`${API_URL}/content`)
      .then((r) => r.json())
      .then((data) => {
        const exp =
          data.experience && (data.experience.uz.length || data.experience.ru.length)
            ? data.experience
            : DEFAULT_CONTENT.experience
        const certs =
          data.certificates && (data.certificates.uz.length || data.certificates.ru.length)
            ? data.certificates
            : DEFAULT_CONTENT.certificates
        const res =
          data.resume && data.resume.contact
            ? { ...data.resume, hidden: Boolean(data.resume.hidden) }
            : DEFAULT_CONTENT.resume
        setExperience(exp)
        setCertificates(certs)
        setResume(res)
        setSavedSnapshots({
          experience: JSON.stringify(exp),
          certificates: JSON.stringify(certs),
          resume: JSON.stringify(res),
        })
        setLoaded(true)
      })
  }, [isAdmin])

  const experienceDirty = JSON.stringify(experience) !== savedSnapshots.experience
  const certificatesDirty = JSON.stringify(certificates) !== savedSnapshots.certificates
  const resumeDirty = JSON.stringify(resume) !== savedSnapshots.resume
  const anyDirty = experienceDirty || certificatesDirty || resumeDirty

  useEffect(() => {
    if (!anyDirty) return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [anyDirty])

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
    if (!window.confirm(t.deleteConfirmMsg)) return
    const setter = section === 'experience' ? setExperience : setCertificates
    setter((prev) => ({ ...prev, [editLang]: prev[editLang].filter((_, i) => i !== index) }))
  }

  function moveItem(section, index, direction) {
    const setter = section === 'experience' ? setExperience : setCertificates
    setter((prev) => {
      const list = [...prev[editLang]]
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...prev, [editLang]: list }
    })
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
      setSavedSnapshots((prev) => ({ ...prev, [section]: JSON.stringify(data) }))
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

  function toggleResumeHidden() {
    setResume((prev) => ({ ...prev, hidden: !prev.hidden }))
  }

  function toggleItemHidden(section, index) {
    const setter = section === 'experience' ? setExperience : setCertificates
    setter((prev) => {
      const list = [...prev[editLang]]
      list[index] = { ...list[index], hidden: !list[index].hidden }
      return { ...prev, [editLang]: list }
    })
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
              {experienceDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
            </button>
            <button className={tab === 'certificates' ? 'active' : ''} onClick={() => setTab('certificates')}>
              {t.tabCertificates}
              {certificatesDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
            </button>
            <button className={tab === 'resume' ? 'active' : ''} onClick={() => setTab('resume')}>
              {t.tabResume}
              {resumeDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
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
              <div className="admin-layout">
                <div className="admin-list">
                  {experience[editLang].map((item, i) => (
                    <div
                      className={`admin-item ${highlightIndex === i ? 'highlight' : ''} ${item.hidden ? 'is-hidden' : ''}`}
                      key={i}
                      ref={(el) => (itemRefs.current[i] = el)}
                    >
                      <div className="admin-item-head">
                        <span>
                          {t.entryLabel} №{i + 1}
                          {item.hidden && <span className="hidden-badge">{t.hiddenBadge}</span>}
                        </span>
                        <button
                          type="button"
                          className="mini-save-btn"
                          onClick={() => saveSection('experience')}
                        >
                          {t.saveBtn}
                          {experienceDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
                        </button>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.moveUpLabel}
                            disabled={i === 0}
                            onClick={() => moveItem('experience', i, -1)}
                          >
                            <ChevronIcon direction="up" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.moveDownLabel}
                            disabled={i === experience[editLang].length - 1}
                            onClick={() => moveItem('experience', i, 1)}
                          >
                            <ChevronIcon direction="down" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={item.hidden ? t.showLabel : t.hideLabel}
                            onClick={() => toggleItemHidden('experience', i)}
                          >
                            <EyeIcon hidden={item.hidden} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.deleteLabel}
                            onClick={() => removeItem('experience', i)}
                          >
                            🗑️
                          </button>
                        </div>
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
                    {experienceDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
                  </button>
                </div>

                <aside className="admin-preview">
                  <h3>{t.previewTitle}</h3>
                  {experience[editLang].filter((item) => !item.hidden).length === 0 ? (
                    <p className="admin-preview-empty">{t.previewEmpty}</p>
                  ) : (
                    experience[editLang]
                      .filter((item) => !item.hidden)
                      .map((item, i) => (
                        <div className="preview-timeline-item" key={i}>
                          <div className="preview-timeline-top">
                            <strong>{item.title || '—'}</strong>
                            <span>{item.date}</span>
                          </div>
                          <div className="preview-timeline-place">{item.place}</div>
                          <p>{item.desc}</p>
                        </div>
                      ))
                  )}
                </aside>
              </div>
            )}

            {tab === 'certificates' && (
              <div className="admin-layout">
                <div className="admin-list">
                  {certificates[editLang].map((item, i) => (
                    <div
                      className={`admin-item ${highlightIndex === i ? 'highlight' : ''} ${item.hidden ? 'is-hidden' : ''}`}
                      key={i}
                      ref={(el) => (itemRefs.current[i] = el)}
                    >
                      <div className="admin-item-head">
                        <span>
                          {t.certLabel} №{i + 1}
                          {item.hidden && <span className="hidden-badge">{t.hiddenBadge}</span>}
                        </span>
                        <button
                          type="button"
                          className="mini-save-btn"
                          onClick={() => saveSection('certificates')}
                        >
                          {t.saveBtn}
                          {certificatesDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
                        </button>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.moveUpLabel}
                            disabled={i === 0}
                            onClick={() => moveItem('certificates', i, -1)}
                          >
                            <ChevronIcon direction="up" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.moveDownLabel}
                            disabled={i === certificates[editLang].length - 1}
                            onClick={() => moveItem('certificates', i, 1)}
                          >
                            <ChevronIcon direction="down" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={item.hidden ? t.showLabel : t.hideLabel}
                            onClick={() => toggleItemHidden('certificates', i)}
                          >
                            <EyeIcon hidden={item.hidden} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title={t.deleteLabel}
                            onClick={() => removeItem('certificates', i)}
                          >
                            🗑️
                          </button>
                        </div>
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
                    {certificatesDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
                  </button>
                </div>

                <aside className="admin-preview">
                  <h3>{t.previewTitle}</h3>
                  {certificates[editLang].filter((item) => !item.hidden).length === 0 ? (
                    <p className="admin-preview-empty">{t.previewEmpty}</p>
                  ) : (
                    <div className="preview-cert-grid">
                      {certificates[editLang]
                        .filter((item) => !item.hidden)
                        .map((item, i) => (
                          <div className="preview-cert-item" key={i}>
                            {item.imageId ? (
                              <img src={`${API_URL}/cert-image/${item.imageId}`} alt="" />
                            ) : (
                              <div className="preview-cert-placeholder">🏅</div>
                            )}
                            <div className="preview-cert-body">
                              <strong>{item.title || '—'}</strong>
                              <span>{item.issuer}</span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </aside>
              </div>
            )}

            {tab === 'resume' && (
              <div className="admin-layout">
              <div className="admin-resume-tabs">
                <div className={`admin-item admin-resume-card ${resume.hidden ? 'is-hidden' : ''}`}>
                  <div className="admin-item-head">
                    <span>
                      {t.resumeCardTitlePrefix} ({editLang.toUpperCase()})
                      {resume.hidden && <span className="hidden-badge">{t.hiddenBadge}</span>}
                    </span>
                    <button
                      type="button"
                      className="icon-btn"
                      title={resume.hidden ? t.showLabel : t.hideLabel}
                      onClick={toggleResumeHidden}
                    >
                      <EyeIcon hidden={resume.hidden} />
                    </button>
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
                    {resumeDirty && <span className="unsaved-dot" title={t.unsavedHint} />}
                  </button>
                </div>

                <div className="admin-item admin-resume-card">
                  <div className="admin-item-head">
                    <span>{t.pdfCardTitle}</span>
                  </div>
                  <p className="admin-resume-hint">{t.pdfHint}</p>
                  <p className="admin-resume-note">{t.pdfUploadNote}</p>
                  <label className="upload-btn">
                    {t.chooseFileBtn}
                    <input type="file" accept="application/pdf" hidden onChange={uploadResume} />
                  </label>
                </div>
              </div>

              <aside className="admin-preview">
                <h3>{t.previewTitle}</h3>
                {resume.hidden ? (
                  <p className="admin-preview-empty">{t.previewResumeHidden}</p>
                ) : (
                  <div className="preview-resume-sheet">
                    <div className="preview-resume-header">
                      <h4>{resume[editLang].name || '—'}</h4>
                      <p className="preview-resume-role">{resume[editLang].role}</p>
                      <div className="preview-resume-contact">
                        <span>✉️ {resume.contact.email}</span>
                        <span>💬 {resume.contact.telegram}</span>
                      </div>
                    </div>
                    <div className="preview-resume-section">
                      <h5>{t.previewAboutLabel}</h5>
                      <p>{resume[editLang].about}</p>
                    </div>
                    <div className="preview-resume-section">
                      <h5>{t.previewSkillsLabel}</h5>
                      <div className="preview-resume-skills">
                        {resume[editLang].skills.map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </aside>
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
