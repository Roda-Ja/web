import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: 'master' | 'establishment_admin' | 'user'
  establishmentId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
  isMaster: () => boolean
  isEstablishmentAdmin: () => boolean
  canManageEstablishment: (establishmentId: string) => boolean
  canAccessAdminPanel: () => boolean
  canManageDrivers: () => boolean
  canManageEstablishments: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: '1',
    name: 'Roda Ja Master',
    email: 'master@rodaja.com',
    role: 'master',
    establishmentId: undefined,
    // id: '3',
    // name: 'Admin Pastelaria',
    // email: 'admin@pastelaria.com',
    // role: 'establishment_admin',
    // establishmentId: '3',
  },
  isAuthenticated: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => set({ user: null, isAuthenticated: false }),

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

    // Master pode gerenciar qualquer estabelecimento
    if (user.role === 'master') return true

    // Establishment Admin pode gerenciar apenas seu estabelecimento
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
}))
