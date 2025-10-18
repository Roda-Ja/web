import { useAuthStore } from '@/lib/stores/auth-store'

/**
 * Hook para verificar permissões do usuário
 */
export function usePermissions() {
  const isMaster = useAuthStore((state) => state.isMaster())
  const isEstablishmentAdmin = useAuthStore((state) =>
    state.isEstablishmentAdmin(),
  )
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  return {
    isAuthenticated,
    isMaster,
    isEstablishmentAdmin,

    canManageAllEstablishments: isMaster,
    canManageSpecificEstablishment: isEstablishmentAdmin,
    canAccessAdminPanel: isMaster,
    canManageProducts: isMaster || isEstablishmentAdmin,
    canViewProducts: isAuthenticated,

    userRole: user?.role,
    userId: user?.id,
    userEstablishmentId: user?.establishmentId,
  }
}
