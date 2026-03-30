import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Project } from '@/types'
import Navbar from '@/components/public/Navbar'
import Cursor from '@/components/public/Cursor'
import Footer from '@/components/public/Footer'

export const dynamic = 'force-dynamic'
import ProjectsFilterGrid from './ProjectsFilterGrid'

export const revalidate = 60

export const metadata = {
  title: 'Projects',
  description: 'Explore our portfolio of architectural projects spanning residential, commercial, cultural, and hospitality.',
}

export default async function ProjectsPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false })

  const projects = (data as Project[]) || []

  return (
    <>
      <Cursor />
      <Navbar />

      <main className="pt-28 md:pt-32 pb-20 min-h-screen">
        <div className="px-6 md:px-16 mb-12 md:mb-16">
          <div className="eyebrow">Portfolio</div>
          <h1 className="sec-title mt-4">
            All <em className="italic text-gold font-display">Projects</em>
          </h1>
        </div>

        <ProjectsFilterGrid projects={projects} />
      </main>

      <Footer />
    </>
  )
}
