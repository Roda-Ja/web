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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                <span className="text-sm font-bold">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {establishment.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Voltar aos estabelecimentos
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
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
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-4xl font-bold">{establishment.name}</h2>
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{averageRating}</span>
              </div>
            </div>
            <p className="mb-6 text-xl text-orange-100">
              {establishment.description}
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <div>
                  <p className="text-sm text-orange-200">Endereço</p>
                  <p className="font-medium">{establishment.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="text-sm text-orange-200">Funcionamento</p>
                  <p className="font-medium">{establishment.workingHours}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5" />
                <div>
                  <p className="text-sm text-orange-200">Delivery</p>
                  <p className="font-medium">
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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h3 className="mb-2 text-3xl font-bold text-gray-900">
            Nosso Cardápio
          </h3>
          <p className="text-gray-600">
            Deliciosas opções preparadas com carinho para você
          </p>
        </div>

        <Tabs
          defaultValue="todos"
          className="w-full"
        >
          <div className="mb-6">
            <TabsList className="inline-flex h-8 w-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="px-3 text-xs"
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
              className="mt-6"
            >
              {renderGrid(category.value)}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <span className="text-sm font-bold">🍽️</span>
                </div>
                <span className="text-xl font-bold">{establishment.name}</span>
              </div>
              <p className="text-sm text-gray-300">
                {establishment.description}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Contato</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{establishment.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{establishment.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{establishment.workingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Delivery</h3>
              <div className="space-y-2 text-sm text-gray-300">
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

          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <Link
              href="/"
              className="text-orange-400 transition-colors hover:text-orange-300"
            >
              ← Voltar aos estabelecimentos
            </Link>
            <p className="mt-4 text-sm text-gray-400">
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
