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

  const [establishmentNotFound, setEstablishmentNotFound] =
    useState<boolean>(false)

  // Se for admin de estabelecimento, redirecionar para a página específica do estabelecimento
  useEffect(() => {
    if (isEstablishmentAdmin && user?.establishmentId) {
      // Tenta encontrar pelo ID do estabelecimento
      let userEstablishment = establishments.find(
        (est) => est.id === user.establishmentId,
      )

      // Fallback: tenta por slug derivado do nome do usuário (ex.: "Roda já" -> "roda-ja")
      if (!userEstablishment && user?.name) {
        const slug = user.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '')
        userEstablishment = establishments.find((est) => est.slug === slug)
      }

      if (userEstablishment) {
        router.replace(`/establishment/${userEstablishment.slug}/cardapio`)
      } else {
        // Se não encontrou o estabelecimento, marca como não encontrado
        setEstablishmentNotFound(true)
      }
    }
  }, [isEstablishmentAdmin, user?.establishmentId, establishments, router])

  // Verificar se o usuário está autenticado
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você precisa estar logado para acessar esta página.
        </p>
      </div>
    )
  }

  // Se for admin de estabelecimento, não renderiza nada desta página
  if (isEstablishmentAdmin) {
    if (establishmentNotFound) {
      return (
        <div className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Estabelecimento Não Encontrado
          </h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível encontrar o estabelecimento associado à sua conta.
          </p>
          <p className="text-muted-foreground text-sm">
            Entre em contato com o suporte para resolver este problema.
          </p>
        </div>
      )
    }

    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Redirecionando…</h2>
        <p className="text-muted-foreground text-sm">
          Indo para o seu cardápio do estabelecimento.
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
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Header com seleção de estabelecimento */}
      <div className="mb-2 flex flex-col gap-2 sm:mb-4 sm:gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Cardápios
          </h1>
          <p className="text-muted-foreground text-sm">
            {isMaster
              ? 'Gerencie os produtos e cardápios dos estabelecimentos'
              : 'Visualize os produtos e cardápios disponíveis'}
          </p>
        </div>
      </div>

      {/* Seleção de estabelecimento - apenas para master */}
      {isMaster && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="truncate text-base sm:text-lg">
                  {establishment.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                  {establishment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {establishment.products.length} produtos
                  </div>
                  <Link
                    href={`/${establishment.slug}`}
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:w-auto"
                    >
                      Ver Público
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cardápio do estabelecimento selecionado */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">
            Cardápio - {currentEstablishment.name}
          </h2>
          <div className="text-muted-foreground text-xs sm:text-sm">
            {currentEstablishment.products.length} produtos cadastrados
          </div>
        </div>

        <Tabs
          defaultValue="todos"
          className="w-full"
        >
          <div className="mb-4 overflow-x-auto sm:mb-6">
            <TabsList className="inline-flex h-7 w-auto sm:h-8">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.value}
                  value={c.value}
                  className="px-2 text-xs whitespace-nowrap sm:px-3"
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
      </div>
    </div>
  )
}
