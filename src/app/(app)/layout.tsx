'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb'
import { CartSheet } from '@/components/menu/cart-sheet'
import { usePathname } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useNavigationSync } from '@/hooks/use-navigation-sync'
import { useAuthStore } from '@/lib/stores/auth-store'
import { ProtectedRoute } from '@/components/auth-guard'
import { ReactNode } from 'react'

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  useNavigationSync()

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex h-full flex-col overflow-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
            <HeaderActions />
          </header>
          <div className="flex-1 overflow-auto p-4 pt-0">{children}</div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

function HeaderActions() {
  const pathname = usePathname()
  const isMaster = useAuthStore((state) => state.isMaster())

  const isMenuPage = pathname?.startsWith('/cardapio')

  if (!isMenuPage || isMaster) return null

  return (
    <div className="ml-auto flex items-center gap-2 px-4">
      <CartSheet />
    </div>
  )
}
