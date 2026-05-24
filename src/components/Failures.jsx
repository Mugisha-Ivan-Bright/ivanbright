import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Failures() {
  const { t } = useI18n()
  const cardsRef = useRef([])

  const cards = t?.failures?.cards

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    cardsRef.current.forEach((card, i) => {
      gsap.from(card,
        {
          y: 20,
          duration: 0.7,
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
          {t?.failures?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.failures?.title}
          <br />
          <span className="text-accent">{t?.failures?.titleAccent}</span>
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((f, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="card"
            >
              <div className="card-label">{f.label}</div>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
