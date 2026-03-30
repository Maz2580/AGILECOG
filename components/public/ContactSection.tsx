'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validators'
import { Check, Loader2, Send } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left side reveals
      const leftTl = gsap.timeline({
        scrollTrigger: { trigger: '.contact-left-content', start: 'top 75%' },
      })
      leftTl
        .fromTo('.contact-eyebrow', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('.contact-title-line', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, 0.2)
        .fromTo('.contact-detail', { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, 0.5)

      // Right side: form fields stagger in
      const formTl = gsap.timeline({
        scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 70%' },
      })
      formTl
        .fromTo('.contact-form-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('.form-field', { y: 30, opacity: 0, x: 15 }, { y: 0, opacity: 1, x: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, 0.2)
        .fromTo('.form-submit-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')

      // Diagonal divider line
      gsap.fromTo('.contact-divider',
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Something went wrong')
      }
      setSubmitted(true)

      // Success particle burst
      gsap.fromTo('.success-particle',
        { scale: 0, opacity: 1, x: 0, y: 0 },
        {
          scale: () => Math.random() * 2 + 0.5,
          opacity: 0,
          x: () => `random(-100, 100)`,
          y: () => `random(-100, -30)`,
          duration: 1,
          stagger: 0.02,
          ease: 'power2.out',
        }
      )
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send')
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="grid grid-cols-1 lg:grid-cols-2 relative">
      {/* Divider line — desktop */}
      <div className="contact-divider hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent origin-top z-10" />

      {/* Left — Info */}
      <div className="contact-left-content px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-bg2 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="contact-eyebrow eyebrow opacity-0">The Parlour</div>
          <h2 className="sec-title mt-4 mb-10 md:mb-14">
            <div className="overflow-hidden">
              <span className="contact-title-line block opacity-0">Let&rsquo;s Build</span>
            </div>
            <div className="overflow-hidden">
              <span className="contact-title-line block opacity-0">
                <em className="italic text-gold font-display">Something</em> Great
              </span>
            </div>
          </h2>

          <div className="space-y-8">
            {[
              { label: 'Studio', value: 'AGILECOG Architecture\nDesign & Innovation Studio' },
              { label: 'Email', value: 'hello@agilecog.fyi' },
              { label: 'Follow', value: null, links: true },
            ].map((detail, i) => (
              <div key={i} className="contact-detail opacity-0">
                <span className="text-[0.55rem] md:text-[0.6rem] tracking-[0.35em] uppercase text-gold/70 mb-2 block">
                  {detail.label}
                </span>
                {detail.links ? (
                  <div className="flex gap-6">
                    {['Instagram', 'LinkedIn', 'Behance'].map((s) => (
                      <a key={s} href="#" className="text-sm text-mid hover:text-gold transition-colors duration-300">
                        {s}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-mid leading-relaxed whitespace-pre-line">{detail.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Decorative element */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-[0.55rem] tracking-[0.3em] uppercase text-mid/25">
              Architecture &middot; Interior &middot; Urban Design
            </p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="contact-form-wrap px-6 md:px-12 lg:px-16 py-20 md:py-28 bg-bg flex flex-col justify-center relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gold/[0.015] blur-3xl pointer-events-none" />

        {submitted ? (
          <div className="text-center relative z-10">
            {/* Success particles */}
            <div className="relative inline-block">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="success-particle absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-gold"
                  style={{ transform: 'scale(0)' }}
                />
              ))}
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-8 border border-gold/20">
                <Check className="text-gold" size={32} />
              </div>
            </div>
            <h3 className="font-display text-3xl font-light mb-4">Message Sent</h3>
            <p className="text-sm text-mid leading-relaxed">
              Thank you for reaching out. We&rsquo;ll review your enquiry<br className="hidden md:block" />
              and get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="relative z-10">
            <h3 className="contact-form-title font-display text-2xl md:text-3xl font-light mb-10 md:mb-12 opacity-0">
              Start a Conversation
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-8">
                {[
                  { name: 'name' as const, label: 'Name', type: 'text', placeholder: 'Your name', required: true, full: false },
                  { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'your@email.com', required: true, full: false },
                  { name: 'phone' as const, label: 'Phone', type: 'tel', placeholder: '+61 400 000 000', required: false, full: false },
                ].map((field) => (
                  <div key={field.name} className={`form-field opacity-0 flex flex-col gap-2 ${field.full ? 'sm:col-span-2' : ''}`}>
                    <label className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase text-mid/70">
                      {field.label} {field.required && <span className="text-gold/50">*</span>}
                    </label>
                    <input
                      {...register(field.name)}
                      type={field.type}
                      className="bg-transparent border-b border-border text-text py-3 outline-none text-sm transition-all duration-300 focus:border-gold focus:pl-1 placeholder:text-mid/20"
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && <span className="text-red-400/80 text-xs">{errors[field.name]?.message}</span>}
                  </div>
                ))}

                <div className="form-field opacity-0 flex flex-col gap-2">
                  <label className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase text-mid/70">Project Type</label>
                  <select
                    {...register('project_type')}
                    className="bg-transparent border-b border-border text-text py-3 outline-none text-sm transition-all duration-300 focus:border-gold appearance-none"
                  >
                    <option value="" className="bg-bg">Select type...</option>
                    {['Residential', 'Commercial', 'Cultural', 'Hospitality', 'Other'].map((t) => (
                      <option key={t} value={t} className="bg-bg">{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field opacity-0 sm:col-span-2 flex flex-col gap-2">
                  <label className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase text-mid/70">
                    Message <span className="text-gold/50">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    className="bg-transparent border-b border-border text-text py-3 outline-none text-sm transition-all duration-300 focus:border-gold focus:pl-1 resize-none h-28 placeholder:text-mid/20"
                    placeholder="Tell us about your project vision..."
                  />
                  {errors.message && <span className="text-red-400/80 text-xs">{errors.message.message}</span>}
                </div>
              </div>

              {submitError && <p className="text-red-400/80 text-sm mt-4">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-submit-btn opacity-0 mt-10 px-10 py-4 bg-gold text-bg font-body text-[0.65rem] md:text-[0.68rem] tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-85 hover:shadow-[0_0_30px_rgba(196,164,90,0.15)] disabled:opacity-50 flex items-center gap-3 group"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending...</>
                ) : (
                  <>
                    Send Message
                    <Send size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
