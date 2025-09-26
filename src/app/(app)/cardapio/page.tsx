'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Category } from '@/components/menu/product-card'
import { ProductCard } from '@/components/menu/product-card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getAllEstablishments } from '@/lib/data/establishments'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Cardapio() {
  const establishments = getAllEstablishments()
  const router = useRouter()
  const isMaster = useAuthStore((state) => state.isMaster())
  const isEstablishmentAdmin = useAuthStore((state) =>
    state.isEstablishmentAdmin(),
  )
  const user = useAuthStore((state) => state.user)
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>(
    establishments[0]?.id || '',
  )

  // Se for admin de estabelecimento, redirecionar para a página específica do estabelecimento
  useEffect(() => {
    if (isEstablishmentAdmin && user?.establishmentId) {
      const userEstablishment = establishments.find(
        (est) => est.id === user.establishmentId,
      )
      if (userEstablishment) {
        router.replace(`/establishment/${userEstablishment.slug}/cardapio`)
      }
    }
  }, [isEstablishmentAdmin, user?.establishmentId, establishments, router])

  // Apenas master admin pode ver esta página
  if (!isMaster) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    )
  }

  const currentEstablishment = establishments.find(
    (est) => est.id === selectedEstablishment,
  )

  if (!currentEstablishment) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">
          Nenhum estabelecimento encontrado
        </h2>
        <p className="text-muted-foreground">
          Adicione estabelecimentos para gerenciar seus cardápios.
        </p>
      </div>
    )
  }

  const categories = [
    { label: 'Todos', value: 'todos' as Category },
    ...currentEstablishment.categories.map((cat) => ({
      label: cat,
      value: cat as Category,
    })),
  ]

  const renderGrid = (category: Category) => {
    const products =
      category === 'todos'
        ? currentEstablishment.products
        : currentEstablishment.products.filter((p) => p.category === category)

    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showAdminControls={false}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header com seleção de estabelecimento */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Cardápios
          </h1>
          <p className="text-muted-foreground">
            Gerencie os produtos e cardápios dos estabelecimentos
          </p>
        </div>
      </div>

      {/* Seleção de estabelecimento */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {establishments.map((establishment) => (
          <Card
            key={establishment.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedEstablishment === establishment.id
                ? 'ring-primary bg-primary/5 ring-2'
                : ''
            }`}
            onClick={() => setSelectedEstablishment(establishment.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{establishment.name}</CardTitle>
              <CardDescription className="text-sm">
                {establishment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  {establishment.products.length} produtos
                </div>
                <Link
                  href={`/${establishment.slug}`}
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Ver Público
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cardápio do estabelecimento selecionado */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Cardápio - {currentEstablishment.name}
          </h2>
          <div className="text-muted-foreground text-sm">
            {currentEstablishment.products.length} produtos cadastrados
          </div>
        </div>

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
      </div>
    </div>
  )
}
