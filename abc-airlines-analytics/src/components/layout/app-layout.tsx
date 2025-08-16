'use client'

import { useState } from 'react'
import { Sidebar, MobileHeader } from './sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen bg-slate-900">
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <div className="flex h-full lg:h-screen">
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        <main className="flex-1 overflow-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}