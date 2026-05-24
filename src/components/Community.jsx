import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Community() {
  const { t } = useI18n()
  const ref = useRef(null)

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
    <section id="community" className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.community?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.community?.title}
          <br />
          <span className="text-accent">{t?.community?.titleAccent}</span>
        </h2>

        <div ref={ref} className="mt-16 max-w-3xl">
          <p className="font-mono text-sm leading-relaxed text-[#888]">
            <span className="text-accent font-semibold">{t?.community?.role}</span> — {t?.community?.school}
          </p>
          <p className="mt-4 font-mono text-xs leading-relaxed text-[#777]">
            {t?.community?.description}
          </p>

          <div className="terminal mt-10">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">beliefs.sh</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-command">{t?.community?.quoteLine1}</div>
              <div className="terminal-success">{t?.community?.quoteLine2}</div>
              <div className="terminal-output italic">{t?.community?.quoteLine3}</div>
              <span className="terminal-cursor" />
            </div>
          </div>

          <p className="mt-6 font-mono text-xs tracking-wider text-[#555]">
            {t?.community?.tag}
          </p>
        </div>
      </div>
    </section>
  )
}
