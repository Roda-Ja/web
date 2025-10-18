'use client'

import { ChevronRight, ClockFading, Package, Star } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getAllEstablishments } from '@/lib/data/establishments'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

type EstablishmentSidebarProps = React.ComponentProps<typeof Sidebar> & {
  establishmentSlug: string
}

export function EstablishmentSidebar({
  establishmentSlug,
  ...props
}: EstablishmentSidebarProps) {
  const user = useAuthStore((state) => state.user)
  const establishments = getAllEstablishments()
  const currentEstablishment = establishments.find(
    (est) => est.slug === establishmentSlug,
  )

  const establishmentNav = [
    {
      title: 'Cardápio',
      url: `/establishment/${establishmentSlug}/cardapio`,
      icon: Package,
    },
    {
      title: 'Avaliações',
      url: `/establishment/${establishmentSlug}/reviews`,
      icon: Star,
    },
    {
      title: 'Histórico de Pedidos',
      url: `/establishment/${establishmentSlug}/orders`,
      icon: ClockFading,
    },
  ]

  const establishmentData = {
    name: currentEstablishment?.name || 'Estabelecimento',
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500">
                  <Package className="w-3 text-white" />
                </div>
                <strong>{establishmentData.name}</strong>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 py-2">
          <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Sistema PDV
          </div>
        </div>
        <nav className="px-4">
          <div className="space-y-1">
            {establishmentNav.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.title}
                  href={item.url}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </a>
              )
            })}
          </div>
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
