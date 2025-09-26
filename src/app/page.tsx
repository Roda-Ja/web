'use client'

import { getAllEstablishments } from '@/lib/data/establishments'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Phone, Truck } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const establishments = getAllEstablishments()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              🍽️ DeliveryHub
            </h1>
            <p className="text-lg text-gray-600">
              Conectando você aos melhores estabelecimentos da região
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Cada estabelecimento tem seu próprio cardápio e especialidades
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Nossos Estabelecimentos
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Cada estabelecimento tem seu cardápio único e especialidades.
            Escolha o que mais combina com seu paladar!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {establishments.map((establishment, index) => {
            const gradients = [
              'from-orange-400 to-red-500',
              'from-blue-400 to-purple-500',
              'from-green-400 to-teal-500',
              'from-pink-400 to-rose-500',
            ]
            const gradient = gradients[index % gradients.length]

            return (
              <Card
                key={establishment.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className={`relative h-48 bg-gradient-to-br ${gradient}`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{establishment.name}</h3>
                    <p className="text-sm opacity-90">
                      {establishment.description}
                    </p>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    {establishment.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {establishment.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>{establishment.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{establishment.workingHours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{establishment.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-purple-500" />
                      <span>
                        Taxa: R$ {establishment.deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Pedido mínimo:
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        R$ {establishment.minOrderValue.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/${establishment.slug}`}
                      className="block"
                    >
                      <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                        Ver Cardápio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold">🍽️ DeliveryHub</h3>
          <p className="mb-6 text-gray-300">
            Conectando você aos melhores estabelecimentos da sua região
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a
              href="#"
              className="transition-colors hover:text-white"
            >
              Sobre
            </a>
            <a
              href="#"
              className="transition-colors hover:text-white"
            >
              Contato
            </a>
            <a
              href="/sign-in"
              className="transition-colors hover:text-white"
            >
              Área Admin
            </a>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6">
            <p className="text-sm text-gray-400">
              &copy; 2024 DeliveryHub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
