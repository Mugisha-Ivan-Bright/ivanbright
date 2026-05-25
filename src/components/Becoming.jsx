import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

const statusPillClass = {
  'shipped': 'pill-shipped',
  'in progress': 'pill-progress',
  'dreaming': 'pill-dream',
}

export default function Becoming() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const pillsRef = useRef([])

  const paragraphs = t?.becoming?.paragraphs
  const closing = t?.becoming?.closing
  const phases = t?.becoming?.phases
  const statusLabels = t?.becoming?.statusLabels

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(titleRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(textRef.current?.querySelectorAll('.become-text'), { y: 15, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
      gsap.from(pillsRef.current.filter(Boolean), { x: -15, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  const statusIcon = (s) => {
    if (s === 'shipped') return '✓'
    if (s === 'in progress') return '⟳'
    return '◌'
  }

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={labelRef} className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.becoming?.label}
        </div>
        <h2 ref={titleRef} className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.becoming?.title}
          <br />
          <span className="text-accent">{t?.becoming?.titleAccent}</span>
        </h2>

        <div ref={textRef} className="mt-16 max-w-3xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="become-text font-mono text-sm leading-relaxed text-[#888] mt-6 first:mt-0">
              {p}
            </p>
          ))}
          <p className="become-text mt-8 font-mono text-base font-semibold leading-relaxed text-accent">
            {closing}
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {phases.map((p, i) => (
            <div
              key={i}
              ref={(el) => (pillsRef.current[i] = el)}
               className="flex flex-wrap items-center gap-4"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#555] min-w-[180px]">
                {p.label}
              </span>
              <span className="font-mono text-sm text-[#888]">
                {p.desc}
              </span>
              <span className={`pill ${statusPillClass[p.status] || 'pill-dream'}`}>
                {statusLabels?.[p.status] || p.status} {statusIcon(p.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
