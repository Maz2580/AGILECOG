'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface GalleryPaintingProps {
  src: string
  alt: string
  label: string
  room: string
  index: number
  wall: 'left' | 'right' | 'center'
  onOpen: (index: number) => void
  proximity: number // 0 = far, 1 = closest
}

export default function GalleryPainting({
  src,
  alt,
  label,
  room,
  index,
  wall,
  onOpen,
  proximity,
}: GalleryPaintingProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = useCallback(() => {
    onOpen(index)
  }, [index, onOpen])

  // Proximity drives glow intensity — closer = brighter
  const glowIntensity = Math.min(1, proximity * 1.5)
  const warmLight = glowIntensity * 0.15

  return (
    <div
      ref={frameRef}
      className={`gallery-painting relative cursor-pointer group ${
        wall === 'left' ? 'self-start' : wall === 'right' ? 'self-end' : 'self-center'
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: wall === 'center' ? '70%' : '55%',
        maxWidth: wall === 'center' ? '600px' : '460px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
        transform: isHovered ? 'translateZ(20px) scale(1.02)' : 'translateZ(0) scale(1)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${label} — ${room}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      {/* ─── WALL SHADOW (painting casts shadow on wall) ─── */}
      <div
        className="absolute -inset-4 rounded-sm pointer-events-none transition-opacity duration-700"
        style={{
          boxShadow: `0 8px 40px rgba(0,0,0,${0.4 + glowIntensity * 0.2}), 0 2px 12px rgba(0,0,0,0.3)`,
          opacity: 1,
        }}
      />

      {/* ─── OUTER FRAME (gilded rim) ─── */}
      <div
        className="relative p-[6px] sm:p-[8px] md:p-[12px] transition-all duration-500"
        style={{
          background: `linear-gradient(145deg,
            rgba(201,168,76,${0.25 + warmLight}) 0%,
            rgba(139,105,20,${0.35 + warmLight}) 25%,
            rgba(201,168,76,${0.45 + warmLight}) 50%,
            rgba(139,105,20,${0.3 + warmLight}) 75%,
            rgba(201,168,76,${0.25 + warmLight}) 100%)`,
          boxShadow: isHovered
            ? `0 0 30px rgba(196,164,90,0.25), inset 0 1px 0 rgba(255,220,130,0.3), inset 0 -1px 0 rgba(0,0,0,0.4)`
            : `inset 0 1px 0 rgba(255,220,130,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        {/* ─── INNER FRAME (cove — concave shadow) ─── */}
        <div
          className="p-[3px] sm:p-[4px] md:p-[6px]"
          style={{
            background: `linear-gradient(180deg, rgba(40,30,15,0.9), rgba(60,45,20,0.7))`,
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 3px rgba(196,164,90,0.1)',
          }}
        >
          {/* ─── LINER (flat gold strip) ─── */}
          <div
            className="p-[2px] sm:p-[3px]"
            style={{
              background: `linear-gradient(145deg, rgba(196,164,90,${0.2 + warmLight}), rgba(139,105,20,${0.15 + warmLight}))`,
            }}
          >
            {/* ─── PAINTING ─── */}
            <div className="relative overflow-hidden aspect-[4/5]">
              <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-all duration-700 ease-luxury ${
                  isHovered ? 'scale-105 brightness-110' : `brightness-${glowIntensity > 0.5 ? '90' : '75'}`
                }`}
                sizes="(max-width: 768px) 80vw, 40vw"
              />

              {/* Warm varnish overlay — paintings aren't perfectly clear */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: isHovered
                    ? 'linear-gradient(180deg, rgba(196,164,90,0.02) 0%, rgba(0,0,0,0.05) 100%)'
                    : `linear-gradient(180deg, rgba(196,164,90,0.04) 0%, rgba(0,0,0,${0.2 - glowIntensity * 0.1}) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── BRASS PLAQUE ─── */}
      <div
        className={`mt-3 sm:mt-4 mx-auto text-center transition-all duration-500 ${
          isHovered || proximity > 0.6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ maxWidth: '80%' }}
      >
        <div
          className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-[2px]"
          style={{
            background: 'linear-gradient(145deg, rgba(196,164,90,0.12), rgba(139,105,20,0.08))',
            border: '1px solid rgba(196,164,90,0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,220,130,0.08)',
          }}
        >
          <div className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.35em] uppercase text-gold/70 mb-0.5">
            {room}
          </div>
          <div className="font-display text-xs sm:text-sm font-light text-text/90 italic">
            {label}
          </div>
        </div>
      </div>

      {/* ─── SPOTLIGHT from above (museum lighting) ─── */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-[120%] h-8 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 100%, rgba(196,164,90,${0.04 + glowIntensity * 0.06}) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : glowIntensity,
        }}
      />
    </div>
  )
}
