'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  redirectTo = '/sign-in',
}: ProtectedRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isHydrated, isAuthenticated, router, redirectTo])

  if (!isHydrated) {
    return <LoadingScreen message="Verificando autenticação..." />
  }

  if (!isAuthenticated) {
    return <LoadingScreen message="Redirecionando..." />
  }

  return <>{children}</>
}

interface AuthRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function AuthRoute({
  children,
  redirectTo = '/dashboard',
}: AuthRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isHydrated, isAuthenticated, router, redirectTo])

  if (!isHydrated) {
    return <LoadingScreen message="Carregando..." />
  }

  if (isAuthenticated) {
    return <LoadingScreen message="Redirecionando..." />
  }

  return <>{children}</>
}

function LoadingScreen({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  )
}
