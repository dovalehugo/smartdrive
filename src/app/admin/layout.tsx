import { requireAdmin } from '@/lib/auth'
import { DashboardSidebar } from '@/components/specific/dashboard-sidebar'
import { DashboardHeader } from '@/components/specific/dashboard-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="lg:pl-64">
        <DashboardHeader user={user} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white">
                <h1 className="text-xl font-bold">Panel de Administración</h1>
                <p className="text-purple-100 text-sm">
                  Gestiona usuarios, archivos y configuraciones del sistema
                </p>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

