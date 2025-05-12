'use client'
import { Form } from "@/components/form"
import { Button } from "@/components/ui/button"
import { FormProvider, useForm } from "react-hook-form"

export function SignUpForm() {
  const signInForm = useForm()
  return (
    <FormProvider {...signInForm}>
      <form className="w-full flex flex-col gap-3">
        <Form.Field>
          <Form.Label htmlFor="name-input">Nome:</Form.Label>
          <Form.Input id="name-input" name="name" placeholder="Digite seu nome..." />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="email-input">E-mail:</Form.Label>
          <Form.Input id="email-input" name="email" placeholder="Digite seu e-mail..." />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password-input">Senha:</Form.Label>
          <Form.Input id="password-input" name="password" placeholder="Digite sua senha..." type="password" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="confirm-password-input">Confirme sua Senha:</Form.Label>
          <Form.Input id="confirm-password-input" name="confirm-password" placeholder="Repita a sua senha" type="password" />
        </Form.Field>

        <Button>Criar conta</Button>
      </form>
    </FormProvider>
  )
}