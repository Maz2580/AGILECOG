'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import type { Project } from '@/types'
import { ArrowLeft } from 'lucide-react'

interface ProjectDetailProps {
  project: Project
  nextProject: { slug: string; title: string; cover_url: string | null; category: string } | null
}

export default function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  useEffect(() => {
    gsap.fromTo('.proj-hero-img', { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'power3.out' })
    gsap.fromTo('.proj-hero-content > *', { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.3,
    })
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="proj-hero-img absolute inset-0">
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full" style={{ background: 'var(--card1)' }} />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        <div className="proj-hero-content absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12 md:pb-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.25em] uppercase text-mid mb-6 no-underline hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> All Projects
          </Link>
          <span className="block text-[0.6rem] tracking-[0.35em] uppercase text-gold mb-3">
            {project.category}
          </span>
          <h1 className="font-display font-light leading-[1.08]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-lg text-mid/70 mt-3 font-light">{project.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-mid">
            <span>{project.location}</span>
            <span>&middot;</span>
            <span>{project.year}</span>
            <span>&middot;</span>
            <span>{project.category}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-16 py-16 md:py-24 max-w-4xl">
        {project.description && (
          <p className="text-lg md:text-xl leading-relaxed text-text/80 mb-12 font-light">
            {project.description}
          </p>
        )}

        {project.story && (
          <div className="prose-like space-y-6 text-sm md:text-base leading-[1.9] text-mid">
            {project.story.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="px-6 md:px-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.images.map((url, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={url}
                  alt={`${project.title} — Image ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-luxury"
                  sizes={i === 0 ? '100vw' : '50vw'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Project */}
      {nextProject && (
        <Link
          href={`/projects/${nextProject.slug}`}
          className="block border-t border-border hover:bg-white/[0.02] transition-colors no-underline group"
        >
          <div className="px-6 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[0.6rem] tracking-[0.35em] uppercase text-gold block mb-2">Next Project</span>
              <h2 className="font-display text-3xl md:text-4xl font-light group-hover:text-gold transition-colors">
                {nextProject.title}
              </h2>
              <span className="text-sm text-mid mt-1 block">{nextProject.category}</span>
            </div>
            <span className="text-gold text-2xl transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
          </div>
        </Link>
      )}
    </div>
  )
}
