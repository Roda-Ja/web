'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useNavigationSync } from '@/hooks/use-navigation-sync'
import { File, FileText } from 'lucide-react'
import { ReactNode } from 'react'

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  // Sincronizar a URL com a store de navegação
  useNavigationSync()

  return (
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
          <div className="ml-auto flex gap-1">
            <Button variant="outline">
              <FileText className="h-4 w-4" /> Excel
            </Button>
            <Button variant="outline">
              <File className="h-4 w-4" /> PDF
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
