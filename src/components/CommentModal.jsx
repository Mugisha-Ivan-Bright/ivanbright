import { useState, useRef, useEffect } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'
import API_BASE from '../apiBase.js'

export default function CommentModal({ open, onClose }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (open) {
      setSent(false)
      setError(false)
      setAnonymous(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(false)
    const form = formRef.current
    const data = {
      name: anonymous ? 'Anonymous' : form.name.value,
      email: anonymous ? 'anonymous@feedback' : form.email.value,
      message: form.message.value,
    }
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="terminal w-full max-w-lg mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal-header">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-title">$ comment --new</span>
          <button onClick={onClose} className="ml-auto text-[#555] hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="terminal-body">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle size={40} className="text-[#00FF87] mb-3" />
              <p className="font-mono text-sm text-white mb-1">Thank you for your feedback!</p>
              <p className="font-mono text-xs text-[#555]">I read every message.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {!anonymous && (
                <>
                  <input type="text" name="name" placeholder="your name" required />
                  <input type="email" name="email" placeholder="your email" required />
                </>
              )}
              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                className="flex items-center gap-3 py-2 w-full"
              >
                <span
                  className="inline-flex items-center justify-center w-[18px] h-[18px] border"
                  style={{
                    borderColor: anonymous ? '#4ade80' : '#333',
                    background: anonymous ? '#4ade80' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {anonymous && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="font-mono text-[11px] text-[#555] select-none">Submit anonymously</span>
              </button>
              <textarea name="message" placeholder="your comment or feedback..." required rows={4} />
              {error && (
                <p className="font-mono text-xs text-red-400">Failed to send. Try again or email directly.</p>
              )}
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-50">
                {sending ? 'Sending...' : 'Send →'}
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
