'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const materials = [
  { name: 'Calacatta Marble', desc: 'Sourced from Tuscany. Each vein is unique — a geological fingerprint we celebrate.', color: '#e8e0d4', accent: '#c4a45a' },
  { name: 'Brushed Brass', desc: 'Hand-finished fixtures that age with grace. We choose brass for its warmth against stone.', color: '#c9a84c', accent: '#8b6914' },
  { name: 'Smoked Oak', desc: 'Fumed European oak panels. The tannins react with ammonia to produce depths no stain can achieve.', color: '#3a2e22', accent: '#6b5738' },
  { name: 'Venetian Plaster', desc: 'Applied in seven layers by artisan hands. The surface breathes, absorbs light, and shifts with the hour.', color: '#d4cec0', accent: '#a09882' },
]

export default function AboutImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const swatchRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── Header animations ───
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: '.about-header', start: 'top 75%' },
      })
      headerTl
        .fromTo('.about-eyebrow', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.about-title-line', { y: 80, opacity: 0, rotateX: 15 }, {
          y: 0, opacity: 1, rotateX: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
        }, 0.2)

      // ─── Text paragraphs ───
      gsap.utils.toArray<HTMLElement>('.about-para').forEach((para) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: para, start: 'top 80%' },
        })
        tl.fromTo(para.querySelector('.about-para-line'),
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: 'power2.out' }
        )
        tl.fromTo(para.querySelector('.about-para-text'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.15
        )
      })

      // ─── Pull quote ───
      const quoteTl = gsap.timeline({
        scrollTrigger: { trigger: '.about-pullquote', start: 'top 75%' },
      })
      quoteTl
        .fromTo('.about-quote-border', { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power2.out' })
        .fromTo('.about-quote-text', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.3)
        .fromTo('.about-quote-source', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)

      // ─── SVG Blueprint: Draw lines on scroll ───
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll('.blueprint-line')
        paths.forEach((path) => {
          const el = path as SVGPathElement | SVGLineElement | SVGRectElement | SVGPolylineElement
          if ('getTotalLength' in el && typeof el.getTotalLength === 'function') {
            const len = el.getTotalLength()
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
            gsap.to(el, {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: svgRef.current,
                start: 'top 70%',
                end: 'center center',
                scrub: 1,
              },
            })
          }
        })

        // Labels fade in after lines draw
        gsap.utils.toArray<HTMLElement>('.blueprint-label').forEach((label, i) => {
          gsap.fromTo(label,
            { opacity: 0, y: 8 },
            {
              opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
              delay: 0.1 * i,
              scrollTrigger: { trigger: svgRef.current, start: 'center 60%' },
            }
          )
        })
      }

      // ─── Material swatches ───
      swatchRefs.current.forEach((swatch, i) => {
        if (!swatch) return
        gsap.fromTo(swatch,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: { trigger: swatch, start: 'top 85%' },
          }
        )
        // Continuous subtle float
        gsap.to(swatch, {
          y: `${2 + Math.random() * 3}`,
          duration: 3 + Math.random() * 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* ─── Left: Text ─── */}
        <div>
          <div className="about-header" style={{ perspective: '800px' }}>
            <div className="about-eyebrow eyebrow opacity-0">The Studio</div>
            <h2 className="sec-title mt-4 mb-10">
              <div className="overflow-hidden">
                <span className="about-title-line block opacity-0">Where Vision</span>
              </div>
              <div className="overflow-hidden">
                <span className="about-title-line block opacity-0">
                  Meets <em className="italic text-gold font-display">Precision</em>
                </span>
              </div>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              'At AGILECOG, we believe architecture is more than shelter — it is a language spoken through light, material, and space. Every project begins with listening: to the land, the community, and the aspiration that drives creation.',
              'Our studio brings together architects, engineers, and environmental designers who share a relentless curiosity. We do not follow trends — we study forces. Climate, culture, human behaviour, structural poetry.',
              'The result is architecture that feels inevitable — as though the building was always meant to exist in that exact place, in that exact form.',
            ].map((text, i) => (
              <div key={i} className="about-para relative">
                <div className="about-para-line absolute -left-4 md:-left-6 top-0 w-0.5 h-full bg-gradient-to-b from-gold/40 to-transparent origin-top" />
                <p className="about-para-text text-sm md:text-[0.9rem] leading-[1.95] text-mid pl-0 md:pl-2 opacity-0">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="about-pullquote mt-14 pt-10 relative">
            <div className="about-quote-border absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent origin-left" />
            <div className="about-quote-border absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold/40 to-transparent origin-top" />
            <p className="about-quote-text font-display text-xl md:text-2xl font-light italic text-text leading-relaxed pl-6 opacity-0">
              &ldquo;We don&rsquo;t design buildings. We design the moments that happen inside them.&rdquo;
            </p>
            <span className="about-quote-source text-[0.55rem] tracking-[0.3em] uppercase text-gold/60 mt-5 pl-6 block opacity-0">
              — AGILECOG Founding Principle
            </span>
          </div>
        </div>

        {/* ─── Right: Animated Blueprint + Material Palette ─── */}
        <div className="lg:mt-16 space-y-10">

          {/* Architectural Blueprint Drawing */}
          <div className="relative">
            {/* Blueprint background */}
            <div className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(145deg, rgba(196,164,90,0.02), rgba(10,8,6,0.8))',
                border: '1px solid rgba(196,164,90,0.06)',
              }}
            />

            <div className="relative p-6 md:p-8">
              {/* Title bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold/30" />
                  <span className="text-[0.5rem] tracking-[0.4em] uppercase text-gold/40">Interior Elevation</span>
                </div>
                <span className="text-[0.45rem] tracking-[0.2em] uppercase text-mid/20 font-mono">DWG-2024-E01</span>
              </div>

              {/* SVG Blueprint — Interior elevation of a luxury room */}
              <svg
                ref={svgRef}
                viewBox="0 0 400 280"
                className="w-full h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Floor */}
                <line className="blueprint-line" x1="20" y1="250" x2="380" y2="250" stroke="rgba(196,164,90,0.4)" strokeWidth="1.5" />

                {/* Left wall */}
                <line className="blueprint-line" x1="20" y1="30" x2="20" y2="250" stroke="rgba(196,164,90,0.25)" strokeWidth="1" />

                {/* Right wall */}
                <line className="blueprint-line" x1="380" y1="30" x2="380" y2="250" stroke="rgba(196,164,90,0.25)" strokeWidth="1" />

                {/* Ceiling line */}
                <line className="blueprint-line" x1="20" y1="30" x2="380" y2="30" stroke="rgba(196,164,90,0.3)" strokeWidth="1" />

                {/* Crown molding detail */}
                <polyline className="blueprint-line" points="20,38 30,38 30,30" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                <polyline className="blueprint-line" points="380,38 370,38 370,30" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />

                {/* Window — left section */}
                <rect className="blueprint-line" x="50" y="60" width="80" height="130" rx="1" stroke="rgba(196,164,90,0.3)" strokeWidth="0.8" />
                <line className="blueprint-line" x1="90" y1="60" x2="90" y2="190" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                <line className="blueprint-line" x1="50" y1="125" x2="130" y2="125" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                {/* Window sill */}
                <line className="blueprint-line" x1="45" y1="190" x2="135" y2="190" stroke="rgba(196,164,90,0.25)" strokeWidth="1" />

                {/* Fireplace — center */}
                <rect className="blueprint-line" x="165" y="100" width="70" height="150" rx="1" stroke="rgba(196,164,90,0.35)" strokeWidth="1" />
                {/* Mantle */}
                <line className="blueprint-line" x1="155" y1="100" x2="245" y2="100" stroke="rgba(196,164,90,0.4)" strokeWidth="1.5" />
                {/* Firebox arch */}
                <path className="blueprint-line" d="M 180 250 L 180 170 Q 200 145 220 170 L 220 250" stroke="rgba(196,164,90,0.3)" strokeWidth="0.8" />
                {/* Mantle shelf detail */}
                <line className="blueprint-line" x1="160" y1="96" x2="240" y2="96" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />

                {/* Built-in shelves — right */}
                <rect className="blueprint-line" x="280" y="50" width="80" height="200" rx="1" stroke="rgba(196,164,90,0.25)" strokeWidth="0.8" />
                {/* Shelf divisions */}
                <line className="blueprint-line" x1="280" y1="100" x2="360" y2="100" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                <line className="blueprint-line" x1="280" y1="150" x2="360" y2="150" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                <line className="blueprint-line" x1="280" y1="200" x2="360" y2="200" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
                <line className="blueprint-line" x1="320" y1="50" x2="320" y2="250" stroke="rgba(196,164,90,0.1)" strokeWidth="0.5" />

                {/* Pendant light — center */}
                <line className="blueprint-line" x1="200" y1="30" x2="200" y2="55" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />
                <circle className="blueprint-line" cx="200" cy="62" r="7" stroke="rgba(196,164,90,0.25)" strokeWidth="0.7" />

                {/* Dimension lines */}
                <line className="blueprint-line" x1="20" y1="265" x2="380" y2="265" stroke="rgba(196,164,90,0.12)" strokeWidth="0.4" strokeDasharray="2 4" />
                <line className="blueprint-line" x1="20" y1="262" x2="20" y2="268" stroke="rgba(196,164,90,0.15)" strokeWidth="0.4" />
                <line className="blueprint-line" x1="380" y1="262" x2="380" y2="268" stroke="rgba(196,164,90,0.15)" strokeWidth="0.4" />

                {/* Height dimension */}
                <line className="blueprint-line" x1="395" y1="30" x2="395" y2="250" stroke="rgba(196,164,90,0.12)" strokeWidth="0.4" strokeDasharray="2 4" />
              </svg>

              {/* Blueprint labels — appear after lines draw */}
              <div className="relative mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {['Window Bay', 'Stone Fireplace', 'Oak Joinery', 'Pendant'].map((label) => (
                  <span key={label} className="blueprint-label text-[0.45rem] tracking-[0.25em] uppercase text-gold/30 opacity-0">
                    {label}
                  </span>
                ))}
              </div>

              {/* Scale marker */}
              <div className="absolute bottom-4 right-6 flex items-center gap-2">
                <div className="w-8 h-px bg-gold/15" />
                <span className="text-[0.4rem] text-gold/20 font-mono">1:50</span>
              </div>
            </div>
          </div>

          {/* Material Palette */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-gold/20" />
              <span className="text-[0.5rem] tracking-[0.4em] uppercase text-gold/40">Material Palette</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {materials.map((mat, i) => (
                <div
                  key={i}
                  ref={(el) => { swatchRefs.current[i] = el }}
                  className="group relative p-4 rounded-lg cursor-default opacity-0"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.02), rgba(0,0,0,0.3))',
                    border: '1px solid rgba(196,164,90,0.06)',
                    transition: 'border-color 0.5s, box-shadow 0.5s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(196,164,90,0.15)'
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), inset 0 0 30px ${mat.accent}08`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(196,164,90,0.06)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Swatch circle */}
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full shrink-0 ring-1 ring-white/5"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${mat.color}, ${mat.accent})`,
                        boxShadow: `0 2px 8px ${mat.accent}30`,
                      }}
                    />
                    <div>
                      <div className="text-[0.55rem] tracking-[0.2em] uppercase text-gold/70 font-medium">
                        {mat.name}
                      </div>
                    </div>
                  </div>
                  {/* Description — reveals on hover/focus */}
                  <p className="text-[0.6rem] leading-[1.7] text-mid/40 group-hover:text-mid/60 transition-colors duration-500">
                    {mat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
