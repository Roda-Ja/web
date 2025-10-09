'use client'
import { GalleryVerticalEnd, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useResetPassword } from '@/hooks/use-auth'
import { AuthRoute } from '@/components/auth-guard'

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPasswordMutation = useResetPassword()

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const { handleSubmit, setError } = form

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('root', { message: 'Token de recuperação não encontrado' })
    }
  }, [token, setError])

  async function handleResetPassword(data: ResetPasswordData) {
    if (!token) {
      setError('root', { message: 'Token de recuperação não encontrado' })
      return
    }

    resetPasswordMutation.mutate({
      token,
      password: data.password,
    })
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="#"
            className="flex items-center gap-2 font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Roda Ja
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs sm:max-w-sm">
            <FormProvider {...form}>
              <form
                className="flex flex-col gap-4 sm:gap-6"
                onSubmit={handleSubmit(handleResetPassword)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-xl font-bold sm:text-2xl">Nova senha</h1>
                  <p className="text-muted-foreground text-xs text-balance sm:text-sm">
                    Digite sua nova senha abaixo
                  </p>
                </div>
                <div className="grid gap-4 sm:gap-6">
                  <Form.Field>
                    <Form.Label htmlFor="password-input">Nova senha</Form.Label>
                    <Form.Input
                      name="password"
                      id="password-input"
                      type="password"
                      placeholder="Digite sua nova senha"
                    />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label htmlFor="confirm-password-input">
                      Confirme sua nova senha
                    </Form.Label>
                    <Form.Input
                      name="confirmPassword"
                      id="confirm-password-input"
                      type="password"
                      placeholder="Confirme sua nova senha"
                    />
                  </Form.Field>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPasswordMutation.isPending || !token}
                  >
                    {resetPasswordMutation.isPending
                      ? 'Alterando senha...'
                      : 'Alterar senha'}
                  </Button>
                </div>
                <div className="text-center text-xs sm:text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 text-xs sm:text-sm"
                    onClick={() => router.push('/sign-in')}
                  >
                    <ArrowLeft className="mr-1 size-3" />
                    Voltar ao login
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/bg-auth.avif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthRoute>
      <Suspense
        fallback={
          <div className="flex min-h-svh items-center justify-center">
            Carregando...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthRoute>
  )
}
