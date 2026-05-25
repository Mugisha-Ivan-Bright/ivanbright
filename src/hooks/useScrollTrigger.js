import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollTrigger() {
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])
}
