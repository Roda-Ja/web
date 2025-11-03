'use client'

import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useCartStore } from '@/lib/stores/cart-store'
import { ordersApi } from '@/lib/api/orders'
import { getEstablishmentBySlug } from '@/lib/data/establishments'
import { CheckoutForm } from '@/components/menu/checkout-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CheckoutPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const { items, totalPrice, clear } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const establishment = getEstablishmentBySlug(slug)

  if (!establishment) {
    notFound()
  }

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      toast.success('Pedido realizado com sucesso!')
      clear()
      router.push(`/${slug}`)
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao realizar pedido: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  const handleSubmit = async (formData: any) => {
    if (items.length === 0) {
      toast.error('Carrinho vazio')
      return
    }

    setIsSubmitting(true)

    try {
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
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h1 className="mb-2 text-2xl font-bold">Carrinho vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione itens ao carrinho antes de finalizar o pedido
          </p>
          <Link href={`/${slug}`}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao cardápio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/${slug}`}>
          <Button
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao cardápio
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
        <p className="text-muted-foreground">
          Complete seus dados para finalizar o pedido
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
