import axios from 'axios'
import { API_BASE_URL } from './config'
import { useAuthStore } from '@/lib/stores/auth-store'

// Base URL da API - configurada em config.ts

// Cliente axios configurado
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use((config) => {
  // Obter token do store (persistido pelo zustand)
  let token = useAuthStore.getState().accessToken || null

  // Fallback: ler do storage persistido do Zustand (chave: auth-storage)
  if (!token && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
        token = parsed?.state?.accessToken || null
      }
    } catch {
      // ignorar erros de JSON
    }
  }

  if (token) {
    // headers podem ser AxiosHeaders ou undefined; manter seguro em runtime
    const headers: Record<string, string> = (config.headers as any) || {}
    headers.Authorization = `Bearer ${token}`
    config.headers = headers as any
  }
  return config
})

// Interceptor para tratar erros de resposta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tratar erros de autenticação (401)
    if (error.response?.status === 401) {
      // Logout imediato para evitar loops
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default apiClient
