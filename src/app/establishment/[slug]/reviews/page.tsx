'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useAuthStore } from '@/lib/stores/auth-store'
import { notFound } from 'next/navigation'
import { use } from 'react'

interface EstablishmentReviewsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EstablishmentReviewsPage({
  params,
}: EstablishmentReviewsPageProps) {
  const { slug } = use(params)
  const establishment = getEstablishmentBySlug(slug)
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

  // Calcular estatísticas das avaliações
  const totalReviews = establishment.products.reduce(
    (sum, product) => sum + Math.floor(product.rating * 10),
    0,
  )
  const averageRating =
    establishment.products.length > 0
      ? establishment.products.reduce((sum, p) => sum + p.rating, 0) /
        establishment.products.length
      : 0

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    establishment.products.forEach((product) => {
      const rating = Math.round(product.rating)
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Avaliações - {establishment.name}
        </h1>
        <p className="text-muted-foreground">
          Acompanhe as avaliações dos seus produtos
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Avaliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {establishment.products.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Avaliações</CardTitle>
          <CardDescription>
            Como estão distribuídas as avaliações dos seus produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                ratingDistribution[rating as keyof typeof ratingDistribution]
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0

              return (
                <div
                  key={rating}
                  className="flex items-center gap-4"
                >
                  <div className="flex w-16 items-center gap-1">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-12 text-sm">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Produtos com Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos e Suas Avaliações</CardTitle>
          <CardDescription>
            Lista de todos os produtos com suas respectivas avaliações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {establishment.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <Badge
                    variant={product.isAvailable ? 'default' : 'secondary'}
                  >
                    {product.isAvailable ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
