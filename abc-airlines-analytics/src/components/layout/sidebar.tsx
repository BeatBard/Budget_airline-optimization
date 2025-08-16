'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Home, 
  Users, 
  MapPin, 
  DollarSign, 
  Zap, 
  Calendar,
  Settings,
  BarChart3,
  Plane,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Crew Scheduling', href: '/crew-scheduling', icon: Users },
  { name: 'Route Profitability', href: '/route-profitability', icon: MapPin },
  { name: 'Ancillary Revenue', href: '/ancillary-revenue', icon: DollarSign },
  { name: 'GenAI Productivity', href: '/genai-productivity', icon: Zap },
  { name: 'Implementation Roadmap', href: '/roadmap', icon: Calendar },
]

interface SidebarProps {
  isMobileMenuOpen?: boolean
  setIsMobileMenuOpen?: (open: boolean) => void
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-slate-800 border-r border-slate-700 h-screen flex-col">
        <SidebarContent pathname={pathname} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/80" onClick={() => setIsMobileMenuOpen?.(false)} />
          <div className="relative flex w-64 bg-slate-800 border-r border-slate-700 h-screen flex-col">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMobileMenuOpen?.(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onLinkClick={() => setIsMobileMenuOpen?.(false)} />
          </div>
        </div>
      )}
    </>
  )
}

function SidebarContent({ pathname, onLinkClick }: { pathname: string, onLinkClick?: () => void }) {
  return (
    <>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ABC Airlines</h1>
            <p className="text-sm text-slate-400">Analytics Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'nav-item',
                isActive && 'active'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="hidden sm:block">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <Settings className="w-4 h-4 text-slate-300" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-200">Executive Demo</p>
            <p className="text-xs text-slate-400">POC Version</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">ABC Airlines</h1>
        </div>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 text-slate-400 hover:text-white"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  )
}