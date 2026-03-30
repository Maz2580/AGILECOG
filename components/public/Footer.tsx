import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-8 border-t border-border bg-bg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <Link
          href="/"
          className="font-display text-sm font-medium tracking-[0.4em] uppercase text-mid no-underline"
        >
          AGILECOG
        </Link>

        <p className="text-[0.62rem] tracking-[0.15em] text-mid/40 text-center">
          &copy; {new Date().getFullYear()} AGILECOG. All rights reserved.
        </p>

        <div className="flex gap-7">
          <a
            href="#"
            className="text-[0.62rem] tracking-[0.2em] uppercase text-mid/50 no-underline hover:text-gold transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-[0.62rem] tracking-[0.2em] uppercase text-mid/50 no-underline hover:text-gold transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-[0.62rem] tracking-[0.2em] uppercase text-mid/50 no-underline hover:text-gold transition-colors"
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  )
}
