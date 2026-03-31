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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const [openPainting, setOpenPainting] = useState<number | null>(null)
  const gyro = useRef({ x: 0, y: 0 })
  const touchStart = useRef({ x: 0, y: 0 })

  const handleOpen = useCallback((index: number) => {
    setOpenPainting(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const handleClose = useCallback(() => {
    setOpenPainting(null)
    document.body.style.overflow = ''
  }, [])

  const handleNavigate = useCallback((i: number) => setOpenPainting(i), [])

  // ─── Golden particle canvas (atmosphere layer) ───
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return

    const resize = () => {
      canvas.width = canvas.clientWidth * 0.5 // half-res for perf
      canvas.height = canvas.clientHeight * 0.5
    }
    resize()
    window.addEventListener('resize', resize)

    // 80 golden dust particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 1.5,
      speedY: -0.1 - Math.random() * 0.3,
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: 0.1 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2,
    }))

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      ctx2d.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += 0.02

        // Wrap
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5

        const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse))
        ctx2d.beginPath()
        ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx2d.fillStyle = `rgba(196, 164, 90, ${alpha})`
        ctx2d.fill()
      })
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ─── Device gyroscope → painting tilt ───
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      gyro.current.x = (e.gamma || 0) / 45 // -1 to 1 range
      gyro.current.y = (e.beta || 0) / 45
    }
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  // ─── Continuous gyro-driven tilt animation ───
  useEffect(() => {
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      frameRefs.current.forEach((frame) => {
        if (!frame) return
        const tiltX = gyro.current.y * 3 // pitch → rotateX
        const tiltY = gyro.current.x * 4 // roll → rotateY
        frame.style.transform = `perspective(600px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`
      })
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  // ─── GSAP scroll animations ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const isLeft = paintings[i].wall === 'left'
        const isCenter = paintings[i].wall === 'center'

        // Cinematic entrance — 3D rotation + slide + scale
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isCenter ? 0 : isLeft ? -80 : 80,
            y: 60,
            scale: 0.8,
            rotateY: isCenter ? 0 : isLeft ? 15 : -15,
            rotateX: 5,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        )

        // Image parallax
        const img = card.querySelector('.painting-image')
        if (img) {
          gsap.fromTo(img,
            { yPercent: -10 },
            { yPercent: 10, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } }
          )
        }

        // Continuous floating — each painting gently drifts
        gsap.to(card, {
          y: `${4 + Math.random() * 5}`,
          x: `${(Math.random() - 0.5) * 3}`,
          duration: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        })

        // Golden glow pulse on scroll proximity
        const glow = card.querySelector('.painting-glow')
        const frameBorder = card.querySelector('.frame-border')
        if (glow) {
          gsap.fromTo(glow, { opacity: 0 }, {
            opacity: 1,
            scrollTrigger: { trigger: card, start: 'top 65%', end: 'top 35%', scrub: 1 },
          })
          gsap.to(glow, {
            opacity: 0,
            scrollTrigger: { trigger: card, start: 'bottom 65%', end: 'bottom 40%', scrub: 1 },
          })
        }
        // Frame brightens when centered
        if (frameBorder) {
          gsap.fromTo(frameBorder, { boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }, {
            boxShadow: '0 8px 40px rgba(196,164,90,0.15), 0 0 20px rgba(196,164,90,0.08)',
            scrollTrigger: { trigger: card, start: 'top 60%', end: 'top 35%', scrub: 1 },
          })
          gsap.to(frameBorder, {
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            scrollTrigger: { trigger: card, start: 'bottom 60%', end: 'bottom 40%', scrub: 1 },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ─── Touch drag for painting tilt ───
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent, i: number) => {
    const frame = frameRefs.current[i]
    if (!frame) return
    const dx = (e.touches[0].clientX - touchStart.current.x) / 100
    const dy = (e.touches[0].clientY - touchStart.current.y) / 100
    frame.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg) scale(1.02)`
    frame.style.transition = 'none'
  }, [])

  const handleTouchEnd = useCallback((i: number) => {
    const frame = frameRefs.current[i]
    if (!frame) return
    frame.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'
    frame.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
  }, [])

  return (
    <>
      <section ref={sectionRef} className="relative py-12 overflow-hidden" id="gallery">
        {/* Particle atmosphere canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ imageRendering: 'auto' }}
        />

        {/* Background ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[250px] h-[400px] rounded-full bg-gold/[0.025] blur-[70px]" />
          <div className="absolute top-[45%] left-[20%] w-[200px] h-[300px] rounded-full bg-gold/[0.015] blur-[80px]" />
          <div className="absolute top-[75%] right-[15%] w-[180px] h-[280px] rounded-full bg-gold/[0.02] blur-[60px]" />
        </div>

        {/* Vertical corridor lines (wall edges) */}
        <div className="absolute top-0 left-2 w-px h-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 5%, rgba(196,164,90,0.06) 20%, rgba(196,164,90,0.06) 80%, transparent 95%)' }} />
        <div className="absolute top-0 right-2 w-px h-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 5%, rgba(196,164,90,0.06) 20%, rgba(196,164,90,0.06) 80%, transparent 95%)' }} />

        {/* Header */}
        <div className="relative z-20 px-5 mb-10">
          <div className="text-[0.5rem] tracking-[0.45em] uppercase text-gold/40 mb-3">
            The Grand Gallery
          </div>
          <h2 className="font-display text-2xl font-light text-text leading-[1.15]">
            Walk Through<br />
            <em className="italic text-gold">Our Rooms</em>
          </h2>
          <p className="text-[0.6rem] text-mid/40 mt-3 max-w-[220px] leading-relaxed">
            Drag to tilt. Tap to step inside.
          </p>
        </div>

        {/* Crown molding */}
        <div className="relative z-20 mx-4 mb-8">
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.3), rgba(196,164,90,0.05) 50%, rgba(196,164,90,0.3))' }} />
          <div className="h-[2px] w-full mt-[2px]" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.1), rgba(196,164,90,0.02) 50%, rgba(196,164,90,0.1))' }} />
        </div>

        {/* Paintings */}
        <div className="relative z-20 space-y-14 px-3">
          {paintings.map((p, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              className="relative"
              style={{ perspective: '800px' }}
              onTouchStart={(e) => handleTouchStart(e)}
              onTouchMove={(e) => handleTouchMove(e, i)}
              onTouchEnd={() => handleTouchEnd(i)}
              onClick={() => handleOpen(i)}
              role="button"
              tabIndex={0}
              aria-label={`View ${p.label} — ${p.room}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(i) }}
            >
              {/* Volumetric spotlight from above */}
              <div
                className="painting-glow absolute -top-8 left-1/2 -translate-x-1/2 w-[75%] h-16 pointer-events-none opacity-0"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 0%, transparent 30%, rgba(196,164,90,0.06) 50%, transparent 70%)',
                  filter: 'blur(6px)',
                }}
              />

              {/* Sconce fixture */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <div className="w-4 h-2 rounded-b-full mx-auto"
                  style={{ background: 'linear-gradient(180deg, rgba(196,164,90,0.25), rgba(196,164,90,0.08))' }} />
                <div className="w-1 h-3 mx-auto"
                  style={{ background: 'rgba(196,164,90,0.12)' }} />
              </div>

              {/* 3D-tiltable frame */}
              <div
                ref={(el) => { frameRefs.current[i] = el }}
                className="relative mx-auto"
                style={{
                  maxWidth: p.wall === 'center' ? '90%' : '85%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                {/* Outer gilded frame */}
                <div
                  className="frame-border p-[5px] sm:p-[6px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(201,168,76,0.3), rgba(139,105,20,0.45), rgba(201,168,76,0.3))',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,130,0.15)',
                  }}
                >
                  {/* Cove */}
                  <div className="p-[3px]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(30,22,10,0.9), rgba(50,38,18,0.7))',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Liner */}
                    <div className="p-[2px]"
                      style={{ background: 'linear-gradient(145deg, rgba(196,164,90,0.2), rgba(139,105,20,0.12))' }}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-[4/5]">
                        <div className="painting-image absolute inset-[-12%] w-[124%] h-[124%]">
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            className="object-cover"
                            sizes="90vw"
                          />
                        </div>
                        {/* Varnish */}
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(180deg, rgba(196,164,90,0.02) 0%, rgba(0,0,0,0.06) 100%)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D shadow layer behind frame (depth) */}
                <div className="absolute inset-0 -z-10"
                  style={{
                    transform: 'translateZ(-10px)',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 5px 20px rgba(0,0,0,0.3)',
                  }}
                />
              </div>

              {/* Brass plaque */}
              <div className="mt-3 text-center">
                <div className="inline-block px-4 py-1.5 rounded-[2px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(196,164,90,0.1), rgba(139,105,20,0.06))',
                    border: '1px solid rgba(196,164,90,0.12)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  }}
                >
                  <div className="text-[0.45rem] tracking-[0.35em] uppercase text-gold/60 mb-0.5">{p.room}</div>
                  <div className="font-display text-xs font-light text-text/80 italic">{p.label}</div>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div className="relative w-3.5 h-3.5">
                    <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" style={{ animationDuration: '2.5s' }} />
                    <div className="absolute inset-[2px] rounded-full border border-gold/40" />
                    <div className="absolute inset-[4px] rounded-full bg-gold/20" />
                  </div>
                  <span className="text-[0.45rem] tracking-[0.2em] uppercase text-gold/30">Tap to explore</span>
                </div>
              </div>

              {/* Wall indicator */}
              {p.wall !== 'center' && (
                <div className={`absolute top-[15%] bottom-[25%] ${p.wall === 'left' ? '-left-1.5' : '-right-1.5'} w-[2px] rounded-full`}
                  style={{ background: 'linear-gradient(180deg, transparent, rgba(196,164,90,0.12), transparent)' }} />
              )}
            </div>
          ))}

          {/* Video alcove */}
          <div className="relative mx-auto" style={{ maxWidth: '90%' }}>
            <div className="text-center mb-4">
              <div className="text-[0.45rem] tracking-[0.45em] uppercase text-gold/35">The Showreel</div>
            </div>
            <div className="p-[5px] overflow-hidden"
              style={{
                borderRadius: '40% 40% 4px 4px / 12% 12% 0% 0%',
                background: 'linear-gradient(145deg, rgba(201,168,76,0.25), rgba(139,105,20,0.35), rgba(201,168,76,0.25))',
                boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
              }}
            >
              <div className="p-[3px]"
                style={{ borderRadius: '40% 40% 2px 2px / 12% 12% 0% 0%', background: 'linear-gradient(180deg, rgba(30,22,10,0.9), rgba(50,38,18,0.7))' }}
              >
                <div className="overflow-hidden"
                  style={{ borderRadius: '38% 38% 2px 2px / 11% 11% 0% 0%', aspectRatio: '4/3' }}
                >
                  <video src="/videos/showreel.mp4" muted loop playsInline autoPlay preload="metadata" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="inline-block px-4 py-1 rounded-[2px]"
                style={{ background: 'linear-gradient(145deg, rgba(196,164,90,0.06), rgba(139,105,20,0.04))', border: '1px solid rgba(196,164,90,0.08)' }}
              >
                <span className="text-[0.45rem] tracking-[0.3em] uppercase text-gold/40 font-display italic">A Glimpse Inside</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baseboard */}
        <div className="relative z-20 mx-4 mt-10">
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.1), rgba(196,164,90,0.02) 50%, rgba(196,164,90,0.1))' }} />
          <div className="h-px w-full mt-[2px]" style={{ background: 'linear-gradient(90deg, rgba(196,164,90,0.3), rgba(196,164,90,0.05) 50%, rgba(196,164,90,0.3))' }} />
        </div>
      </section>

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
