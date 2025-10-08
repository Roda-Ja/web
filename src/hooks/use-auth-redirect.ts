import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

/**
 * Hook para redirecionar usuários autenticados
 * Útil para páginas de auth (sign-in, sign-up) que não devem ser acessíveis por usuários logados
 */
export function useAuthRedirect(redirectTo: string = '/dashboard') {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  return isAuthenticated
}

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona para login se não estiver autenticado
 */
export function useRequireAuth(redirectTo: string = '/sign-in') {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  return isAuthenticated
}
