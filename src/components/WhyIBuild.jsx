import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function WhyIBuild() {
  const { t } = useI18n()
  const ref = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(ref.current,
      {
        y: 15,
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      }
    )
  }, [])

  return (
    <section id="why-i-build" className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444] text-center">
          {t?.whyIBuild?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-center">
          <span className="text-accent">{t?.whyIBuild?.title}</span>
        </h2>

        <div ref={ref} className="mt-12 text-center">
          <p className="font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line1}
          </p>
          <p className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line2}
          </p>
          <p className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line3}
          </p>
          <p className="mt-6 font-mono text-lg leading-relaxed text-accent sm:text-xl font-semibold">
            {t?.whyIBuild?.line4}
          </p>
          <p className="mt-6 font-mono text-lg leading-relaxed text-[#888] sm:text-xl">
            {t?.whyIBuild?.line5}
          </p>
        </div>
      </div>
    </section>
  )
}
