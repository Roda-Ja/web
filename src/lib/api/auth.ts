import { apiClient } from './client'
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
} from './types'

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post('/establishment/sign-up', data)
    return response.data
  },

  signIn: async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await apiClient.post('/establishment/sign-in', data)

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

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/establishment/forgot-password', {
      email,
    })
    return response.data
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/establishment/reset-password', { token, password })
  },

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
