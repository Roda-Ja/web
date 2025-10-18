'use client'

import {
  Building2,
  ClockFading,
  LayoutDashboard,
  MapPin,
  ScrollText,
  ShoppingBasket,
  Users,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
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

const getEstablishmentUrl = (page: string = 'cardapio') => {
  const establishments = getAllEstablishments()
  const user = useAuthStore.getState().user
  const userEstablishment = establishments.find(
    (est) => est.id === user?.establishmentId,
  )
  return userEstablishment
    ? `/establishment/${userEstablishment.slug}/${page}`
    : '/cardapio'
}

const getNavigationData = (isMaster: boolean) => ({
  navMain: [
    ...(isMaster
      ? [
          {
            title: 'Painel Administrativo',
            url: '/dashboard',
            icon: LayoutDashboard,
          },
        ]
      : []),
    {
      title: 'Histórico de Pedidos',
      url: '/orders/history',
      icon: ClockFading,
    },
  ],
  system: [
    {
      name: 'Cardapio',
      url: isMaster ? '/cardapio' : getEstablishmentUrl(),
      icon: ShoppingBasket,
    },
    // ...(isMaster
    //   ? [
    //       {
    //         name: 'Motoristas',
    //         url: '/drivers',
    //         icon: Users,
    //       },
    //       {
    //         name: 'Estabelecimentos',
    //         url: '/establishments',
    //         icon: Building2,
    //       },
    //     ]
    //   : []),
  ],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMaster = useAuthStore((state) => state.isMaster())
  const data = getNavigationData(isMaster)

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
                  <MapPin className="w-3 text-white" />
                </div>
                <strong>
                  {isMaster ? 'DeliveryHub Admin' : 'Meu Estabelecimento'}
                </strong>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.system} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
