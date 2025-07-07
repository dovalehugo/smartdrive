"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileCard } from '@/components/specific/file-card'
import { FolderCard } from '@/components/specific/folder-card'
import { FileItem, Folder, ViewMode, SearchFilters } from '@/types'
import { 
  Search, 
  Grid3X3, 
  List, 
  Plus, 
  FolderIcon,
  Upload,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    dateRange: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  useEffect(() => {
    fetchData()
  }, [currentFolder, filters])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch folders
      const foldersResponse = await fetch(`/api/folders?parentId=${currentFolder || ''}`)
      const foldersResult = await foldersResponse.json()
      
      if (foldersResult.success) {
        setFolders(foldersResult.data)
      }

      // Fetch files
      const params = new URLSearchParams({
        folderId: currentFolder || '',
        search: filters.query,
        type: filters.type,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const filesResponse = await fetch(`/api/files?${params}`)
      const filesResult = await filesResponse.json()
      
      if (filesResult.success) {
        setFiles(filesResult.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters(prev => ({ ...prev, query }))
  }

  const handleFolderOpen = (folder: Folder) => {
    setCurrentFolder(folder.id)
  }

  const handleCreateFolder = async () => {
    const name = prompt('Nombre de la nueva carpeta:')
    if (!name) return

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          parent_id: currentFolder
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setFolders(prev => [...prev, result.data])
      } else {
        alert(result.error || 'Error al crear la carpeta')
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('Error al crear la carpeta')
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

  const handleFileDownload = (file: FileItem) => {
    if (file.public_url) {
      window.open(file.public_url, '_blank')
    }
  }

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Archivos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y organiza todos tus archivos
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateFolder} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Carpeta
          </Button>
          <Button asChild>
            <a href="/dashboard/upload">
              <Upload className="h-4 w-4 mr-2" />
              Subir Archivos
            </a>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar archivos..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="image">Imágenes</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documentos</option>
              </select>
              
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
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
        </CardContent>
      </Card>

      {/* Content */}
      {folders.length === 0 && files.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron resultados' : 'Esta carpeta está vacía'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza subiendo archivos o creando carpetas'
              }
            </p>
            {!searchQuery && (
              <div className="flex justify-center space-x-4">
                <Button onClick={handleCreateFolder} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Carpeta
                </Button>
                <Button asChild>
                  <a href="/dashboard/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Archivos
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Folders */}
          {folders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Carpetas</h2>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onOpen={handleFolderOpen}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200">
                  {folders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onOpen={handleFolderOpen}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Files */}
          {files.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Archivos</h2>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleFileDelete}
                      onDownload={handleFileDownload}
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
                      onDelete={handleFileDelete}
                      onDownload={handleFileDownload}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

