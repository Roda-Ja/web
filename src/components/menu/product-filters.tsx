'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { X } from 'lucide-react'

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
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const next: string[] = []
    if (value.search !== undefined) next.push('search')
    if (value.sort !== undefined || value.sortOrder !== undefined)
      next.push('order')
    if (value.categoryId !== undefined) next.push('category')
    if (value.isActive !== undefined) next.push('status')
    if (value.minPrice !== undefined || value.maxPrice !== undefined)
      next.push('price')
    if (value.createdAfter !== undefined || value.createdBefore !== undefined)
      next.push('created')
    if (value.updatedAfter !== undefined || value.updatedBefore !== undefined)
      next.push('updated')
    setActiveFilters((prev) => {
      const merged = [...prev]
      for (const f of next) if (!merged.includes(f)) merged.push(f)
      return merged.filter((f) => next.includes(f))
    })
  }, [value])

  const addFilter = (type: string) => {
    setActiveFilters((prev) => (prev.includes(type) ? prev : [...prev, type]))
  }

  const removeFilter = (type: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== type))
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
              disabled={activeFilters.includes(opt.value)}
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
              className="gap-1"
            >
              {options.find((o) => o.value === filter)?.label}
              <X
                className="h-3.5 w-3.5 opacity-60"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFilter(filter)
                }}
              />
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
              <select
                value={value.categoryId || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    categoryId: e.target.value || undefined,
                  })
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none"
              >
                <option value="">Todas as categorias</option>
                <option value="1e064214-19fb-4f85-9b9c-7a5a393b29ba">
                  Categoria padrão
                </option>
              </select>
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
