import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin | AGILECOG',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-6 md:p-8 lg:p-10 pt-16 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  )
}
