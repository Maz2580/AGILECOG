import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import PublishToggle from './PublishToggle'

export default async function AdminProjectsList() {
  const supabase = createServerSupabaseClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-text">Projects</h1>
          <p className="text-sm text-mid mt-1">{projects?.length || 0} total projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-gold text-center flex items-center gap-2">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-bg2 border border-border rounded-xl overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Project</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Category</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Location</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Year</th>
                <th className="text-center p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Published</th>
                <th className="text-right p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.cover_url ? (
                          <Image
                            src={project.cover_url}
                            alt={project.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className="text-mid/30 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-text font-normal">{project.title}</p>
                          {project.featured && (
                            <span className="text-[0.55rem] tracking-wider uppercase text-gold">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-mid">{project.category}</td>
                    <td className="p-4 text-sm text-mid">{project.location}</td>
                    <td className="p-4 text-sm text-mid">{project.year}</td>
                    <td className="p-4 text-center">
                      <PublishToggle projectId={project.id} published={project.published} slug={project.slug} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-xs text-gold tracking-wider uppercase hover:text-text transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-mid/50 text-sm">
                    No projects yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block p-4 hover:bg-white/[0.02] transition-colors no-underline"
              >
                <div className="flex items-center gap-3">
                  {project.cover_url ? (
                    <Image
                      src={project.cover_url}
                      alt={project.title}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{project.title}</p>
                    <p className="text-xs text-mid">{project.category} &middot; {project.location} &middot; {project.year}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${project.published ? 'bg-green-400' : 'bg-mid/30'}`} />
                      <span className="text-[0.6rem] text-mid">{project.published ? 'Published' : 'Draft'}</span>
                      {project.featured && <span className="text-[0.55rem] text-gold uppercase">Featured</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-mid/50 text-sm">No projects yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
