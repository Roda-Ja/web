'use client'
import { GalleryVerticalEnd, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useForgotPassword } from '@/hooks/use-auth'
import { AuthRoute } from '@/components/auth-guard'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const forgotPasswordMutation = useForgotPassword()

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const { handleSubmit } = form

  async function handleForgotPassword(data: ForgotPasswordData) {
    forgotPasswordMutation.mutate(data.email)
  }

  return (
    <AuthRoute>
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
                onSubmit={handleSubmit(handleForgotPassword)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-xl font-bold sm:text-2xl">
                    Recuperar senha
                  </h1>
                  <p className="text-muted-foreground text-xs text-balance sm:text-sm">
                    Digite seu e-mail para receber as instruções de recuperação
                  </p>
                </div>
                <div className="grid gap-4 sm:gap-6">
                  <Form.Field>
                    <Form.Label htmlFor="email-input">Email</Form.Label>
                    <Form.Input
                      name="email"
                      id="email-input"
                      type="email"
                      placeholder="m@example.com"
                    />
                  </Form.Field>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending
                      ? 'Enviando...'
                      : 'Enviar instruções'}
                  </Button>
                </div>
                <div className="text-center text-xs sm:text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 text-xs sm:text-sm"
                    onClick={() => router.back()}
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
    </AuthRoute>
  )
}
