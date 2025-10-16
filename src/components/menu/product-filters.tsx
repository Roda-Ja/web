'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CategorySelect } from '@/components/menu/category-select'

export type ProductFilterState = {
  search?: string
  sort?: 'name' | 'price' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  categoryId?: string
  isActive?: 'true' | 'false'
  minPrice?: number
  maxPrice?: number
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
}

type ProductFiltersProps = {
  value: ProductFilterState
  onChange: (next: ProductFilterState) => void
}

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
  // Filtros que têm valores (para mostrar checkmark no dropdown)
  const filtersWithValues = useMemo(() => {
    const filters: string[] = []
    if (value.search !== undefined && value.search !== '')
      filters.push('search')
    if (
      (value.sort !== undefined && value.sort !== '') ||
      (value.sortOrder !== undefined && value.sortOrder !== '')
    )
      filters.push('order')
    if (value.categoryId !== undefined && value.categoryId !== '')
      filters.push('category')
    if (value.isActive !== undefined && value.isActive !== '')
      filters.push('status')
    if (
      (value.minPrice !== undefined && value.minPrice > 0) ||
      (value.maxPrice !== undefined && value.maxPrice > 0)
    )
      filters.push('price')
    if (
      (value.createdAfter !== undefined && value.createdAfter !== '') ||
      (value.createdBefore !== undefined && value.createdBefore !== '')
    )
      filters.push('created')
    if (
      (value.updatedAfter !== undefined && value.updatedAfter !== '') ||
      (value.updatedBefore !== undefined && value.updatedBefore !== '')
    )
      filters.push('updated')
    return filters
  }, [value])

  // Filtros ativos (podem ou não ter valores ainda)
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])

  // Sincronizar: adicionar filtros com valores se ainda não estiverem na lista
  React.useEffect(() => {
    if (filtersWithValues.length > 0) {
      setActiveFilters((prev) => {
        const combined = [...new Set([...prev, ...filtersWithValues])]
        return combined
      })
    }
  }, [filtersWithValues])

  const addFilter = (type: string) => {
    if (!activeFilters.includes(type)) {
      setActiveFilters((prev) => [...prev, type])
    }
  }

  const removeFilter = (type: string) => {
    // Remover da lista de ativos
    setActiveFilters((prev) => prev.filter((f) => f !== type))
    // Remover os valores do filtro
    if (type === 'search') onChange({ ...value, search: undefined })
    if (type === 'order')
      onChange({ ...value, sort: undefined, sortOrder: undefined })
    if (type === 'category') onChange({ ...value, categoryId: undefined })
    if (type === 'status') onChange({ ...value, isActive: undefined })
    if (type === 'price')
      onChange({ ...value, minPrice: undefined, maxPrice: undefined })
    if (type === 'created')
      onChange({ ...value, createdAfter: undefined, createdBefore: undefined })
    if (type === 'updated')
      onChange({ ...value, updatedAfter: undefined, updatedBefore: undefined })
  }

  const options = useMemo(
    () => [
      { value: 'search', label: 'Busca' },
      { value: 'order', label: 'Ordenação' },
      { value: 'category', label: 'Categoria' },
      { value: 'status', label: 'Status' },
      { value: 'price', label: 'Preço' },
      { value: 'created', label: 'Criado em' },
      { value: 'updated', label: 'Atualizado em' },
    ],
    [],
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select onValueChange={addFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Adicionar filtro" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={filtersWithValues.includes(opt.value)}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFilters.map((filter) => (
        <Popover key={filter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              {options.find((o) => o.value === filter)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            {filter === 'search' && (
              <Input
                autoFocus
                placeholder="Buscar por nome ou descrição"
                value={value.search || ''}
                onChange={(e) =>
                  onChange({ ...value, search: e.target.value || undefined })
                }
              />
            )}

            {filter === 'order' && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={value.sort || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      sort: (e.target.value as any) || undefined,
                    })
                  }
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none"
                >
                  <option value="">Ordenar por…</option>
                  <option value="name">Nome</option>
                  <option value="price">Preço</option>
                  <option value="createdAt">Criado em</option>
                  <option value="updatedAt">Atualizado em</option>
                </select>
                <select
                  value={value.sortOrder || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      sortOrder: (e.target.value as any) || undefined,
                    })
                  }
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none"
                >
                  <option value="">Ordem</option>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            )}

            {filter === 'category' && (
              <CategorySelect
                value={value.categoryId || ''}
                onChange={(categoryId) =>
                  onChange({
                    ...value,
                    categoryId: categoryId || undefined,
                  })
                }
                placeholder="Todas as categorias"
                allowEmpty={true}
              />
            )}

            {filter === 'status' && (
              <select
                value={value.isActive || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    isActive: (e.target.value as any) || undefined,
                  })
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none"
              >
                <option value="">Status</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            )}

            {filter === 'price' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Preço mín"
                  value={value.minPrice?.toString() || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Preço máx"
                  value={value.maxPrice?.toString() || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            )}

            {filter === 'created' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="datetime-local"
                  value={value.createdAfter || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      createdAfter: e.target.value || undefined,
                    })
                  }
                />
                <Input
                  type="datetime-local"
                  value={value.createdBefore || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      createdBefore: e.target.value || undefined,
                    })
                  }
                />
              </div>
            )}

            {filter === 'updated' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="datetime-local"
                  value={value.updatedAfter || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      updatedAfter: e.target.value || undefined,
                    })
                  }
                />
                <Input
                  type="datetime-local"
                  value={value.updatedBefore || ''}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      updatedBefore: e.target.value || undefined,
                    })
                  }
                />
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFilter(filter)}
              >
                Remover filtro
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
