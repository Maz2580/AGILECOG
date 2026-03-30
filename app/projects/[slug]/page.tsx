import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Project } from '@/types'
import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'

export const dynamic = 'force-dynamic'
import Cursor from '@/components/public/Cursor'
import Footer from '@/components/public/Footer'
import ProjectDetail from './ProjectDetail'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: project } = await supabase
    .from('projects')
    .select('title, description, cover_url')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!project) return { title: 'Project Not Found' }

  return {
    title: project.title,
    description: project.description || `${project.title} — AGILECOG Architecture`,
    openGraph: {
      title: `${project.title} | AGILECOG`,
      description: project.description || undefined,
      images: project.cover_url ? [project.cover_url] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!project) notFound()

  // Get next project for "Next Project" teaser
  const { data: nextProjects } = await supabase
    .from('projects')
    .select('slug, title, cover_url, category')
    .eq('published', true)
    .neq('id', project.id)
    .order('sort_order', { ascending: true })
    .limit(1)

  const nextProject = nextProjects?.[0] || null

  return (
    <>
      <Cursor />
      <Navbar />

      <main>
        <ProjectDetail project={project as Project} nextProject={nextProject} />
      </main>

      <Footer />
    </>
  )
}
