export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

export interface FileItem {
  id: string
  user_id: string
  name: string
  original_name: string
  size: number
  type: string
  folder_id: string | null
  storage_path: string
  public_url: string | null
  metadata: any | null
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface FilePreview {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface BreadcrumbItem {
  id: string | null
  name: string
  path: string
}

export interface SearchFilters {
  query: string
  type: 'all' | 'image' | 'video' | 'audio' | 'document'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  sortBy: 'name' | 'date' | 'size' | 'type'
  sortOrder: 'asc' | 'desc'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AdminStats {
  totalUsers: number
  totalFiles: number
  totalStorage: number
  activeUsers: number
  newUsersThisMonth: number
  storageUsageByType: {
    images: number
    videos: number
    audio: number
    documents: number
    others: number
  }
}

export interface UserActivity {
  id: string
  user_id: string
  action: 'upload' | 'download' | 'delete' | 'share' | 'login'
  resource_type: 'file' | 'folder' | 'account'
  resource_id: string | null
  metadata: any | null
  created_at: string
}

export type ViewMode = 'grid' | 'list'
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other'
export type UserRole = 'user' | 'admin'

