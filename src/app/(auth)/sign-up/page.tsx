'use client'
import { GalleryVerticalEnd } from 'lucide-react'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const signUpSchema = z.object(
  {
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  },
  { required_error: 'Esse campo é obrigatório!' },
)

type SignUpData = z.infer<typeof signUpSchema>

export default function LoginPage() {
  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })
  const { handleSubmit } = signUpForm

  async function handleSignUp(data: SignUpData) {
    console.log(data)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Roda Ja
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FormProvider {...signUpForm}>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(handleSignUp)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Crie uma conta</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Insira seus dados abaixo para criar sua conta
                  </p>
                </div>
                <div className="grid gap-6">
                  <Form.Field>
                    <Form.Label htmlFor="name-input">Nome</Form.Label>
                    <Form.Input
                      name="name"
                      id="name-input"
                      placeholder="Fulano de Tal"
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

                  <Button type="submit" className="w-full">
                    Criar conta
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Ja possui uma conta ?
                  <a href="#" className="underline underline-offset-4">
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
  )
}
