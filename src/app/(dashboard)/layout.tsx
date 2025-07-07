import { requireAuth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/specific/dashboard-sidebar'
import { DashboardHeader } from '@/components/specific/dashboard-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="lg:pl-64">
        <DashboardHeader user={user} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

