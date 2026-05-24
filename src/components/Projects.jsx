import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Projects() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  const primary = t?.projects?.primary
  const secondary = t?.projects?.secondary

  const codeSnippets = {
    Uptime: `// Multi-region consensus check
async function confirmOutage(regionReports: RegionReport[]) {
  const failures = regionReports
    .filter(r => r.status === 'down')
  return failures.length >=
    Math.ceil(regionReports.length / 2)
}`,
    MediSafe: `// Medication validation
async function validateMeds(meds: string[]) {
  const conflicts = await ai.check(meds)
  if (conflicts.length > 0) {
    return { safe: false, warnings: conflicts }
  }
  return { safe: true }
}`,
    Academix: `// Student service (microservice)
app.get('/api/students/:id', async (req, res) => {
  const student = await db
    .findUnique({ where: { id: req.params.id }})
  res.json({ data: student })
})`,
    furnit: `// Product card component
function ProductCard({ item }) {
  const { isInView, ref } = useInView()
  return (
    <motion.div
      ref={ref}
      animate={isInView
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 20 }
      }
    >
      <img src={item.image} alt={item.name} />
    </motion.div>
  )
}`,
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    cardsRef.current.forEach((card, i) => {
      gsap.from(card,
        {
          y: 15,
          duration: 0.8,
          delay: i * 0.12,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        }
      )
    })
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.projects?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t?.projects?.title}
          <br />
          <span className="text-accent">{t?.projects?.titleAccent}</span>
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {primary.map((p, i) => (
            <div
              key={p.name}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`project-card${i === 0 && p.name === 'Uptime' ? ' lg:col-span-3' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {p.category && <span className="mini-label">{p.category}</span>}
                  {p.status && (
                    <span className={`pill ${p.status === 'in progress' ? 'pill-progress' : ''} text-[9px] py-1 px-2.5`}>{p.status}</span>
                  )}
                </div>
                {p.name !== 'Uptime' && (
                  <a
                    href={`https://github.com/codewithmugisha/${p.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#555] transition-colors hover:text-accent"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                )}
              </div>

              <h3 className="project-name">{p.name}</h3>
              <p className="project-tagline">{p.tagline}</p>
              <p className="project-desc">{(p.desc || '').split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</p>

              {p.arch && p.name === 'Uptime' && (
                <div className="project-code">
                  <pre className="m-0">$ uptime --architecture{'\n\n'}{p.arch}</pre>
                </div>
              )}

              {p.name !== 'Uptime' && (
                <div className="project-code">
                  <pre className="m-0">{codeSnippets[p.name] || '// coming soon'}</pre>
                </div>
              )}

              <div className="project-stack">
                {(p.tech || []).map((tech) => (
                  <span key={tech} className="pill">{tech}</span>
                ))}
              </div>

              <div className="project-links">
                <a
                  href={p.github || `https://github.com/codewithmugisha/${p.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost btn-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  github →
                </a>
              </div>

              {p.closingUptime && (
                <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#555] max-w-2xl">{p.closingUptime}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {secondary.map((p) => (
            <div key={p.name} className="secondary-card">
              <div className="flex items-start justify-between gap-4">
                <div className="mini-label">{p.category}</div>
                {p.status === 'shipped' ? (
                  <span className="pill pill-shipped text-[9px] py-1 px-2.5">{p.status}</span>
                ) : (
                  <span className="pill pill-progress text-[9px] py-1 px-2.5">{p.status}</span>
                )}
              </div>
              <h3 className="secondary-name">{p.name}</h3>
              <p className="secondary-desc">{p.desc}</p>
              <div className="secondary-tech">
                {p.tech.map((t) => (
                  <span key={t} className="pill text-[9px] py-1 px-2.5">{t}</span>
                ))}
              </div>
              <div className="secondary-links">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  github →
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                    <ExternalLink size={12} />
                    live →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 terminal">
          <div className="terminal-header">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-title">$ ls ~/github --count</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-output mb-4">{(t?.projects?.closingNote || '').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
            <div className="flex flex-col gap-1">
              <a href="https://github.com/Mugisha-Ivan-Bright" target="_blank" rel="noopener noreferrer" className="terminal-accent link-underline no-underline text-xs">
                → github.com/Mugisha-Ivan-Bright
              </a>
              <a href="https://github.com/codewithmugisha" target="_blank" rel="noopener noreferrer" className="terminal-accent link-underline no-underline text-xs">
                → github.com/codewithmugisha
              </a>
            </div>
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </section>
  )
}
