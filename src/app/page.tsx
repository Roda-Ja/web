'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  publicEstablishmentsApi,
  type ListPublicEstablishmentsParams,
} from '@/lib/api'
import {
  EstablishmentFilters,
  type EstablishmentFilterState,
} from '@/components/establishment-filters'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MapPin,
  Clock,
  Phone,
  Truck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [filters, setFilters] = useState<EstablishmentFilterState>({
    page: 1,
    limit: 12,
  })

  const {
    data: establishmentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['public-establishments', filters],
    queryFn: () =>
      publicEstablishmentsApi.list(filters as ListPublicEstablishmentsParams),
  })

  const establishments = establishmentsData?.data || []
  const meta = establishmentsData?.meta

  const handleFilterChange = (newFilters: EstablishmentFilterState) => {
    setFilters({ ...newFilters, page: 1 }) // Reset to first page when filters change
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              🍽️ Roda Já
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
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Nossos Estabelecimentos
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Cada estabelecimento tem seu cardápio único e especialidades.
            Escolha o que mais combina com seu paladar!
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <EstablishmentFilters
              value={filters}
              onChange={handleFilterChange}
            />
            <div className="text-muted-foreground text-sm">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                `${meta?.totalItems || 0} estabelecimentos encontrados`
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <div className="mb-4 text-red-600">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Erro ao carregar estabelecimentos
            </h3>
            <p className="text-gray-600">
              Tente novamente em alguns instantes.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && establishments.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum estabelecimento encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar mais opções.
            </p>
          </div>
        )}

        {/* Estabelecimentos */}
        {!isLoading && !error && establishments.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {establishments.map((establishment, index) => {
                const gradients = [
                  'from-orange-400 to-red-500',
                  'from-blue-400 to-purple-500',
                  'from-green-400 to-teal-500',
                  'from-pink-400 to-rose-500',
                ]
                const gradient = gradients[index % gradients.length]
                const primaryAddress =
                  establishment.addresses.find((addr) => addr.isPrimary) ||
                  establishment.addresses[0]

                return (
                  <Card
                    key={establishment.id}
                    className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className={`h-32 bg-gradient-to-r ${gradient} relative`}
                    >
                      {establishment.imageUrl && (
                        <img
                          src={establishment.imageUrl}
                          alt={establishment.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {establishment.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Cardápio único e especialidades
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        {primaryAddress && (
                          <>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>
                                {primaryAddress.street}, {primaryAddress.number}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>
                                {primaryAddress.neighborhood},{' '}
                                {primaryAddress.city}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="border-t pt-4">
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

            {/* Paginação */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Página {meta.currentPage} de {meta.totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={filters.page === meta.totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold">🍽️ Roda Já</h3>
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
              &copy; 2025 Roda Já. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
