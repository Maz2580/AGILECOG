'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }

      // Update spotlight CSS custom property
      const hero = document.getElementById('hero')
      if (hero) {
        hero.style.setProperty('--mx', `${e.clientX}px`)
        hero.style.setProperty('--my', `${e.clientY}px`)
      }
    }

    const animate = () => {
      // Dot lerp — fast
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.14
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.14
      // Ring lerp — slower
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.08
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.08

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        id="custom-cursor"
        className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-[9990] mix-blend-screen"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        className="fixed top-0 left-0 w-9 h-9 border border-gold/50 rounded-full pointer-events-none z-[9989] transition-[width,height,border-color] duration-200 ease-luxury"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
