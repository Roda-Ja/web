'use client'

import { useState, use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Category } from '@/components/menu/product-card'
import type { Product } from '@/lib/data/establishments'
import { ProductCard } from '@/components/menu/product-card'
import { AddProductDialog } from '@/components/menu/add-product-dialog'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const canManage = useAuthStore((state) =>
    state.canManageEstablishment(establishment?.id || ''),
  )

  if (!establishment) {
    notFound()
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

  const categories = [
    { label: 'Todos', value: 'todos' as Category },
    ...establishment.categories.map((cat) => ({
      label: cat,
      value: cat as Category,
    })),
  ]

  const renderGrid = (category: Category) => {
    const products =
      category === 'todos'
        ? establishment.products
        : establishment.products.filter((p) => p.category === category)

    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {establishment.products.length}
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
              {establishment.products.filter((p) => p.isAvailable).length}
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
              {establishment.categories.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cardápio */}
      <Tabs
        defaultValue="todos"
        className="w-full"
      >
        <div className="mb-4 sm:mb-6">
          <TabsList className="inline-flex h-7 w-auto sm:h-8">
            {categories.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className="px-2 text-xs sm:px-3"
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((c) => (
          <TabsContent
            key={c.value}
            value={c.value}
            className="mt-4 sm:mt-6"
          >
            {renderGrid(c.value)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal de Edição */}
      <AddProductDialog
        editingProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
        showTrigger={false}
      />
    </div>
  )
}
