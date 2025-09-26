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
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cardápio - {establishment.name}
          </h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do seu estabelecimento
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AddProductDialog />
          <Link
            href={`/${establishment.slug}`}
            target="_blank"
          >
            <Button variant="outline">Ver Site Público</Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {establishment.products.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {establishment.products.filter((p) => p.isAvailable).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
        <div className="mb-6">
          <TabsList className="inline-flex h-8 w-auto">
            {categories.map((c) => (
              <TabsTrigger
                key={c.value}
                value={c.value}
                className="px-3 text-xs"
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
            className="mt-6"
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
