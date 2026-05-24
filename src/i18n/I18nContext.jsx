import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from './en.json'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda' },
]

function deepMerge(base, overrides) {
  const result = { ...base }
  for (const key in overrides) {
    if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = deepMerge(base[key] || {}, overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}

async function loadTranslation(lang) {
  if (lang === 'en') return en
  try {
    const mod = await import(`./translations/${lang}.json`)
    return deepMerge(en, mod.default)
  } catch {
    return en
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('mib_lang') || 'en' } catch { return 'en' }
  })
  const [t, setT] = useState(en)

  const setLang = useCallback((code) => {
    setLangState(code)
    try { localStorage.setItem('mib_lang', code) } catch {}
  }, [])

  useEffect(() => {
    loadTranslation(lang).then(setT)
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
