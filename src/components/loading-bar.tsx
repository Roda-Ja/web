'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)

    const interval = globalThis.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          globalThis.clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 50)

    const timeout = globalThis.setTimeout(() => {
      setProgress(90)
      globalThis.setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }, 300)

    return () => {
      globalThis.clearInterval(interval)
      globalThis.clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 h-1 bg-blue-600 transition-all duration-200 ease-out"
      style={{
        width: `${progress}%`,
        transform: 'translateX(0)',
      }}
    />
  )
}
