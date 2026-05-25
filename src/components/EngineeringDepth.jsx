import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function EngineeringDepth() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])
  const terminalRef = useRef(null)

  const cards = t?.engineering?.cards
  const terminalPrompt = t?.engineering?.terminalPrompt
  const terminalLines = t?.engineering?.terminalLines

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(titleRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(cardsRef.current.filter(Boolean), { y: 15, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
      gsap.from(terminalRef.current, { y: 15, opacity: 0, duration: 0.7, delay: 0.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={labelRef} className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.engineering?.label}
        </div>
        <h2 ref={titleRef} className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.engineering?.title}
          <br />
          <span className="text-accent">{t?.engineering?.titleAccent}</span>
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="terminal"
            >
              <div className="terminal-header">
                <span className="terminal-dot" />
                <span className="terminal-dot" />
                <span className="terminal-dot" />
                <span className="terminal-title">{card.title}</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-output">{card.body}</div>
              </div>
            </div>
          ))}

          <div
            ref={terminalRef}
            className="terminal"
          >
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">terminal</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-prompt">{terminalPrompt}</div>
              {terminalLines.map((line, li) => (
                <div key={li} className="terminal-output">
                  {line}
                </div>
              ))}
              <span className="terminal-cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
