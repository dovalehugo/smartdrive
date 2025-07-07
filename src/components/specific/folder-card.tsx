"use client"

import { useState } from 'react'
import { Folder } from '@/types'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderIcon, MoreVertical, Edit3, Trash2 } from 'lucide-react'

interface FolderCardProps {
  folder: Folder
  onOpen?: (folder: Folder) => void
  onRename?: (folder: Folder) => void
  onDelete?: (folder: Folder) => void
  viewMode?: 'grid' | 'list'
}

export function FolderCard({ 
  folder, 
  onOpen, 
  onRename, 
  onDelete,
  viewMode = 'grid' 
}: FolderCardProps) {
  const [showActions, setShowActions] = useState(false)

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 group">
        <div 
          className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => onOpen?.(folder)}
        >
          <div className="flex-shrink-0">
            <FolderIcon className="w-10 h-10 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
            <p className="text-xs text-gray-500">Carpeta • {formatDate(folder.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRename?.(folder)}
            className="h-8 w-8"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(folder)}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div 
        className="relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => onOpen?.(folder)}
      >
        {/* Folder Icon */}
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <FolderIcon className="w-16 h-16 text-blue-500" />
        </div>

        {/* Folder Info */}
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
            {folder.name}
          </h3>
          <div className="text-xs text-gray-500">
            Carpeta • {formatDate(folder.created_at)}
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

