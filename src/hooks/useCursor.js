import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const qX = gsap.quickTo(dot, 'x', { duration: 0.08 })
    const qY = gsap.quickTo(dot, 'y', { duration: 0.08 })
    const rX = gsap.quickTo(ring, 'x', { duration: 0.3 })
    const rY = gsap.quickTo(ring, 'y', { duration: 0.3 })

    const move = (e) => {
      qX(e.clientX)
      qY(e.clientY)
      rX(e.clientX)
      rY(e.clientY)
    }

    const down = () => gsap.to(ring, { scale: 0.5, duration: 0.2 })
    const up = () => gsap.to(ring, { scale: 1, duration: 0.2 })

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return { dotRef, ringRef }
}
