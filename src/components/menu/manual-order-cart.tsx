'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useManualOrderCartStore } from '@/lib/stores/manual-order-cart-store'
import { formatBRL } from './product-card'
import { cn } from '@/lib/utils'

interface ManualOrderCartProps {
  onProceedToCheckout: () => void
  className?: string
}

export function ManualOrderCart({
  onProceedToCheckout,
  className,
}: ManualOrderCartProps) {
  const { items, increase, decrease, remove, totalItems, totalPrice, clear } =
    useManualOrderCartStore()

  const cartItemsCount = totalItems()
  const cartTotal = totalPrice()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className={cn(
            'fixed bottom-4 right-4 z-50 h-12 gap-2 rounded-full px-4 shadow-lg sm:bottom-6 sm:right-6 sm:h-14 sm:px-6',
            className,
          )}
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm font-semibold sm:text-base">Ver Carrinho</span>
          {cartItemsCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 bg-white text-blue-600 sm:ml-1"
            >
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-4 sm:max-w-lg sm:p-6"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            Carrinho de Lançamento
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">
            {cartItemsCount === 0
              ? 'Adicione produtos para criar o pedido'
              : `${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'itens'} no carrinho`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden py-4 sm:gap-4 sm:py-6">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center sm:gap-3">
              <ShoppingCart className="text-muted-foreground h-12 w-12 opacity-20 sm:h-16 sm:w-16" />
              <div>
                <p className="text-muted-foreground text-sm font-medium sm:text-base">
                  Carrinho vazio
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Selecione produtos para adicionar ao pedido
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto sm:space-y-3">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="group rounded-lg border bg-card p-2.5 transition-colors hover:bg-accent sm:p-3"
                  >
                    <div className="flex gap-2 sm:gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-md object-cover sm:h-16 sm:w-16"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-1 sm:gap-2">
                          <h4 className="text-xs font-medium leading-tight sm:text-sm">
                            {product.name}
                          </h4>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 sm:h-6 sm:w-6"
                            onClick={() => remove(product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 sm:text-sm">
                            {formatBRL(product.price)}
                          </span>

                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() => decrease(product.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-medium tabular-nums sm:w-8 sm:text-sm">
                              {quantity}
                            </span>
                            <Button
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() => increase(product.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Separator />

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatBRL(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold sm:text-lg">Total</span>
                    <span className="text-base font-bold text-blue-600 sm:text-lg">
                      {formatBRL(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => clear()}
                  >
                    Limpar
                  </Button>
                  <Button
                    className="flex-1 gap-1.5 text-xs sm:gap-2 sm:text-sm"
                    onClick={onProceedToCheckout}
                  >
                    Continuar
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

