'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

type CategorySelectProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  allowEmpty?: boolean
}

export function CategorySelect({
  value,
  onChange,
  disabled,
  placeholder = 'Selecione uma categoria',
  allowEmpty = false,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchCategory, setSearchCategory] = useState('')
  const containerRef = useRef<React.ElementRef<'div'>>(null)

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['categories', searchCategory],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.listCategories({
        page: pageParam,
        limit: 10,
        search: searchCategory,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  const categories = categoriesData?.pages.flatMap((page) => page.data) || []
  const selectedCategory = categories.find((cat) => cat.value === value)

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    /* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
    if (typeof window !== 'undefined') {
      ;(window.document as any).addEventListener(
        'mousedown',
        handleClickOutside,
      )
      return () => {
        ;(window.document as any).removeEventListener(
          'mousedown',
          handleClickOutside,
        )
      }
    }
    /* eslint-enable no-undef, @typescript-eslint/no-explicit-any */
  }, [open])

  const handleScroll = useCallback(
    (e: React.UIEvent<React.ElementRef<'div'>>) => {
      const target = e.currentTarget
      const scrollPercentage =
        (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100

      if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  const handleSelect = (categoryValue: string) => {
    onChange(categoryValue)
    setOpen(false)
    setSearchCategory('')
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span className={cn(!value && 'text-muted-foreground')}>
          {selectedCategory?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 opacity-50 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full rounded-md border shadow-md">
          <div className="flex flex-col">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar categoria..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-8 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              onScroll={handleScroll}
              className="max-h-[200px] overflow-y-auto"
            >
              {allowEmpty && (
                <div
                  onClick={() => handleSelect('')}
                  className={cn(
                    'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors outline-none',
                    value === '' && 'bg-accent',
                  )}
                >
                  Todas as categorias
                </div>
              )}
              {isLoadingCategories && categories.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  Carregando...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  Nenhuma categoria encontrada
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() => handleSelect(category.value)}
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors outline-none',
                      value === category.value && 'bg-accent',
                    )}
                  >
                    {category.label}
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className="text-muted-foreground p-2 text-center text-xs">
                  Carregando mais...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
