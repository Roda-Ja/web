import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { SignUpRequest, SignInRequest } from '@/lib/api/types'
import { getAllEstablishments } from '@/lib/data/establishments'

export function useSignUp() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
    onSuccess: (data) => {
      toast.success('Conta criada com sucesso!')
      // Redirecionar para login após cadastro bem-sucedido
      router.push('/sign-in')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
    },
  })
}

export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (data: SignInRequest) => authApi.signIn(data),
    onSuccess: (data) => {
      // Mapear dados do usuário para o formato do store
      const slugify = (text: string) =>
        text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '')

      // Derivar establishmentId caso a API não envie
      let derivedEstablishmentId = data.user.establishmentId
      if (!derivedEstablishmentId && data.user.entity === 'establishment') {
        const establishments = getAllEstablishments()
        const possibleSlug = slugify(data.user.name || '')
        const match = establishments.find((e) => e.slug === possibleSlug)
        if (match) derivedEstablishmentId = match.id
      }

      const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        // Se a API indicar entity: 'establishment', trata como admin de estabelecimento
        role: (data.user.role ||
          (data.user.entity === 'establishment'
            ? 'establishment_admin'
            : 'user')) as 'master' | 'establishment_admin' | 'user',
        establishmentId:
          derivedEstablishmentId || data.user.establishmentId || data.user.id,
        createdAt: data.user.createdAt,
      }

      // Salvar no store
      login(user, data.token.accessToken, data.token.refreshToken)

      toast.success('Login realizado com sucesso!')

      // Redirecionar baseado na role
      if (user.role === 'master') {
        router.push('/dashboard')
      } else {
        router.push('/cardapio')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Email de recuperação enviado!')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Erro ao enviar email de recuperação'
      toast.error(message)
    },
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
      router.push('/sign-in')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao alterar senha'
      toast.error(message)
    },
  })
}

export function useRefreshToken() {
  const { setTokens, refreshToken } = useAuthStore()

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado')
      }
      return authApi.refreshToken(refreshToken)
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, refreshToken || '')
    },
    onError: () => {
      // Se o refresh falhar, fazer logout
      useAuthStore.getState().logout()
    },
  })
}
