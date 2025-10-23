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
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import type { ListPublicEstablishmentsParams } from '@/lib/api/types'

export type EstablishmentFilterState = {
  page?: number
  limit?: number
  search?: string
  sort?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  slug?: string
  verified?: 'true' | 'false'
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
}

type EstablishmentFiltersProps = {
  value: EstablishmentFilterState
  onChange: (next: EstablishmentFilterState) => void
}

export function EstablishmentFilters({
  value,
  onChange,
}: EstablishmentFiltersProps) {
  const filtersWithValues = useMemo(() => {
    const filters: string[] = []
    if (value.search !== undefined && value.search !== '')
      filters.push('search')
    if (
      (value.sort !== undefined && value.sort !== '') ||
      (value.sortOrder !== undefined && value.sortOrder !== '')
    )
      filters.push('order')
    if (value.slug !== undefined && value.slug !== '') filters.push('slug')
    if (value.verified !== undefined && value.verified !== '')
      filters.push('verified')
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

  const [activeFilters, setActiveFilters] = React.useState<string[]>([])

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
    setActiveFilters((prev) => prev.filter((f) => f !== type))
    // Reset the filter value
    switch (type) {
      case 'search':
        onChange({ ...value, search: undefined })
        break
      case 'order':
        onChange({ ...value, sort: undefined, sortOrder: undefined })
        break
      case 'slug':
        onChange({ ...value, slug: undefined })
        break
      case 'verified':
        onChange({ ...value, verified: undefined })
        break
      case 'created':
        onChange({
          ...value,
          createdAfter: undefined,
          createdBefore: undefined,
        })
        break
      case 'updated':
        onChange({
          ...value,
          updatedAfter: undefined,
          updatedBefore: undefined,
        })
        break
    }
  }

  const options = useMemo(
    () => [
      { value: 'search', label: 'Buscar' },
      { value: 'order', label: 'Ordenar' },
      { value: 'slug', label: 'Slug' },
      { value: 'verified', label: 'Verificado' },
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
              <X
                className="ml-2 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFilter(filter)
                }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">
                  {options.find((o) => o.value === filter)?.label}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {filter === 'search' &&
                    'Busque por nome ou slug do estabelecimento'}
                  {filter === 'order' && 'Defina como ordenar os resultados'}
                  {filter === 'slug' && 'Filtre por slug específico'}
                  {filter === 'verified' && 'Filtre por status de verificação'}
                  {filter === 'created' && 'Filtre por data de criação'}
                  {filter === 'updated' && 'Filtre por data de atualização'}
                </p>
              </div>

              {filter === 'search' && (
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar</Label>
                  <Input
                    id="search"
                    placeholder="Nome ou slug..."
                    value={value.search || ''}
                    onChange={(e) =>
                      onChange({ ...value, search: e.target.value })
                    }
                  />
                </div>
              )}

              {filter === 'order' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="sort">Campo</Label>
                      <Select
                        value={value.sort || ''}
                        onValueChange={(val) =>
                          onChange({ ...value, sort: val as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Nome</SelectItem>
                          <SelectItem value="createdAt">
                            Data de Criação
                          </SelectItem>
                          <SelectItem value="updatedAt">
                            Data de Atualização
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Ordem</Label>
                      <Select
                        value={value.sortOrder || ''}
                        onValueChange={(val) =>
                          onChange({ ...value, sortOrder: val as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Crescente</SelectItem>
                          <SelectItem value="desc">Decrescente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {filter === 'slug' && (
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="slug-do-estabelecimento"
                    value={value.slug || ''}
                    onChange={(e) =>
                      onChange({ ...value, slug: e.target.value })
                    }
                  />
                </div>
              )}

              {filter === 'verified' && (
                <div className="space-y-2">
                  <Label htmlFor="verified">Status de Verificação</Label>
                  <Select
                    value={value.verified || ''}
                    onValueChange={(val) =>
                      onChange({ ...value, verified: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Verificado</SelectItem>
                      <SelectItem value="false">Não Verificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filter === 'created' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="createdAfter">De</Label>
                      <Input
                        id="createdAfter"
                        type="datetime-local"
                        value={value.createdAfter || ''}
                        onChange={(e) =>
                          onChange({ ...value, createdAfter: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="createdBefore">Até</Label>
                      <Input
                        id="createdBefore"
                        type="datetime-local"
                        value={value.createdBefore || ''}
                        onChange={(e) =>
                          onChange({ ...value, createdBefore: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {filter === 'updated' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="updatedAfter">De</Label>
                      <Input
                        id="updatedAfter"
                        type="datetime-local"
                        value={value.updatedAfter || ''}
                        onChange={(e) =>
                          onChange({ ...value, updatedAfter: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="updatedBefore">Até</Label>
                      <Input
                        id="updatedBefore"
                        type="datetime-local"
                        value={value.updatedBefore || ''}
                        onChange={(e) =>
                          onChange({ ...value, updatedBefore: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
