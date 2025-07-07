"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileCard } from '@/components/specific/file-card'
import { FilePreview } from '@/components/specific/file-preview'
import { FileItem, SearchFilters } from '@/types'
import { 
  Search, 
  Filter, 
  Calendar,
  FileType,
  SortAsc,
  SortDesc,
  Grid3X3,
  List
} from 'lucide-react'

export default function SearchPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    dateRange: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  useEffect(() => {
    if (filters.query.trim()) {
      searchFiles()
    } else {
      setFiles([])
    }
  }, [filters])

  const searchFiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: filters.query,
        type: filters.type,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const response = await fetch(`/api/files?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setFiles(result.data)
      }
    } catch (error) {
      console.error('Error searching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }))
  }

  const handleFilePreview = (file: FileItem) => {
    setPreviewFile(file)
  }

  const handleFileDownload = (file: FileItem) => {
    if (file.public_url) {
      window.open(file.public_url, '_blank')
    }
  }

  const handleFileDelete = async (file: FileItem) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        setFiles(prev => prev.filter(f => f.id !== file.id))
      } else {
        alert(result.error || 'Error al eliminar el archivo')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error al eliminar el archivo')
    }
  }

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buscar Archivos</h1>
        <p className="text-gray-600 mt-1">
          Encuentra rápidamente cualquier archivo en tu biblioteca
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Búsqueda Avanzada</span>
          </CardTitle>
          <CardDescription>
            Utiliza filtros para encontrar exactamente lo que buscas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre de archivo..."
              value={filters.query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de archivo
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="image">Imágenes</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documentos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Cualquier fecha</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="created_at">Fecha de subida</option>
                <option value="name">Nombre</option>
                <option value="size">Tamaño</option>
                <option value="type">Tipo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vista
              </label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="flex-1"
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                <div className="flex border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !filters.query.trim() ? (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comienza a buscar
            </h3>
            <p className="text-gray-600">
              Escribe el nombre de un archivo para comenzar la búsqueda
            </p>
          </CardContent>
        </Card>
      ) : files.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 mb-4">
              No hay archivos que coincidan con tu búsqueda "{filters.query}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters(prev => ({ ...prev, query: '', type: 'all', dateRange: 'all' }))}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la búsqueda</CardTitle>
            <CardDescription>
              {files.length} archivo{files.length !== 1 ? 's' : ''} encontrado{files.length !== 1 ? 's' : ''} para "{filters.query}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={handleFilePreview}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={handleFilePreview}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* File Preview Modal */}
      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleFileDownload}
      />
    </div>
  )
}

