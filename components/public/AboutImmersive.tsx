'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function AboutImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: '.about-header', start: 'top 75%' },
      })
      headerTl
        .fromTo('.about-eyebrow', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo('.about-title-line', { y: 80, opacity: 0, rotateX: 15 }, {
          y: 0, opacity: 1, rotateX: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
        }, 0.2)

      // Text paragraphs
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

      // Pull quote
      const quoteTl = gsap.timeline({
        scrollTrigger: { trigger: '.about-pullquote', start: 'top 75%' },
      })
      quoteTl
        .fromTo('.about-quote-border', { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power2.out' })
        .fromTo('.about-quote-text', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.3)
        .fromTo('.about-quote-source', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)

      // Image mosaic reveals
      gsap.utils.toArray<HTMLElement>('.about-img').forEach((img, i) => {
        gsap.fromTo(img,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: img, start: 'top 85%' },
          }
        )
      })

      // Video section
      gsap.fromTo('.about-video-wrap',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-video-wrap', start: 'top 80%' },
        }
      )

      // Parallax on the mosaic
      gsap.to('.about-mosaic-inner', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.about-mosaic', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Text */}
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

        {/* Right: Real project images mosaic + video */}
        <div className="about-mosaic relative lg:mt-16 space-y-3">
          <div className="about-mosaic-inner space-y-3">
            {/* Top row: 2 images */}
            <div className="grid grid-cols-2 gap-3">
              <div className="about-img relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/marble-bathroom.jpg"
                  alt="Luxury bathroom with Calacatta marble"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </div>
              <div className="about-img relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/kitchen-marble.jpg"
                  alt="Kitchen with marble and timber detailing"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </div>
            </div>

            {/* Wide image */}
            <div className="about-img relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/bedroom-ambient.jpg"
                alt="Ambient bedroom with warm lighting"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
              <span className="absolute bottom-4 left-4 text-[0.5rem] tracking-[0.3em] uppercase text-gold/50">
                Material &middot; Light &middot; Space
              </span>
            </div>

            {/* Video showreel */}
            <div className="about-video-wrap relative aspect-video overflow-hidden opacity-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/showreel.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-bg/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gold/40 flex items-center justify-center mb-3 mx-auto backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" fill="rgba(196,164,90,0.8)" className="w-5 h-5 ml-0.5">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <span className="text-[0.5rem] tracking-[0.35em] uppercase text-gold/50">Our Craft</span>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6">
                <div className="absolute top-0 left-0 w-full h-px bg-gold/20" />
                <div className="absolute top-0 left-0 w-px h-full bg-gold/20" />
              </div>
              <div className="absolute bottom-3 right-3 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gold/20" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-gold/20" />
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="about-img relative aspect-square overflow-hidden">
                <Image
                  src="/images/wardrobe-niche.jpg"
                  alt="Custom wardrobe with illuminated niche"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes="(max-width: 1024px) 33vw, 17vw"
                />
              </div>
              <div className="about-img relative aspect-square overflow-hidden">
                <Image
                  src="/images/timber-panel.jpg"
                  alt="Backlit timber feature panel"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes="(max-width: 1024px) 33vw, 17vw"
                />
              </div>
              <div className="about-img relative aspect-square overflow-hidden">
                <Image
                  src="/images/kitchen-detail.jpg"
                  alt="Kitchen marble detailing"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes="(max-width: 1024px) 33vw, 17vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
