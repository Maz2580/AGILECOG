'use client'

import { useReveal } from '@/lib/useReveal'

export default function AboutSection() {
  useReveal()

  return (
    <section className="section-padding" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="eyebrow reveal">Our Philosophy</div>
          <h2 className="sec-title mt-4 mb-8 reveal">
            Where Vision<br />
            Meets <em className="italic text-gold font-display">Precision</em>
          </h2>
          <div className="space-y-5 text-sm md:text-[0.9rem] leading-[1.95] text-mid reveal">
            <p>
              At AGILECOG, we believe architecture is more than shelter — it is a language
              spoken through light, material, and space. Every project begins with listening:
              to the land, the community, and the aspiration that drives creation.
            </p>
            <p>
              Our studio brings together architects, engineers, and environmental designers
              who share a relentless curiosity. We do not follow trends — we study forces.
              Climate, culture, human behaviour, structural poetry.
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-border reveal">
            <p className="font-display text-xl md:text-2xl font-light italic text-text leading-relaxed">
              &ldquo;We don&rsquo;t design buildings. We design the moments that happen inside them.&rdquo;
            </p>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden reveal">
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(155deg, #0f1820 0%, #080d14 100%)' }}>
            <svg width="55%" height="55%" viewBox="0 0 200 250" fill="none">
              <rect x="30" y="40" width="140" height="190" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />
              <rect x="50" y="60" width="100" height="80" stroke="rgba(196,164,90,0.15)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="30" stroke="rgba(196,164,90,0.12)" strokeWidth="0.4" />
              <line x1="30" y1="150" x2="170" y2="150" stroke="rgba(196,164,90,0.1)" strokeWidth="0.3" />
              <rect x="70" y="160" width="60" height="70" fill="rgba(196,164,90,0.05)" stroke="rgba(196,164,90,0.15)" strokeWidth="0.4" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
          <span className="absolute bottom-8 left-8 text-[0.62rem] tracking-[0.3em] uppercase text-gold">
            Est. 2008
          </span>
        </div>
      </div>
    </section>
  )
}
