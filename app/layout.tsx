import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AGILECOG — Architecture Studio',
    template: '%s | AGILECOG',
  },
  description: 'We design spaces that transcend function — environments that inspire, endure, and become woven into the human story.',
  keywords: ['architecture', 'design', 'studio', 'residential', 'commercial', 'cultural'],
  openGraph: {
    title: 'AGILECOG — Architecture Studio',
    description: 'Architecture That Defines Tomorrow.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body font-light">
        {children}
      </body>
    </html>
  )
}
