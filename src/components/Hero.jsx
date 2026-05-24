import { useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

const HeroCanvas = lazy(() => import('../three/HeroCanvas.jsx'))

function Marquee({ items }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return
    const width = el.scrollWidth / 2
    gsap.to(el, {
      x: -width,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  return (
    <div className="marquee-wrapper">
      <div ref={ref} className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="dot">◆</span>
            {item.replace('◆ ', '')}
          </span>
        ))}
      </div>
    </div>
  )
}

function splitChars(text) {
  return text.split('').map((char, i) => (
    <span key={i} className="char inline-block">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

export default function Hero() {
  const { t, lang } = useI18n()
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const badgeRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const chars = headlineRef.current?.querySelectorAll('.char')
    if (!chars?.length) return

    gsap.set([badgeRef.current, subRef.current, ctaRef.current], { clearProps: 'all' })
    gsap.set(chars, { clearProps: 'all' })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    tl.fromTo(chars, { y: 80, opacity: 0, rotateX: -90 }, {
      y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.025,
    }, '-=0.2')
    tl.fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
    tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
  }, [t])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-12 px-6 pt-32 pb-12 xl:gap-20">
        <div className="min-w-0 flex-1">
          <div ref={badgeRef} className="mb-8 opacity-0">
            <span className="pill">{t?.hero?.badge}</span>
          </div>

          <h1
            ref={headlineRef}
            className="font-display text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <div className="overflow-hidden">{splitChars(t?.hero?.headline1)}</div>
            <div className="overflow-hidden text-accent">{splitChars(t?.hero?.headline2)}</div>
            <div className="overflow-hidden">{splitChars(t?.hero?.headline3)}</div>
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-2xl text-sm leading-relaxed text-[#888] opacity-0 font-mono"
          >
            {t?.hero?.subheadline}
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4 opacity-0">
            <a href="#story" className="btn-primary">
              {t?.hero?.ctaStory}
            </a>
            <a href="#projects" className="btn-ghost">
              {t?.hero?.ctaWork}
            </a>
          </div>
        </div>

        <div className="relative hidden w-72 aspect-square flex-shrink-0 lg:block xl:w-80">
          <img
            src="/me.JPG"
            alt="Mugisha Ivan Bright"
            className="h-full w-full object-cover"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <Suspense fallback={null}>
              <HeroCanvas />
            </Suspense>
          </div>
        </div>
      </div>

      <Marquee items={t?.hero?.tickerItems || []} />
    </section>
  )
}
