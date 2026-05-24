import { Mail, Phone } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'

const columns = [
  {
    key: 'navigate',
    links: [
      { tKey: 'story', href: '#story' },
      { tKey: 'projects', href: '#projects' },
      { tKey: 'skills', href: '#skills' },
      { tKey: 'community', href: '#community' },
    ],
  },
  {
    key: 'more',
    links: [
      { tKey: 'whyIBuild', href: '#why-i-build' },
      { tKey: 'beliefs', href: '#beliefs' },
      { tKey: 'contact', href: '#contact' },
      { tKey: 'hireMe', href: '#contact' },
    ],
  },
  {
    key: 'code',
    links: [
      { tKey: 'github1', href: 'https://github.com/Mugisha-Ivan-Bright' },
      { tKey: 'github2', href: 'https://github.com/codewithmugisha' },
    ],
  },
  {
    key: 'reach',
    links: [
      { tKey: 'email', href: 'mailto:mugishaivanbright250@gmail.com' },
      { tKey: 'phone', href: 'tel:+250735024932' },
    ],
  },
]

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.key}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#555] mb-4">
                {t?.footer?.[col.key]}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.tKey}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="link-underline font-mono text-sm text-[#777] no-underline transition-colors hover:text-accent"
                    >
                      {t?.nav?.[link.tKey] || t?.footer?.links?.[link.tKey]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#1a1a1a] pt-8 sm:flex-row">
          <div className="font-mono text-xs text-[#555]">
            {t?.footer?.copyright}
          </div>
          <div className="font-mono text-xs text-[#555] text-center">
            {t?.footer?.builtWith}
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Mugisha-Ivan-Bright" target="_blank" rel="noopener noreferrer" className="text-[#555] transition-colors hover:text-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="mailto:mugishaivanbright250@gmail.com" className="text-[#555] transition-colors hover:text-accent">
              <Mail size={16} />
            </a>
            <a href="tel:+250735024932" className="text-[#555] transition-colors hover:text-accent">
              <Phone size={16} />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center font-mono text-[11px] tracking-wider text-[#444]">
          {t?.footer?.location}
        </div>
      </div>
    </footer>
  )
}
