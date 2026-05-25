import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Skills() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const gridRef = useRef(null)

  const categories = t?.skills?.categories

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(gridRef.current?.querySelectorAll('.skill-row'), { y: 15, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={labelRef} className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.skills?.label}
        </div>

        <div ref={gridRef} className="mt-12 space-y-6">
          {categories.map((s) => (
            <div key={s.name} className="skill-row grid grid-cols-[140px_1fr] gap-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#555]">
                {s.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {s.items.split(' · ').map((item) => (
                  <span key={item} className="pill">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
