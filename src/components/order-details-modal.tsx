'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard,
  MapPin,
  Clock,
  User,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
} from 'lucide-react'

interface OrderDetailsModalProps {
  orderId: string | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({
  orderId,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const {
    data: orderDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => ordersApi.getDetails(orderId!),
    enabled: !!orderId && isOpen,
  })

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'PAID':
        return 'Pago'
      case 'CANCELLED':
        return 'Cancelado'
      case 'IN_PROGRESS':
        return 'Em Andamento'
      case 'COMPLETED':
        return 'Completo'
      default:
        return status
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary'
      case 'PAID':
      case 'COMPLETED':
        return 'default'
      case 'CANCELLED':
        return 'destructive'
      case 'IN_PROGRESS':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD':
        return 'Cartão de Crédito'
      case 'DEBIT_CARD':
        return 'Cartão de Débito'
      case 'PIX':
        return 'PIX'
      case 'MONEY':
        return 'Dinheiro'
      default:
        return method
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Pedido
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <div className="mb-4 text-red-600">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Erro ao carregar detalhes
            </h3>
            <p className="text-gray-600">
              Não foi possível carregar os detalhes do pedido.
            </p>
          </div>
        )}

        {orderDetails && (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Pedido #{orderDetails.id.slice(0, 8)}
                </h3>
                <Badge variant={getStatusBadgeVariant(orderDetails.status)}>
                  {getStatusText(orderDetails.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="font-semibold">
                      R$ {orderDetails.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Método de Pagamento</p>
                    <p className="font-medium">
                      {getPaymentMethodText(orderDetails.paymentMethod)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status do Pagamento e Entrega */}
            <div className="space-y-4">
              <h4 className="font-semibold">Status</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">Pagamento</span>
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(orderDetails.paymentStatus)}
                  >
                    {getStatusText(orderDetails.paymentStatus)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Entrega</span>
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(orderDetails.deliveryStatus)}
                  >
                    {getStatusText(orderDetails.deliveryStatus)}
                  </Badge>
                </div>
              </div>

              {orderDetails.deliveredAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Entregue em</p>
                    <p className="font-medium">
                      {new Date(orderDetails.deliveredAt).toLocaleString(
                        'pt-BR',
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Informações de Identificação */}
            <div className="space-y-4">
              <h4 className="font-semibold">Identificação</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Estabelecimento</p>
                    <p className="text-sm font-medium">
                      {orderDetails.establishmentId.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Endereço</p>
                    <p className="text-sm font-medium">
                      {orderDetails.addressId.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="text-sm font-medium">
                      {orderDetails.customerId.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Datas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Datas</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Criado em</p>
                    <p className="font-medium">
                      {new Date(orderDetails.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Atualizado em</p>
                    <p className="font-medium">
                      {new Date(orderDetails.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
