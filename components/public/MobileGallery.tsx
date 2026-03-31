'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PaintingLightbox from './PaintingLightbox'

gsap.registerPlugin(ScrollTrigger)

const paintings = [
  { src: '/images/marble-bathroom.jpg', label: 'Marble & Light', room: 'Bathroom', alt: 'Marble & Light', wall: 'left' as const },
  { src: '/images/kitchen-marble.jpg', label: 'Stone & Craft', room: 'Kitchen', alt: 'Stone & Craft', wall: 'right' as const },
  { src: '/images/bedroom-ambient.jpg', label: 'Warmth & Rest', room: 'Bedroom', alt: 'Warmth & Rest', wall: 'left' as const },
  { src: '/images/wardrobe-niche.jpg', label: 'Form & Function', room: 'Wardrobe', alt: 'Form & Function', wall: 'right' as const },
  { src: '/images/timber-panel.jpg', label: 'Timber & Glow', room: 'Joinery', alt: 'Timber & Glow', wall: 'left' as const },
  { src: '/images/kitchen-detail.jpg', label: 'Detail & Finish', room: 'Kitchen Detail', alt: 'Detail & Finish', wall: 'right' as const },
  { src: '/images/bedroom-daylight.jpg', label: 'Light & Space', room: 'Master Suite', alt: 'Light & Space', wall: 'center' as const },
]

export default function MobileGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [openPainting, setOpenPainting] = useState<number | null>(null)

  const handleOpen = useCallback((index: number) => {
    setOpenPainting(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const handleClose = useCallback(() => {
    setOpenPainting(null)
    document.body.style.overflow = ''
  }, [])

  const handleNavigate = useCallback((i: number) => setOpenPainting(i), [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const isLeft = paintings[i].wall === 'left'
        const isCenter = paintings[i].wall === 'center'

        // Each painting slides in from the side + scales up
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isCenter ? 0 : isLeft ? -60 : 60,
            y: 40,
            scale: 0.88,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        )

        // Parallax on the image inside — moves slower than the card
        const img = card.querySelector('.painting-image')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          )
        }

        // Golden spotlight glow intensifies as card reaches center of viewport
        const glow = card.querySelector('.painting-glow')
        if (glow) {
          gsap.fromTo(
            glow,
            { opacity: 0 },
            {
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1,
              },
            }
          )
          gsap.to(glow, {
            opacity: 0,
            scrollTrigger: {
              trigger: card,
              start: 'bottom 60%',
              end: 'bottom 40%',
              scrub: 1,
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="relative py-12 overflow-hidden" id="gallery">
        {/* Background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[400px] rounded-full bg-gold/[0.02] blur-[60px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[250px] h-[350px] rounded-full bg-gold/[0.015] blur-[80px]" />
        </div>

        {/* Header */}
        <div className="px-5 mb-10">
          <div className="text-[0.5rem] tracking-[0.45em] uppercase text-gold/40 mb-3">
            The Grand Gallery
          </div>
          <h2 className="font-display text-2xl font-light text-text leading-[1.15]">
            Walk Through<br />
            <em className="italic text-gold">Our Rooms</em>
          </h2>
          <p className="text-[0.65rem] text-mid/40 mt-3 max-w-[240px] leading-relaxed">
            Tap any painting to step inside and explore the full design.
          </p>
        </div>

        {/* Crown molding line */}
        <div className="mx-5 mb-6">
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.25), rgba(196,164,90,0.05) 50%, rgba(196,164,90,0.25))' }} />
        </div>

        {/* Paintings */}
        <div className="space-y-10 px-4">
          {paintings.map((p, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              className="relative"
              onClick={() => handleOpen(i)}
              role="button"
              tabIndex={0}
              aria-label={`View ${p.label} — ${p.room}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(i) }}
            >
              {/* Museum spotlight from above */}
              <div
                className="painting-glow absolute -top-6 left-1/2 -translate-x-1/2 w-[80%] h-12 pointer-events-none opacity-0"
                style={{
                  background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(196,164,90,0.08) 0%, transparent 70%)',
                }}
              />

              {/* Ornate frame */}
              <div
                className="relative mx-auto overflow-hidden"
                style={{ maxWidth: p.wall === 'center' ? '92%' : '88%' }}
              >
                {/* Outer gilded frame */}
                <div
                  className="p-[5px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(201,168,76,0.3), rgba(139,105,20,0.4), rgba(201,168,76,0.3))',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,130,0.15)',
                  }}
                >
                  {/* Inner cove (dark shadow) */}
                  <div
                    className="p-[3px]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(30,22,10,0.9), rgba(50,38,18,0.7))',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Gold liner */}
                    <div
                      className="p-[2px]"
                      style={{ background: 'linear-gradient(145deg, rgba(196,164,90,0.18), rgba(139,105,20,0.12))' }}
                    >
                      {/* Image container */}
                      <div className="relative overflow-hidden aspect-[4/5]">
                        <div className="painting-image absolute inset-[-10%] w-[120%] h-[120%]">
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            className="object-cover"
                            sizes="90vw"
                          />
                        </div>

                        {/* Warm varnish overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(180deg, rgba(196,164,90,0.02) 0%, rgba(0,0,0,0.08) 100%)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brass plaque below frame */}
              <div className="mt-3 text-center">
                <div
                  className="inline-block px-4 py-1.5 rounded-[2px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(196,164,90,0.1), rgba(139,105,20,0.06))',
                    border: '1px solid rgba(196,164,90,0.12)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  }}
                >
                  <div className="text-[0.45rem] tracking-[0.35em] uppercase text-gold/60 mb-0.5">
                    {p.room}
                  </div>
                  <div className="font-display text-xs font-light text-text/80 italic">
                    {p.label}
                  </div>
                </div>

                {/* Tap hint — pulsing ring */}
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div className="relative w-3.5 h-3.5">
                    <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" style={{ animationDuration: '2.5s' }} />
                    <div className="absolute inset-[2px] rounded-full border border-gold/40" />
                    <div className="absolute inset-[4px] rounded-full bg-gold/20" />
                  </div>
                  <span className="text-[0.45rem] tracking-[0.2em] uppercase text-gold/30">
                    Tap to explore
                  </span>
                </div>
              </div>

              {/* Side wall indicator — which wall the painting is on */}
              {p.wall !== 'center' && (
                <div className={`absolute top-1/2 -translate-y-1/2 ${p.wall === 'left' ? '-left-1' : '-right-1'} w-[3px] h-[40%] rounded-full`}
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(196,164,90,0.15), transparent)',
                  }}
                />
              )}
            </div>
          ))}

          {/* Video alcove — inline for mobile */}
          <div className="relative mx-auto" style={{ maxWidth: '92%' }}>
            <div className="text-center mb-4">
              <div className="text-[0.45rem] tracking-[0.45em] uppercase text-gold/35">
                The Showreel
              </div>
            </div>
            <div
              className="p-[5px] overflow-hidden"
              style={{
                borderRadius: '40% 40% 4px 4px / 12% 12% 0% 0%',
                background: 'linear-gradient(145deg, rgba(201,168,76,0.25), rgba(139,105,20,0.35), rgba(201,168,76,0.25))',
                boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
              }}
            >
              <div
                className="p-[3px]"
                style={{
                  borderRadius: '40% 40% 2px 2px / 12% 12% 0% 0%',
                  background: 'linear-gradient(180deg, rgba(30,22,10,0.9), rgba(50,38,18,0.7))',
                }}
              >
                <div
                  className="overflow-hidden"
                  style={{
                    borderRadius: '38% 38% 2px 2px / 11% 11% 0% 0%',
                    aspectRatio: '4/3',
                  }}
                >
                  <video
                    src="/videos/showreel.mp4"
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <div
                className="inline-block px-4 py-1 rounded-[2px]"
                style={{
                  background: 'linear-gradient(145deg, rgba(196,164,90,0.06), rgba(139,105,20,0.04))',
                  border: '1px solid rgba(196,164,90,0.08)',
                }}
              >
                <span className="text-[0.45rem] tracking-[0.3em] uppercase text-gold/40 font-display italic">
                  A Glimpse Inside
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Baseboard line */}
        <div className="mx-5 mt-10">
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.25), rgba(196,164,90,0.05) 50%, rgba(196,164,90,0.25))' }} />
        </div>
      </section>

      {/* Lightbox — same experience on mobile */}
      {openPainting !== null && (
        <PaintingLightbox
          painting={paintings[openPainting]}
          index={openPainting}
          paintings={paintings}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </>
  )
}
