'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'Studio' },
    { href: '#process', label: 'Process' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-[1000] px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between border-b border-border transition-all duration-500',
          scrolled ? 'bg-bg/95 backdrop-blur-xl' : 'bg-bg/85 backdrop-blur-sm'
        )}
      >
        <Link
          href="/"
          className="font-display text-lg md:text-xl font-medium tracking-[0.4em] uppercase text-text no-underline"
        >
          AGILECOG
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-8 xl:gap-11 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[0.68rem] tracking-[0.22em] uppercase text-mid no-underline relative transition-colors duration-300 hover:text-text group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden md:inline-block text-[0.68rem] tracking-[0.22em] uppercase border border-gold/50 text-gold px-5 py-2.5 no-underline transition-all duration-300 hover:bg-gold hover:text-bg"
          >
            Start a Project
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-text p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-[999] bg-bg/98 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 lg:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <ul className="list-none space-y-8 text-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl font-light text-text no-underline tracking-wider"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={() => setMobileOpen(false)}
          className="mt-12 btn-gold"
        >
          Start a Project
        </a>
      </div>
    </>
  )
}
