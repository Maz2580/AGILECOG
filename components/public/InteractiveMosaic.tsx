'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pieces = [
  { src: '/images/marble-bathroom.jpg', alt: 'Marble & Light', label: 'Bathroom', col: 'col-span-2', row: 'row-span-2', aspect: 'aspect-[3/4]' },
  { src: '/images/kitchen-marble.jpg', alt: 'Stone & Craft', label: 'Kitchen', col: 'col-span-1', row: 'row-span-1', aspect: 'aspect-square' },
  { src: '/images/bedroom-ambient.jpg', alt: 'Warmth & Rest', label: 'Bedroom', col: 'col-span-1', row: 'row-span-1', aspect: 'aspect-square' },
  { src: '/images/wardrobe-niche.jpg', alt: 'Form & Function', label: 'Wardrobe', col: 'col-span-1', row: 'row-span-1', aspect: 'aspect-square' },
  { src: '/images/timber-panel.jpg', alt: 'Timber & Glow', label: 'Joinery', col: 'col-span-1', row: 'row-span-1', aspect: 'aspect-square' },
  { src: '/images/kitchen-detail.jpg', alt: 'Detail & Finish', label: 'Kitchen Detail', col: 'col-span-2', row: 'row-span-1', aspect: 'aspect-[16/9]' },
  { src: '/images/bedroom-daylight.jpg', alt: 'Light & Space', label: 'Master Suite', col: 'col-span-1', row: 'row-span-2', aspect: 'aspect-[3/4]' },
]

export default function InteractiveMosaic() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([])
  const mousePos = useRef({ x: 0, y: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Mouse tracking for parallax displacement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance: pieces fly in from scattered positions
      pieceRefs.current.forEach((piece, idx) => {
        if (!piece) return
        gsap.fromTo(piece,
          {
            opacity: 0,
            scale: 0.7,
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.5) * 80 + 40,
            rotateZ: (Math.random() - 0.5) * 8,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotateZ: 0,
            duration: 1,
            delay: 0.1 * idx,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        )
      })

      // Continuous breathing animation for each piece
      pieceRefs.current.forEach((piece) => {
        if (!piece) return
        gsap.to(piece, {
          y: `${3 + Math.random() * 4}`,
          duration: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        })
      })
    }, sectionRef)

    // Mouse-reactive displacement — requestAnimationFrame loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!gridRef.current) return

      const rect = gridRef.current.getBoundingClientRect()
      const mx = mousePos.current.x
      const my = mousePos.current.y

      pieceRefs.current.forEach((piece) => {
        if (!piece) return
        const pieceRect = piece.getBoundingClientRect()
        const px = pieceRect.left + pieceRect.width / 2 - rect.left
        const py = pieceRect.top + pieceRect.height / 2 - rect.top

        const dx = mx - px
        const dy = my - py
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 400

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 15
          const moveX = -(dx / dist) * force
          const moveY = -(dy / dist) * force

          // Pieces push AWAY from cursor
          gsap.to(piece, {
            x: moveX,
            y: moveY,
            rotateX: (dy / maxDist) * -3,
            rotateY: (dx / maxDist) * 3,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } else {
          gsap.to(piece, {
            x: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      })
    }
    animate()

    return () => {
      ctx.revert()
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28" id="projects">
      {/* Golden glow visible through gaps */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-[80px]" />
      </div>

      {/* Header */}
      <div className="px-6 md:px-16 mb-12 md:mb-16">
        <div className="eyebrow reveal">The Gallery</div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-4">
          <h2 className="sec-title reveal">
            Spaces We&rsquo;ve<br />
            <em className="italic text-gold font-display">Brought to Life</em>
          </h2>
          <p className="text-sm text-mid/50 max-w-xs reveal">
            Move your cursor across the mosaic. Every piece is a room we designed.
          </p>
        </div>
      </div>

      {/* Interactive grid */}
      <div
        ref={gridRef}
        onMouseMove={handleMouseMove}
        className="px-4 md:px-12 lg:px-16"
        style={{ perspective: '1200px' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[180px] md:auto-rows-[220px]">
          {pieces.map((piece, i) => (
            <div
              key={i}
              ref={(el) => { pieceRefs.current[i] = el }}
              className={`${piece.col} ${piece.row} relative overflow-hidden cursor-pointer group`}
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  className={`object-cover transition-transform duration-700 ease-luxury ${
                    hoveredIndex === i ? 'scale-110' : 'scale-100'
                  }`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Dark overlay — lightens on hover */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                hoveredIndex === i
                  ? 'bg-black/20'
                  : hoveredIndex !== null
                    ? 'bg-black/60'
                    : 'bg-black/30'
              }`} />

              {/* Golden edge glow on hover */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                hoveredIndex === i ? 'opacity-100' : 'opacity-0'
              }`} style={{
                boxShadow: 'inset 0 0 30px rgba(196,164,90,0.15)',
              }} />

              {/* Top gold bar on hover */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gold transition-transform duration-500 ease-luxury origin-left ${
                hoveredIndex === i ? 'scale-x-100' : 'scale-x-0'
              }`} />

              {/* Label — reveals on hover */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 transition-all duration-500 ${
                hoveredIndex === i ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <span className="text-[0.5rem] tracking-[0.3em] uppercase text-gold block mb-1">
                  {piece.label}
                </span>
                <span className="font-display text-base md:text-lg font-light text-text">
                  {piece.alt}
                </span>
              </div>

              {/* Corner accent on hover */}
              <div className={`absolute top-3 right-3 transition-opacity duration-500 ${
                hoveredIndex === i ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-5 h-5">
                  <div className="absolute top-0 right-0 w-full h-px bg-gold/40" />
                  <div className="absolute top-0 right-0 w-px h-full bg-gold/40" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Caption */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/20" />
          <span className="text-[0.5rem] tracking-[0.4em] uppercase text-mid/30">
            Residential &middot; Interior &middot; Bespoke
          </span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/20" />
        </div>
      </div>
    </section>
  )
}
