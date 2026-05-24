import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Story() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const cardsRef = useRef([])

  const milestones = t?.story?.milestones

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (lineRef.current && !prefersReduced) {
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 30%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      )
    }

    if (!prefersReduced) {
      cardsRef.current.forEach((card, i) => {
        gsap.from(card,
          {
            y: 20,
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
    }
  }, [])

  return (
    <section id="story" ref={sectionRef} className="relative bg-[#0a0a0a] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.story?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.story?.title}
          <br />
          <span className="text-accent">{t?.story?.titleAccent}</span>
        </h2>

        <div className="relative mt-20">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1f1f1f]">
            <div ref={lineRef} className="w-full bg-accent origin-top" style={{ height: '100%', transform: 'scaleY(0)' }} />
          </div>

          <div className="space-y-20 pl-8 md:pl-12">
            {milestones.map((m, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="relative"
              >
                <div className="absolute -left-8 top-1 h-3 w-3 border-2 border-accent bg-[#0a0a0a] md:-left-12" />
                <span className="font-mono text-xs tracking-widest text-accent">
                  {m.year}
                </span>
                <h3 className="mt-2 font-mono text-lg font-semibold text-white">
                  {m.title}
                </h3>
                <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed text-[#888]">
                  {m.body}
                </p>
                {m.pill && (
                  <span className="mt-3 inline-block pill pill-shipped">
                    {m.pill}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
