'use client'

import { notFound, useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCard } from '@/components/menu/product-card'
import { ManualOrderCart } from '@/components/menu/manual-order-cart'
import { CheckoutForm } from '@/components/menu/checkout-form'
import { CategoryTabs } from '@/components/menu/category-tabs'
import {
  ProductFilters,
  type ProductFilterState,
} from '@/components/menu/product-filters'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useManualOrderCartStore } from '@/lib/stores/manual-order-cart-store'
import { productsApi, ordersApi } from '@/lib/api'
import type { ListProductsParams } from '@/lib/api/products'
import { ArrowLeft, Loader2, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type ManualOrderPageProps = {
  params: Promise<{ slug: string }>
}

export default function ManualOrderNewPage({ params }: ManualOrderPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const establishment = getEstablishmentBySlug(slug)
  const canManage = useAuthStore((state) =>
    state.canManageEstablishment(establishment?.id || ''),
  )

  const { items, totalPrice, clear } = useManualOrderCartStore()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [filters, setFilters] = useState<ProductFilterState>({
    page: 1,
    limit: 20,
    isActive: 'true',
  })

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products-manual', slug, filters],
    queryFn: () => productsApi.list(filters as ListProductsParams),
    enabled: !!establishment && canManage,
  })

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      toast.success('Pedido criado com sucesso!')
      clear()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      router.push(`/establishment/${slug}/orders`)
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao criar pedido: ' + (error.message || 'Erro desconhecido'),
      )
    },
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

  const products = productsData?.data || []

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error('Adicione pelo menos um produto ao carrinho')
      return
    }
    setCurrentStep(3)
  }

  const handleCheckoutSubmit = async (formData: any) => {
    if (items.length === 0) {
      toast.error('Carrinho vazio')
      return
    }

    const orderData: any = {
      products: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice(),
      paymentMethod: formData.paymentMethod,
      deliveryType: formData.deliveryType || 'delivery',
        customer: formData.customer,
      }

      if (formData.deliveryType === 'delivery') {
      orderData.address = formData.address
    }

    await createOrderMutation.mutateAsync(orderData)
  }

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-center gap-1.5 sm:gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10 sm:text-base ${
          currentStep >= 1
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {currentStep > 1 ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : '1'}
      </div>
      <div
        className={`h-0.5 w-12 rounded transition-colors sm:h-1 sm:w-16 ${
          currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      />
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10 sm:text-base ${
          currentStep >= 2
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {currentStep > 2 ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : '2'}
      </div>
      <div
        className={`h-0.5 w-12 rounded transition-colors sm:h-1 sm:w-16 ${
          currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      />
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10 sm:text-base ${
          currentStep >= 3
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        3
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
              <Link href={`/establishment/${slug}/orders`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 sm:h-9 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold sm:text-xl">
                  Lançamento Manual de Pedido
                </h1>
                <p className="text-muted-foreground truncate text-xs sm:text-sm">
                  {establishment.name}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ShoppingCart className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
              <span className="text-xs font-medium sm:text-sm">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-3 py-4 sm:px-4 sm:py-8">
        {renderStepIndicator()}

        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold sm:text-2xl">Selecione os Produtos</h2>
              <p className="text-muted-foreground mt-1 text-xs sm:mt-2 sm:text-sm">
                Escolha os produtos que fazem parte deste pedido
              </p>
            </div>

            <CategoryTabs
              value={filters.categoryId}
              onChange={(categoryId) =>
                setFilters({ ...filters, categoryId, page: 1 })
              }
            />

            <div>
              <ProductFilters
                value={filters}
                onChange={setFilters}
              />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-800">
                  Erro ao carregar produtos. Por favor, tente novamente.
                </p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          originalPrice: product.oldPrice,
                          image: product.imageUrl || '/placeholder-product.jpg',
                          category: product.categoryId || '',
                          categoryId: product.categoryId,
                          rating: 4.5,
                          isAvailable: product.isActive,
                          establishmentId: establishment.id,
                        }}
                        useManualCart={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">
                      Nenhum produto encontrado com os filtros selecionados.
                    </p>
                  </div>
                )}

                {productsData && productsData.meta.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      onClick={() =>
                        setFilters({ ...filters, page: (filters.page || 1) - 1 })
                      }
                      disabled={filters.page === 1}
                      variant="outline"
                      size="sm"
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Página {productsData.meta.currentPage} de{' '}
                      {productsData.meta.totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setFilters({ ...filters, page: (filters.page || 1) + 1 })
                      }
                      disabled={filters.page === productsData.meta.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold sm:text-2xl">Dados do Pedido</h2>
              <p className="text-muted-foreground mt-1 text-xs sm:mt-2 sm:text-sm">
                Preencha as informações do cliente e endereço de entrega
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <CheckoutForm
                  onSubmit={handleCheckoutSubmit}
                  isSubmitting={createOrderMutation.isPending}
                />
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium">
                              {product.name}
                            </h4>
                            <p className="text-muted-foreground text-xs">
                              Qtd: {quantity} x R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            R$ {(product.price * quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>R$ {totalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setCurrentStep(1)}
                    >
                      Voltar aos produtos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      {currentStep === 1 && (
        <ManualOrderCart onProceedToCheckout={handleProceedToCheckout} />
      )}
    </div>
  )
}

