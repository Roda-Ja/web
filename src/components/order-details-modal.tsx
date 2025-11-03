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
  MessageCircle,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      case 'APPROVED':
        return 'Aprovado'
      case 'REJECTED':
        return 'Rejeitado'
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
      case 'APPROVED':
        return 'default'
      case 'CANCELLED':
      case 'REJECTED':
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

  const formatDate = (date: string | null | undefined) => {
    if (!date) return null
    try {
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) return null
      return parsedDate.toLocaleString('pt-BR')
    } catch {
      return null
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes do Pedido
            </DialogTitle>
            {orderDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="print:hidden gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            )}
          </div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Pedido #{orderDetails.id.slice(0, 8)}
                </h3>
                <Badge variant={getStatusBadgeVariant(orderDetails.status)}>
                  {getStatusText(orderDetails.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                <div className="flex items-center gap-3">
                  {orderDetails.deliveryType === 'pickup' ? (
                    <>
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Recebimento</p>
                        <p className="font-medium text-purple-600">Retirada</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Recebimento</p>
                        <p className="font-medium text-orange-600">Entrega</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Status</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                {orderDetails.approvalStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Aprovação</span>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(
                        orderDetails.approvalStatus,
                      )}
                    >
                      {getStatusText(orderDetails.approvalStatus)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {orderDetails.products && orderDetails.products.length > 0 && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold">Produtos do Pedido</h4>
                  <div className="space-y-3">
                    {orderDetails.products.map((product, index) => (
                      <div
                        key={product.id + index}
                        className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-14 w-14 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium">{product.name}</h5>
                          <p className="text-sm text-gray-600">
                            Quantidade: {product.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            R$ {product.price.toFixed(2)}
                          </p>
                          <p className="font-semibold text-blue-600">
                            R$ {(product.price * product.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {orderDetails.customer && (
                <div className="flex h-full flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Cliente
                    </h4>
                    {orderDetails.customer.phone && (
                      <Button
                        size="sm"
                        className="h-8 gap-2 bg-green-500 hover:bg-green-600"
                        onClick={() =>
                          window.open(
                            `https://wa.me/55${orderDetails.customer.phone.replace(/\D/g, '')}`,
                            '_blank',
                          )
                        }
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2.5 rounded-lg border bg-gray-50 p-3.5">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nome</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">
                        {orderDetails.customer.name}
                      </p>
                    </div>
                    {orderDetails.customer.phone && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Telefone
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {orderDetails.customer.phone}
                        </p>
                      </div>
                    )}
                    {orderDetails.customer.email && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          E-mail
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {orderDetails.customer.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {orderDetails.address && (
                <div className="flex h-full flex-col space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4" />
                    Endereço de Entrega
                  </h4>
                  <div className="flex-1 space-y-1.5 rounded-lg border bg-gray-50 p-3.5">
                    <p className="text-sm font-medium text-gray-900">
                      {orderDetails.address.street},{' '}
                      {orderDetails.address.number}
                    </p>
                    {orderDetails.address.complement && (
                      <p className="text-xs text-gray-600">
                        {orderDetails.address.complement}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      {orderDetails.address.neighborhood}
                    </p>
                    <p className="text-xs text-gray-600">
                      {orderDetails.address.city} - {orderDetails.address.state}
                    </p>
                    <p className="text-xs text-gray-600">
                      CEP: {orderDetails.address.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {orderDetails.establishment && (
                <div className="flex h-full flex-col space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4" />
                    Estabelecimento
                  </h4>
                  <div className="flex-1 space-y-2.5 rounded-lg border bg-gray-50 p-3.5">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Nome</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">
                        {orderDetails.establishment.name}
                      </p>
                    </div>
                    {orderDetails.establishment.slug && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Slug
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {orderDetails.establishment.slug}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex h-full flex-col space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4" />
                  Datas
                </h4>
                <div className="flex-1 space-y-2.5 rounded-lg border bg-gray-50 p-3.5">
                  {formatDate(
                    orderDetails.createdAt || orderDetails.customer?.createdAt,
                  ) && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Pedido criado em
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">
                        {formatDate(
                          orderDetails.createdAt ||
                            orderDetails.customer?.createdAt,
                        )}
                      </p>
                    </div>
                  )}
                  {formatDate(
                    orderDetails.updatedAt || orderDetails.customer?.updatedAt,
                  ) && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Atualizado em
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">
                        {formatDate(
                          orderDetails.updatedAt ||
                            orderDetails.customer?.updatedAt,
                        )}
                      </p>
                    </div>
                  )}
                  {formatDate(orderDetails.deliveredAt) && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Entregue em
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-green-600">
                        {formatDate(orderDetails.deliveredAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {orderDetails && (
          <div className="hidden print:block">
            <style jsx global>{`
              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                body * {
                  visibility: hidden;
                }
                .print-content,
                .print-content * {
                  visibility: visible;
                }
                .print-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  max-width: 80mm;
                  padding: 10mm;
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 12px;
                  line-height: 1.4;
                  color: #000;
                  background: #fff;
                }
                .print-content h1 {
                  font-size: 18px;
                  margin: 0;
                }
                .print-content p {
                  margin: 2px 0;
                }
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
              }
            `}</style>
            
            <div className="print-content">
              <div className="text-center border-b-2 border-black pb-3 mb-3">
                <h1 className="text-xl font-bold">
                  {orderDetails.establishment?.name || 'Estabelecimento'}
                </h1>
                <p className="text-sm">Comprovante de Pedido</p>
              </div>

              <div className="mb-4">
                <p className="font-bold text-lg">
                  PEDIDO #{orderDetails.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs">
                  {formatDate(orderDetails.createdAt || orderDetails.customer?.createdAt)}
                </p>
              </div>

              <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
                <p className="font-bold mb-1">CLIENTE:</p>
                <p>{orderDetails.customer?.name}</p>
                {orderDetails.customer?.phone && (
                  <p className="text-sm">Tel: {orderDetails.customer.phone}</p>
                )}
              </div>

              {orderDetails.products && orderDetails.products.length > 0 && (
                <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
                  <p className="font-bold mb-2">PRODUTOS:</p>
                  {orderDetails.products.map((product, index) => (
                    <div key={product.id + index} className="mb-2">
                      <div className="flex justify-between">
                        <span>
                          {product.quantity}x {product.name}
                        </span>
                        <span>R$ {(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-600 ml-4">
                        Unit: R$ {product.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 border-black pt-2 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>R$ {orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
                <p className="font-bold mb-1">FORMA DE PAGAMENTO:</p>
                <p>{getPaymentMethodText(orderDetails.paymentMethod)}</p>
                <p className="text-xs">Status: {getStatusText(orderDetails.paymentStatus)}</p>
              </div>

              <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
                <p className="font-bold mb-1">TIPO DE RECEBIMENTO:</p>
                <p className="font-semibold">
                  {orderDetails.deliveryType === 'pickup' ? '⬆️ RETIRADA NO LOCAL' : '🚚 ENTREGA'}
                </p>
              </div>

              {orderDetails.deliveryType !== 'pickup' && orderDetails.address && (
                <div className="mb-4 border-t border-dashed border-gray-400 pt-3">
                  <p className="font-bold mb-1">ENDEREÇO DE ENTREGA:</p>
                  <p>
                    {orderDetails.address.street}, {orderDetails.address.number}
                  </p>
                  {orderDetails.address.complement && (
                    <p className="text-sm">{orderDetails.address.complement}</p>
                  )}
                  <p className="text-sm">{orderDetails.address.neighborhood}</p>
                  <p className="text-sm">
                    {orderDetails.address.city} - {orderDetails.address.state}
                  </p>
                  <p className="text-sm">CEP: {orderDetails.address.zipCode}</p>
                </div>
              )}

              <div className="text-center border-t-2 border-black pt-3 mt-4 text-xs">
                <p>Obrigado pela preferência!</p>
                <p className="mt-1">
                  Impresso em: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
