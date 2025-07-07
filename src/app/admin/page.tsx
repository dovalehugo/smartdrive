"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminStats } from '@/types'
import { formatFileSize } from '@/lib/utils'
import { 
  Users, 
  FileIcon, 
  HardDrive, 
  TrendingUp, 
  UserPlus,
  Activity
} from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error al cargar las estadísticas</p>
      </div>
    )
  }

  const totalStorageGB = stats.totalStorage / (1024 * 1024 * 1024)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              usuarios registrados
            </p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Almacenamiento Total</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorageGB.toFixed(2)} GB</div>
            <p className="text-xs text-muted-foreground">
              espacio utilizado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              últimos 30 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Actividad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              usuarios activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de Almacenamiento por Tipo</CardTitle>
          <CardDescription>
            Distribución del espacio utilizado según el tipo de archivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.storageUsageByType).map(([type, size]) => {
              const percentage = stats.totalStorage > 0 ? (size / stats.totalStorage) * 100 : 0
              const typeNames = {
                images: 'Imágenes',
                videos: 'Videos',
                audio: 'Audio',
                documents: 'Documentos',
                others: 'Otros'
              }
              
              const colors = {
                images: 'bg-blue-500',
                videos: 'bg-red-500',
                audio: 'bg-green-500',
                documents: 'bg-yellow-500',
                others: 'bg-gray-500'
              }

              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[type as keyof typeof colors]}`} />
                    <span className="text-sm font-medium">
                      {typeNames[type as keyof typeof typeNames]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[type as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-20 text-right">
                      {formatFileSize(size)}
                    </span>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona el sistema desde aquí
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/admin/users"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Gestionar Usuarios</h4>
                  <p className="text-sm text-gray-600">Ver, editar y eliminar usuarios</p>
                </div>
              </div>
            </a>
            
            <div className="p-3 border border-gray-200 rounded-lg opacity-50">
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-500">Configuración del Sistema</h4>
                  <p className="text-sm text-gray-400">Próximamente disponible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del Sistema</CardTitle>
            <CardDescription>
              Estado general de SmartDrive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado del sistema:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Promedio archivos/usuario:</span>
                <span className="text-sm font-medium">
                  {stats.totalUsers > 0 ? (stats.totalFiles / stats.totalUsers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Almacenamiento promedio:</span>
                <span className="text-sm font-medium">
                  {stats.totalUsers > 0 ? formatFileSize(stats.totalStorage / stats.totalUsers) : '0 B'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

