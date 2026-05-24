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
  const ref = useRef(null)
  const pillsRef = useRef([])

  const paragraphs = t?.becoming?.paragraphs
  const closing = t?.becoming?.closing
  const phases = t?.becoming?.phases
  const statusLabels = t?.becoming?.statusLabels

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

    pillsRef.current.forEach((pill, i) => {
      gsap.from(pill,
        {
          x: -15,
          duration: 0.5,
          delay: i * 0.12,
          scrollTrigger: {
            trigger: pill,
            start: 'top 90%',
            once: true,
          },
        }
      )
    })
  }, [])

  const statusIcon = (s) => {
    if (s === 'shipped') return '✓'
    if (s === 'in progress') return '⟳'
    return '◌'
  }

  return (
    <section className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.becoming?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.becoming?.title}
          <br />
          <span className="text-accent">{t?.becoming?.titleAccent}</span>
        </h2>

        <div ref={ref} className="mt-16 max-w-3xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-mono text-sm leading-relaxed text-[#888] mt-6 first:mt-0">
              {p}
            </p>
          ))}
          <p className="mt-8 font-mono text-base font-semibold leading-relaxed text-accent">
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
