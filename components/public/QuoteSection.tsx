'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function QuoteSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax floating particles
      gsap.utils.toArray<HTMLElement>('.quote-particle').forEach((p) => {
        gsap.to(p, {
          y: `random(-60, -120)`,
          x: `random(-30, 30)`,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })

      // Quote mark scales in
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })

      tl.fromTo('.quote-mark',
        { scale: 0.3, opacity: 0, rotateZ: -10 },
        { scale: 1, opacity: 0.08, rotateZ: 0, duration: 1.2, ease: 'power3.out' }
      )

      // Horizontal lines expand from center
      tl.fromTo('.quote-line-left',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        0.3
      )
      tl.fromTo('.quote-line-right',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' },
        0.3
      )

      // Quote text: each word fades in
      tl.fromTo('.quote-word',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' },
        0.5
      )

      // Source
      tl.fromTo('.quote-source',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const quoteText = 'Architecture should speak of its time and place, but yearn for timelessness.'
  const words = quoteText.split(' ')

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    top: 10 + Math.random() * 80,
    size: 1 + Math.random() * 3,
    opacity: 0.05 + Math.random() * 0.15,
  }))

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 text-center overflow-hidden border-t border-border">
      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="quote-particle absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: `rgba(196,164,90,${p.opacity})`,
              boxShadow: p.size > 2 ? `0 0 ${p.size * 4}px rgba(196,164,90,${p.opacity * 0.5})` : 'none',
            }}
          />
        ))}
      </div>

      {/* Radial glow behind quote */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 px-6 md:px-16 max-w-4xl mx-auto">
        {/* Giant quote mark */}
        <span className="quote-mark font-display text-[8rem] md:text-[14rem] leading-[0.3] text-gold block mb-12 select-none opacity-0">
          &ldquo;
        </span>

        {/* Decorative lines */}
        <div className="flex items-center gap-4 md:gap-6 justify-center mb-10">
          <div className="quote-line-left w-16 md:w-24 h-px bg-gradient-to-l from-gold/30 to-transparent origin-right" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
          <div className="quote-line-right w-16 md:w-24 h-px bg-gradient-to-r from-gold/30 to-transparent origin-left" />
        </div>

        {/* Quote — word by word reveal */}
        <blockquote className="font-display font-light italic leading-relaxed text-text mb-12" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.5rem)' }}>
          {words.map((word, i) => (
            <span key={i} className="quote-word inline-block opacity-0 mx-[0.15em]">
              {word}
            </span>
          ))}
        </blockquote>

        {/* Source */}
        <cite className="quote-source not-italic block opacity-0">
          <span className="text-[0.6rem] md:text-[0.65rem] tracking-[0.35em] uppercase text-gold block">
            Frank Gehry
          </span>
          <span className="text-[0.5rem] md:text-[0.55rem] tracking-[0.2em] uppercase text-mid mt-1.5 block">
            Architect &amp; Pritzker Laureate
          </span>
        </cite>
      </div>
    </section>
  )
}
