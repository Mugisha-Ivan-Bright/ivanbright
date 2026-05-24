import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Obsession() {
  const { t } = useI18n()
  const ref = useRef(null)

  const exploringItems = t?.obsession?.exploringItems
  const thoughtsItems = t?.obsession?.thoughtsItems

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(ref.current,
      {
        y: 15,
        duration: 0.8,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      }
    )
  }, [])

  return (
    <section className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.obsession?.label}
        </div>

        <div ref={ref} className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">{t?.obsession?.exploringPrompt}</span>
            </div>
            <div className="terminal-body">
              {exploringItems.map((item, i) => (
                <div key={i} className="terminal-output">{item}</div>
              ))}
              <span className="terminal-cursor" />
            </div>
          </div>

          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">{t?.obsession?.thoughtsPrompt}</span>
            </div>
            <div className="terminal-body">
              {thoughtsItems.map((item, i) => (
                <div key={i} className="terminal-output">{item}</div>
              ))}
              <span className="terminal-cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
