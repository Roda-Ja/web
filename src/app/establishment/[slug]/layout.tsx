'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { EstablishmentSidebar } from '@/components/establishment-sidebar'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { ProtectedRoute } from '@/components/auth-guard'

interface EstablishmentLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export default function EstablishmentLayout({
  children,
  params,
}: EstablishmentLayoutProps) {
  const { slug } = use(params)
  const establishment = getEstablishmentBySlug(slug)

  if (!establishment) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <EstablishmentSidebar establishmentSlug={establishment.slug} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
