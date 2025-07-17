'use client'

import { useNavigationStore } from '@/lib/stores/navigation-store'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useNavigationSync() {
  const pathname = usePathname()
  const { setCurrentPath } = useNavigationStore()

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname, setCurrentPath])
}
