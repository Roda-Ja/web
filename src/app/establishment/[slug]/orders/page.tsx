'use client'

import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { OrderDetailsModal } from '@/components/order-details-modal'
import { ordersApi, productsApi } from '@/lib/api'
import type { ListOrdersParams } from '@/lib/api/orders'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { OrderCard } from './order-card'

type EstablishmentOrdersPageProps = {
  params: Promise<{ slug: string }>
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
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<string>('pending')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManualOrderDialogOpen, setIsManualOrderDialogOpen] = useState(false)

  // Estados do formulário manual
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      productId: string
      productName: string
      quantity: number
      price: number
    }>
  >([])
  const [currentProductId, setCurrentProductId] = useState<string>('')
  const [currentQuantity, setCurrentQuantity] = useState<string>('1')
  const [whatsapp, setWhatsapp] = useState<string>('')
  const [cep, setCep] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [addressNumber, setAddressNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrderId(null)
  }

  const handleOpenDetails = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  // Funções para o formulário manual
  const handleAddProduct = () => {
    if (!currentProductId || currentQuantity === '0' || !currentQuantity) {
      toast.error('Selecione um produto e informa a quantidade')
      return
    }

    const product = products.find((p) => p.id === currentProductId)
    if (!product) return

    // Verificar se já existe
    const existingIndex = selectedProducts.findIndex(
      (item) => item.productId === currentProductId,
    )

    if (existingIndex >= 0) {
      // Atualizar quantidade existente
      setSelectedProducts((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Number(currentQuantity) }
            : item,
        ),
      )
    } else {
      // Adicionar novo produto
      setSelectedProducts((prev) => [
        ...prev,
        {
          productId: currentProductId,
          productName: product.name,
          quantity: Number(currentQuantity),
          price: product.price,
        },
      ])
    }

    setCurrentProductId('')
    setCurrentQuantity('1')
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((item) => item.productId !== productId),
    )
  }

  const handleSubmitManualOrder = () => {
    if (selectedProducts.length === 0) {
      toast.error('Adicione pelo menos um produto')
      return
    }
    if (!whatsapp) {
      toast.error('Informe o número do WhatsApp')
      return
    }
    if (!address) {
      toast.error('Informe o endereço')
      return
    }
    if (!paymentMethod) {
      toast.error('Selecione a forma de pagamento')
      return
    }

    toast.success('Pedido criado com sucesso!')
    setIsManualOrderDialogOpen(false)
    // Reset form
    setSelectedProducts([])
    setWhatsapp('')
    setCep('')
    setAddress('')
    setAddressNumber('')
    setPaymentMethod('')
  }

  // Query params para buscar pedidos
  const queryParams: ListOrdersParams = {
    page: currentPage,
    limit: 50,
    sortOrder: 'desc',
    paymentStatus: 'PAID', // Apenas pedidos pagos
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

  // Mutation para aprovar pedido
  const updateApprovalStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'PENDING' | 'APPROVED' | 'REJECTED'
    }) => ordersApi.updateApprovalStatus(id, { approvalStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details'] })
    },
    onError: (error: Error) => {
      toast.error(
        'Erro ao aprovar pedido: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  // Mutation para atualizar status de entrega
  const updateDeliveryStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    }) => ordersApi.updateDeliveryStatus(id, { deliveryStatus: status }),
    onSuccess: () => {
      toast.success('Status do pedido atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details'] })
    },
    onError: (error: Error) => {
      toast.error(
        'Erro ao atualizar status: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Primeiro aprova o pedido
      await updateApprovalStatusMutation.mutateAsync({
        id: orderId,
        status: 'APPROVED',
      })
      // Depois muda o status de entrega para em preparo
      await updateDeliveryStatusMutation.mutateAsync({
        id: orderId,
        status: 'IN_PROGRESS',
      })
    } catch {
      // Erro já é tratado pelas mutations
    }
  }

  const handleStartDelivery = async (orderId: string) => {
    await updateDeliveryStatusMutation.mutateAsync({
      id: orderId,
      status: 'COMPLETED',
    })
  }

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

  // Usar dados da API
  const orders = data?.data || []

  // Filtrar pedidos por status de entrega
  const receivedOrders = orders.filter(
    (order) => order.deliveryStatus === 'PENDING',
  )
  const inProgressOrders = orders.filter(
    (order) => order.deliveryStatus === 'IN_PROGRESS',
  )
  const deliveryOrders = orders.filter(
    (order) => order.deliveryStatus === 'COMPLETED',
  )

  // Query para buscar produtos do estabelecimento
  const { data: productsData } = useQuery({
    queryKey: ['products', establishment?.id],
    queryFn: () => productsApi.list({ limit: 100, isActive: 'true' }),
    enabled: !!establishment && canManage && isManualOrderDialogOpen,
  })

  const products = productsData?.data || []

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            Pedidos - {establishment.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie os pedidos do seu estabelecimento
          </p>
        </div>
        <Dialog
          open={isManualOrderDialogOpen}
          onOpenChange={setIsManualOrderDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Lançamentos manuais</span>
              <span className="sm:hidden">Manual</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lançamento Manual de Pedido</DialogTitle>
              <DialogDescription>
                Preencha os dados do pedido para cadastrá-lo no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Seleção de Produtos */}
              <div className="space-y-3">
                <Label htmlFor="product">Produto</Label>
                <div className="flex gap-2">
                  <Select
                    value={currentProductId}
                    onValueChange={setCurrentProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id}
                        >
                          {product.name} - R$ {product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    placeholder="Qtd"
                    className="w-20"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProduct}
                  >
                    Adicionar
                  </Button>
                </div>

                {/* Lista de Produtos Selecionados */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-2 rounded-lg border p-3">
                    <Label>Produtos Selecionados</Label>
                    {selectedProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                      >
                        <span className="text-sm">
                          {item.quantity}x {item.productName} - R${' '}
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(item.productId)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                    <div className="mt-2 border-t pt-2">
                      <p className="text-sm font-semibold">
                        Total: R${' '}
                        {selectedProducts
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do Cliente */}
              <div className="space-y-3">
                <Label>Informações do Cliente</Label>
                <Input
                  placeholder="Número do WhatsApp (ex: 11987654321)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              {/* Endereço */}
              <div className="space-y-3">
                <Label>Endereço de Entrega</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="col-span-1"
                  />
                  <Input
                    placeholder="Endereço completo"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-2"
                  />
                </div>
                <Input
                  placeholder="Número"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-3">
                <Label>Forma de Pagamento</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONEY">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CREDIT_CARD">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsManualOrderDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitManualOrder}
                >
                  Criar Pedido
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                  {receivedOrders.length}
                </div>
                <p className="text-muted-foreground text-xs">Pedidos novos</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Em Preparo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-xl font-bold text-orange-600 sm:text-2xl">
                  {inProgressOrders.length}
                </div>
                <p className="text-muted-foreground text-xs">Em produção</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Em Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-xl font-bold text-green-600 sm:text-2xl">
                  {deliveryOrders.length}
                </div>
                <p className="text-muted-foreground text-xs">A caminho</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end md:gap-4">
        <label className="text-xs font-medium sm:text-sm sm:whitespace-nowrap">
          Filtrar por método de pagamento:
        </label>
        <Select
          value={paymentMethodFilter}
          onValueChange={setPaymentMethodFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px] md:w-[200px]">
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 gap-1">
          <TabsTrigger
            value="pending"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            Recebidos ({receivedOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="preparing"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            Em preparo ({inProgressOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            <span className="hidden xl:inline">Entregas em andamento</span>
            <span className="xl:hidden">Em entrega</span>
            {` (${deliveryOrders.length})`}
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-[10px] sm:text-xs md:text-sm"
          >
            Concluídos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="pending"
          className="space-y-4"
        >
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
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

          {!isLoading && !isError && receivedOrders.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum pedido recebido no momento.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading &&
            !isError &&
            receivedOrders
              .filter((order) => {
                if (paymentMethodFilter === 'all') return true
                return order.paymentMethod === paymentMethodFilter
              })
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getPaymentMethodText={getPaymentMethodText}
                  buttonLabel="Aceitar pedido"
                  mobileLabel="Aceitar"
                  onButtonClick={handleAcceptOrder}
                  onDetailsClick={handleOpenDetails}
                  isLoading={
                    updateApprovalStatusMutation.isPending ||
                    updateDeliveryStatusMutation.isPending
                  }
                />
              ))}
        </TabsContent>

        <TabsContent
          value="preparing"
          className="space-y-4"
        >
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading &&
            !isError &&
            inProgressOrders
              .filter((order) => {
                if (paymentMethodFilter === 'all') return true
                return order.paymentMethod === paymentMethodFilter
              })
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getPaymentMethodText={getPaymentMethodText}
                  buttonLabel="Enviar para entrega"
                  mobileLabel="Enviar"
                  onButtonClick={handleStartDelivery}
                  onDetailsClick={handleOpenDetails}
                  isLoading={updateDeliveryStatusMutation.isPending}
                />
              ))}
        </TabsContent>

        <TabsContent
          value="delivery"
          className="space-y-4"
        >
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading &&
            !isError &&
            deliveryOrders
              .filter((order) => {
                if (paymentMethodFilter === 'all') return true
                return order.paymentMethod === paymentMethodFilter
              })
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  getPaymentMethodText={getPaymentMethodText}
                  buttonLabel=""
                  onButtonClick={() => {}}
                  onDetailsClick={handleOpenDetails}
                  showBadge={true}
                  badgeText="Em entrega"
                />
              ))}
        </TabsContent>

        <TabsContent
          value="completed"
          className="space-y-4"
        >
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Histórico de pedidos concluídos em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Paginação */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Página {data.meta.currentPage} de {data.meta.totalPages} (
            {data.meta.totalItems} pedidos)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(data.meta.totalPages, prev + 1),
                )
              }
              disabled={currentPage === data.meta.totalPages || isLoading}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
