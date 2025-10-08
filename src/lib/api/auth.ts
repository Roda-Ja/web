import { apiClient } from './client'
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
} from './types'

// Serviços de autenticação
export const authApi = {
  // Cadastro de estabelecimento
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post('/establishment/sign-up', data)
    return response.data
  },

  // Login de estabelecimento
  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await apiClient.post('/establishment/sign-in', data)

    // Extrair tokens dos headers também (conforme documentação)
    const accessToken =
      response.data.token?.accessToken ||
      response.headers.authorization?.replace('Bearer ', '')
    const refreshToken =
      response.data.token?.refreshToken || response.headers['x-refresh-token']

    return {
      ...response.data,
      token: {
        accessToken: accessToken || response.data.token.accessToken,
        refreshToken: refreshToken || response.data.token.refreshToken,
      },
    }
  },

  // Recuperação de senha
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/establishment/forgot-password', {
      email,
    })
    return response.data
  },

  // Reset de senha
  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/establishment/reset-password', { token, password })
  },

  // Refresh token
  refreshToken: async (
    refreshToken: string,
  ): Promise<{ accessToken: string }> => {
    const response = await apiClient.post(
      '/establishment/refresh-token',
      null,
      {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      },
    )
    return response.data
  },
}
