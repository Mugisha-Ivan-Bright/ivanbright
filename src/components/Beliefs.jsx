import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Beliefs() {
  const { t } = useI18n()
  const cardsRef = useRef([])

  const cards = t?.beliefs?.cards

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    cardsRef.current.forEach((card, i) => {
      gsap.from(card,
        {
          y: 15,
          duration: 0.6,
          delay: i * 0.1,
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
    <section id="beliefs" className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.beliefs?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.beliefs?.title}
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {cards.map((b, i) => (
            <div
              key={b.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="card"
            >
              <h3 className="card-title text-accent">{b.title}</h3>
              <p className="card-body">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
