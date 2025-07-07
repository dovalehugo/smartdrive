"use client"

import { useState } from 'react'
import { FileItem } from '@/types'
import { formatFileSize, formatDate, getFileIcon, isImageFile, isVideoFile, isAudioFile, isPDFFile } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Download, Trash2, Eye, Edit3 } from 'lucide-react'

interface FileCardProps {
  file: FileItem
  onPreview?: (file: FileItem) => void
  onDownload?: (file: FileItem) => void
  onDelete?: (file: FileItem) => void
  onRename?: (file: FileItem) => void
  viewMode?: 'grid' | 'list'
}

export function FileCard({ 
  file, 
  onPreview, 
  onDownload, 
  onDelete, 
  onRename,
  viewMode = 'grid' 
}: FileCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [imageError, setImageError] = useState(false)

  const canPreview = isImageFile(file.type) || isVideoFile(file.type) || isAudioFile(file.type) || isPDFFile(file.type)

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 group">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isImageFile(file.type) && file.public_url && !imageError ? (
              <img
                src={file.public_url}
                alt={file.name}
                className="w-10 h-10 object-cover rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">
                {getFileIcon(file.type)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {formatDate(file.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {canPreview && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPreview?.(file)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload?.(file)}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRename?.(file)}
            className="h-8 w-8"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(file)}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* File Preview */}
        <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
          {isImageFile(file.type) && file.public_url && !imageError ? (
            <img
              src={file.public_url}
              alt={file.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-4xl text-gray-400">
              {getFileIcon(file.type)}
            </div>
          )}
          
          {/* Overlay Actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2">
              {canPreview && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPreview?.(file)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDownload?.(file)}
                className="bg-white/90 hover:bg-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </Button>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
            {file.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.created_at)}</span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 bg-white/80 hover:bg-white transition-opacity ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement dropdown menu
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

