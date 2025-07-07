"use client"

import { useState } from 'react'
import { FileItem } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { isImageFile, isVideoFile, isAudioFile, isPDFFile, formatFileSize, formatDate } from '@/lib/utils'
import { Download, X, ExternalLink, Info } from 'lucide-react'

interface FilePreviewProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (file: FileItem) => void
}

export function FilePreview({ file, isOpen, onClose, onDownload }: FilePreviewProps) {
  const [showInfo, setShowInfo] = useState(false)

  if (!file) return null

  const renderPreview = () => {
    if (isImageFile(file.type)) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={file.public_url || ''}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>
      )
    }

    if (isVideoFile(file.type)) {
      return (
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <video
            src={file.public_url || ''}
            controls
            className="w-full max-h-[60vh]"
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      )
    }

    if (isAudioFile(file.type)) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{file.original_name}</h3>
          </div>
          <audio
            src={file.public_url || ''}
            controls
            className="w-full"
          >
            Tu navegador no soporta la reproducción de audio.
          </audio>
        </div>
      )
    }

    if (isPDFFile(file.type)) {
      return (
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={file.public_url || ''}
            className="w-full h-[60vh]"
            title={file.name}
          >
            <p>
              Tu navegador no puede mostrar este PDF.{' '}
              <a href={file.public_url || ''} target="_blank" rel="noopener noreferrer">
                Haz clic aquí para descargarlo.
              </a>
            </p>
          </iframe>
        </div>
      )
    }

    // Fallback for unsupported file types
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{file.original_name}</h3>
        <p className="text-gray-600 mb-4">
          Vista previa no disponible para este tipo de archivo
        </p>
        <Button onClick={() => onDownload?.(file)}>
          <Download className="h-4 w-4 mr-2" />
          Descargar archivo
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{file.original_name}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-4 w-4" />
              </Button>
              {file.public_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(file.public_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload?.(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Preview */}
          <div className="relative">
            {renderPreview()}
          </div>

          {/* File Info */}
          {showInfo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Información del archivo</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nombre:</span>
                  <p className="font-medium">{file.original_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tamaño:</span>
                  <p className="font-medium">{formatFileSize(file.size)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <p className="font-medium">{file.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Subido:</span>
                  <p className="font-medium">{formatDate(file.created_at)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

