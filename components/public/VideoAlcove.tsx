'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoAlcove() {
  const alcoveRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Alcove fades and scales in as you approach
      gsap.fromTo(
        alcoveRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: alcoveRef.current,
            start: 'top 75%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )

      // Auto-play video when visible
      ScrollTrigger.create({
        trigger: alcoveRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => videoRef.current?.play(),
        onLeave: () => videoRef.current?.pause(),
        onEnterBack: () => videoRef.current?.play(),
        onLeaveBack: () => videoRef.current?.pause(),
      })
    }, alcoveRef)

    return () => ctx.revert()
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div ref={alcoveRef} className="w-full max-w-[600px] mx-auto my-16 sm:my-20 md:my-28 px-4">
      {/* Alcove label */}
      <div className="text-center mb-6">
        <div className="text-[0.5rem] tracking-[0.5em] uppercase text-gold/40">
          The Showreel
        </div>
      </div>

      {/* Arched frame */}
      <div className="relative">
        {/* Outer arch */}
        <div
          className="relative p-[6px] sm:p-[8px] md:p-[10px]"
          style={{
            borderRadius: '50% 50% 4px 4px / 20% 20% 0% 0%',
            background: 'linear-gradient(145deg, rgba(201,168,76,0.3), rgba(139,105,20,0.4), rgba(201,168,76,0.3))',
            boxShadow: '0 0 50px rgba(196,164,90,0.1), 0 15px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,130,0.15)',
          }}
        >
          {/* Inner shadow */}
          <div
            className="p-[4px] sm:p-[5px]"
            style={{
              borderRadius: '50% 50% 2px 2px / 20% 20% 0% 0%',
              background: 'linear-gradient(180deg, rgba(30,22,10,0.9), rgba(50,38,18,0.7))',
              boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.7)',
            }}
          >
            {/* Gold liner */}
            <div
              className="p-[2px]"
              style={{
                borderRadius: '50% 50% 2px 2px / 20% 20% 0% 0%',
                background: 'linear-gradient(145deg, rgba(196,164,90,0.15), rgba(139,105,20,0.1))',
              }}
            >
              {/* Video container */}
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: '50% 50% 2px 2px / 18% 18% 0% 0%',
                  aspectRatio: '4/3',
                }}
              >
                <video
                  ref={videoRef}
                  src="/videos/showreel.mp4"
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />

                {/* Warm overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(196,164,90,0.03) 0%, rgba(0,0,0,0.1) 100%)',
                  }}
                />

                {/* Mute toggle */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full text-text/60 hover:text-gold transition-colors duration-300 z-10"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M23 9l-6 6M17 9l6 6" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Keystone at the top of the arch */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-6 sm:w-10 sm:h-7"
          style={{
            background: 'linear-gradient(180deg, rgba(201,168,76,0.35), rgba(139,105,20,0.25))',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />

        {/* Recessed shadow inside (depth illusion) */}
        <div
          className="absolute inset-[10px] pointer-events-none"
          style={{
            borderRadius: '50% 50% 2px 2px / 18% 18% 0% 0%',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Small plaque below alcove */}
      <div className="text-center mt-4">
        <div
          className="inline-block px-5 py-1.5 rounded-[2px]"
          style={{
            background: 'linear-gradient(145deg, rgba(196,164,90,0.08), rgba(139,105,20,0.05))',
            border: '1px solid rgba(196,164,90,0.1)',
          }}
        >
          <span className="text-[0.5rem] tracking-[0.3em] uppercase text-gold/50 font-display italic">
            A Glimpse Inside
          </span>
        </div>
      </div>
    </div>
  )
}
