'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RoomDividerProps {
  label: string
  number: string
}

export default function RoomDivider({ label, number }: RoomDividerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          end: 'top 35%',
          scrub: 0.5,
        },
      })

      // Giant number rises from below with parallax
      tl.fromTo('.rd-number',
        { y: 80, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 0.04, scale: 1, duration: 0.5, ease: 'power2.out' }
      )

      // Left line extends from center
      tl.fromTo('.rd-line-left',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power2.out' },
        0.1
      )

      // Right line extends from center
      tl.fromTo('.rd-line-right',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power2.out' },
        0.1
      )

      // Center diamond pulses in
      tl.fromTo('.rd-diamond',
        { scale: 0, rotate: 45, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
        0.15
      )

      // Label fades up
      tl.fromTo('.rd-label',
        { opacity: 0, y: 8, letterSpacing: '0.3em' },
        { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 0.4, ease: 'power2.out' },
        0.25
      )

      // Small decorative ticks
      tl.fromTo('.rd-tick',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, stagger: 0.03, duration: 0.2, ease: 'power2.out' },
        0.2
      )

    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      {/* Giant background number */}
      <span className="rd-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[10rem] md:text-[18rem] font-light text-white opacity-0 pointer-events-none select-none">
        {number}
      </span>

      {/* Divider construction */}
      <div className="relative flex items-center justify-center px-6 md:px-16">
        {/* Left decorative ticks */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rd-tick w-px h-3 bg-gold/15 origin-bottom opacity-0" />
          ))}
        </div>

        {/* Left line */}
        <div className="rd-line-left flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-gold/40 origin-right" />

        {/* Center diamond */}
        <div className="mx-4 md:mx-6 flex flex-col items-center gap-2">
          <div className="rd-diamond w-2 h-2 bg-gold/30 rotate-45 opacity-0" />
          <span className="rd-label text-[0.5rem] md:text-[0.55rem] tracking-[0.5em] uppercase text-gold/50 whitespace-nowrap opacity-0">
            {label}
          </span>
        </div>

        {/* Right line */}
        <div className="rd-line-right flex-1 h-px bg-gradient-to-l from-transparent via-gold/20 to-gold/40 origin-left" />

        {/* Right decorative ticks */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rd-tick w-px h-3 bg-gold/15 origin-bottom opacity-0" />
          ))}
        </div>
      </div>
    </div>
  )
}
