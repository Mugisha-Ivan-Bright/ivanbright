import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function WhyIBuild() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.why-label'), { y: 20, opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(el.querySelector('.why-title'), { y: 20, opacity: 0, duration: 0.8, delay: 0.15, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(linesRef.current.filter(Boolean), { y: 15, opacity: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="why-i-build" ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="why-label mb-4 font-mono text-[11px] tracking-widest text-[#444] text-center">
          {t?.whyIBuild?.label}
        </div>
        <h2 className="why-title font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-center">
          <span className="text-accent">{t?.whyIBuild?.title}</span>
        </h2>

        <div className="mt-12 text-center">
          <p ref={(el) => linesRef.current[0] = el} className="font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line1}
          </p>
          <p ref={(el) => linesRef.current[1] = el} className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line2}
          </p>
          <p ref={(el) => linesRef.current[2] = el} className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line3}
          </p>
          <p ref={(el) => linesRef.current[3] = el} className="mt-6 font-mono text-lg leading-relaxed text-accent sm:text-xl font-semibold">
            {t?.whyIBuild?.line4}
          </p>
          <p ref={(el) => linesRef.current[4] = el} className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line5}
          </p>
        </div>
      </div>
    </section>
  )
}
