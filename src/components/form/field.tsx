import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export function Field({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props} />
  )
}
