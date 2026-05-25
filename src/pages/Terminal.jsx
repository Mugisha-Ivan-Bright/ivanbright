import { useEffect, useRef, useState } from 'react'
import { useTerminalEngine } from '../hooks/useTerminalEngine.js'
import { OutputLine } from '../components/TerminalLine.jsx'
import TerminalChrome from '../components/TerminalChrome.jsx'
import { C } from '../constants/terminalColors.js'

function LoadingBar() {
  const [b, setB] = useState(0)
  const [d, setD] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setB((p) => { if (p >= 12) { clearInterval(t); return p } return p + 1 }), 60)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (b >= 12) {
      const t = setTimeout(() => setD(true), 200)
      return () => clearTimeout(t)
    }
  }, [b])

  return (
    <span>
      {'█'.repeat(Math.min(b, 12))}
      {!d && b < 12 && <span style={{ opacity: 0.15 }}>{'█'.repeat(12 - b)}</span>}
      {d && <span style={{ color: C.green, fontWeight: 700 }}>  done</span>}
    </span>
  )
}

function BootLine({ line, index }) {
  if (index === 4) {
    return (
      <div style={{ color: C.muted, minHeight: '1.7em' }}>
        Loading mugisha-ivan-bright...  <LoadingBar />
      </div>
    )
  }
  return (
    <div style={{ color: line.color, minHeight: line.text === '' ? '1.7em' : 'auto' }}>
      {line.text || '\u00A0'}
    </div>
  )
}

export default function Terminal() {
  const {
    bootPhase,
    bootDone,
    booting,
    history,
    input,
    cwd,
    easterRunning,
    minimized,
    BOOT_LINES,
    inputRef,
    outputRef,
    setInput,
    setCwd,
    setHistIndex,
    setEasterRunning,
    setMinimized,
    handleKeyDown,
  } = useTerminalEngine()

  const hiddenInputRef = useRef(null)

  useEffect(() => {
    document.documentElement.style.margin = '0'
    document.documentElement.style.padding = '0'
    document.documentElement.style.width = '100%'
    document.documentElement.style.height = '100%'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.background = C.bg
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
    document.body.style.background = C.bg

    const root = document.getElementById('app')
    if (root) {
      root.style.width = '100%'
      root.style.height = '100%'
      root.style.margin = '0'
      root.style.padding = '0'
      root.style.overflow = 'hidden'
      root.style.background = C.bg
    }

    return () => {
      document.documentElement.style.margin = ''
      document.documentElement.style.padding = ''
      document.documentElement.style.width = ''
      document.documentElement.style.height = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.background = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.overflow = ''
      document.body.style.background = ''
      if (root) {
        root.style.width = ''
        root.style.height = ''
        root.style.margin = ''
        root.style.padding = ''
        root.style.overflow = ''
        root.style.background = ''
      }
    }
  }, [])

  const handleMinimize = () => setMinimized(true)
  const handleRestore = () => setMinimized(false)
  const handleClose = () => {
    if (window.opener) {
      window.close()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div
      className="terminal-window"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: C.bg,
        overflow: 'hidden',
      }}
    >
      <TerminalChrome
        cwd={cwd}
        minimized={minimized}
        onMinimize={handleMinimize}
        onRestore={handleRestore}
        onClose={handleClose}
      />

      <div
        className="terminal-body-scroll"
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          lineHeight: 1.7,
          scrollbarWidth: 'thin',
          scrollbarColor: '#222222 #0d0d0d',
        }}
        onClick={() => hiddenInputRef.current?.focus()}
      >
        {BOOT_LINES.slice(0, bootPhase).map((line, i) => (
          <BootLine key={i} line={line} index={i} />
        ))}

        {history.map((line, i) => (
          <div key={i} className="new-line">
            <OutputLine line={line} />
          </div>
        ))}

        {bootDone && !minimized && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              minHeight: '1.7em',
            }}
          >
            <span style={{ color: C.green, fontWeight: 700 }}>mugisha</span>
            <span style={{ color: C.muted }}>@portfolio:</span>
            <span style={{ color: C.green }}>{cwd === '~' ? '~' : cwd}</span>
            <span style={{ color: C.white, fontWeight: 700 }}>$ </span>
            <span style={{ color: C.white }}>{input}</span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 15,
                background: C.green,
                animation: 'blink-cursor 1s step-end infinite',
                verticalAlign: 'middle',
                marginLeft: 1,
              }}
            />
          </div>
        )}
      </div>

      <input
        ref={hiddenInputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          position: 'absolute',
          left: -9999,
          opacity: 0,
          width: 0,
          height: 0,
        }}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        aria-hidden="true"
      />

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </div>
  )
}
