let termCount = 0

export const openTerminal = () => {
  const width = 720
  const height = 480
  const left = window.screen.width - width - 40
  const top = window.screen.height - height - 80
  const offset = termCount * 30

  const popup = window.open(
    '/terminal',
    `mugisha-terminal-${Date.now()}`,
    `width=${width},height=${height},` +
    `left=${left - offset},top=${top - offset},` +
    `resizable=yes,scrollbars=no,toolbar=no,` +
    `menubar=no,location=no,status=no`,
  )

  termCount++

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    window.open('/terminal', '_blank')
    const el = document.getElementById('popup-hint')
    if (el) {
      el.style.display = 'block'
      setTimeout(() => { el.style.display = 'none' }, 3000)
    }
  }
}
