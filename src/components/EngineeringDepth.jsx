import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function EngineeringDepth() {
  const { t } = useI18n()
  const cardsRef = useRef([])

  const cards = t?.engineering?.cards
  const terminalPrompt = t?.engineering?.terminalPrompt
  const terminalLines = t?.engineering?.terminalLines

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    cardsRef.current.forEach((card, i) => {
      gsap.from(card,
        {
          y: 15,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        }
      )
    })
  }, [])

  return (
    <section className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.engineering?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
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
            ref={(el) => (cardsRef.current[2] = el)}
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
