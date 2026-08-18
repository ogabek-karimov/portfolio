import { createContext, useContext, useEffect, useState } from 'react'
import translations from './translations'

const LanguageContext = createContext(null)

function getInitialLang() {
  const saved = localStorage.getItem('lang')
  return saved === 'ru' ? 'ru' : 'uz'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

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
