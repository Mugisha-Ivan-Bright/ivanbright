import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { C, G, P } from '../constants/terminalColors.js'
import { FS, getDirEntry, getDirChildren, getFileContent, resolvePath, isHiddenDir } from '../constants/terminalFS.js'

const BOOT_LINES = [
  G('Last login: Mon May 25 2026 from portfolio.mugisha.dev', C.muted),
  G('', C.bg),
  G('mugisha-macbook ~ % source .profile', C.amber),
  G('', C.bg),
  G('Loading mugisha-ivan-bright...  ████████████  done', C.muted),
  G('', C.bg),
  G('──────────────────────────────────────────────────────', C.dim),
  G(' Welcome to Mugisha Ivan Bright\'s terminal.', C.white),
  G(' You found the developer route. Most people don\'t.', C.muted),
  G('──────────────────────────────────────────────────────', C.dim),
  G('', C.bg),
  G('Type \'help\' to see available commands.', C.muted),
  G('Type \'ls\' to explore.', C.muted),
  G('', C.bg),
  G('# hint: some directories are hidden', C.dim, { italic: true }),
]

function buildLsOutput(cwd, showAll) {
  const children = getDirChildren(cwd, showAll)
  if (children === null) return [G('ls: no such directory', C.amber)]
  if (children.length === 0) return [G('(empty)', C.muted)]

  const dirs = []
  const files = []
  const hidden = []
  const parentEntry = getDirEntry(cwd)

  for (const e of children) {
    if (e === '.' || e === '..') { if (showAll) hidden.push(e); continue }
    const ep = cwd === '~' ? `~/${e}` : `${cwd}/${e}`
    const entry = getDirEntry(ep)
    const isH = parentEntry?.hidden?.includes(e)
    if (entry?.type === 'dir' || isH) {
      if (e.startsWith('.')) { if (showAll) hidden.push(e) } else dirs.push(e)
    } else {
      if (e.startsWith('.')) { if (showAll) hidden.push(e) } else files.push(e)
    }
  }

  const rows = []
  const addRow = (items, color, bold) => {
    const parts = []
    for (let i = 0; i < items.length; i++) {
      const label = items[i].endsWith('/') ? items[i] : (bold ? `${items[i]}/` : items[i])
      parts.push(G(label.padEnd(14), color, { bold }))
    }
    if (parts.length > 0) rows.push(P(parts))
  }

  while (dirs.length > 0) addRow(dirs.splice(0, 3), C.green, true)
  while (files.length > 0) addRow(files.splice(0, 3), C.white, false)
  while (hidden.length > 0) addRow(hidden.splice(0, 3), C.dim, false)

  if (!showAll && rows.length > 0) {
    rows.push(G('(use ls -a to see hidden files)', C.dim, { italic: true }))
  }
  if (rows.length === 0) rows.push(G('(empty)', C.muted))
  return rows
}

export function useTerminalEngine() {
  const [bootPhase, setBootPhase] = useState(0)
  const [bootDone, setBootDone] = useState(false)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('~')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIndex, setHistIndex] = useState(-1)
  const [easterRunning, setEasterRunning] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [booting, setBooting] = useState(true)

  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const historyRef = useRef(history)
  historyRef.current = history

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setBootPhase((p) => {
        if (p >= BOOT_LINES.length) {
          clearInterval(t)
          setTimeout(() => {
            setBootDone(true)
            setBooting(false)
          }, 400)
          return p
        }
        return p + 1
      })
    }, 80)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (bootDone && inputRef.current) inputRef.current.focus()
  }, [bootDone])

  useEffect(() => {
    scrollToBottom()
  }, [history, bootPhase, scrollToBottom])

  useEffect(() => {
    if (!bootDone) return
    const container = outputRef.current
    if (!container) return
    const nl = container.querySelectorAll('.new-line')
    if (nl.length > 0) {
      gsap.from(nl, { opacity: 0, y: 4, stagger: 0.03, duration: 0.2, ease: 'power1.out' })
    }
  }, [history, bootDone])

  useEffect(() => {
    document.title = cwd === '~'
      ? 'mugisha -- bash -- 80x24'
      : `${cwd} — mugisha — bash`
  }, [cwd])

  const addOutput = useCallback((lines) => {
    setHistory((prev) => {
      const arr = Array.isArray(lines) ? lines : [lines]
      return [...prev, ...arr]
    })
  }, [])

  const addEcho = useCallback((cmd) => {
    setHistory((prev) => [...prev, P([G('$ ', C.muted), G(cmd, C.amber)])])
  }, [])

  function typewrite(text, color, opts = {}) {
    return new Promise((resolve) => {
      const delay = opts.delay || 60
      let i = 1
      const lineId = Date.now() + Math.random()
      setHistory((prev) => [...prev, { text: '', color, ...opts, _lineId: lineId }])
      const t = setInterval(() => {
        i++
        if (i > text.length) {
          clearInterval(t)
          setHistory((prev) => {
            const idx = prev.findLastIndex((l) => l._lineId === lineId)
            if (idx === -1) return prev
            const u = [...prev]
            const { _lineId: id, _temp: tmp, ...rest } = u[idx]
            u[idx] = { ...rest, text }
            return u
          })
          resolve()
          return
        }
        setHistory((prev) => {
          const idx = prev.findLastIndex((l) => l._lineId === lineId)
          if (idx === -1) return prev
          const u = [...prev]
          u[idx] = { ...u[idx], text: text.substring(0, i) }
          scrollToBottom()
          return u
        })
      }, delay)
    })
  }

  const handleCommand = useCallback((cmdStr) => {
    const t = cmdStr.trim()
    if (!t) return
    setCmdHistory((prev) => [...prev, t])
    setHistIndex(-1)
    addEcho(t)

    const parts = t.split(/\s+/)
    const c = parts[0].toLowerCase()
    const a = parts.slice(1)

    switch (c) {
      case 'help': {
        const sections = [
          { t: 'Navigation', i: [
            ['ls', 'list contents of current directory'],
            ['cd [dir]', 'enter a directory'],
            ['cd ..', 'go back'],
            ['pwd', 'show current path'],
          ]},
          { t: 'Reading', i: [
            ['cat [file]', 'read a file'],
            ['open [file]', 'same as cat'],
            ['head [file]', 'first 3 lines of a file'],
            ['whoami', 'who is mugisha'],
          ]},
          { t: 'Search', i: [
            ['grep [term]', 'search across all content for a term'],
            ['find [name]', 'find a file by name'],
          ]},
          { t: 'Portfolio', i: [
            ['portfolio', 'open the main portfolio site'],
            ['github', 'open github.com/Mugisha-Ivan-Bright'],
            ['github2', 'open github.com/codewithmugisha'],
            ['email', 'mailto:mugishaivanbright250@gmail.com'],
            ['projects', 'list all projects with one-line descriptions'],
          ]},
          { t: 'Terminal', i: [
            ['clear', 'clear the terminal'],
            ['history', 'show command history this session'],
            ['exit', 'go back to portfolio homepage'],
            ['easter', '...you\'ll see'],
          ]},
        ]
        const out = [G('Available commands:', C.white, { bold: true }), G('', C.bg)]
        for (const s of sections) {
          out.push(G(s.t, C.amber, { bold: true }))
          for (const [cmd, desc] of s.i) {
            out.push(P([G(`  ${cmd.padEnd(16)}`, C.green), G(desc, C.muted)]))
          }
          out.push(G('', C.bg))
        }
        out.push(G('# hint: some directories are hidden', C.dim, { italic: true }))
        addOutput(out)
        return
      }

      case 'ls': {
        const showAll = a.includes('-a') || a.includes('--all')
        addOutput(buildLsOutput(cwd, showAll))
        return
      }

      case 'cd': {
        if (a.length === 0 || a[0] === '~' || a[0] === '/') {
          setCwd('~')
          return
        }
        const r = resolvePath(cwd, a[0])
        const entry = getDirEntry(r)
        if (!entry) {
          addOutput(G(`cd: no such file or directory: ${a[0]}`, C.amber))
          return
        }
        if (entry.type !== 'dir') {
          addOutput(G(`cd: not a directory: ${a[0]}`, C.amber))
          return
        }
        setCwd(r)
        return
      }

      case 'pwd': {
        addOutput(G(cwd, C.green))
        return
      }

      case 'cat':
      case 'open': {
        if (a.length === 0) {
          addOutput(G('usage: cat [file]', C.amber))
          return
        }
        let target = a[0]
        if (!target.startsWith('/') && !target.startsWith('~')) {
          target = resolvePath(cwd, target)
        } else if (target.startsWith('/')) {
          addOutput(G('absolute paths not supported', C.amber))
          return
        }
        const entry = getDirEntry(target)
        if (entry?.type === 'dir') {
          addOutput(G(`cat: ${a[0]}: Is a directory`, C.amber))
          return
        }
        const content = getFileContent(target)
        if (!content) {
          addOutput(G(`cat: ${a[0]}: No such file or directory`, C.amber))
          return
        }
        addOutput(content)
        return
      }

      case 'head': {
        if (a.length === 0) {
          addOutput(G('usage: head [file]', C.amber))
          return
        }
        let target = a[0]
        if (!target.startsWith('/') && !target.startsWith('~')) {
          target = resolvePath(cwd, target)
        } else if (target.startsWith('/')) {
          addOutput(G('absolute paths not supported', C.amber))
          return
        }
        const content = getFileContent(target)
        if (!content) {
          addOutput(G(`head: ${a[0]}: No such file or directory`, C.amber))
          return
        }
        addOutput(content.slice(0, 3))
        return
      }

      case 'whoami': {
        addOutput([
          G('mugisha-ivan-bright', C.green, { bold: true }),
          G('', C.bg),
          P([G('role:      ', C.muted), G('Full-Stack Engineer · Community Leader', C.white)]),
          P([G('school:    ', C.muted), G('Rwanda Coding Academy · Year 2', C.white)]),
          P([G('location:  ', C.muted), G('Rwanda · Gatsibo', C.white)]),
          P([G('faith:     ', C.muted), G('Christian', C.white)]),
          P([G('building:  ', C.muted), G('Uptime SaaS · always something else', C.green)]),
          P([G('dream:     ', C.muted), G('MIT / Stanford', C.green, { bold: true })]),
        ])
        return
      }

      case 'grep': {
        if (a.length === 0) {
          addOutput(G('usage: grep [term]', C.amber))
          return
        }
        const term = a.join(' ').toLowerCase()
        const results = []
        for (const [key, entry] of Object.entries(FS)) {
          if (entry.type !== 'file') continue
          for (const line of entry.content || []) {
            const text = line.parts ? line.parts.map((p) => p.text).join('') : line.text || ''
            if (text.toLowerCase().includes(term)) {
              results.push({
                file: key,
                line: text.substring(0, 80),
              })
            }
          }
        }
        if (results.length === 0) {
          addOutput(G(`No results found for "${term}"`, C.muted))
          return
        }
        const out = results.map((r) => P([G(`${r.file}:  `, C.amber), G(r.line, C.white)]))
        out.push(G('', C.bg))
        out.push(P([G(`${results.length} result${results.length > 1 ? 's' : ''} found for `, C.muted), G(term, C.green, { bold: true })]))
        addOutput(out)
        return
      }

      case 'find': {
        if (a.length === 0) {
          addOutput(G('usage: find [name]', C.amber))
          return
        }
        const name = a.join(' ').toLowerCase()
        const r = []
        for (const key of Object.keys(FS)) {
          const fn = key.split('/').pop() || key
          if (fn.toLowerCase().includes(name)) r.push(key)
        }
        if (r.length === 0) {
          addOutput(G(`No results found for "${name}"`, C.muted))
          return
        }
        addOutput(r.map((x) => ({
          text: x,
          color: C.green,
          bold: true,
        })))
        return
      }

      case 'projects': {
        const projectList = [
          ['uptime', 'monitoring SaaS · multi-region · multi-tenant'],
          ['medisafe', 'AI medication assistant · healthcare'],
          ['academix', 'microservices school management system'],
          ['automailio', 'email automation · Spring Boot · Docker'],
          ['lumen', 'full-stack TypeScript product'],
          ['furnit', 'furniture web experience · UI-focused'],
          ['igihango', 'digital contracts · Rwanda-first'],
          ['rfid', 'RFID web system · hardware meets software'],
          ['market-truth', 'market data tool · someone forked it'],
          ['enrollia', 'enrollment dashboard · Supabase · SQL'],
        ]
        const out = [G('$ ls ~/projects --describe', C.amber), G('', C.bg)]
        for (const [n, d] of projectList) {
          out.push(P([G(`${n.padEnd(16)}`, C.green), G(d, C.muted)]))
        }
        out.push(G('', C.bg))
        out.push(G('+ 31 more across two GitHub accounts.', C.muted))
        out.push(G('some finished. some broken. all real.', C.muted))
        addOutput(out)
        return
      }

      case 'portfolio': {
        addOutput([G('Closing session...', C.muted), G('Returning to portfolio...', C.muted)])
        setTimeout(() => {
          if (window.opener) {
            window.opener.focus()
            window.close()
          } else {
            window.location.href = '/'
          }
        }, 800)
        return
      }

      case 'github': {
        window.open('https://github.com/Mugisha-Ivan-Bright', '_blank', 'noopener')
        addOutput(G('opening github.com/Mugisha-Ivan-Bright...', C.muted))
        return
      }

      case 'github2': {
        window.open('https://github.com/codewithmugisha', '_blank', 'noopener')
        addOutput(G('opening github.com/codewithmugisha...', C.muted))
        return
      }

      case 'email': {
        window.open('mailto:mugishaivanbright250@gmail.com', '_blank')
        addOutput(G('opening email client...', C.muted))
        return
      }

      case 'clear': {
        setHistory([])
        return
      }

      case 'history': {
        setCmdHistory((prev) => {
          if (prev.length === 0) {
            addOutput([G('(no commands yet)', C.muted)])
          } else {
            addOutput(prev.map((c, i) => G(`  ${i + 1}  ${c}`, C.muted)))
          }
          return prev
        })
        return
      }

      case 'exit': {
        addOutput([G('Closing session...', C.muted), G('Returning to portfolio...', C.muted)])
        setTimeout(() => {
          if (window.opener) {
            gsap.to('.terminal-window', {
              scale: 0.95,
              opacity: 0,
              duration: 0.2,
              ease: 'power2.in',
              onComplete: () => window.close(),
            })
          } else {
            window.location.href = '/'
          }
        }, 800)
        return
      }

      case 'easter': {
        setEasterRunning(true)
        const run = async () => {
          await typewrite('"Byatangiye nsenga cyane..."', C.green, { bold: true, delay: 120 })
          await new Promise((r) => setTimeout(r, 1000))
          await typewrite('', C.bg, { delay: 1 })
          await typewrite('That is Kinyarwanda. My language.', C.white, { delay: 60 })
          await typewrite('It means: "It started with a lot of prayer."', C.white, { delay: 60 })
          await typewrite('', C.bg, { delay: 1 })
          await typewrite('That is how everything I have built started.', C.white, { delay: 60 })
          await typewrite('With prayer. Then with code.', C.amber, { bold: true, delay: 60 })
          await typewrite('', C.bg, { delay: 1 })
          await typewrite('You just ran the most honest command on this terminal.', C.muted, { delay: 60 })
          setEasterRunning(false)
        }
        run()
        return
      }

      default: {
        addOutput([
          P([G('command not found: ', C.amber), G(c, C.white)]),
          G('type \'help\' to see available commands.', C.muted),
        ])
      }
    }
  }, [cwd, addOutput, addEcho, typewrite])

  const handleKeyDown = useCallback((e) => {
    if (!bootDone || easterRunning) return

    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setInput('')
      addOutput(G('^C', C.muted))
      return
    }

    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setHistory([])
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand(input)
      setInput('')
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCmdHistory((prev) => {
        if (prev.length === 0) return prev
        setHistIndex((hi) => {
          const ni = hi === -1 ? prev.length - 1 : Math.max(0, hi - 1)
          setInput(prev[ni])
          return ni
        })
        return prev
      })
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIndex((hi) => {
        if (hi === -1) return hi
        const ni = hi + 1
        if (ni >= cmdHistory.length) {
          setInput('')
          return -1
        }
        setInput(cmdHistory[ni])
        return ni
      })
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const p = input.trim().toLowerCase()
      if (!p) return

      const ps = p.split(/\s+/)
      const lp = ps[ps.length - 1]
      const candidates = []

      if (ps.length <= 1) {
        const entries = getDirChildren(cwd) || []
        for (const ep of entries) {
          if (ep.startsWith('.')) continue
          if (ep.toLowerCase().startsWith(lp)) {
            const ePath = cwd === '~' ? `~/${ep}` : `${cwd}/${ep}`
            const entry = getDirEntry(ePath)
            candidates.push(entry?.type === 'dir' || isHiddenDir(ePath) ? `${ep}/` : ep)
          }
        }
        const cmds = ['help', 'ls', 'cd', 'pwd', 'cat', 'open', 'head', 'whoami',
          'grep', 'find', 'projects', 'portfolio', 'github', 'github2',
          'email', 'clear', 'history', 'exit', 'easter']
        for (const cmd of cmds) {
          if (cmd.startsWith(lp) && !candidates.includes(cmd)) candidates.push(cmd)
        }
      } else if (['cd', 'cat', 'open', 'head'].includes(ps[0])) {
        const entries = getDirChildren(cwd) || []
        for (const ep of entries) {
          if (ep.startsWith('.')) continue
          if (ep.toLowerCase().startsWith(lp)) {
            const ePath = cwd === '~' ? `~/${ep}` : `${cwd}/${ep}`
            const entry = getDirEntry(ePath)
            candidates.push(entry?.type === 'dir' || isHiddenDir(ePath) ? `${ep}/` : ep)
          }
        }
      }

      if (candidates.length === 1) {
        const prefix = p.substring(0, p.length - lp.length)
        setInput(prefix + candidates[0])
      } else if (candidates.length > 1) {
        const common = candidates.reduce((a, b) => {
          let i = 0
          while (i < a.length && i < b.length && a[i] === b[i]) i++
          return a.substring(0, i)
        })
        if (common.length > lp.length) {
          const idx = p.lastIndexOf(lp)
          setInput(p.substring(0, idx) + common)
        } else {
          addOutput(G(candidates.join('  '), C.muted))
        }
      }
      return
    }

    if (e.key === 'Backspace') {
      setInput((i) => i.slice(0, -1))
      return
    }

    if (e.key.length === 1) {
      e.preventDefault()
      setInput((i) => i + e.key)
    }
  }, [bootDone, easterRunning, input, cwd, cmdHistory, handleCommand, addOutput])

  return {
    bootPhase,
    bootDone,
    booting,
    history,
    input,
    cwd,
    cmdHistory,
    histIndex,
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
    handleCommand,
  }
}
