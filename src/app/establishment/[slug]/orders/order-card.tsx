'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { FileText, MessageCircle } from 'lucide-react'
import type { OrderResponse } from '@/lib/api/types'

interface OrderCardProps {
  order: OrderResponse
  getPaymentMethodText: (method: string) => string
  buttonLabel: string
  onButtonClick: (orderId: string) => void
  onDetailsClick?: (orderId: string) => void
  showBadge?: boolean
  badgeText?: string
  isLoading?: boolean
  mobileLabel?: string
}

export function OrderCard({
  order,
  getPaymentMethodText,
  buttonLabel,
  onButtonClick,
  onDetailsClick,
  showBadge = false,
  badgeText,
  isLoading = false,
  mobileLabel,
}: OrderCardProps) {
  const customerName = order.customer?.name || 'Cliente não informado'
  const customerPhone = order.customer?.phone || ''
  const address = order.address
    ? `${order.address.street}, ${order.address.number}${order.address.neighborhood ? ` - ${order.address.neighborhood}` : ''}`
    : 'Endereço não informado'

  return (
    <Card
      key={order.id}
      className="overflow-hidden"
    >
      <CardContent className="relative p-3 pr-12 sm:p-4 sm:pr-14">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 z-10 h-8 w-8 sm:h-9 sm:w-9"
          onClick={() => onDetailsClick?.(order.id)}
        >
          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1 space-y-1.5 sm:space-y-2">
            <CardTitle className="text-base font-bold sm:text-lg">
              Pedido #{order.id.slice(0, 8).toUpperCase()}
            </CardTitle>

            <div className="space-y-1 text-xs text-gray-600 sm:text-sm">
              <div className="space-y-0.5">
                <p className="font-medium text-gray-800">{customerName}</p>
                {customerPhone && <p>Tel: {customerPhone}</p>}
                <p className="line-clamp-1" title={address}>{address}</p>
              </div>
              <p>
                Pagamento:{' '}
                <span className="font-medium">
                  {getPaymentMethodText(order.paymentMethod)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
            <div className="text-left sm:text-right">
              <p className="text-base font-bold sm:text-lg">
                R$ {order.totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              {showBadge ? (
                <Badge className="bg-green-100 text-xs text-green-800 sm:text-sm">
                  {badgeText}
                </Badge>
              ) : (
                <>
                  {buttonLabel && (
                    <Button
                      onClick={() => onButtonClick(order.id)}
                      disabled={isLoading}
                      className="bg-blue-600 text-xs hover:bg-blue-700 sm:text-sm"
                      size="sm"
                    >
                      <span className="hidden sm:inline">{buttonLabel}</span>
                      <span className="sm:hidden">
                        {mobileLabel || buttonLabel}
                      </span>
                    </Button>
                  )}
                  {customerPhone && (
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 sm:h-9 sm:w-9"
                      onClick={() => window.open(`https://wa.me/55${customerPhone.replace(/\D/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
