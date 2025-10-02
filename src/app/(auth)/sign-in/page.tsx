'use client'
import { GalleryVerticalEnd } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getAllEstablishments } from '@/lib/data/establishments'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const signInSchema = z.object({
  email: z.string({ required_error: 'Informe seu email!' }).email(),
  password: z.string({ required_error: 'Informe sua senha!' }),
})

type SignInData = z.infer<typeof signInSchema>

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const establishments = getAllEstablishments()

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })
  const { handleSubmit } = signInForm

  async function handleSignIn(data: SignInData) {
    // Simular login - redirecionar para dashboard
    setUser({
      id: '1',
      name: 'Roda Ja Master',
      email: data.email,
      role: 'master',
      establishmentId: undefined, // Master não tem estabelecimento específico
    })
    router.push('/dashboard')
  }

  const handleQuickLogin = (
    role: 'master' | 'establishment_admin',
    establishmentId?: string,
    establishmentName?: string,
  ) => {
    if (role === 'master') {
      setUser({
        id: '1',
        name: 'Roda Ja Master',
        email: 'master@rodaja.com',
        role: 'master',
        establishmentId: undefined, // Master não tem estabelecimento específico
      })
      router.push('/dashboard')
    } else {
      const establishment = establishments.find((e) => e.id === establishmentId)
      setUser({
        id: establishmentId || '2',
        name: `Admin ${establishmentName}`,
        email: `admin@${establishmentName?.toLowerCase().replace(/\s+/g, '')}.com`,
        role: 'establishment_admin',
        establishmentId: establishmentId,
      })
      router.push(`/establishment/${establishment?.slug}/cardapio`)
    }
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
            <FormProvider {...signInForm}>
              <form
                className="flex flex-col gap-4 sm:gap-6"
                onSubmit={handleSubmit(handleSignIn)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-xl font-bold sm:text-2xl">
                    Entre na sua conta
                  </h1>
                  <p className="text-muted-foreground text-xs text-balance sm:text-sm">
                    Digite seu e-mail abaixo para acessar sua conta
                  </p>
                </div>
                <div className="grid gap-4 sm:gap-6">
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
                        className="ml-auto text-xs underline-offset-4 hover:underline sm:text-sm"
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
                <div className="text-center text-xs sm:text-sm">
                  Não tem uma conta?{' '}
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

        {/* Acesso Rápido para Teste */}
        <div className="mt-4 sm:mt-8">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-center text-base sm:text-lg">
                Acesso Rápido para Teste
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                Escolha um tipo de usuário para testar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Master Admin */}
              <div className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <div className="flex-1">
                  <h3 className="text-xs font-semibold sm:text-sm">
                    Master Admin
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Acesso total ao sistema
                  </p>
                </div>
                <Button
                  onClick={() => handleQuickLogin('master')}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:w-auto"
                >
                  <span className="hidden sm:inline">
                    Entrar como Roda Ja Master
                  </span>
                  <span className="sm:hidden">Entrar como Master</span>
                </Button>
              </div>

              {/* Establishment Admins */}
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-xs font-medium">
                  Administradores de Estabelecimento:
                </h4>
                {establishments.slice(0, 2).map((establishment) => (
                  <div
                    key={establishment.id}
                    className="flex flex-col gap-2 rounded border p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-medium sm:text-sm">
                        {establishment.name}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        Acesso limitado ao estabelecimento
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        handleQuickLogin(
                          'establishment_admin',
                          establishment.id,
                          establishment.name,
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:w-auto"
                    >
                      Entrar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
