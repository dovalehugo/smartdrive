"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/utils'
import { 
  Bell, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Settings
} from 'lucide-react'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const storagePercentage = (user.storage_used / user.storage_limit) * 100

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          {/* Storage indicator */}
          <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-600">
            <span>Almacenamiento:</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    storagePercentage > 90 ? 'bg-red-500' : 
                    storagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <span className="text-xs">
                {formatFileSize(user.storage_used)} / {formatFileSize(user.storage_limit)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </Button>

          {/* Profile dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-semibold leading-6 text-gray-900">
                  {user.full_name || 'Usuario'}
                </span>
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </span>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 mt-1">
                      Administrador
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/dashboard/settings')
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  Configuración
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    handleSignOut()
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

