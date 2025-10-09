import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'master' | 'establishment_admin' | 'user'
  establishmentId?: string
  createdAt?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isHydrated: boolean
  setHydrated: (hydrated: boolean) => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  isMaster: () => boolean
  isEstablishmentAdmin: () => boolean
  canManageEstablishment: (establishmentId: string) => boolean
  canAccessAdminPanel: () => boolean
  canManageDrivers: () => boolean
  canManageEstablishments: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isHydrated: false,

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      isMaster: () => {
        const { user } = get()
        return user?.role === 'master'
      },

      isEstablishmentAdmin: () => {
        const { user } = get()
        return user?.role === 'establishment_admin'
      },

      canManageEstablishment: (establishmentId) => {
        const { user } = get()
        if (!user) return false

        if (user.role === 'master') return true

        if (user.role === 'establishment_admin') {
          return user.establishmentId === establishmentId
        }

        return false
      },

      canAccessAdminPanel: () => {
        const { user } = get()
        return user?.role === 'master'
      },

      canManageDrivers: () => {
        const { user } = get()
        return user?.role === 'master'
      },

      canManageEstablishments: () => {
        const { user } = get()
        return user?.role === 'master'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
