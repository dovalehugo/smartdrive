"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { validateFileType, validateFileSize, formatFileSize } from '@/lib/utils'
import { UploadProgress } from '@/types'

interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void
  onUploadProgress?: (progress: UploadProgress[]) => void
  maxFiles?: number
  maxSizeInMB?: number
  className?: string
}

export function UploadZone({ 
  onFilesSelected, 
  onUploadProgress,
  maxFiles = 10,
  maxSizeInMB = 50,
  className 
}: UploadZoneProps) {
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = []
    const validFiles: File[] = []

    // Validate accepted files
    acceptedFiles.forEach(file => {
      if (!validateFileType(file)) {
        newErrors.push(`${file.name}: Tipo de archivo no permitido`)
        return
      }
      
      if (!validateFileSize(file, maxSizeInMB)) {
        newErrors.push(`${file.name}: Archivo demasiado grande (máximo ${maxSizeInMB}MB)`)
        return
      }

      validFiles.push(file)
    })

    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === 'too-many-files') {
          newErrors.push(`Máximo ${maxFiles} archivos permitidos`)
        } else {
          newErrors.push(`${file.name}: ${error.message}`)
        }
      })
    })

    setErrors(newErrors)

    if (validFiles.length > 0) {
      const newUploads: UploadProgress[] = validFiles.map(file => ({
        file,
        progress: 0,
        status: 'pending'
      }))

      setUploadQueue(prev => [...prev, ...newUploads])
      onFilesSelected?.(validFiles)
      onUploadProgress?.(newUploads)
    }
  }, [maxFiles, maxSizeInMB, onFilesSelected, onUploadProgress])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSizeInMB * 1024 * 1024,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  })

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index))
  }

  const clearErrors = () => {
    setErrors([])
  }

  return (
    <div className={className}>
      {/* Upload Zone */}
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="p-8 text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Suelta los archivos aquí' : 'Sube tus archivos'}
          </h3>
          <p className="text-gray-500 mb-4">
            Arrastra y suelta archivos aquí, o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400">
            Máximo {maxFiles} archivos • {maxSizeInMB}MB por archivo
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Formatos: Imágenes, Videos, Audio, PDF, Documentos
          </p>
        </div>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="mt-4 border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="text-sm font-medium text-red-800">
                  Errores de subida
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearErrors}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Card className="mt-4">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Archivos en cola ({uploadQueue.length})
            </h4>
            <div className="space-y-2">
              {uploadQueue.map((upload, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {upload.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(upload.file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500">
                      {upload.status === 'pending' && 'Pendiente'}
                      {upload.status === 'uploading' && `${upload.progress}%`}
                      {upload.status === 'completed' && 'Completado'}
                      {upload.status === 'error' && 'Error'}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromQueue(index)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// Note: react-dropzone needs to be installed
// npm install react-dropzone

