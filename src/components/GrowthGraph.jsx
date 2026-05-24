import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n/I18nContext.jsx'

const activityData = [
  { id: 'rca-admission', date: 'Aug 2023', type: 'milestone', label: 'Admitted to Rwanda Coding Academy', note: 'I prayed for this every day. I had never owned a PC. When the admission came, it felt like a miracle. Because it was.', project: null },
  { id: 'first-pc', date: 'Sep 2023', type: 'milestone', label: 'Touched a computer for the first time (seriously)', note: 'Not just touching — learning. Everything was new. The keyboard shortcuts. The terminal. The file system. I was overwhelmed and grateful at the same time.', project: null },
  { id: 'php-calc', date: 'Nov 2023', type: 'built', label: 'Built PHP-CALC', note: 'My first real project. A PHP calculator. It was simple. But I built it myself. That mattered more than the code.', project: 'PHP-CALC' },
  { id: 'year1-quiet', date: 'Dec 2023', type: 'learned', label: 'The quiet year — learning to survive', note: 'Everyone said: this man does not talk. I was afraid. Not because I had nothing to say. I just had not found my voice yet.', project: null },
  { id: 'first-js', date: 'Feb 2024', type: 'learned', label: 'JavaScript started making sense', note: 'I had been copying async/await for months without understanding it. Then one day it clicked. That feeling — I still chase it.', project: null },
  { id: 'chat-app-attempt', date: 'Feb 2024', type: 'broke', label: 'Chat app — kept breaking', note: 'I built three versions of a chat app. None of them worked the way I wanted. I deleted hundreds of lines. The architecture was wrong every time.', project: 'chat-app' },
  { id: 'todo-first-deploy', date: 'Mar 2024', type: 'milestone', label: 'First deployed project', note: 'A todo list. Deployed to Vercel. The URL worked from someone else\'s phone. That was the day the internet stopped being abstract.', project: 'todo' },
  { id: 'typescript-start', date: 'May 2024', type: 'learned', label: 'Started TypeScript — types changed everything', note: 'JavaScript was fine. TypeScript made me think differently. Errors at compile time instead of runtime. I understood why discipline in code matters.', project: null },
  { id: 'year2-breakthrough', date: 'Aug 2024', type: 'milestone', label: 'Year 2 — everything changed', note: 'Better grades. I started speaking. My confidence grew. I stopped looking down on myself. I do not fully understand what shifted. But something did.', project: null },
  { id: 'community-head', date: 'Sep 2024', type: 'milestone', label: 'Appointed Head of Community Outreach — RCA', note: 'I was not looking for it. They gave it to me because of how I showed up. That responsibility changed how I think about building — for people, not just for code.', project: null },
  { id: 'market-truth', date: 'Jan 2025', type: 'built', label: 'Shipped MARKET-TRUTH', note: 'Someone forked it. That was the first time I realized something I built was useful to a stranger. A small moment. But it meant something.', project: 'MARKET-TRUTH' },
  { id: 'hardware-rfid', date: 'Feb 2025', type: 'built', label: 'Built RFID web system', note: 'Hardware and software at the same time. Physical RFID readers talking to a web interface. I did not know this was hard until I was already doing it.', project: 'RFID' },
  { id: 'bluetooth-cpp', date: 'Feb 2025', type: 'learned', label: 'Wrote C++ for Bluetooth communication', note: 'Nobody asked me to. I was curious. Master-slave communication protocol. Low-level. Different from everything else I had done. Curiosity does not wait for a syllabus.', project: 'Bluetooth-Master-Slave-Communication' },
  { id: 'java-discovery', date: 'Mar 2025', type: 'learned', label: 'Started learning Java seriously', note: 'Spring Boot. Enterprise patterns. A completely different way of thinking about backend architecture. Heavy. Opinionated. Powerful.', project: null },
  { id: 'igihango', date: 'Apr 2025', type: 'built', label: 'Built Igihango Digital', note: '"Igihango" means covenant in Kinyarwanda. I built this for Rwanda. Because software should solve problems where people actually are, not just where investors are.', project: 'igihango-digital' },
  { id: 'furnit-shipped', date: 'May 2025', type: 'built', label: 'Shipped Furnit — most polished frontend yet', note: 'Two stars. Deployed. The first project where I genuinely cared about how it looked, not just whether it worked.', project: 'furnit' },
  { id: 'java-backend-real', date: 'Oct 2025', type: 'built', label: 'First real Java Spring Boot backend', note: 'PostgreSQL, Flyway migrations, Spring Mail. It took longer than Node.js would have. But I understood more at the end of it.', project: 'Automailio' },
  { id: 'lumen-fullstack', date: 'Mar 2026', type: 'built', label: 'Shipped Lumen — frontend + backend', note: 'Two separate repos, one product. The most starred project on this account. I built it carefully. That is the only explanation I have.', project: 'lumen-frontend' },
  { id: 'automailio-complete', date: 'Mar 2026', type: 'built', label: 'Automailio — email automation platform', note: 'Campaigns, templates, cron scheduling, per-tenant SMTP health checks, delivery logs, Docker. The most technically complete thing I had built to this point.', project: 'Automailio' },
  { id: 'uptime-architecture', date: 'Apr 2026', type: 'redesign', label: 'Uptime — first architecture was wrong', note: 'Built the first version of the monitoring system. Single-region. It raised false alarms constantly. Scrapped it. Started over with multi-region consensus. Deleting it was the right decision.', project: 'Uptime' },
  { id: 'uptime-consensus', date: 'May 2026', type: 'learned', label: 'Multi-region consensus — the concept that changed everything', note: 'If only one region reports failure, it is noise. If the majority agree — that is an outage. Reliability engineering is not about detecting failures. It is about distinguishing real failures from noise.', project: 'Uptime' },
  { id: 'uptime-saas', date: 'May 2026', type: 'milestone', label: 'Uptime becomes a real SaaS product', note: 'Multi-tenant. Subscription billing. Public status pages. Slack + Email + PagerDuty alerts. Built from scratch. The most ambitious thing I have ever done. I am still building it.', project: 'Uptime' },
]

const filters = ['all', 'built', 'learned', 'milestones']

const nodeConfig = {
  built:     { color: '#4ade80', size: 10, border: '1px solid #4ade80', glow: '0 0 8px rgba(74,222,128,0.4)' },
  learned:   { color: '#F5A623', size: 8, border: '1px solid #F5A623', glow: 'none' },
  broke:     { color: '#ef4444', size: 7, border: '1px dashed #ef4444', glow: 'none' },
  redesign:  { color: '#818cf8', size: 9, border: '1px solid #818cf8', glow: 'none' },
  milestone: { color: '#ffffff', size: 14, border: '2px solid #ffffff', glow: '0 0 16px rgba(255,255,255,0.3)' },
}

function getYearX(year, w) {
  const years = [2023, 2024, 2025, 2026]
  const idx = years.indexOf(year)
  const pad = w * 0.08
  const seg = (w - pad * 2) / (years.length - 1)
  return pad + idx * seg
}

function layoutNodes(data, w) {
  const grouped = {}
  data.forEach((n) => {
    const y = parseInt(n.date.split(' ')[1])
    if (!grouped[y]) grouped[y] = []
    grouped[y].push(n)
  })

  const rows = 4
  const rowH = 120
  const topY = 60
  const result = []

  Object.entries(grouped).forEach(([year, nodes]) => {
    const y = parseInt(year)
    const cx = getYearX(y, w)
    nodes.forEach((n, i) => {
      const offset = (i - (nodes.length - 1) / 2) * rowH
      const row = Math.round(offset / rowH)
      const rowY = topY + (row + rows / 2) * rowH * 0.5
      result.push({ ...n, x: cx + (i % 2 === 0 ? -12 : 12), y: rowY + (i * 18) % 48 })
    })
  })

  return result
}

function buildConnections(nodes) {
  const conns = []
  for (let i = 0; i < nodes.length; i++) {
    if (i < nodes.length - 1) {
      conns.push({ from: nodes[i].id, to: nodes[i + 1].id })
    }
    if (nodes[i].project) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[j].project && nodes[j].project === nodes[i].project) {
          conns.push({ from: nodes[i].id, to: nodes[j].id })
        }
      }
    }
  }
  return conns
}

export default function GrowthGraph() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const svgRef = useRef(null)
  const graphRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [dims, setDims] = useState({ w: 800, h: 500 })

  const positioned = layoutNodes(activityData, dims.w)
  const connections = buildConnections(positioned)

  const nodeMap = Object.fromEntries(positioned.map((n) => [n.id, n]))

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      setDims({ w: Math.max(600, width), h: Math.min(600, Math.max(400, width * 0.55)) })
    })
    if (graphRef.current) obs.observe(graphRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.growth-title'), { y: 20, opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(el.querySelector('.growth-sub'), { y: 15, opacity: 0, duration: 0.6, delay: 0.2, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      gsap.from(el.querySelectorAll('.growth-node'), { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2)', scrollTrigger: { trigger: el.querySelector('.growth-graph-wrap'), start: 'top 75%', once: true } })
      const paths = svgRef.current?.querySelectorAll('.growth-line')
      if (paths) {
        gsap.set(paths, { strokeDashoffset: (i, t) => t.getTotalLength() })
        gsap.to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.02, ease: 'power2.out', scrollTrigger: { trigger: el.querySelector('.growth-graph-wrap'), start: 'top 75%', once: true } })
      }
    }, el)
    return () => ctx.revert()
  }, [dims])

  const isVisible = useCallback((n) => {
    if (filter === 'all') return true
    if (filter === 'built') return n.type === 'built'
    if (filter === 'learned') return n.type === 'learned' || n.type === 'broke' || n.type === 'redesign'
    if (filter === 'milestones') return n.type === 'milestone'
    return true
  }, [filter])

  const handleMouseEnter = useCallback((n, e) => {
    setHovered(n.id)
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ node: n, x: rect.left + rect.width / 2, y: rect.top - 8 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(null)
    setTooltip(null)
  }, [])

  const handleClick = useCallback((n) => {
    if (n.type === 'milestone') {
      setExpanded(expanded === n.id ? null : n.id)
    }
  }, [expanded])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onClick = () => setExpanded(null)
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [expanded])

  return (
    <section id="growth" ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444] growth-title">
          {t?.growth?.label}
        </div>
        <h2 className="growth-title font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl max-w-3xl">
          {t?.growth?.title}
        </h2>
        <p className="growth-sub mt-4 font-mono text-xs leading-relaxed text-[#555] max-w-xl">
          {t?.growth?.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-2" ref={graphRef}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="growth-graph-wrap relative mt-6">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            className="w-full h-auto"
            style={{ overflow: 'visible' }}
          >
            {connections.map((c) => {
              const a = nodeMap[c.from]
              const b = nodeMap[c.to]
              if (!a || !b) return null
              const hidden = !isVisible(a) || !isVisible(b)
              const hl = hovered && (hovered === a.id || hovered === b.id)
              return (
                <path
                  key={`${c.from}-${c.to}`}
                  className="growth-line"
                  d={`M${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 - 30} ${b.x},${b.y}`}
                  fill="none"
                  stroke={hl ? '#333' : '#1a1a1a'}
                  strokeWidth={hl ? 1.5 : 1}
                  strokeDasharray={hl ? 'none' : '4 4'}
                  style={{ transition: 'stroke 0.3s', opacity: hidden ? 0.1 : 1 }}
                />
              )
            })}

            {positioned.map((n) => {
              const cfg = nodeConfig[n.type]
              const visible = isVisible(n)
              const isHovered = hovered === n.id
              return (
                <g
                  key={n.id}
                  className="growth-node"
                  style={{ opacity: visible ? 1 : 0.1, cursor: n.type === 'milestone' ? 'pointer' : 'default', transition: 'opacity 0.3s' }}
                  onMouseEnter={(e) => handleMouseEnter(n, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(n)}
                >
                  {n.type === 'milestone' && (
                    <circle cx={n.x} cy={n.y} r={cfg.size + 6} fill="none" stroke="#ffffff" strokeWidth={0.5} opacity={isHovered ? 0.3 : 0.1} style={{ transition: 'opacity 0.3s' }} />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isHovered ? cfg.size + 2 : cfg.size}
                    fill={isHovered ? cfg.color : '#111'}
                    stroke={cfg.color}
                    strokeWidth={n.type === 'milestone' ? 2 : 1}
                    strokeDasharray={n.type === 'broke' ? '3 3' : 'none'}
                    style={{
                      transition: 'all 0.2s',
                      boxShadow: isHovered && cfg.glow !== 'none' ? cfg.glow : 'none',
                    }}
                  />
                </g>
              )
            })}
          </svg>

          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
            >
              <div className="terminal" style={{ width: 260, padding: 0 }}>
                <div className="terminal-body" style={{ padding: '14px 16px' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] text-[#555]">{tooltip.node.date}</span>
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5"
                      style={{
                        border: `1px solid ${nodeConfig[tooltip.node.type].color}`,
                        color: nodeConfig[tooltip.node.type].color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {tooltip.node.type}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed text-[#aaa]">{tooltip.node.note}</p>
                  {tooltip.node.project && (
                    <p className="font-mono text-[10px] text-[#555] mt-2">→ relates to: {tooltip.node.project}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {expanded && nodeMap[expanded] && (
          <div
            className="terminal mx-auto mt-4"
            style={{ maxWidth: 500, cursor: 'pointer' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">{nodeMap[expanded].date} · {nodeMap[expanded].type}</span>
            </div>
            <div className="terminal-body">
              <p className="text-white font-mono text-sm font-semibold mb-2">{nodeMap[expanded].label}</p>
              <p className="terminal-output">{nodeMap[expanded].note}</p>
              {nodeMap[expanded].project && (
                <p className="font-mono text-[11px] text-[#555] mt-3">→ relates to: {nodeMap[expanded].project}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 justify-center font-mono text-[11px] text-[#555]">
          {Object.entries(nodeConfig).map(([type, cfg]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block rounded-full"
                style={{
                  width: cfg.size * 0.5 + 4,
                  height: cfg.size * 0.5 + 4,
                  background: cfg.color,
                  border: type === 'broke' ? '1px dashed ' + cfg.color : '1px solid ' + cfg.color,
                  opacity: 0.8,
                }}
              />
              {type}
            </span>
          ))}
        </div>

        <p className="mt-12 text-center font-mono text-xs text-[#444]">&ldquo;Not optimized for activity. Optimized for understanding.&rdquo;</p>
      </div>
    </section>
  )
}
