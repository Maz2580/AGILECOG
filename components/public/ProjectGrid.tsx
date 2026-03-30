'use client'

import ProjectCard from './ProjectCard'
import type { Project } from '@/types'
import { useReveal } from '@/lib/useReveal'

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  useReveal()

  return (
    <section className="section-padding" id="projects">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 md:mb-16 gap-4">
        <div>
          <div className="eyebrow reveal">Selected Work</div>
          <h2 className="sec-title mt-4 reveal">
            Projects That<br />
            <em className="italic text-gold font-display">Leave a Mark</em>
          </h2>
        </div>
        <a
          href="/projects"
          className="text-[0.65rem] tracking-[0.25em] uppercase text-mid no-underline flex items-center gap-2.5 hover:text-gold transition-colors group reveal"
        >
          View All Projects
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
        </a>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {projects.slice(0, 5).map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              large={i === 0}
              wide={i === 3}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-mid/50">Projects coming soon</p>
        </div>
      )}
    </section>
  )
}
