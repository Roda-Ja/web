'use client'

import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Clock,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { OrderDetailsModal } from '@/components/order-details-modal'
import { StatusUpdateButtons } from '@/components/status-update-buttons'
import { ordersApi, type ListOrdersParams } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

type EstablishmentOrdersPageProps = {
  params: Promise<{ slug: string }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pagamento Pendente'
    case 'PAID':
      return 'Pago'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return status
  }
}

const getDeliveryStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getDeliveryStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Entrega Pendente'
    case 'IN_PROGRESS':
      return 'Em Andamento'
    case 'COMPLETED':
      return 'Entregue'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return status
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

export default function EstablishmentOrdersPage({
  params,
}: EstablishmentOrdersPageProps) {
  const { slug } = use(params)
  const establishment = getEstablishmentBySlug(slug)
  const canManage = useAuthStore((state) =>
    state.canManageEstablishment(establishment?.id || ''),
  )

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deliveryStatusFilter, setDeliveryStatusFilter] =
    useState<string>('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all')

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrderId(null)
  }

  const queryParams: ListOrdersParams = {
    page,
    limit,
    sortOrder: 'desc',
  }

  if (statusFilter !== 'all') {
    queryParams.status = statusFilter as 'PENDING' | 'PAID' | 'CANCELLED'
  }
  if (deliveryStatusFilter !== 'all') {
    queryParams.deliveryStatus = deliveryStatusFilter as
      | 'PENDING'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED'
  }
  if (paymentMethodFilter !== 'all') {
    queryParams.paymentMethod = paymentMethodFilter as
      | 'CREDIT_CARD'
      | 'DEBIT_CARD'
      | 'PIX'
      | 'MONEY'
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', establishment?.id, queryParams],
    queryFn: () => ordersApi.list(queryParams),
    enabled: !!establishment && canManage,
  })

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

  const orders = data?.data || []
  const totalOrders = data?.meta.totalItems || 0
  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING',
  ).length
  const inProgressOrders = orders.filter(
    (order) => order.deliveryStatus === 'IN_PROGRESS',
  ).length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Pedidos - {establishment.name}
        </h1>
        <p className="text-muted-foreground">
          Gerencie os pedidos do seu estabelecimento
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-muted-foreground text-xs">
                  Total de pedidos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pagamento Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingOrders}
                </div>
                <p className="text-muted-foreground text-xs">
                  Aguardando pagamento
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {inProgressOrders}
                </div>
                <p className="text-muted-foreground text-xs">Em entrega</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalRevenue.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">Página atual</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status do Pedido</label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING">Pagamento Pendente</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status de Entrega</label>
              <Select
                value={deliveryStatusFilter}
                onValueChange={setDeliveryStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDING">Entrega Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="COMPLETED">Entregue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pagamento</label>
              <Select
                value={paymentMethodFilter}
                onValueChange={setPaymentMethodFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="MONEY">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos</h2>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-600">Erro ao carregar os pedidos.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhum pedido encontrado com os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <>
            {orders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-base sm:text-lg">
                          Pedido #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {new Date(order.createdAt).toLocaleString('pt-BR')}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:text-right">
                      <div className="text-lg font-bold">
                        R$ {order.totalPrice.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.paymentStatus)}>
                          {getStatusText(order.paymentStatus)}
                        </Badge>
                        <Badge
                          className={getDeliveryStatusColor(
                            order.deliveryStatus,
                          )}
                        >
                          {getDeliveryStatusText(order.deliveryStatus)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {getPaymentMethodText(order.paymentMethod)}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          Status Pagamento: {getStatusText(order.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    {order.deliveredAt && (
                      <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          Entregue em:{' '}
                          {new Date(order.deliveredAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(order.id)}
                      >
                        Ver Detalhes
                      </Button>

                      {canManage && (
                        <StatusUpdateButtons
                          orderId={order.id}
                          currentPaymentStatus={order.paymentStatus}
                          currentDeliveryStatus={order.deliveryStatus}
                          establishmentId={establishment.id}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {data && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Página {data.meta.currentPage} de {data.meta.totalPages} (
                  {data.meta.totalItems} pedidos)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(data.meta.totalPages, p + 1))
                    }
                    disabled={page === data.meta.totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
