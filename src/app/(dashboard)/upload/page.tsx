"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadZone } from '@/components/specific/upload-zone'
import { FileCard } from '@/components/specific/file-card'
import { UploadProgress, FileItem } from '@/types'
import { Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function UploadPage() {
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesSelected = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }))

    setUploadQueue(prev => [...prev, ...newUploads])
    await processUploads(newUploads)
  }

  const processUploads = async (uploads: UploadProgress[]) => {
    setIsUploading(true)

    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i]
      
      // Update status to uploading
      setUploadQueue(prev => 
        prev.map(item => 
          item.file === upload.file 
            ? { ...item, status: 'uploading', progress: 0 }
            : item
        )
      )

      try {
        const formData = new FormData()
        formData.append('file', upload.file)

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          // Update status to completed
          setUploadQueue(prev => 
            prev.map(item => 
              item.file === upload.file 
                ? { ...item, status: 'completed', progress: 100 }
                : item
            )
          )

          // Add to uploaded files
          setUploadedFiles(prev => [...prev, result.data])
        } else {
          // Update status to error
          setUploadQueue(prev => 
            prev.map(item => 
              item.file === upload.file 
                ? { ...item, status: 'error', error: result.error }
                : item
            )
          )
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadQueue(prev => 
          prev.map(item => 
            item.file === upload.file 
              ? { ...item, status: 'error', error: 'Error de conexión' }
              : item
          )
        )
      }
    }

    setIsUploading(false)
  }

  const clearCompleted = () => {
    setUploadQueue(prev => prev.filter(item => item.status !== 'completed'))
  }

  const retryFailed = () => {
    const failedUploads = uploadQueue.filter(item => item.status === 'error')
    if (failedUploads.length > 0) {
      processUploads(failedUploads)
    }
  }

  const completedCount = uploadQueue.filter(item => item.status === 'completed').length
  const errorCount = uploadQueue.filter(item => item.status === 'error').length
  const pendingCount = uploadQueue.filter(item => item.status === 'pending' || item.status === 'uploading').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subir Archivos</h1>
        <p className="text-gray-600 mt-1">
          Arrastra y suelta archivos o haz clic para seleccionar
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Zona de Subida</span>
          </CardTitle>
          <CardDescription>
            Formatos soportados: Imágenes, Videos, Audio, PDF, Documentos (máximo 50MB por archivo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadZone 
            onFilesSelected={handleFilesSelected}
            maxFiles={10}
            maxSizeInMB={50}
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadQueue.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className={`h-5 w-5 ${isUploading ? 'animate-spin' : ''}`} />
                <span>Progreso de Subida</span>
              </CardTitle>
              <div className="flex space-x-2">
                {completedCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCompleted}>
                    Limpiar completados ({completedCount})
                  </Button>
                )}
                {errorCount > 0 && (
                  <Button variant="outline" size="sm" onClick={retryFailed}>
                    Reintentar errores ({errorCount})
                  </Button>
                )}
              </div>
            </div>
            <CardDescription>
              {pendingCount > 0 && `${pendingCount} archivos pendientes • `}
              {completedCount > 0 && `${completedCount} completados • `}
              {errorCount > 0 && `${errorCount} errores`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadQueue.map((upload, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {upload.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {upload.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {(upload.status === 'pending' || upload.status === 'uploading') && (
                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {upload.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {upload.status === 'pending' && 'Pendiente'}
                      {upload.status === 'uploading' && `${upload.progress}%`}
                      {upload.status === 'completed' && 'Completado'}
                      {upload.status === 'error' && 'Error'}
                    </div>
                    {upload.error && (
                      <div className="text-xs text-red-600 mt-1">
                        {upload.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Archivos Subidos Recientemente</CardTitle>
            <CardDescription>
              {uploadedFiles.length} archivo{uploadedFiles.length !== 1 ? 's' : ''} subido{uploadedFiles.length !== 1 ? 's' : ''} en esta sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode="grid"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

