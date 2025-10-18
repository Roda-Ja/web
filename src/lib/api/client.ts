import axios from 'axios'
import { API_BASE_URL } from './config'
import { useAuthStore } from '@/lib/stores/auth-store'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  let token = useAuthStore.getState().accessToken || null

  if (!token && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
        token = parsed?.state?.accessToken || null
      }
    } catch {
    }
  }

  if (token) {
    const headers: Record<string, string> = (config.headers as any) || {}
    headers.Authorization = `Bearer ${token}`
    config.headers = headers as any
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default apiClient
