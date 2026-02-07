'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  HomeIcon,
  InformationCircleIcon,
  CalendarIcon,
  PhotoIcon,
  PhoneIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'
import { UserProfile } from '@/types/user.types'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Home Page', href: '/admin/home', icon: HomeIcon },
  { name: 'About Page', href: '/admin/about', icon: InformationCircleIcon },
  { name: 'Events', href: '/admin/events', icon: CalendarIcon },
  { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon },
  { name: 'Contact Page', href: '/admin/contact', icon: PhoneIcon },
  { name: 'Theme Settings', href: '/admin/theme', icon: PaintBrushIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, adminOnly: true },
  { name: 'SEO Settings', href: '/admin/seo', icon: Cog6ToothIcon },
]

interface AdminSidebarProps {
  profile: UserProfile | null
}

export default function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || profile?.role === 'super_admin'
  )

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">{profile?.full_name || profile?.email}</p>
        <p className="text-xs text-gray-500 mt-1 capitalize">{profile?.role?.replace('_', ' ')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="border-t p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
