'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    word: 'Vision',
    desc: 'We imagine what doesn\'t yet exist',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
        <circle cx="16" cy="16" r="10" />
        <circle cx="16" cy="16" r="4" />
        <line x1="16" y1="2" x2="16" y2="6" opacity="0.5" />
        <line x1="16" y1="26" x2="16" y2="30" opacity="0.5" />
        <line x1="2" y1="16" x2="6" y2="16" opacity="0.5" />
        <line x1="26" y1="16" x2="30" y2="16" opacity="0.5" />
      </svg>
    ),
  },
  {
    word: 'Precision',
    desc: 'Every joint, every grain, every lux',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
        <rect x="6" y="6" width="20" height="20" />
        <rect x="11" y="11" width="10" height="10" />
        <line x1="6" y1="6" x2="11" y2="11" opacity="0.5" />
        <line x1="26" y1="6" x2="21" y2="11" opacity="0.5" />
        <line x1="6" y1="26" x2="11" y2="21" opacity="0.5" />
        <line x1="26" y1="26" x2="21" y2="21" opacity="0.5" />
      </svg>
    ),
  },
  {
    word: 'Craft',
    desc: 'Materials speak when treated with respect',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
        <polygon points="16,4 28,24 4,24" />
        <line x1="16" y1="4" x2="16" y2="24" opacity="0.4" />
        <circle cx="16" cy="18" r="3" opacity="0.6" />
      </svg>
    ),
  },
  {
    word: 'Legacy',
    desc: 'Built to outlast the ones who built them',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
        <rect x="8" y="14" width="16" height="14" />
        <polygon points="4,14 16,4 28,14" />
        <rect x="13" y="20" width="6" height="8" />
      </svg>
    ),
  },
]

export default function DoorTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)

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

      // Phase 1: Light beam
      tl.fromTo('.door-light-beam',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.15, ease: 'power2.in' }
      )

      // Phase 2: Light rays
      tl.to('.light-ray', {
        opacity: 0.6, scaleY: 1.5, duration: 0.2,
        stagger: { each: 0.02, from: 'center' }, ease: 'power2.out',
      }, 0.08)

      // Phase 3: Doors swing open 3D
      tl.to('.door-left', { rotateY: 75, x: '-30%', opacity: 0.3, duration: 0.5, ease: 'power3.inOut' }, 0.12)
      tl.to('.door-right', { rotateY: -75, x: '30%', opacity: 0.3, duration: 0.5, ease: 'power3.inOut' }, 0.12)

      // Phase 4: Golden flood
      tl.fromTo('.golden-flood', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.2)

      // Phase 5: Particles burst
      tl.to('.door-particle', {
        opacity: 1, y: () => `random(-200, -50)`, x: () => `random(-150, 150)`,
        scale: () => Math.random() * 2 + 0.5, duration: 0.4,
        stagger: { each: 0.008, from: 'center' }, ease: 'power2.out',
      }, 0.25)

      // Phase 6: Content
      tl.fromTo('.door-welcome', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: 'power3.out' }, 0.45)
      tl.fromTo('.door-title-line', { y: 60, opacity: 0, rotateX: 15 }, {
        y: 0, opacity: 1, rotateX: 0, duration: 0.25, stagger: 0.08, ease: 'power3.out',
      }, 0.5)

      // Phase 7: Brand pillars — stagger in with icons
      tl.fromTo('.door-pillar', { y: 40, opacity: 0, scale: 0.85 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.2, stagger: 0.06, ease: 'back.out(1.2)',
      }, 0.6)

      // Phase 8: Cleanup
      tl.to(['.door-left', '.door-right'], { opacity: 0, duration: 0.2 }, 0.78)
      tl.to('.golden-flood', { opacity: 0, duration: 0.25 }, 0.82)
      tl.to('.door-particle', { opacity: 0, duration: 0.15 }, 0.82)
      tl.fromTo('.door-scroll-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 0.9)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: 48 + (Math.random() - 0.5) * 10,
    top: 55 + (Math.random() - 0.5) * 20,
    size: 2 + Math.random() * 4,
  }))

  const rays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: -30 + (i / 11) * 60,
    length: 30 + Math.random() * 40,
    width: 1 + Math.random() * 2,
  }))

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-bg" style={{ perspective: '1200px' }}>
      {/* Light rays */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {rays.map((ray) => (
          <div key={ray.id} className="light-ray absolute opacity-0 origin-bottom"
            style={{
              width: `${ray.width}px`, height: `${ray.length}vh`,
              background: 'linear-gradient(to top, rgba(196,164,90,0.3), transparent)',
              transform: `rotate(${ray.angle}deg)`, bottom: '30%', left: '50%', marginLeft: '-1px', filter: 'blur(3px)',
            }}
          />
        ))}
      </div>

      {/* Central light beam */}
      <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none">
        <div className="door-light-beam opacity-0 w-1 h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 10%, rgba(196,164,90,0.8) 40%, rgba(196,164,90,0.8) 60%, transparent 90%)',
            boxShadow: '0 0 60px 20px rgba(196,164,90,0.15), 0 0 120px 40px rgba(196,164,90,0.08)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Left door */}
      <div className="door-left absolute top-0 left-0 w-1/2 h-full z-20"
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-bg2">
          <div className="absolute inset-6 md:inset-12 border border-white/[0.04]">
            <div className="absolute inset-4 md:inset-8 border border-white/[0.03]">
              <div className="absolute inset-4 md:inset-6 border border-white/[0.02]" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6">
              <div className="w-1 h-10 md:h-16 border border-gold/25 rounded-full" />
              <div className="w-1 h-6 md:h-10 border border-gold/15 rounded-full mt-2" />
            </div>
          </div>
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 20px),
                              repeating-linear-gradient(-45deg, white 0px, white 1px, transparent 1px, transparent 20px)`,
          }} />
          <div className="absolute top-0 right-0 w-px h-full bg-gold/20" />
        </div>
      </div>

      {/* Right door */}
      <div className="door-right absolute top-0 right-0 w-1/2 h-full z-20"
        style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-bg2">
          <div className="absolute inset-6 md:inset-12 border border-white/[0.04]">
            <div className="absolute inset-4 md:inset-8 border border-white/[0.03]">
              <div className="absolute inset-4 md:inset-6 border border-white/[0.02]" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6">
              <div className="w-1 h-10 md:h-16 border border-gold/25 rounded-full" />
              <div className="w-1 h-6 md:h-10 border border-gold/15 rounded-full mt-2" />
            </div>
          </div>
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 20px),
                              repeating-linear-gradient(-45deg, white 0px, white 1px, transparent 1px, transparent 20px)`,
          }} />
          <div className="absolute top-0 left-0 w-px h-full bg-gold/20" />
        </div>
      </div>

      {/* Golden flood */}
      <div className="golden-flood absolute inset-0 z-8 opacity-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(196,164,90,0.12) 0%, rgba(196,164,90,0.04) 50%, transparent 80%)' }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-12 pointer-events-none">
        {particles.map((p) => (
          <div key={p.id} className="door-particle absolute rounded-full opacity-0"
            style={{
              left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
              background: 'radial-gradient(circle, rgba(196,164,90,0.9), rgba(196,164,90,0) 70%)', filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Content — brand pillars instead of numbers */}
      <div className="absolute inset-0 z-5 flex flex-col items-center justify-center text-center px-6">
        <span className="door-welcome opacity-0 text-[0.55rem] md:text-[0.6rem] tracking-[0.5em] uppercase text-gold/70 mb-6">
          Welcome to
        </span>

        <div className="overflow-hidden mb-3">
          <h2 className="door-title-line opacity-0 font-display text-4xl md:text-6xl lg:text-7xl font-light text-text">
            Where Vision
          </h2>
        </div>
        <div className="overflow-hidden mb-12 md:mb-16">
          <h2 className="door-title-line opacity-0 font-display text-4xl md:text-6xl lg:text-7xl font-light">
            Becomes <em className="italic text-gold">Space</em>
          </h2>
        </div>

        {/* Four brand pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-4xl">
          {pillars.map((pillar) => (
            <div key={pillar.word} className="door-pillar opacity-0 text-center group">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-gold/30 group-hover:text-gold/60 transition-colors duration-500">
                {pillar.icon}
              </div>
              <span className="font-display text-lg md:text-xl font-light text-text block mb-1.5">
                {pillar.word}
              </span>
              <p className="text-[0.5rem] md:text-[0.55rem] tracking-[0.15em] text-mid/50 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="door-scroll-hint opacity-0 absolute bottom-8 md:bottom-12 flex flex-col items-center gap-3">
          <div className="w-5 h-9 rounded-full border border-gold/25 flex justify-center pt-2">
            <div className="w-0.5 h-2 bg-gold/50 rounded-full animate-bounce" />
          </div>
          <span className="text-[0.45rem] tracking-[0.4em] uppercase text-mid/30">Enter the Gallery</span>
        </div>
      </div>
    </section>
  )
}
