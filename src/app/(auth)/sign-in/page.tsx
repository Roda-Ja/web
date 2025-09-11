'use client'
import { GalleryVerticalEnd } from 'lucide-react'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const signInSchema = z.object({
  email: z.string({ required_error: 'Informe seu email!' }).email(),
  password: z.string({ required_error: 'Informe sua senha!' }),
})

type SignInData = z.infer<typeof signInSchema>

export default function LoginPage() {
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })
  const { handleSubmit } = signInForm

  async function handleSignIn(data: SignInData) {
    console.log(data)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
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
          <div className="w-full max-w-xs">
            <FormProvider {...signInForm}>
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(handleSignIn)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Entre na sua conta</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Digite seu e-mail abaixo para acessar sua conta
                  </p>
                </div>
                <div className="grid gap-6">
                  <Form.Field>
                    <Form.Label>Email</Form.Label>
                    <Form.Input
                      name="email"
                      type="email"
                      id="email-input"
                      placeholder="m@example.com"
                    />
                    <Form.ErrorMessage field="email" />
                  </Form.Field>

                  <Form.Field>
                    <div className="flex items-center">
                      <Form.Label>Senha</Form.Label>

                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Esqueceu sua senha?
                      </a>
                    </div>
                    <Form.Input
                      name="password"
                      type="password"
                      id="password-input"
                    />
                    <Form.ErrorMessage field="password" />
                  </Form.Field>

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Entrar
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Não tem uma conta?
                  <a
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Cadastre-se
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
