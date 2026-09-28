import { createContext, useContext, useEffect, useState } from 'react'
import translations from './translations'
import { LANGS, detectLanguage } from './detectLanguage'

const LanguageContext = createContext(null)

// A language the visitor picked themselves wins; otherwise guess from where they are.
function getInitialLang() {
  let saved = null
  try {
    saved = localStorage.getItem('lang')
  } catch {
    // storage can be blocked; fall back to detection
  }
  return LANGS.includes(saved) ? saved : detectLanguage()
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // only an explicit choice is remembered, so detection keeps working for everyone else
  function setLang(next) {
    setLangState(next)
    try {
      localStorage.setItem('lang', next)
    } catch {
      // not remembered, but the switch still works for this visit
    }
  }

  const dict = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
