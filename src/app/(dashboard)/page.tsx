import { getUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadZone } from '@/components/specific/upload-zone'
import { 
  FolderIcon, 
  FileIcon, 
  Upload, 
  HardDrive,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const user = await getUser()

  // Mock data - will be replaced with real data from database
  const stats = {
    totalFiles: 0,
    totalFolders: 0,
    storageUsed: user?.storage_used || 0,
    storageLimit: user?.storage_limit || 5 * 1024 * 1024 * 1024,
    recentUploads: 0
  }

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              ¡Bienvenido, {user?.full_name || 'Usuario'}!
            </h1>
            <p className="text-blue-100 mt-1">
              Gestiona tus archivos de forma fácil y segura
            </p>
          </div>
          <div className="hidden md:block">
            <Image
              src="/hero-illustration.png"
              alt="Dashboard illustration"
              width={120}
              height={80}
              className="opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Archivos</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              archivos almacenados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carpetas</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
            <p className="text-xs text-muted-foreground">
              carpetas creadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storagePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              de {Math.round(stats.storageLimit / (1024 * 1024 * 1024))}GB usado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subidas Recientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">
              en los últimos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Subir Archivos</span>
            </CardTitle>
            <CardDescription>
              Arrastra y suelta archivos o haz clic para seleccionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadZone className="h-48" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/upload">
              <Button className="w-full justify-start" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Subir Archivos
              </Button>
            </Link>
            
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Crear Carpeta
            </Button>
            
            <Link href="/dashboard/search">
              <Button className="w-full justify-start" variant="outline">
                <FileIcon className="mr-2 h-4 w-4" />
                Buscar Archivos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {stats.totalFiles === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Image
              src="/empty-state.png"
              alt="No files"
              width={200}
              height={200}
              className="mx-auto mb-4 opacity-60"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Comienza a subir tus archivos!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Tu espacio de almacenamiento está vacío. Sube tu primer archivo para comenzar a organizar tu contenido digital.
            </p>
            <Link href="/dashboard/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Subir Primer Archivo
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

