'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/menu/product-card'
import { PublicCart } from '@/components/menu/public-cart'
import { Toaster } from '@/components/ui/sonner'
import {
  getEstablishmentBySlug,
  type Establishment,
  type Product,
} from '@/lib/data/establishments'
import { MapPin, Clock, Phone, Truck, Star } from 'lucide-react'
import Link from 'next/link'

interface EstablishmentPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EstablishmentPage({ params }: EstablishmentPageProps) {
  const { slug } = use(params)
  const establishment = getEstablishmentBySlug(slug)

  if (!establishment) {
    notFound()
  }

  const categories = [
    { label: 'Todos', value: 'todos' },
    ...establishment.categories.map((cat) => ({ label: cat, value: cat })),
  ]

  const renderGrid = (category: string) => {
    const products =
      category === 'todos'
        ? establishment.products
        : establishment.products.filter((p) => p.category === category)

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    )
  }

  const averageRating =
    establishment.products.length > 0
      ? (
          establishment.products.reduce((sum, p) => sum + p.rating, 0) /
          establishment.products.length
        ).toFixed(1)
      : '0.0'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white sm:h-10 sm:w-10">
                <span className="text-xs font-bold sm:text-sm">🍽️</span>
              </div>
              <div>
                <h1 className="truncate text-base font-bold text-gray-900 sm:text-xl">
                  {establishment.name}
                </h1>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Voltar aos estabelecimentos
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-4 md:flex md:gap-6">
              <a
                href="#cardapio"
                className="text-sm font-medium text-gray-600 hover:text-orange-500"
              >
                Cardápio
              </a>
              <a
                href="#sobre"
                className="text-sm font-medium text-gray-600 hover:text-orange-500"
              >
                Sobre
              </a>
              <a
                href="#contato"
                className="text-sm font-medium text-gray-600 hover:text-orange-500"
              >
                Contato
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-8 text-white sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                {establishment.name}
              </h2>
              <div className="flex w-fit items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                <Star className="h-3 w-3 fill-current sm:h-4 sm:w-4" />
                <span className="text-xs font-medium sm:text-sm">
                  {averageRating}
                </span>
              </div>
            </div>
            <p className="mb-6 text-base text-orange-100 sm:text-lg lg:text-xl">
              {establishment.description}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-xs text-orange-200 sm:text-sm">Endereço</p>
                  <p className="truncate text-sm font-medium sm:text-base">
                    {establishment.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-xs text-orange-200 sm:text-sm">
                    Funcionamento
                  </p>
                  <p className="text-sm font-medium sm:text-base">
                    {establishment.workingHours}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <p className="text-xs text-orange-200 sm:text-sm">Delivery</p>
                  <p className="text-sm font-medium sm:text-base">
                    R$ {establishment.deliveryFee.toFixed(2)} • Min: R${' '}
                    {establishment.minOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Nosso Cardápio
          </h3>
          <p className="text-sm text-gray-600 sm:text-base">
            Deliciosas opções preparadas com carinho para você
          </p>
        </div>

        <Tabs
          defaultValue="todos"
          className="w-full"
        >
          <div className="mb-4 overflow-x-auto sm:mb-6">
            <TabsList className="inline-flex h-7 w-auto sm:h-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="px-2 text-xs whitespace-nowrap sm:px-3"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent
              key={category.value}
              value={category.value}
              className="mt-4 sm:mt-6"
            >
              {renderGrid(category.value)}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-white sm:h-8 sm:w-8">
                  <span className="text-xs font-bold sm:text-sm">🍽️</span>
                </div>
                <span className="truncate text-lg font-bold sm:text-xl">
                  {establishment.name}
                </span>
              </div>
              <p className="text-xs text-gray-300 sm:text-sm">
                {establishment.description}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
                Contato
              </h3>
              <div className="space-y-2 text-xs text-gray-300 sm:text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  <span className="truncate">{establishment.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  <span className="truncate">{establishment.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  <span>{establishment.workingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
                Delivery
              </h3>
              <div className="space-y-2 text-xs text-gray-300 sm:text-sm">
                <p>
                  Taxa de entrega: R$ {establishment.deliveryFee.toFixed(2)}
                </p>
                <p>
                  Pedido mínimo: R$ {establishment.minOrderValue.toFixed(2)}
                </p>
                <p>Tempo estimado: 30-45 min</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-800 pt-6 text-center sm:mt-8 sm:pt-8">
            <Link
              href="/"
              className="text-sm text-orange-400 transition-colors hover:text-orange-300 sm:text-base"
            >
              ← Voltar aos estabelecimentos
            </Link>
            <p className="mt-3 text-xs text-gray-400 sm:mt-4 sm:text-sm">
              &copy; 2024 {establishment.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Carrinho público */}
      <PublicCart />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
