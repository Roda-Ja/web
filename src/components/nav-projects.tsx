'use client'

import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useNavigationStore } from '@/lib/stores/navigation-store'

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isActiveRoute } = useNavigationStore()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Sistema PDV</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = isActiveRoute(item.url)
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                tooltip={item.name}
                isActive={isActive}
                asChild
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
