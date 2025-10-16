'use client'
import { GalleryVerticalEnd } from 'lucide-react'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSignUp } from '@/hooks/use-auth'
import { AuthRoute } from '@/components/auth-guard'
import { generateSlug } from '@/lib/utils'
import { useEffect } from 'react'

const signUpSchema = z
  .object(
    {
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
      confirmPassword: z.string(),
      slug: z.string().min(1, 'Slug é obrigatório'),
    },
    { required_error: 'Esse campo é obrigatório!' },
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type SignUpData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const signUpMutation = useSignUp()

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      slug: '',
    },
  })
  const { handleSubmit, watch, setValue } = signUpForm

  // Observa mudanças no campo nome e gera o slug automaticamente
  const nameValue = watch('name')

  useEffect(() => {
    if (nameValue) {
      const slug = generateSlug(nameValue)
      setValue('slug', slug)
    }
  }, [nameValue, setValue])

  async function handleSignUp(data: SignUpData) {
    // Remover confirmPassword antes de enviar para a API
    const { confirmPassword, ...signUpData } = data
    signUpMutation.mutate(signUpData)
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
              <FormProvider {...signUpForm}>
                <form
                  className="flex flex-col gap-4 sm:gap-6"
                  onSubmit={handleSubmit(handleSignUp)}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-xl font-bold sm:text-2xl">
                      Crie uma conta
                    </h1>
                    <p className="text-muted-foreground text-xs text-balance sm:text-sm">
                      Insira seus dados abaixo para criar sua conta
                    </p>
                  </div>
                  <div className="grid gap-4 sm:gap-6">
                    <Form.Field>
                      <Form.Label htmlFor="name-input">Nome</Form.Label>
                      <Form.Input
                        name="name"
                        id="name-input"
                        placeholder="Loja do João"
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Label htmlFor="email-input">Email</Form.Label>
                      <Form.Input
                        name="email"
                        id="email-input"
                        type="email"
                        placeholder="m@example.com"
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Label htmlFor="password-input">Senha</Form.Label>
                      <Form.Input
                        name="password"
                        id="password-input"
                        type="password"
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Label htmlFor="confirm-password-input">
                        Confirme sua senha
                      </Form.Label>
                      <Form.Input
                        name="confirmPassword"
                        id="confirm-password-input"
                        type="password"
                      />
                    </Form.Field>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={signUpMutation.isPending}
                    >
                      {signUpMutation.isPending
                        ? 'Criando conta...'
                        : 'Criar conta'}
                    </Button>
                  </div>
                  <div className="text-center text-xs sm:text-sm">
                    Já possui uma conta?{' '}
                    <a
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Entre
                    </a>
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
