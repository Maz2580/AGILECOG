'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

interface HeroImmersiveProps {
  tagline: string
  subtitle: string
}

export default function HeroImmersive({ subtitle }: HeroImmersiveProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline({ delay: 2.2 })

    tl.fromTo('.hero-tag-immersive', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.hero-title-immersive', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-body-immersive', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-cta-immersive', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')

    // Scroll-driven zoom effect: as user scrolls, camera pushes into the building
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Scale up the Three.js scene (zoom into building)
      scrollTl.to(canvasWrapRef.current, {
        scale: 2.5,
        opacity: 0.3,
        duration: 1,
        ease: 'power2.in',
      }, 0)

      // Fade out hero content
      scrollTl.to(contentRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      }, 0)

      // Dark overlay rises
      scrollTl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.4
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen overflow-hidden">
      {/* Three.js scene — scales on scroll */}
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 origin-center"
        style={{ willChange: 'transform' }}
      >
        <HeroScene />
      </div>

      {/* Spotlight */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 600px at var(--mx, 50%) var(--my, 50%), transparent 0%, rgba(7,7,7,0.6) 100%)',
        }}
      />

      {/* Dark overlay for scroll transition */}
      <div ref={overlayRef} className="absolute inset-0 z-[3] bg-bg opacity-0 pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative z-[2] h-full flex items-center px-6 md:px-16">
        <div className="max-w-3xl mt-10">
          <div className="hero-tag-immersive opacity-0 text-[0.6rem] md:text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-6 md:mb-7 flex items-center gap-3.5">
            <span className="w-7 md:w-9 h-px bg-gold inline-block" />
            Architecture Studio
          </div>

          <h1
            className="hero-title-immersive opacity-0 font-display font-light leading-[1.04] mb-8 md:mb-9"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 6.5rem)' }}
          >
            Architecture<br />
            That <em className="italic text-gold">Defines</em><br />
            Tomorrow.
          </h1>

          <p className="hero-body-immersive opacity-0 text-sm md:text-[0.88rem] leading-[1.9] text-mid max-w-md">
            {subtitle}
          </p>

          <div className="hero-cta-immersive opacity-0 mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
            <a href="#projects" className="btn-gold text-center">View Our Work</a>
            <a href="#contact" className="btn-ghost text-center">Get in Touch</a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint opacity-0 absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2.5">
        <div className="w-5 h-8 rounded-full border border-gold/30 flex justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-gold/60 rounded-full animate-bounce" />
        </div>
        <span className="text-[0.5rem] tracking-[0.4em] uppercase text-mid/40">Scroll to Enter</span>
      </div>
    </section>
  )
}
