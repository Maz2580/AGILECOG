'use client'

import { useState, useEffect } from 'react'

export default function Loader() {
  const [done, setDone] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2200)
    const hideTimer = setTimeout(() => setHidden(true), 3200)
    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (hidden) return null

  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center gap-8 transition-opacity duration-700 ${
        done ? 'opacity-0 pointer-events-none' : ''
      }`}
    >
      <div
        className="font-display text-3xl md:text-4xl font-light tracking-[0.7em] uppercase text-text opacity-0 animate-fade-in"
        style={{ animationDelay: '0.3s' }}
      >
        AGILECOG
      </div>
      <div className="w-44 h-px bg-white/10">
        <div className="h-full bg-gold animate-load-bar" style={{ animationDelay: '0.3s' }} />
      </div>
      <div
        className="text-[0.6rem] tracking-[0.4em] uppercase text-mid opacity-0 animate-fade-in"
        style={{ animationDelay: '1.2s' }}
      >
        Architecture Studio
      </div>
    </div>
  )
}
