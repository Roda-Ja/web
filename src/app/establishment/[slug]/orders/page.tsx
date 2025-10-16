'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Truck, User, MapPin, CreditCard } from 'lucide-react'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useAuthStore } from '@/lib/stores/auth-store'

type EstablishmentOrdersPageProps = {
  params: Promise<{ slug: string }>
}

// Mock data para pedidos
const mockOrders = [
  {
    id: '1',
    customerName: 'João Silva',
    customerPhone: '(11) 99999-9999',
    items: [
      { name: 'Pastel de Carne', quantity: 2, price: 8.5 },
      { name: 'Coca-Cola', quantity: 1, price: 4.5 },
    ],
    total: 21.5,
    status: 'delivered',
    orderDate: '2024-01-15T18:30:00Z',
    deliveryAddress: 'Rua das Flores, 123 - Centro',
    deliveryTime: '30 min',
    paymentMethod: 'Cartão',
  },
  {
    id: '2',
    customerName: 'Maria Santos',
    customerPhone: '(11) 88888-8888',
    items: [
      { name: 'Pastel de Frango', quantity: 1, price: 9.5 },
      { name: 'Pastel de Queijo', quantity: 1, price: 6.5 },
    ],
    total: 16.0,
    status: 'preparing',
    orderDate: '2024-01-15T19:15:00Z',
    deliveryAddress: 'Av. Comercial, 456 - Bairro Novo',
    deliveryTime: '25 min',
    paymentMethod: 'Dinheiro',
  },
  {
    id: '3',
    customerName: 'Pedro Oliveira',
    customerPhone: '(11) 77777-7777',
    items: [{ name: 'Pastel de Pizza', quantity: 3, price: 10.5 }],
    total: 31.5,
    status: 'pending',
    orderDate: '2024-01-15T19:45:00Z',
    deliveryAddress: 'Rua da Paz, 789 - Vila Esperança',
    deliveryTime: '40 min',
    paymentMethod: 'PIX',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'preparing':
      return 'bg-blue-100 text-blue-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'preparing':
      return 'Preparando'
    case 'delivered':
      return 'Entregue'
    default:
      return status
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

  // Calcular estatísticas
  const totalOrders = mockOrders.length
  const pendingOrders = mockOrders.filter(
    (order) => order.status === 'pending',
  ).length
  const preparingOrders = mockOrders.filter(
    (order) => order.status === 'preparing',
  ).length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)

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

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-muted-foreground text-xs">Pedidos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingOrders}
            </div>
            <p className="text-muted-foreground text-xs">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Preparo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {preparingOrders}
            </div>
            <p className="text-muted-foreground text-xs">Sendo preparados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRevenue.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">Total hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pedidos Recentes</h2>

        {mockOrders.map((order) => (
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
                      {order.customerName}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {order.customerPhone}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
                  <div className="text-lg font-bold">
                    R$ {order.total.toFixed(2)}
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Itens do pedido */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Itens do Pedido:
                  </h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>
                          R$ {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informações de entrega */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{order.deliveryTime}</span>
                  </div>

                  <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {order.status === 'pending' && (
                    <>
                      <button className="rounded bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600">
                        Aceitar Pedido
                      </button>
                      <button className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600">
                        Rejeitar
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600">
                      Marcar como Pronto
                    </button>
                  )}
                  <button className="rounded bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-600">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
