'use client'

import {
  ClockFading,
  LayoutDashboard,
  MapPin,
  ScrollText,
  ShoppingBasket,
  ShoppingCart,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
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

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Painel Administrativo',
      url: '#',
      icon: LayoutDashboard,
    },
    {
      title: 'Histórico de Pedidos',
      url: '#',
      icon: ClockFading,
    },
  ],
  system: [
    {
      name: 'Pedidos',
      url: '#',
      icon: ShoppingCart,
    },
    {
      name: 'Produtos',
      url: '#',
      icon: ShoppingBasket,
    },
    {
      name: 'Relatórios',
      url: '#',
      icon: ScrollText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500">
                  <MapPin className="w-3 text-white" />
                </div>
                <strong>Roda Ja</strong>
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
