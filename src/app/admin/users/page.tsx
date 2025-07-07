"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/types'
import { formatFileSize, formatDate } from '@/lib/utils'
import { 
  Search, 
  Users, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  Trash2,
  Edit
} from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchQuery])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchQuery
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data)
        setTotalPages(result.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      // Note: This would need to be implemented in the API
      alert('Funcionalidad de eliminación pendiente de implementar')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar el usuario')
    }
  }

  const getStoragePercentage = (used: number, limit: number) => {
    return limit > 0 ? (used / limit) * 100 : 0
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administra todos los usuarios del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{users.length} usuarios</span>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar usuarios por nombre o email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Información detallada de todos los usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Los usuarios aparecerán aquí cuando se registren'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Almacenamiento</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Registro</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const storagePercentage = getStoragePercentage(user.storage_used, user.storage_limit)
                    
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.full_name || 'Sin nombre'}
                              </p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserIcon className="h-3 w-3 mr-1" />
                                Usuario
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{formatFileSize(user.storage_used)}</span>
                              <span className="text-gray-500">
                                / {formatFileSize(user.storage_limit)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  storagePercentage > 90 ? 'bg-red-500' : 
                                  storagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {storagePercentage.toFixed(1)}% usado
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.role !== 'admin' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

