import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'
import API_BASE from '../apiBase.js'

const missionMeta = {
  1: { target: new Date('2027-04-01T00:00:00'), focus: 0.35, connectsTo: [2, 3] },
  2: { target: new Date('2026-11-01T00:00:00'), focus: 0.50, connectsTo: [1, 3] },
  3: { target: new Date('2027-09-01T00:00:00'), focus: 0.20, connectsTo: [1, 2] },
  4: { target: new Date('2026-12-25T00:00:00'), focus: 0.60, connectsTo: [5, 6] },
  5: { target: new Date('2026-08-01T00:00:00'), focus: 0.75, connectsTo: [4, 6] },
  6: { target: new Date('2026-11-15T00:00:00'), focus: 0.40, connectsTo: [4, 5, 7] },
  7: { target: new Date('2032-01-01T00:00:00'), focus: 0.10, connectsTo: [6] },
}

function calcTimeLeft(target, now) {
  const diff = target.getTime() - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: false,
  }
}

const GROWTH_START = new Date('2023-09-01T00:00:00').getTime()
const GROWTH_RATE = 0.000001

function calcGrowth(now) {
  const elapsed = (now - GROWTH_START) / 1000
  return (elapsed * GROWTH_RATE).toFixed(6)
}

function Particles({ dims }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const count = 80
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * dims.w,
      y: Math.random() * dims.h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }))
    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, dims.w, dims.h)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = dims.w
        if (p.x > dims.w) p.x = 0
        if (p.y < 0) p.y = dims.h
        if (p.y > dims.h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74,222,128,0.15)'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x
          const dy = p.y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(74,222,128,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      requestAnimationFrame(draw)
    }
    draw()
    return () => { running = false }
  }, [dims])

  return <canvas ref={canvasRef} width={dims.w} height={dims.h} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
}

function MissionCard({ mission, onHover, hovered, getNow }) {
  const [time, setTime] = useState(() => calcTimeLeft(mission.target, getNow()))
  const cardRef = useRef(null)

  useEffect(() => {
    const iv = setInterval(() => setTime(calcTimeLeft(mission.target, getNow())), 1000)
    return () => clearInterval(iv)
  }, [mission.target, getNow])

  return (
    <div
      ref={cardRef}
      className="mission-card"
      onMouseEnter={() => onHover(mission.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[10px] text-[#333] tracking-[0.15em] mission-label">
          MISSION-{String(mission.id).padStart(2, '0')}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] px-2 py-0.5" style={{ border: '1px solid #1a3a1a', color: '#4ade80' }}>
          {mission.status}
        </span>
      </div>

      <h3 className="font-mono text-sm font-bold text-white mb-3 leading-snug">{mission.title}</h3>

      <div className="font-mono mb-3">
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-bold text-white tabular-nums">{String(time.days).padStart(3, ' ')}</span>
          <span className="text-[10px] text-[#555] ml-1">days</span>
        </div>
        <div className="flex gap-2 text-xs text-[#555] tabular-nums mt-0.5">
          <span>{String(time.hours).padStart(2, '0')}h</span>
          <span className="text-[#333]">:</span>
          <span>{String(time.minutes).padStart(2, '0')}m</span>
          <span className="text-[#333]">:</span>
          <span className="text-[#4ade80] mission-count-sec" style={{ textShadow: '0 0 8px rgba(74,222,128,0.3)' }}>{String(time.seconds).padStart(2, '0')}s</span>
        </div>
      </div>

      <div className="h-px bg-[#1a1a1a] mb-3 relative">
        <div className="absolute inset-y-0 left-0 bg-[#4ade80] transition-all duration-500 mission-focus" style={{ width: `${mission.focus * 100}%`, boxShadow: '0 0 6px rgba(74,222,128,0.3)' }} />
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-[#555]">
        <span>FOCUS {(mission.focus * 100).toFixed(0)}%</span>
        <span className="text-[#333]">⟳</span>
      </div>

      {hovered === mission.id && (
        <div className="mt-4 pt-3 border-t border-[#1a1a1a] animate-fadeIn">
          <p className="font-mono text-[11px] leading-relaxed text-[#888] italic">&ldquo;{mission.reflection}&rdquo;</p>
        </div>
      )}
    </div>
  )
}

export default function MyTime() {
  const { t } = useI18n()
  const missions = (t?.mytime?.missions || []).map(m => ({
    ...m,
    ...(missionMeta[m.id] || {}),
  }))
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const gridRef = useRef(null)
  const growthRef = useRef(null)
  const closingRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [growth, setGrowth] = useState('0.000000')
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [synced, setSynced] = useState(false)
  const timeOffsetRef = useRef(0)

  const getNow = useCallback(() => Date.now() + timeOffsetRef.current, [])

  useEffect(() => {
    fetch(`${API_BASE}/api/time`)
      .then(r => r.json())
      .then(data => {
        timeOffsetRef.current = data.timestamp - Date.now()
        setSynced(true)
        setGrowth(calcGrowth(getNow()))
      })
      .catch(() => {
        setSynced(true)
        setGrowth(calcGrowth(getNow()))
      })
  }, [getNow])

  useEffect(() => {
    if (!synced) return
    const iv = setInterval(() => setGrowth(calcGrowth(getNow())), 1000)
    return () => clearInterval(iv)
  }, [synced, getNow])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(gridRef.current?.querySelectorAll('.mission-card'), { y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: gridRef.current, start: 'top 75%', once: true } })
      gsap.from(growthRef.current, { scale: 0.8, opacity: 0, duration: 0.6, delay: 0.4, scrollTrigger: { trigger: growthRef.current, start: 'top 85%', once: true } })
      gsap.from(closingRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.3, scrollTrigger: { trigger: closingRef.current, start: 'top 85%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleHover = useCallback((id) => setHovered(id), [])

  return (
    <section id="my-time" ref={sectionRef} className="relative bg-[#0a0a0a] py-32 border-t border-[#1a1a1a] overflow-hidden">
      <Particles dims={dims} />

      <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ opacity: 0.15 }}>
        {missions.map((m) =>
          m.connectsTo.map((tid) => {
            const a = missions.find(x => x.id === m.id)
            const b = missions.find(x => x.id === tid)
            if (!a || !b) return null
            const active = hovered && (hovered === a.id || hovered === b.id)
            return (
              <line
                key={`${m.id}-${tid}`}
                x1="0%" y1="0%" x2="100%" y2="100%"
                className="mission-line"
                data-from={m.id}
                data-to={tid}
                style={{ opacity: active ? 0.3 : 0.06, transition: 'opacity 0.4s' }}
              />
            )
          })
        )}
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div ref={titleRef} className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.mytime?.label}
        </div>
        <h2 className="font-display text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl text-white" style={{ textShadow: '0 0 40px rgba(74,222,128,0.08)' }}>
          {t?.mytime?.title}
        </h2>
        <p ref={subtitleRef} className="mt-4 font-mono text-xs leading-relaxed text-[#555] max-w-xl">
          {t?.mytime?.subtitle}
        </p>

        <div ref={gridRef} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {missions.map((m) => (
            <MissionCard key={m.id} mission={m} onHover={handleHover} hovered={hovered} getNow={getNow} />
          ))}
        </div>

        <div ref={growthRef} className="mt-16 terminal mx-auto" style={{ maxWidth: 400 }}>
          <div className="terminal-header">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-title">$ growth --live</span>
          </div>
          <div className="terminal-body text-center">
            <p className="terminal-output text-xs mb-2">Growth is happening now.</p>
            <p className="text-white font-mono text-2xl font-bold tabular-nums" style={{ textShadow: '0 0 12px rgba(74,222,128,0.2)' }}>
              +{growth}%
            </p>
            <p className="terminal-output text-xs mt-2">Current State: Evolving...</p>
          </div>
        </div>

        <p ref={closingRef} className="mt-16 text-center font-mono text-sm leading-relaxed text-[#555] max-w-2xl mx-auto" style={{ letterSpacing: '0.02em' }}>
          &ldquo;{t?.mytime?.closing}&rdquo;
        </p>
      </div>
    </section>
  )
}
