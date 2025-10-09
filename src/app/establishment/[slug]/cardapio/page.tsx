'use client'

import { useState, use, useEffect } from 'react'
import type { Category } from '@/components/menu/product-card'
import type { Product } from '@/lib/data/establishments'
import { ProductCard } from '@/components/menu/product-card'
import { AddProductDialog } from '@/components/menu/add-product-dialog'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ProductFilters,
  type ProductFilterState,
} from '@/components/menu/product-filters'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EstablishmentCardapioPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EstablishmentCardapioPage({
  params,
}: EstablishmentCardapioPageProps) {
  const { slug } = use(params)
  const establishment = getEstablishmentBySlug(slug)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<
    'name' | 'price' | 'createdAt' | 'updatedAt' | ''
  >('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [isActiveFilter, setIsActiveFilter] = useState<'' | 'true' | 'false'>(
    '',
  )
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [createdAfter, setCreatedAfter] = useState<string>('')
  const [createdBefore, setCreatedBefore] = useState<string>('')
  const [updatedAfter, setUpdatedAfter] = useState<string>('')
  const [updatedBefore, setUpdatedBefore] = useState<string>('')
  const canManage = useAuthStore((state) =>
    state.canManageEstablishment(establishment?.id || ''),
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: metricsData } = useQuery({
    queryKey: ['product-metrics'],
    queryFn: () => productsApi.getMetrics(),
  })

  const { data: listData, isLoading } = useQuery({
    queryKey: [
      'products',
      {
        slug,
        page,
        limit,
        search,
        sort,
        sortOrder,
        categoryId,
        isActiveFilter,
        minPrice,
        maxPrice,
        createdAfter,
        createdBefore,
        updatedAfter,
        updatedBefore,
      },
    ],
    queryFn: () =>
      productsApi.list({
        page,
        limit,
        search: search || undefined,
        sort: (sort || undefined) as
          | 'name'
          | 'price'
          | 'createdAt'
          | 'updatedAt'
          | undefined,
        sortOrder: (sortOrder || undefined) as 'asc' | 'desc' | undefined,
        categoryId: categoryId || undefined,
        isActive: (isActiveFilter || undefined) as 'true' | 'false' | undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        createdAfter: createdAfter || undefined,
        createdBefore: createdBefore || undefined,
        updatedAfter: updatedAfter || undefined,
        updatedBefore: updatedBefore || undefined,
      }),
    enabled: mounted && !!establishment && canManage,
  })

  const apiProducts = (listData?.data || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.oldPrice,
    image: p.imageUrl || '/next.svg',
    category: 'todos',
    tag: undefined,
    rating: 0,
    isAvailable: p.isActive,
    establishmentId: establishment?.id || '',
  })) as Product[]

  const meta = listData?.meta
  if (!establishment) {
    notFound()
  }

  if (!mounted) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Carregando…</h2>
        <p className="text-muted-foreground text-sm">
          Preparando seu cardápio do estabelecimento.
        </p>
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para gerenciar este estabelecimento.
        </p>
      </div>
    )
  }

  const renderGrid = (category: Category) => {
    const products =
      category === 'todos'
        ? apiProducts
        : apiProducts.filter((p) => p.category === category)

    return (
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-4">
        {products.length === 0 && (
          <div className="text-muted-foreground col-span-full rounded-md border p-6 text-center text-sm">
            {isLoading ? 'Carregando produtos…' : 'Nenhum produto encontrado.'}
          </div>
        )}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showAdminControls={true}
            onEdit={() => {
              setEditingProduct(product)
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Header */}
      <div className="mb-2 flex flex-col gap-4 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Cardápio - {establishment.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os produtos do seu estabelecimento
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <AddProductDialog />
          <Link
            href={`/${establishment.slug}`}
            target="_blank"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Ver Site Público</span>
              <span className="sm:hidden">Site Público</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {metricsData?.totalProducts ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Produtos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {metricsData?.activeProducts ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {metricsData?.totalProductCategories ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros em Sheet/Drawer */}
      <div className="mb-3 flex items-center justify-between">
        <ProductFilters
          value={{
            search: search || undefined,
            sort: (sort || undefined) as any,
            sortOrder: (sortOrder || undefined) as any,
            categoryId: categoryId || undefined,
            isActive: (isActiveFilter || undefined) as any,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            createdAfter: createdAfter || undefined,
            createdBefore: createdBefore || undefined,
            updatedAfter: updatedAfter || undefined,
            updatedBefore: updatedBefore || undefined,
          }}
          onChange={(next: ProductFilterState) => {
            setPage(1)
            setSearch(next.search || '')
            setSort((next.sort as any) || '')
            setSortOrder((next.sortOrder as any) || '')
            setCategoryId(next.categoryId || '')
            setIsActiveFilter((next.isActive as any) || '')
            setMinPrice(
              typeof next.minPrice === 'number' ? String(next.minPrice) : '',
            )
            setMaxPrice(
              typeof next.maxPrice === 'number' ? String(next.maxPrice) : '',
            )
            setCreatedAfter(next.createdAfter || '')
            setCreatedBefore(next.createdBefore || '')
            setUpdatedAfter(next.updatedAfter || '')
            setUpdatedBefore(next.updatedBefore || '')
          }}
        />
        <div className="text-muted-foreground text-xs">
          {meta?.totalItems ?? 0} resultados
        </div>
      </div>

      {/* Cardápio (sem filtro por abas) */}
      <div className="w-full">{renderGrid('todos')}</div>

      {/* Paginação */}
      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
        <div>
          Página {meta?.currentPage ?? page} de {meta?.totalPages ?? 1} • Itens
          por página: {meta?.itemsPerPage ?? limit}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={(meta?.currentPage ?? page) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta ? meta.currentPage >= meta.totalPages : true}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* Modal de Edição */}
      <AddProductDialog
        editingProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
        showTrigger={false}
      />
    </div>
  )
}
