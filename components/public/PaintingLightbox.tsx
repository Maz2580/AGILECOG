'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

interface PaintingData {
  src: string
  alt: string
  label: string
  room: string
}

interface PaintingLightboxProps {
  painting: PaintingData
  index: number
  paintings: PaintingData[]
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function PaintingLightbox({
  painting,
  index,
  paintings,
  onClose,
  onNavigate,
}: PaintingLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const topBarRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    tl.fromTo(topBarRef.current, { y: '-100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' }, 0.1)
    tl.fromTo(bottomBarRef.current, { y: '100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' }, 0.1)
    tl.fromTo(imageRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.2)
    tl.fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.5)
    tl.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6)

    return () => { tl.kill() }
  }, [])

  // Close with animation
  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(textRef.current, { y: 20, opacity: 0, duration: 0.2 })
    tl.to(navRef.current, { opacity: 0, duration: 0.2 }, 0)
    tl.to(imageRef.current, { scale: 0.85, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1)
    tl.to(topBarRef.current, { y: '-100%', duration: 0.35, ease: 'power2.in' }, 0.15)
    tl.to(bottomBarRef.current, { y: '100%', duration: 0.35, ease: 'power2.in' }, 0.15)
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, 0.25)
  }, [onClose])

  // Navigate between paintings
  const goPrev = useCallback(() => {
    const prev = (index - 1 + paintings.length) % paintings.length
    onNavigate(prev)
  }, [index, paintings.length, onNavigate])

  const goNext = useCallback(() => {
    const next = (index + 1) % paintings.length
    onNavigate(next)
  }, [index, paintings.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClose, goPrev, goNext])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Cinematic letterbox bars */}
      <div
        ref={topBarRef}
        className="absolute top-0 left-0 right-0 h-[10vh] sm:h-[12vh] bg-black z-10"
      />
      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 right-0 h-[10vh] sm:h-[12vh] bg-black z-10"
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-[12vh] right-4 sm:top-[13vh] sm:right-8 z-30 w-10 h-10 flex items-center justify-center text-text/50 hover:text-gold transition-colors duration-300"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4L16 16M16 4L4 16" />
        </svg>
      </button>

      {/* Main image */}
      <div
        ref={imageRef}
        className="relative z-20 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-h-[65vh]"
      >
        {/* Ornate frame */}
        <div
          className="p-[6px] sm:p-[10px]"
          style={{
            background: 'linear-gradient(145deg, rgba(201,168,76,0.35), rgba(139,105,20,0.5), rgba(201,168,76,0.35))',
            boxShadow: '0 0 60px rgba(196,164,90,0.15), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,130,0.2)',
          }}
        >
          <div
            className="p-[4px] sm:p-[6px]"
            style={{
              background: 'linear-gradient(180deg, rgba(30,22,10,0.95), rgba(50,38,18,0.8))',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            <div className="p-[2px] sm:p-[3px]" style={{ background: 'linear-gradient(145deg, rgba(196,164,90,0.2), rgba(139,105,20,0.15))' }}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={painting.src}
                  alt={painting.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, 45vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text info */}
      <div ref={textRef} className="absolute bottom-[12vh] sm:bottom-[14vh] left-0 right-0 z-20 text-center px-4">
        <div className="text-[0.55rem] tracking-[0.5em] uppercase text-gold/50 mb-2">
          {painting.room}
        </div>
        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-light italic text-text">
          {painting.label}
        </h3>
        <div className="mt-3 text-[0.55rem] tracking-[0.3em] uppercase text-mid/40">
          {index + 1} / {paintings.length}
        </div>
      </div>

      {/* Navigation arrows */}
      <div ref={navRef} className="absolute inset-0 z-20 pointer-events-none">
        {/* Previous */}
        <button
          onClick={goPrev}
          className="pointer-events-auto absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-text/30 hover:text-gold transition-colors duration-300"
          aria-label="Previous painting"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M15 4L7 12L15 20" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={goNext}
          className="pointer-events-auto absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-text/30 hover:text-gold transition-colors duration-300"
          aria-label="Next painting"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M9 4L17 12L9 20" />
          </svg>
        </button>
      </div>
    </div>
  )
}
