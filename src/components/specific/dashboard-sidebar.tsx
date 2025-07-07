"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/types'
import { cn } from '@/lib/utils'
import { 
  Cloud, 
  FolderIcon, 
  Upload, 
  Search, 
  Settings, 
  Users, 
  BarChart3,
  X,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardSidebarProps {
  user: User
}

const navigation = [
  { name: 'Mis Archivos', href: '/dashboard', icon: FolderIcon },
  { name: 'Subir Archivos', href: '/dashboard/upload', icon: Upload },
  { name: 'Buscar', href: '/dashboard/search', icon: Search },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Panel Admin', href: '/admin', icon: BarChart3 },
  { name: 'Usuarios', href: '/admin/users', icon: Users },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const allNavigation = user.role === 'admin' 
    ? [...navigation, ...adminNavigation] 
    : navigation

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <SidebarContent 
            user={user} 
            navigation={allNavigation} 
            pathname={pathname}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent 
          user={user} 
          navigation={allNavigation} 
          pathname={pathname}
        />
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-40"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

interface SidebarContentProps {
  user: User
  navigation: typeof navigation
  pathname: string
  onClose?: () => void
}

function SidebarContent({ user, navigation, pathname, onClose }: SidebarContentProps) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Cloud className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">SmartDrive</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                    )}
                    onClick={onClose}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 mt-1">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

