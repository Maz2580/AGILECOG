import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Setting } from '@/types'
import Navbar from '@/components/public/Navbar'
import Cursor from '@/components/public/Cursor'
import Loader from '@/components/public/Loader'

export const dynamic = 'force-dynamic'
import Footer from '@/components/public/Footer'
import ImmersiveScroll from '@/components/public/ImmersiveScroll'
import HeroImmersive from '@/components/public/HeroImmersive'
import DoorTransition from '@/components/public/DoorTransition'
import RoomDivider from '@/components/public/RoomDivider'
import InteractiveMosaic from '@/components/public/InteractiveMosaic'
import AboutImmersive from '@/components/public/AboutImmersive'
import ProcessImmersive from '@/components/public/ProcessImmersive'
import QuoteSection from '@/components/public/QuoteSection'
import ContactSection from '@/components/public/ContactSection'

export const revalidate = 60

async function getSettings(): Promise<Record<string, string>> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('settings').select('*')
  const map: Record<string, string> = {}
  data?.forEach((row: Setting) => { map[row.key] = row.value })
  return map
}

export default async function HomePage() {
  const settings = await getSettings()

  return (
    <>
      <Loader />
      <Cursor />
      <Navbar />

      <main>
        <ImmersiveScroll>
          {/* Room 1: The Approach — Hero zooms into building on scroll */}
          <HeroImmersive
            tagline={settings.hero_tagline || 'Architecture That Defines Tomorrow.'}
            subtitle={settings.hero_sub || 'We design spaces that transcend function — environments that inspire, endure, and become woven into the human story.'}
          />

          {/* Transition: Doors open revealing brand pillars */}
          <DoorTransition />

          {/* Room 2: The Gallery — Interactive puzzle mosaic of real work */}
          <RoomDivider label="The Gallery" number="I" />
          <InteractiveMosaic />

          {/* Room 3: The Studio — Who we are */}
          <RoomDivider label="The Studio" number="II" />
          <AboutImmersive />

          {/* Room 4: The Workshop — Our process */}
          <RoomDivider label="The Workshop" number="III" />
          <ProcessImmersive />

          {/* The Reflection — Quote */}
          <QuoteSection />

          {/* Room 5: The Parlour — Contact */}
          <RoomDivider label="The Parlour" number="IV" />
          <ContactSection />
        </ImmersiveScroll>
      </main>

      <Footer />
    </>
  )
}
