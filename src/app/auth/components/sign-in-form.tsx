'use client'
import { Form } from "@/components/form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FormProvider, useForm } from "react-hook-form"

export function SignInForm() {
  const signInForm = useForm()
  return (
    <FormProvider {...signInForm}>
      <form className="w-full flex flex-col gap-3">
        <Form.Field>
          <Form.Label htmlFor="email-input">E-mail:</Form.Label>
          <Form.Input id="email-input" name="email" placeholder="Digite seu e-mail..." />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password-input">Senha:</Form.Label>
          <Form.Input id="password-input" name="password" placeholder="Digite sua senha..." type="password" />
        </Form.Field>

        <Button>Entrar</Button>

        <Link href={""} className="font-semibold text-blue-500 text-center">Esqueci minha senha</Link>
      </form>
    </FormProvider>
  )
}