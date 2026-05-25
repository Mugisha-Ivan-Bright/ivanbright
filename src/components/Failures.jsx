import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Failures() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  const cards = t?.failures?.cards

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(titleRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(cardsRef.current.filter(Boolean), { y: 15, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={labelRef} className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.failures?.label}
        </div>
        <h2 ref={titleRef} className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
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
