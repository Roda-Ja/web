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
  return <InputLib {...props} {...field} />
}
