'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Loader2, UtensilsCrossed } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

type CategoryTabsProps = {
  value?: string
  onChange: (categoryId?: string) => void
  className?: string
}

export function CategoryTabs({
  value,
  onChange,
  className,
}: CategoryTabsProps) {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories-tabs'],
    queryFn: () =>
      productsApi.listCategories({
        page: 1,
        limit: 50,
      }),
  })

  const categories = categoriesData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Gradiente de fade nas bordas para indicar scroll */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent sm:w-12" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent sm:w-12" />

      <div className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1 sm:gap-2">
        {/* Botão "Todos" */}
        <Button
          variant={!value || value === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(undefined)}
          className={cn(
            'shrink-0 rounded-full px-3 text-xs font-medium shadow-sm transition-all duration-200 sm:px-5 sm:text-sm',
            !value || value === ''
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50',
          )}
        >
          <UtensilsCrossed className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">Todos</span>
        </Button>

        {/* Botões de categorias */}
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={value === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(category.value)}
            className={cn(
              'shrink-0 rounded-full px-3 text-xs font-medium shadow-sm transition-all duration-200 sm:px-5 sm:text-sm',
              value === category.value
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50',
            )}
          >
            <span className="whitespace-nowrap">{category.label}</span>
          </Button>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

