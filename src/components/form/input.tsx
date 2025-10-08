'use client'
import { Input as InputLib } from '@/components/ui/input'
import { ComponentProps } from 'react'
import { useController, useFormContext } from 'react-hook-form'

interface InputProps extends ComponentProps<typeof InputLib> {
  name: string
}

export function Input({ name, ...props }: InputProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })

  // Garantir que o value seja sempre uma string para evitar o erro de controlled/uncontrolled
  const controlledField = {
    ...field,
    value: field.value ?? '',
  }

  return (
    <InputLib
      {...props}
      {...controlledField}
    />
  )
}
