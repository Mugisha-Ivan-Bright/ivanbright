import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Obsession() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const exploringRef = useRef(null)
  const thoughtsRef = useRef(null)

  const exploringItems = t?.obsession?.exploringItems
  const thoughtsItems = t?.obsession?.thoughtsItems

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.obs-label'), { y: 20, opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(exploringRef.current, { y: 15, opacity: 0, duration: 0.6, delay: 0.2, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(thoughtsRef.current, { y: 15, opacity: 0, duration: 0.6, delay: 0.35, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="obs-label mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.obsession?.label}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div ref={exploringRef} className="terminal">
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

          <div ref={thoughtsRef} className="terminal">
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
