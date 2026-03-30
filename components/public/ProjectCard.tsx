'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMotionValue, useTransform, motion } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  large?: boolean
  wide?: boolean
}

export default function ProjectCard({ project, index, large, wide }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const cardGradients = [
    'linear-gradient(145deg,#101828 0%,#0b1018 100%)',
    'linear-gradient(145deg,#1a1008 0%,#100a04 100%)',
    'linear-gradient(155deg,#0d1e1a 0%,#071410 100%)',
    'linear-gradient(140deg,#18100a 0%,#0e0906 100%)',
    'linear-gradient(135deg,#14101a 0%,#0c0a12 100%)',
  ]

  return (
    <Link href={`/projects/${project.slug}`} className="no-underline">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 900,
        }}
        className={`reveal relative overflow-hidden bg-bg2 cursor-pointer group ${
          large ? 'row-span-2' : ''
        } ${wide ? 'col-span-1 md:col-span-2' : ''}`}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div
          className={`w-full transition-transform duration-700 ease-luxury group-hover:scale-105 ${
            large ? 'h-[400px] md:h-[580px]' : 'h-[280px] md:h-[300px]'
          }`}
          style={{ background: cardGradients[index % 5] }}
        >
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes={large ? '(max-width: 768px) 100vw, 45vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <svg width="60%" height="60%" viewBox="0 0 200 200" fill="none">
                <rect x="40" y="20" width="120" height="160" stroke="rgba(196,164,90,0.3)" strokeWidth="0.5" />
                <rect x="60" y="60" width="30" height="20" fill="rgba(196,164,90,0.1)" />
                <rect x="110" y="60" width="30" height="20" fill="rgba(196,164,90,0.1)" />
                <rect x="60" y="100" width="30" height="20" fill="rgba(196,164,90,0.08)" />
                <rect x="110" y="100" width="30" height="20" fill="rgba(196,164,90,0.08)" />
                <rect x="80" y="140" width="40" height="40" stroke="rgba(196,164,90,0.2)" strokeWidth="0.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            {project.category}
          </span>
          <h3 className={`font-display font-normal leading-tight ${large ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {project.title}
          </h3>
          <p className="text-[0.7rem] text-white/40 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
            {project.location} &middot; {project.year}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
