'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import MobileGallery from './MobileGallery'

// Desktop 3D gallery — loaded only on desktop, SSR disabled (Three.js)
const GrandGallery = dynamic(() => import('./GrandGallery'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-[0.5rem] tracking-[0.4em] uppercase text-gold/20 animate-pulse">
        Preparing the gallery...
      </div>
    </div>
  ),
})

export default function GallerySwitch() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Avoid rendering anything during SSR / first paint (prevents hydration mismatch)
  if (isMobile === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[0.5rem] tracking-[0.4em] uppercase text-gold/20 animate-pulse">
          Preparing the gallery...
        </div>
      </div>
    )
  }

  return isMobile ? <MobileGallery /> : <GrandGallery />
}
