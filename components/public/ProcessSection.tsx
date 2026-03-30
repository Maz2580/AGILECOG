'use client'

import { useReveal } from '@/lib/useReveal'

const steps = [
  {
    num: '01',
    title: 'Discovery',
    body: 'We begin by understanding the site, context, and your vision. Deep research informs every design decision from day one.',
  },
  {
    num: '02',
    title: 'Concept',
    body: 'Ideas take shape through sketches, models, and spatial studies. We explore multiple directions before committing to form.',
  },
  {
    num: '03',
    title: 'Development',
    body: 'Technical precision meets creative intent. Materials, systems, and details are resolved with engineering rigour.',
  },
  {
    num: '04',
    title: 'Realisation',
    body: 'We guide construction with an unwavering eye for quality, ensuring the built outcome honours the design vision.',
  },
]

export default function ProcessSection() {
  useReveal()

  return (
    <section className="section-padding bg-bg2" id="process">
      <div className="eyebrow reveal">How We Work</div>
      <h2 className="sec-title mt-4 mb-12 md:mb-16 reveal">
        A Process Built on<br />
        <em className="italic text-gold font-display">Rigour</em>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`py-8 pr-6 border-t border-border lg:border-r lg:last:border-r-0 hover:border-t-gold transition-colors duration-400 reveal`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <span className="font-display text-4xl md:text-5xl font-light text-gold/15 leading-none mb-6 block transition-colors duration-400 hover:text-gold/35">
              {step.num}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-normal mb-3">{step.title}</h3>
            <p className="text-[0.8rem] leading-[1.85] text-mid">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
