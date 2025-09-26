'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, CheckCircle } from 'lucide-react'
import { formatBRL } from '@/components/menu/product-card'
import type { Review } from '@/app/(app)/reviews/data'

type ReviewCardProps = {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
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

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={review.customerAvatar}
                alt={review.customerName}
              />
              <AvatarFallback>
                {review.customerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{review.customerName}</h4>
                {review.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">
            {formatDate(review.date)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {review.comment}
          </p>

          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
            <img
              src={review.productImage}
              alt={review.productName}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h5 className="text-sm font-medium">{review.productName}</h5>
              <div className="mt-1 flex items-center gap-1">
                {renderStars(review.rating)}
                <span className="text-muted-foreground ml-1 text-xs">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
