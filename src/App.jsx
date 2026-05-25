import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useScrollTrigger } from './hooks/useScrollTrigger.js'
import { useCursor } from './hooks/useCursor.js'
import { I18nProvider, useI18n } from './i18n/I18nContext.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Story from './components/Story.jsx'
import EngineeringDepth from './components/EngineeringDepth.jsx'
import GrowthGraph from './components/GrowthGraph.jsx'
import Projects from './components/Projects.jsx'
import MyTime from './components/MyTime.jsx'
import Skills from './components/Skills.jsx'
import Community from './components/Community.jsx'
import WhyIBuild from './components/WhyIBuild.jsx'
import Failures from './components/Failures.jsx'
import Obsession from './components/Obsession.jsx'
import Becoming from './components/Becoming.jsx'
import Beliefs from './components/Beliefs.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import FeedbackOverlay from './components/FeedbackOverlay.jsx'
import CommentModal from './components/CommentModal.jsx'
import Terminal from './pages/Terminal.jsx'

function GrainOverlay() {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  )
}

function LoadingScreen({ onComplete }) {
  const { t } = useI18n()
  const ref = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete })
    tl.fromTo(ref.current,
      { opacity: 1 },
      { opacity: 0, duration: 1.2, ease: 'power3.inOut', delay: 1.2 }
    )
  }, [onComplete])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a]"
    >
      <span className="font-mono text-accent text-4xl tracking-widest">
        {t?.nav?.logo}
      </span>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const { dotRef, ringRef } = useCursor()
  useScrollTrigger()

  useEffect(() => {
    if (!loaded) return
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      lenis.destroy()
      gsap.ticker.remove(raf)
    }
  }, [loaded])

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  return (
    <Routes>
      <Route path="/terminal" element={<Terminal />} />
      <Route path="/" element={
        <>
          <I18nProvider>
            {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

            {!prefersReduced && (
              <>
                <div
                  ref={dotRef}
                  className="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent hidden md:block"
                  style={{ top: 0, left: 0 }}
                />
                <div
                  ref={ringRef}
                  className="pointer-events-none fixed z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60 hidden md:block"
                  style={{ top: 0, left: 0 }}
                />
              </>
            )}

            <div
              className="cursor-none"
              style={{ display: loaded ? 'block' : 'none' }}
            >
              <GrainOverlay />

              <Nav />
              <Hero />
              <Story />
              <EngineeringDepth />
              <GrowthGraph />
              <Projects />
              <MyTime />
              <Skills />
              <Community />
              <WhyIBuild />
              <Failures />
              <Obsession />
              <Becoming />
              <Beliefs />
              <Contact />
              <Footer onOpenComment={() => setCommentOpen(true)} />
            </div>

            <FeedbackOverlay onOpenComment={() => setCommentOpen(true)} />
            <CommentModal open={commentOpen} onClose={() => setCommentOpen(false)} />
          </I18nProvider>
        </>
      } />
    </Routes>
  )
}
