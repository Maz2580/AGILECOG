'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const cardGradients = [
  'linear-gradient(145deg,#101828 0%,#0b1018 100%)',
  'linear-gradient(145deg,#1a1008 0%,#100a04 100%)',
  'linear-gradient(155deg,#0d1e1a 0%,#071410 100%)',
  'linear-gradient(140deg,#18100a 0%,#0e0906 100%)',
  'linear-gradient(135deg,#14101a 0%,#0c0a12 100%)',
]

interface HorizontalGalleryProps {
  projects: Project[]
}

export default function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!projects.length) return

    const ctx = gsap.context(() => {
      // Header cinematic entrance
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: '.gallery-header', start: 'top 80%' },
      })
      headerTl
        .fromTo('.gallery-eyebrow', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.gallery-title-word', { y: 70, opacity: 0, rotateX: 20 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' }, 0.2)
        .fromTo('.gallery-viewall', { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.6)

      // Counter label
      headerTl.fromTo('.gallery-counter', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8)

      const mm = gsap.matchMedia()

      // ─── DESKTOP: Horizontal scroll with 3D depth ───
      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current
        if (!track) return

        const totalWidth = track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 0.3,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Each card: 3D perspective entrance as it scrolls into view
        gsap.utils.toArray<HTMLElement>('.gallery-card').forEach((card) => {
          gsap.fromTo(card,
            { z: -100, rotateY: 8, opacity: 0, scale: 0.9 },
            {
              z: 0, rotateY: 0, opacity: 1, scale: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 90%',
                end: 'left 50%',
                scrub: 0.5,
              },
            }
          )
        })

        // Progress bar fills as you scroll through gallery
        gsap.fromTo('.gallery-progress-fill',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${totalWidth}`,
              scrub: true,
            },
          }
        )
      })

      // ─── MOBILE: Vertical with stagger ───
      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray<HTMLElement>('.gallery-card').forEach((card) => {
          gsap.fromTo(card,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 85%' },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [projects])

  if (!projects.length) {
    return (
      <section className="section-padding" id="projects">
        <div className="eyebrow">Selected Work</div>
        <h2 className="sec-title mt-4">Projects Coming Soon</h2>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden" id="projects">
      {/* Ambient golden particles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/20 animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="gallery-header px-6 md:px-16 pt-20 md:pt-28 pb-8 md:pb-12 relative z-10">
        <div className="gallery-eyebrow eyebrow opacity-0">The Gallery</div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-4">
          <h2 className="sec-title" style={{ perspective: '800px' }}>
            <span className="gallery-title-word inline-block opacity-0">Projects </span>
            <span className="gallery-title-word inline-block opacity-0">That </span>
            <br />
            <span className="gallery-title-word inline-block opacity-0">
              <em className="italic text-gold font-display">Leave</em>
            </span>{' '}
            <span className="gallery-title-word inline-block opacity-0">
              <em className="italic text-gold font-display">a Mark</em>
            </span>
          </h2>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/projects"
              className="gallery-viewall opacity-0 text-[0.65rem] tracking-[0.25em] uppercase text-mid no-underline flex items-center gap-2.5 hover:text-gold transition-colors group"
            >
              View All Projects
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
            </Link>
            <span className="gallery-counter opacity-0 text-[0.5rem] tracking-[0.3em] uppercase text-mid/30">
              {projects.length} Featured Works
            </span>
          </div>
        </div>

        {/* Progress bar — desktop only */}
        <div className="hidden md:block mt-10 h-px bg-white/[0.05] relative overflow-hidden">
          <div className="gallery-progress-fill absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-gold/50 to-gold/20 origin-left" />
        </div>
      </div>

      {/* Horizontal track (desktop) / Vertical stack (mobile) */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row gap-5 md:gap-8 px-6 md:px-16 pb-20 md:pb-16 relative z-10"
        style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
      >
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="gallery-card flex-shrink-0 w-full md:w-[42vw] lg:w-[33vw] group relative overflow-hidden no-underline"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="aspect-[3/4] relative overflow-hidden"
              style={{ background: cardGradients[i % 5] }}
            >
              {project.cover_url ? (
                <Image
                  src={project.cover_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="35%" height="35%" viewBox="0 0 200 300" fill="none" className="opacity-25">
                    <rect x="50" y="20" width="100" height="260" stroke="rgba(196,164,90,0.3)" strokeWidth="0.5" />
                    <rect x="70" y="80" width="20" height="15" fill="rgba(196,164,90,0.1)" />
                    <rect x="110" y="80" width="20" height="15" fill="rgba(196,164,90,0.1)" />
                    <rect x="70" y="120" width="20" height="15" fill="rgba(196,164,90,0.08)" />
                    <rect x="110" y="120" width="20" height="15" fill="rgba(196,164,90,0.08)" />
                    <rect x="85" y="230" width="30" height="50" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />
                  </svg>
                </div>
              )}

              {/* Multi-layer gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-40" />

              {/* Number watermark */}
              <span className="absolute top-5 md:top-8 left-5 md:left-8 font-display text-6xl md:text-8xl font-light text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-700 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Hover reveal bar at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-luxury origin-left" />

              {/* Info block */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <div className="overflow-hidden">
                  <span className="block text-[0.5rem] md:text-[0.55rem] tracking-[0.35em] uppercase text-gold mb-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-normal text-text leading-tight">
                  {project.title}
                </h3>
                <div className="overflow-hidden">
                  <p className="text-[0.65rem] md:text-[0.7rem] text-white/35 mt-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-75 ease-luxury">
                    {project.location} &middot; {project.year}
                  </p>
                </div>

                {/* Expanding line */}
                <div className="mt-5 h-px bg-white/0 group-hover:bg-gold/30 transition-all duration-700 w-0 group-hover:w-full" />
              </div>
            </div>
          </Link>
        ))}

        {/* CTA card */}
        <Link
          href="/projects"
          className="gallery-card flex-shrink-0 w-full md:w-[28vw] group no-underline"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="aspect-[3/4] border border-border flex flex-col items-center justify-center text-center px-8 hover:border-gold/20 transition-all duration-700 relative overflow-hidden">
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.02] transition-colors duration-700" />
            <span className="font-display text-5xl md:text-6xl font-light text-gold/15 group-hover:text-gold/30 mb-6 transition-colors duration-500">&rarr;</span>
            <h3 className="font-display text-xl font-light text-text mb-2">Explore All Work</h3>
            <p className="text-xs text-mid/50">View the full portfolio</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
