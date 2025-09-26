'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatBRL } from '@/components/menu/product-card'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

export function PublicCart() {
  const { items, increase, decrease, remove, clear, totalItems, totalPrice } =
    useCartStore()

  const hasItems = items.length > 0

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="relative h-14 w-14 rounded-full shadow-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {totalItems()}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="p-0"
        >
          <SheetHeader className="border-b p-4">
            <SheetTitle className="text-left">
              Seu Carrinho ({totalItems()})
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col">
            {!hasItems ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                  <ShoppingCart className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-lg font-semibold">Carrinho vazio</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Adicione itens ao carrinho para continuar
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
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
                            {formatBRL(product.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => decrease(product.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => increase(product.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive h-6 w-6"
                            onClick={() => remove(product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t p-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatBRL(totalPrice())}</span>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                    >
                      Finalizar Pedido
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clear}
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

