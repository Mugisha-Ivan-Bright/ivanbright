import { useState, useCallback } from 'react'
import gsap from 'gsap'
import { openTerminal } from '../utils/openTerminal.js'
import { C } from '../constants/terminalColors.js'

export default function TerminalChrome({ cwd, minimized, onMinimize, onRestore, onClose }) {
  const [isMaximized, setIsMaximized] = useState(false)
  const originalSize = useCallback(() => {
    return { w: 720, h: 480, l: window.screen.width - 720 - 40, t: window.screen.height - 480 - 80 }
  }, [])

  const handleClose = () => {
    gsap.to('.terminal-window', {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        onClose()
        window.close()
      },
    })
  }

  const handleMinimize = () => {
    if (minimized) {
      const orig = originalSize()
      window.resizeTo(720, 480)
      window.moveTo(orig.l, orig.t)
      gsap.to('.terminal-body-scroll', { height: 'auto', opacity: 1, duration: 0.25 })
      onRestore()
    } else {
      gsap.to('.terminal-body-scroll', { height: 0, opacity: 0, duration: 0.25 })
      gsap.to('.terminal-window', { height: '36px', duration: 0.25 })
      window.resizeTo(720, 36)
      window.moveTo(window.screen.width - 760, window.screen.height - 60)
      onMinimize()
    }
  }

  const handleMaximize = () => {
    if (isMaximized) {
      const orig = originalSize()
      window.resizeTo(720, 480)
      window.moveTo(orig.l, orig.t)
      setIsMaximized(false)
    } else {
      window.resizeTo(window.screen.availWidth, window.screen.availHeight)
      window.moveTo(0, 0)
      setIsMaximized(true)
    }
  }

  const handleNew = () => {
    openTerminal()
  }

  const title = minimized
    ? 'minimized — click to restore'
    : cwd === '~'
      ? 'mugisha -- bash -- 80x24'
      : `${cwd} -- mugisha -- bash`

  return (
    <div
      className="terminal-chrome"
      style={{
        background: '#1a1a1a',
        height: 36,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flexShrink: 0,
        borderBottom: `1px solid ${C.border}`,
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          onClick={handleClose}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ff5f57',
            cursor: 'pointer',
            transition: 'filter 0.15s',
          }}
          title="close"
        />
        <div
          onClick={handleMinimize}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#febc2e',
            cursor: 'pointer',
            transition: 'filter 0.15s',
          }}
          title={minimized ? 'restore' : 'minimize'}
        />
        <div
          onClick={handleMaximize}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#28c840',
            cursor: 'pointer',
            transition: 'filter 0.15s',
          }}
          title={isMaximized ? 'restore' : 'maximize'}
        />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: '#666666',
          letterSpacing: '0.05em',
          cursor: minimized ? 'pointer' : 'default',
        }}
        onClick={minimized ? handleMinimize : undefined}
      >
        {title}
      </div>
      <div
        onClick={handleNew}
        style={{
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#555',
          fontSize: 16,
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
        title="new terminal"
      >
        +
      </div>
    </div>
  )
}
