import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = languages.find(l => l.code === lang)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#888] transition-colors hover:text-white"
        aria-label="Switch language"
      >
        <Languages size={14} />
        <span>{current?.native}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 border border-[#1f1f1f] bg-[#0c0c0c] p-1 shadow-xl z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`w-full rounded px-3 py-1.5 text-left font-mono text-xs transition-colors ${
                lang === l.code
                  ? 'bg-accent/10 text-accent'
                  : 'text-[#777] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span className="block">{l.native}</span>
              <span className="block text-[10px] text-[#555]">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
