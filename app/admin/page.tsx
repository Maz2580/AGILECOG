import { createServerSupabaseClient } from '@/lib/supabase/server'
import StatsBar from '@/components/admin/StatsBar'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()

  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: newEnquiries },
    { data: recentEnquiries },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-text">Dashboard</h1>
          <p className="text-sm text-mid mt-1">Welcome back to AGILECOG admin</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="btn-gold text-center"
        >
          New Project
        </Link>
      </div>

      <StatsBar
        totalProjects={totalProjects || 0}
        publishedProjects={publishedProjects || 0}
        newEnquiries={newEnquiries || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-bg2 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-light">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-gold tracking-wider uppercase">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentEnquiries && recentEnquiries.length > 0 ? (
              recentEnquiries.map((eq) => (
                <div key={eq.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-text">{eq.name}</p>
                    <p className="text-xs text-mid">{eq.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[0.6rem] uppercase tracking-wider ${
                      eq.status === 'new' ? 'bg-gold/15 text-gold' :
                      eq.status === 'read' ? 'bg-blue-500/15 text-blue-400' :
                      eq.status === 'replied' ? 'bg-green-500/15 text-green-400' :
                      'bg-white/5 text-mid'
                    }`}>
                      {eq.status}
                    </span>
                    <p className="text-[0.6rem] text-mid/50 mt-1">{formatDate(eq.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-mid/50 py-4 text-center">No enquiries yet</p>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-bg2 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-light">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-gold tracking-wider uppercase">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded transition-colors no-underline"
                >
                  <div>
                    <p className="text-sm text-text">{project.title}</p>
                    <p className="text-xs text-mid">{project.category} &middot; {project.location}</p>
                  </div>
                  <span className={`inline-block w-2 h-2 rounded-full ${project.published ? 'bg-green-400' : 'bg-mid/30'}`} />
                </Link>
              ))
            ) : (
              <p className="text-sm text-mid/50 py-4 text-center">No projects yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
