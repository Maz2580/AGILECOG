'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/types'

const categories = ['All', 'Residential', 'Commercial', 'Cultural', 'Hospitality', 'Public']

interface ProjectsFilterGridProps {
  projects: Project[]
}

export default function ProjectsFilterGrid({ projects }: ProjectsFilterGridProps) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div className="px-6 md:px-16">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 mb-10 md:mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 text-[0.65rem] tracking-[0.2em] uppercase transition-all duration-300 border ${
              active === cat
                ? 'border-gold text-gold bg-gold/10'
                : 'border-border text-mid hover:text-text hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block group relative overflow-hidden no-underline"
              >
                <div className="aspect-[4/3] bg-bg2 relative overflow-hidden">
                  {project.cover_url ? (
                    <Image
                      src={project.cover_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `var(--card${(Math.abs(project.title.charCodeAt(0)) % 5) + 1})` }}>
                      <svg width="40%" height="40%" viewBox="0 0 100 100" fill="none">
                        <rect x="20" y="20" width="60" height="60" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />
                        <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(196,164,90,0.1)" strokeWidth="0.3" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[0.55rem] tracking-[0.3em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 block mb-1">
                    {project.category}
                  </span>
                  <h3 className="font-display text-lg font-normal text-text">{project.title}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{project.location} &middot; {project.year}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-mid/50 py-20">No projects in this category yet.</p>
      )}
    </div>
  )
}
