import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { openTerminal } from '../utils/openTerminal.js'

const links = [
  { key: 'story', href: '#story' },
  { key: 'projects', href: '#projects' },
  { key: 'skills', href: '#skills' },
  { key: 'whyIBuild', href: '#why-i-build' },
  { key: 'contact', href: '#contact' },
]

export default function Nav() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      setScrolled(sy > 80)
      if (open) { setHidden(false); lastScrollY.current = sy; return }
      if (sy > 120) {
        setHidden(sy > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = sy
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[60px] transition-all duration-300 ${
        hidden ? 'top-[-70px]' : 'top-3'
      } ${
        scrolled
          ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <a href="#" className="link-underline font-mono text-sm font-bold tracking-wide text-white no-underline">
        {t?.nav?.logo}
      </a>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="link-underline font-mono text-xs tracking-wide text-[#888] no-underline transition-colors hover:text-white"
          >
            {t?.nav?.[l.key]}
          </a>
        ))}
        <LanguageSwitcher />
        <button
          onClick={openTerminal}
          className="terminal-nav-btn"
        >
          [~/&#36;]
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#888]">
          <span className="nav-status-dot" />
          {t?.nav?.openToWork}
        </div>
        <a href="#contact" className="btn-accent text-[11px] py-2 px-4">
          {t?.nav?.hireMe}
        </a>
      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

       {open && (
         <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] backdrop-blur-sm md:hidden animate-fadeIn">
           {links.map((l) => (
             <a
               key={l.href}
               href={l.href}
               onClick={() => setOpen(false)}
               className="link-underline font-mono text-lg uppercase tracking-widest text-[#eee] no-underline hover:text-white transition-colors duration-200"
             >
               {t?.nav?.[l.key]}
             </a>
           ))}
           <div className="mt-2"><LanguageSwitcher onClose={() => setOpen(false)} /></div>
           <a href="#contact" onClick={() => setOpen(false)} className="btn-accent text-[11px] py-2 px-4">
             {t?.nav?.hireMe}
           </a>
         </div>
       )}
    </nav>
  )
}
