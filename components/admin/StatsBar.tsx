'use client'

interface StatCardProps {
  label: string
  value: string | number
  accent?: boolean
}

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-bg2 border border-border rounded-xl p-6">
      <p className={`font-display text-3xl font-light ${accent ? 'text-gold' : 'text-text'}`}>
        {value}
      </p>
      <p className="text-[0.65rem] tracking-[0.2em] uppercase text-mid mt-2">{label}</p>
    </div>
  )
}

interface StatsBarProps {
  totalProjects: number
  publishedProjects: number
  newEnquiries: number
}

export default function StatsBar({ totalProjects, publishedProjects, newEnquiries }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Projects" value={totalProjects} />
      <StatCard label="Published" value={publishedProjects} accent />
      <StatCard label="New Enquiries" value={newEnquiries} accent />
      <StatCard label="Featured" value={totalProjects > 0 ? Math.min(5, totalProjects) : 0} />
    </div>
  )
}
