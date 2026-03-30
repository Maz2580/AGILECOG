'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Discovery',
    body: 'We begin by understanding the site, context, and your vision. Deep research informs every design decision from day one.',
  },
  {
    num: '02',
    title: 'Concept',
    body: 'Ideas take shape through sketches, models, and spatial studies. We explore multiple directions before committing to form.',
  },
  {
    num: '03',
    title: 'Development',
    body: 'Technical precision meets creative intent. Materials, systems, and details are resolved with engineering rigour.',
  },
  {
    num: '04',
    title: 'Realisation',
    body: 'We guide construction with an unwavering eye for quality, ensuring the built outcome honours the design vision.',
  },
]

export default function ProcessImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: '.process-header', start: 'top 75%' },
      })
      headerTl
        .fromTo('.process-eyebrow', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('.process-title-line', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' }, 0.2)

      // ─── Progress line that fills across all steps on scroll ───
      gsap.fromTo('.process-progress-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        }
      )

      // ─── Each step: dramatic stagger entrance ───
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 80%' },
        })

        // Number scales up from nothing
        tl.fromTo(step.querySelector('.step-number'),
          { scale: 0, opacity: 0, rotateZ: -15 },
          { scale: 1, opacity: 1, rotateZ: 0, duration: 0.7, ease: 'back.out(1.5)' }
        )

        // Icon draws
        tl.fromTo(step.querySelector('.step-icon'),
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          0.15
        )

        // Top border slides in
        tl.fromTo(step.querySelector('.step-top-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power2.out' },
          0.1
        )

        // Title
        tl.fromTo(step.querySelector('.step-title'),
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.3
        )

        // Body text
        tl.fromTo(step.querySelector('.step-body'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.45
        )

        // Connecting dot pulses in
        tl.fromTo(step.querySelector('.step-dot'),
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: 'back.out(3)' },
          0.5
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-bg2 relative overflow-hidden" id="process">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-gold/15 animate-pulse"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="process-header relative z-10">
        <div className="process-eyebrow eyebrow opacity-0">The Workshop</div>
        <h2 className="sec-title mt-4 mb-16 md:mb-20">
          <div className="overflow-hidden">
            <span className="process-title-line block opacity-0">A Process Built on</span>
          </div>
          <div className="overflow-hidden">
            <span className="process-title-line block opacity-0">
              <em className="italic text-gold font-display">Rigour</em>
            </span>
          </div>
        </h2>
      </div>

      {/* Progress line spanning all steps */}
      <div className="process-grid relative z-10">
        <div className="hidden lg:block absolute top-0 left-0 right-0 h-px bg-white/[0.04]">
          <div className="process-progress-line absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-gold/60 via-gold/30 to-gold/10 origin-left" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="process-step relative group">
              {/* Top accent line */}
              <div className="step-top-line absolute top-0 left-0 right-0 h-[2px] bg-gold/40 origin-left lg:hidden" />

              {/* Connection dot on the progress line */}
              <div className="step-dot hidden lg:block absolute -top-[5px] left-1/2 -translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-bg2 border-2 border-gold/50 group-hover:border-gold group-hover:shadow-[0_0_12px_rgba(196,164,90,0.3)] transition-all duration-500" />
              </div>

              <div className="pt-8 lg:pt-12 pr-6 pb-8 lg:border-r border-border last:border-r-0">
                {/* Icon */}
                <div className="step-icon w-10 h-10 md:w-12 md:h-12 mb-6 text-gold/20 group-hover:text-gold/50 transition-colors duration-500">
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="0.8">
                    {i === 0 && (<>
                      <circle cx="24" cy="24" r="16" />
                      <circle cx="24" cy="24" r="6" />
                      <line x1="24" y1="8" x2="24" y2="40" opacity="0.5" />
                      <line x1="8" y1="24" x2="40" y2="24" opacity="0.5" />
                    </>)}
                    {i === 1 && (<>
                      <polygon points="24,6 42,38 6,38" />
                      <line x1="24" y1="6" x2="24" y2="38" opacity="0.5" />
                    </>)}
                    {i === 2 && (<>
                      <rect x="8" y="8" width="32" height="32" />
                      <rect x="15" y="15" width="18" height="18" />
                      <line x1="8" y1="8" x2="15" y2="15" opacity="0.5" />
                      <line x1="40" y1="8" x2="33" y2="15" opacity="0.5" />
                    </>)}
                    {i === 3 && (<>
                      <rect x="12" y="22" width="24" height="18" />
                      <polygon points="8,22 24,6 40,22" />
                      <rect x="20" y="28" width="8" height="12" />
                    </>)}
                  </svg>
                </div>

                {/* Number */}
                <span className="step-number font-display text-4xl md:text-5xl font-light text-gold/10 group-hover:text-gold/30 block mb-5 transition-colors duration-500 origin-left">
                  {step.num}
                </span>

                <h3 className="step-title font-display text-xl md:text-2xl font-normal mb-3 group-hover:text-gold transition-colors duration-500 opacity-0">
                  {step.title}
                </h3>
                <p className="step-body text-[0.78rem] md:text-[0.8rem] leading-[1.85] text-mid opacity-0">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
