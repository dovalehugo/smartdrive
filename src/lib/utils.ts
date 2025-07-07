import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️'
  if (type.startsWith('video/')) return '🎥'
  if (type.startsWith('audio/')) return '🎵'
  if (type.includes('pdf')) return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('text')) return '📄'
  if (type.includes('zip') || type.includes('rar')) return '📦'
  return '📁'
}

export function isImageFile(type: string): boolean {
  return type.startsWith('image/')
}

export function isVideoFile(type: string): boolean {
  return type.startsWith('video/')
}

export function isAudioFile(type: string): boolean {
  return type.startsWith('audio/')
}

export function isPDFFile(type: string): boolean {
  return type.includes('pdf')
}

export function isPreviewableFile(type: string): boolean {
  return isImageFile(type) || isVideoFile(type) || isAudioFile(type) || isPDFFile(type)
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "")
  
  return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mp3',
    'audio/wav',
    'audio/mpeg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeInMB: number = 50): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

