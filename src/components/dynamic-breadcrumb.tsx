'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { useNavigationStore } from '@/lib/stores/navigation-store'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const { currentBreadcrumb, setCurrentPath } = useNavigationStore()

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname, setCurrentPath])

  if (currentBreadcrumb.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentBreadcrumb.map((item, index) => (
          <BreadcrumbItem key={item.path}>
            <BreadcrumbLink
              href={item.path}
              className={
                index === currentBreadcrumb.length - 1
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }
            >
              {item.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
