'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReviewCard } from '@/components/reviews/review-card'
import { Star, Search, Filter } from 'lucide-react'
import { reviews, reviewStats } from './data'

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating =
      selectedRating === null || review.rating === selectedRating
    const matchesVerified = !showVerifiedOnly || review.verified

    return matchesSearch && matchesRating && matchesVerified
  })

  const getRatingPercentage = (rating: number) => {
    const total = reviewStats.totalReviews
    const count =
      reviewStats.ratingDistribution[
        rating as keyof typeof reviewStats.ratingDistribution
      ]
    return Math.round((count / total) * 100)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  const renderRatingBar = (rating: number) => {
    const percentage = getRatingPercentage(rating)
    return (
      <div className="flex items-center gap-2">
        <span className="w-8 text-sm font-medium">{rating}</span>
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        <div className="h-2 flex-1 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-muted-foreground w-8 text-right text-sm">
          {percentage}%
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-700">
          Avaliações dos Clientes
        </h1>
        <p className="text-sm text-gray-500">
          Visualize e gerencie as avaliações dos seus produtos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
              Total de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {reviewStats.totalReviews}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold sm:text-2xl">
                {reviewStats.averageRating}
              </span>
              <div className="flex items-center">
                {renderStars(Math.round(reviewStats.averageRating))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
              Avaliações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600 sm:text-2xl">
              {reviewStats.recentReviews}
            </div>
            <p className="text-muted-foreground text-xs">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
              Avaliações Verificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600 sm:text-2xl">
              {reviews.filter((r) => r.verified).length}
            </div>
            <p className="text-muted-foreground text-xs">
              {Math.round(
                (reviews.filter((r) => r.verified).length / reviews.length) *
                  100,
              )}
              % do total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Buscar</label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    placeholder="Nome, produto ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">
                  Avaliação
                </label>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() =>
                        setSelectedRating(
                          selectedRating === rating ? null : rating,
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        {renderStars(rating)}
                        <span className="text-xs">
                          (
                          {
                            reviewStats.ratingDistribution[
                              rating as keyof typeof reviewStats.ratingDistribution
                            ]
                          }
                          )
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant={showVerifiedOnly ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Apenas verificadas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Distribuição de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => renderRatingBar(rating))}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base sm:text-lg">
                  Avaliações ({filteredReviews.length})
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="w-fit"
                >
                  {filteredReviews.length === reviews.length
                    ? 'Todas'
                    : 'Filtradas'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      Nenhuma avaliação encontrada com os filtros aplicados.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
