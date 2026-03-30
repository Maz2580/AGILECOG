'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

interface HeroProps {
  tagline: string
  subtitle: string
  stats: {
    projects: string
    countries: string
    awards: string
    years: string
  }
}

export default function Hero({ tagline, subtitle, stats }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 })

    tl.fromTo(tagRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
      .fromTo(bodyRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(ctaRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(statsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')

    // Counter animation for stats
    const counters = statsRef.current?.querySelectorAll('[data-target]')
    counters?.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0')
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: 2,
        delay: 3,
        snap: { innerText: 1 },
        ease: 'power2.out',
      })
    })
  }, [])

  // Parse tagline to make italic word gold
  const renderTagline = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-gold">{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  return (
    <section id="hero" ref={containerRef} className="relative h-screen flex items-center overflow-hidden">
      <HeroScene />

      {/* Spotlight overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 600px at var(--mx, 50%) var(--my, 50%), transparent 0%, rgba(7,7,7,0.55) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[2] px-6 md:px-16 max-w-3xl mt-10">
        <div ref={tagRef} className="opacity-0 text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-7 flex items-center gap-3.5">
          <span className="w-9 h-px bg-gold inline-block" />
          Architecture Studio
        </div>

        <h1
          ref={titleRef}
          className="opacity-0 font-display font-light leading-[1.04] mb-9"
          style={{ fontSize: 'clamp(2.8rem, 7.5vw, 7rem)' }}
        >
          {tagline.includes('*') ? renderTagline(tagline) : (
            <>
              Architecture<br />
              That <em className="italic text-gold">Defines</em><br />
              Tomorrow.
            </>
          )}
        </h1>

        <p ref={bodyRef} className="opacity-0 text-sm md:text-[0.88rem] leading-[1.9] text-mid max-w-md">
          {subtitle}
        </p>

        <div ref={ctaRef} className="opacity-0 mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
          <a href="#projects" className="btn-gold text-center">View Our Work</a>
          <a href="#contact" className="btn-ghost text-center">Get in Touch</a>
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="opacity-0 absolute bottom-0 right-0 z-[2] hidden md:flex border-t border-l border-border bg-bg/90 backdrop-blur-xl"
      >
        {[
          { value: stats.projects, label: 'Projects' },
          { value: stats.countries, label: 'Countries' },
          { value: stats.awards, label: 'Awards' },
          { value: stats.years, label: 'Years' },
        ].map((stat) => (
          <div key={stat.label} className="px-8 lg:px-10 py-6 border-r border-border last:border-r-0 text-center">
            <span
              className="font-display text-2xl lg:text-3xl font-light text-text block leading-none"
              data-target={stat.value}
            >
              0
            </span>
            <span className="text-[0.6rem] tracking-[0.25em] uppercase text-mid mt-1.5 block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile stats */}
      <div className="absolute bottom-6 left-6 right-6 z-[2] md:hidden grid grid-cols-4 gap-1 bg-bg/90 backdrop-blur-xl border border-border rounded-lg overflow-hidden">
        {[
          { value: stats.projects, label: 'Projects' },
          { value: stats.countries, label: 'Countries' },
          { value: stats.awards, label: 'Awards' },
          { value: stats.years, label: 'Years' },
        ].map((stat) => (
          <div key={stat.label} className="py-4 text-center">
            <span className="font-display text-lg font-light text-text block">{stat.value}</span>
            <span className="text-[0.5rem] tracking-[0.15em] uppercase text-mid">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="absolute bottom-12 left-16 z-[2] hidden md:flex flex-col items-center gap-2.5">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold animate-pulse-line" />
        <span className="text-[0.58rem] tracking-[0.35em] uppercase text-mid" style={{ writingMode: 'vertical-lr' }}>
          Scroll
        </span>
      </div>
    </section>
  )
}
