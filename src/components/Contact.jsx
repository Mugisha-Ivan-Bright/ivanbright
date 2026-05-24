import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext.jsx'

export default function Contact() {
  const { t } = useI18n()
  const formRef = useRef()
  const sectionRef = useRef()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(sectionRef.current,
      {
        y: 15,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    )
  }, [t])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(false)
    const form = formRef.current
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      form.reset()
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="bg-[#0a0a0a] py-32 border-t border-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-[#444]">
          {t?.contact?.label}
        </div>
        <h2 className="font-mono text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl max-w-3xl">
          {t?.contact?.title}
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">{t?.contact?.terminalHeading}</span>
            </div>
            <div className="terminal-body">
              <div><span className="terminal-prompt">{t?.contact?.fieldLabels?.email}</span>      mugishaivanbright250@gmail.com</div>
              <div><span className="terminal-prompt">{t?.contact?.fieldLabels?.phone}</span>      +250 735 024 932</div>
              <div><span className="terminal-prompt">{t?.contact?.fieldLabels?.location}</span>   Rwanda · Gatsibo · Kiramuruzi · Akabingo</div>
              <div>
                <span className="terminal-prompt">{t?.contact?.fieldLabels?.github}</span>{'    '}
                <a href="https://github.com/Mugisha-Ivan-Bright" target="_blank" rel="noopener noreferrer" className="terminal-accent link-underline no-underline">
                  github.com/Mugisha-Ivan-Bright
                </a>
                <br />
                <span className="terminal-prompt">         </span>
                <a href="https://github.com/codewithmugisha" target="_blank" rel="noopener noreferrer" className="terminal-accent link-underline no-underline">
                  github.com/codewithmugisha
                </a>
              </div>
              <div><span className="terminal-prompt">{t?.contact?.fieldLabels?.school}</span>     Rwanda Coding Academy · Year 2</div>
              <div><span className="terminal-prompt">{t?.contact?.fieldLabels?.openTo}</span>    part-time work · collaboration · sponsorship · mentorship</div>
              <span className="terminal-cursor" />
            </div>
          </div>

          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={48} className="text-[#00FF87] mb-4" />
                <p className="font-mono text-lg text-white mb-2">Message sent successfully!</p>
                <p className="font-mono text-xs text-[#555]">I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    placeholder={t?.contact?.namePlaceholder}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t?.contact?.emailPlaceholder}
                    required
                  />
                  <textarea
                    name="message"
                    placeholder={t?.contact?.messagePlaceholder}
                    required
                    rows={5}
                  />
                  {error && (
                    <p className="font-mono text-xs text-red-400">Failed to send. Please try again or email me directly.</p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                  >
                    {sending ? t?.contact?.sending : t?.contact?.send}
                    <Send size={14} />
                  </button>
                </form>

                <p className="mt-8 font-mono text-xs leading-relaxed text-[#555] max-w-md">
                  {t?.contact?.sponsorText}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
