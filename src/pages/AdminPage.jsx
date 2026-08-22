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
}

function AdminPage() {
  const { lang } = useLanguage()
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
      if (!res.ok) throw new Error(data.error || 'Xatolik')
      setStep('otp')
      setMsg('Kod Telegram botga yuborildi')
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
      if (!res.ok) throw new Error(data.error || 'Xatolik')
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
    setSaveMsg('Saqlanmoqda...')
    const data = section === 'experience' ? experience : certificates
    const token = localStorage.getItem('admin-token')
    try {
      const res = await fetch(`${API_URL}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section, data }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Xatolik')
      setSaveMsg('Saqlandi ✓')
    } catch (err) {
      setSaveMsg('Xato: ' + err.message)
    }
    setTimeout(() => setSaveMsg(''), 3000)
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
      if (!res.ok) throw new Error(result.error || 'Xatolik')
      updateItem('certificates', index, 'imageId', result.id)
    } catch (err) {
      setSaveMsg('Xato: ' + err.message)
      setTimeout(() => setSaveMsg(''), 3000)
    } finally {
      setUploadingIndex(null)
    }
  }

  async function uploadResume(e) {
    const file = e.target.files[0]
    if (!file) return
    setSaveMsg('Yuklanmoqda...')
    const token = localStorage.getItem('admin-token')
    try {
      const res = await fetch(`${API_URL}/admin/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Xatolik')
      setSaveMsg('Rezyume yuklandi ✓')
    } catch (err) {
      setSaveMsg('Xato: ' + err.message)
    }
    setTimeout(() => setSaveMsg(''), 3000)
  }

  if (!isAdmin) {
    return (
      <section className="admin-login">
        <div className="admin-login-card">
          <h1>Admin panel</h1>

          {step === 'phone' && (
            <form onSubmit={requestOtp}>
              <label>
                Telefon raqam
                <input
                  type="tel"
                  placeholder="+998901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Yuborilmoqda...' : 'Kod olish'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verifyOtp}>
              <label>
                Telegram'dan kelgan kod
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Tekshirilmoqda...' : 'Kirish'}
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
          <h1>Admin panel</h1>
        </div>

        <div className="admin-toolbar">
          <div className="admin-tabs">
            <button className={tab === 'experience' ? 'active' : ''} onClick={() => setTab('experience')}>
              Ta'lim va tajriba
            </button>
            <button className={tab === 'certificates' ? 'active' : ''} onClick={() => setTab('certificates')}>
              Sertifikatlar
            </button>
            <button className={tab === 'resume' ? 'active' : ''} onClick={() => setTab('resume')}>
              Rezyume
            </button>
          </div>

          {tab !== 'resume' && (
            <p className="admin-edit-lang-note">
              Hozir <strong>{editLang.toUpperCase()}</strong> tili tahrirlanmoqda — tilni yuqoridagi
              navbar'dan almashtiring
            </p>
          )}
        </div>

        {!loaded ? (
          <p>Yuklanmoqda...</p>
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
                      <span>Yozuv №{i + 1}</span>
                      <button
                        type="button"
                        className="icon-btn"
                        title="O'chirish"
                        onClick={() => removeItem('experience', i)}
                      >
                        🗑️
                      </button>
                    </div>
                    <input
                      placeholder="Sana (masalan: 2025)"
                      value={item.date}
                      onChange={(e) => updateItem('experience', i, 'date', e.target.value)}
                    />
                    <input
                      placeholder="Sarlavha"
                      value={item.title}
                      onChange={(e) => updateItem('experience', i, 'title', e.target.value)}
                    />
                    <input
                      placeholder="Joy"
                      value={item.place}
                      onChange={(e) => updateItem('experience', i, 'place', e.target.value)}
                    />
                    <textarea
                      placeholder="Tavsif"
                      rows="2"
                      value={item.desc}
                      onChange={(e) => updateItem('experience', i, 'desc', e.target.value)}
                    />
                  </div>
                ))}
                <button className="btn btn-outline" onClick={() => addItem('experience')}>
                  + Yangi qator qo'shish
                </button>
                <button className="btn btn-primary" onClick={() => saveSection('experience')}>
                  Saqlash
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
                      <span>Sertifikat №{i + 1}</span>
                      <button
                        type="button"
                        className="icon-btn"
                        title="O'chirish"
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
                        {uploadingIndex === i ? 'Yuklanmoqda...' : "Rasm yuklash"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => uploadCertImage(i, e.target.files[0])}
                        />
                      </label>
                    </div>

                    <input
                      placeholder="Sertifikat nomi"
                      value={item.title}
                      onChange={(e) => updateItem('certificates', i, 'title', e.target.value)}
                    />
                    <input
                      placeholder="Bergan tashkilot"
                      value={item.issuer}
                      onChange={(e) => updateItem('certificates', i, 'issuer', e.target.value)}
                    />
                    <input
                      placeholder="Sana"
                      value={item.date}
                      onChange={(e) => updateItem('certificates', i, 'date', e.target.value)}
                    />
                  </div>
                ))}
                <button className="btn btn-outline" onClick={() => addItem('certificates')}>
                  + Yangi sertifikat qo'shish
                </button>
                <button className="btn btn-primary" onClick={() => saveSection('certificates')}>
                  Saqlash
                </button>
              </div>
            )}

            {tab === 'resume' && (
              <div className="admin-resume">
                <p>Yangi PDF rezyume faylini yuklang (eskisi almashtiriladi):</p>
                <input type="file" accept="application/pdf" onChange={uploadResume} />
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
