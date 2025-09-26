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

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  const { isActiveRoute } = useNavigationStore()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Suporte</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isActiveRoute(item.url)
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                asChild
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
