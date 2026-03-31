'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PalaceDoors() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftDoorRef = useRef<HTMLDivElement>(null)
  const rightDoorRef = useRef<HTMLDivElement>(null)
  const lightBeamRef = useRef<HTMLDivElement>(null)
  const floodRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const raysRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      // Phase 1: Light seeps through the crack (0 → 0.12)
      tl.fromTo(
        lightBeamRef.current,
        { scaleX: 0.003, opacity: 0 },
        { scaleX: 0.08, opacity: 1, duration: 0.12, ease: 'power2.out' },
        0
      )

      // Phase 2: Light rays fan out from center (0.08 → 0.2)
      tl.fromTo(
        '.palace-ray',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.4, duration: 0.12, stagger: { from: 'center', amount: 0.06 }, ease: 'power2.out' },
        0.08
      )

      // Phase 3: Doors swing open — HEAVY, slow, cinematic (0.15 → 0.55)
      tl.to(
        leftDoorRef.current,
        { rotateY: 75, x: '-15%', opacity: 0.3, duration: 0.4, ease: 'power2.inOut' },
        0.15
      )
      tl.to(
        rightDoorRef.current,
        { rotateY: -75, x: '15%', opacity: 0.3, duration: 0.4, ease: 'power2.inOut' },
        0.15
      )

      // Phase 4: Golden light floods in (0.3 → 0.5)
      tl.fromTo(
        floodRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.5, duration: 0.2, ease: 'power2.out' },
        0.3
      )

      // Phase 5: Dust particles float through the light (0.35 → 0.65)
      tl.fromTo(
        '.palace-particle',
        { opacity: 0, y: 0, scale: 0 },
        {
          opacity: () => 0.3 + Math.random() * 0.5,
          y: () => -(80 + Math.random() * 200),
          x: () => (Math.random() - 0.5) * 250,
          scale: () => 0.5 + Math.random() * 1,
          duration: 0.3,
          stagger: 0.004,
          ease: 'power1.out',
        },
        0.35
      )

      // Phase 6: Welcome text reveals (0.55 → 0.7)
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power3.out' },
        0.55
      )

      // Phase 7: Everything fades, preparing for gallery (0.8 → 1)
      tl.to(
        [leftDoorRef.current, rightDoorRef.current],
        { opacity: 0, duration: 0.15, ease: 'power2.in' },
        0.8
      )
      tl.to(
        [floodRef.current, raysRef.current, particlesRef.current, lightBeamRef.current],
        { opacity: 0, duration: 0.15, ease: 'power2.in' },
        0.8
      )
      tl.to(
        contentRef.current,
        { opacity: 0, y: -30, duration: 0.15, ease: 'power2.in' },
        0.85
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
      style={{ perspective: '1200px' }}
    >
      {/* ─── LEFT DOOR ─── */}
      <div
        ref={leftDoorRef}
        className="absolute top-[5%] left-[8%] w-[42%] h-[90%] origin-left"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Door body */}
        <div className="absolute inset-0 rounded-t-[4px]"
          style={{
            background: 'linear-gradient(180deg, #1a1510 0%, #0f0c08 40%, #1a1510 100%)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 2px rgba(196,164,90,0.1)',
            border: '1px solid rgba(196,164,90,0.08)',
          }}
        >
          {/* Ornate top panel */}
          <div className="absolute top-[4%] left-[8%] right-[8%] h-[28%] rounded-t-[2px]"
            style={{
              background: 'linear-gradient(180deg, rgba(196,164,90,0.04) 0%, rgba(15,12,8,0.8) 100%)',
              border: '1px solid rgba(196,164,90,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(196,164,90,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
            }}
          >
            {/* Inner embossed detail */}
            <div className="absolute inset-[8%] rounded-[1px]"
              style={{
                border: '1px solid rgba(196,164,90,0.06)',
                background: 'linear-gradient(135deg, rgba(196,164,90,0.02) 0%, transparent 50%, rgba(196,164,90,0.02) 100%)',
              }}
            />
          </div>

          {/* Bottom panel */}
          <div className="absolute bottom-[4%] left-[8%] right-[8%] h-[52%] rounded-b-[2px]"
            style={{
              background: 'linear-gradient(180deg, rgba(15,12,8,0.6) 0%, rgba(196,164,90,0.03) 100%)',
              border: '1px solid rgba(196,164,90,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(196,164,90,0.06)',
            }}
          >
            <div className="absolute inset-[6%] rounded-[1px]"
              style={{ border: '1px solid rgba(196,164,90,0.05)' }}
            />
          </div>

          {/* Golden handle */}
          <div className="absolute top-[50%] right-[6%] -translate-y-1/2 w-[4%] h-[8%]">
            <div className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #d4b664, #8b6914, #c9a84c)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,220,130,0.3)',
              }}
            />
            {/* Handle plate */}
            <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[140%] h-[220%] rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(196,164,90,0.15), rgba(139,105,20,0.08))',
                border: '1px solid rgba(196,164,90,0.12)',
              }}
            />
          </div>

          {/* Wood grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(196,164,90,0.3) 3px,
                rgba(196,164,90,0.3) 4px
              )`,
            }}
          />
        </div>
      </div>

      {/* ─── RIGHT DOOR ─── */}
      <div
        ref={rightDoorRef}
        className="absolute top-[5%] right-[8%] w-[42%] h-[90%] origin-right"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-t-[4px]"
          style={{
            background: 'linear-gradient(180deg, #1a1510 0%, #0f0c08 40%, #1a1510 100%)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 2px rgba(196,164,90,0.1)',
            border: '1px solid rgba(196,164,90,0.08)',
          }}
        >
          {/* Top panel */}
          <div className="absolute top-[4%] left-[8%] right-[8%] h-[28%] rounded-t-[2px]"
            style={{
              background: 'linear-gradient(180deg, rgba(196,164,90,0.04) 0%, rgba(15,12,8,0.8) 100%)',
              border: '1px solid rgba(196,164,90,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(196,164,90,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-[8%] rounded-[1px]"
              style={{
                border: '1px solid rgba(196,164,90,0.06)',
                background: 'linear-gradient(135deg, rgba(196,164,90,0.02) 0%, transparent 50%, rgba(196,164,90,0.02) 100%)',
              }}
            />
          </div>

          {/* Bottom panel */}
          <div className="absolute bottom-[4%] left-[8%] right-[8%] h-[52%] rounded-b-[2px]"
            style={{
              background: 'linear-gradient(180deg, rgba(15,12,8,0.6) 0%, rgba(196,164,90,0.03) 100%)',
              border: '1px solid rgba(196,164,90,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(196,164,90,0.06)',
            }}
          >
            <div className="absolute inset-[6%] rounded-[1px]"
              style={{ border: '1px solid rgba(196,164,90,0.05)' }}
            />
          </div>

          {/* Golden handle */}
          <div className="absolute top-[50%] left-[6%] -translate-y-1/2 w-[4%] h-[8%]">
            <div className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #d4b664, #8b6914, #c9a84c)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,220,130,0.3)',
              }}
            />
            <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[140%] h-[220%] rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(196,164,90,0.15), rgba(139,105,20,0.08))',
                border: '1px solid rgba(196,164,90,0.12)',
              }}
            />
          </div>

          {/* Wood grain */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(196,164,90,0.3) 3px,
                rgba(196,164,90,0.3) 4px
              )`,
            }}
          />
        </div>
      </div>

      {/* ─── DOOR FRAME (architectural surround) ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top lintel */}
        <div className="absolute top-[3%] left-[6%] right-[6%] h-[3%]"
          style={{
            background: 'linear-gradient(180deg, rgba(196,164,90,0.06), rgba(196,164,90,0.02))',
            borderBottom: '1px solid rgba(196,164,90,0.08)',
          }}
        >
          {/* Keystone */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[6%] h-[160%]"
            style={{
              background: 'linear-gradient(180deg, rgba(196,164,90,0.08), rgba(196,164,90,0.03))',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
        {/* Left pilaster */}
        <div className="absolute top-[3%] left-[6%] w-[2.5%] h-[92%]"
          style={{
            background: 'linear-gradient(90deg, rgba(196,164,90,0.04), rgba(196,164,90,0.02))',
            borderRight: '1px solid rgba(196,164,90,0.06)',
          }}
        />
        {/* Right pilaster */}
        <div className="absolute top-[3%] right-[6%] w-[2.5%] h-[92%]"
          style={{
            background: 'linear-gradient(270deg, rgba(196,164,90,0.04), rgba(196,164,90,0.02))',
            borderLeft: '1px solid rgba(196,164,90,0.06)',
          }}
        />
      </div>

      {/* ─── LIGHT BEAM through crack ─── */}
      <div
        ref={lightBeamRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 8% 100% at 50% 50%, rgba(196,164,90,0.25) 0%, rgba(196,164,90,0.05) 40%, transparent 70%)',
        }}
      />

      {/* ─── LIGHT RAYS fanning out ─── */}
      <div ref={raysRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = -35 + (i * 70) / 13
          return (
            <div
              key={i}
              className="palace-ray absolute top-0 left-1/2 w-[2px] h-[120%] origin-top"
              style={{
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(180deg, rgba(196,164,90,${0.08 + Math.random() * 0.06}) 0%, transparent 80%)`,
                filter: 'blur(3px)',
              }}
            />
          )
        })}
      </div>

      {/* ─── GOLDEN FLOOD ─── */}
      <div
        ref={floodRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(196,164,90,0.08) 0%, rgba(196,164,90,0.02) 40%, transparent 70%)',
        }}
      />

      {/* ─── DUST PARTICLES ─── */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="palace-particle absolute rounded-full"
            style={{
              left: `${42 + (Math.random() - 0.5) * 20}%`,
              top: `${50 + Math.random() * 30}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `radial-gradient(circle, rgba(196,164,90,${0.5 + Math.random() * 0.4}), transparent)`,
              filter: `blur(${Math.random() * 1}px)`,
            }}
          />
        ))}
      </div>

      {/* ─── WELCOME CONTENT ─── */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 pointer-events-none"
      >
        <div className="text-center">
          <div className="text-[0.6rem] tracking-[0.5em] uppercase text-gold/60 mb-6">
            Step Inside
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-text leading-[1.1]">
            Where Vision Becomes<br />
            <em className="italic text-gold">Space</em>
          </h2>
          <div className="mt-8 w-16 h-px bg-gold/20 mx-auto" />
        </div>
      </div>

      {/* ─── FLOOR SHADOW ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </section>
  )
}
