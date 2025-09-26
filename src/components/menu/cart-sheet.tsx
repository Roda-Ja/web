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
import { formatBRL } from './product-card'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

export function CartSheet() {
  const { items, increase, decrease, remove, clear, totalItems, totalPrice } =
    useCartStore()

  const hasItems = items.length > 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Abrir carrinho"
          className="relative"
        >
          <ShoppingCart />
          {totalItems() > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
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
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>

        {!hasItems ? (
          <div className="text-muted-foreground p-4 text-sm">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-3 overflow-auto p-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-card/60 border-muted flex items-start justify-between gap-3 rounded-md border p-3 shadow-sm"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-primary text-xs font-semibold">
                        {formatBRL(product.price)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        Subtotal: {formatBRL(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      onClick={() => decrease(product.id)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="text-sm tabular-nums">{quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      onClick={() => increase(product.id)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive size-7"
                      onClick={() => remove(product.id)}
                      aria-label="Remover item"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky bottom-0 border-t p-3 backdrop-blur">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-muted-foreground text-xs">
                  Total ({totalItems()} itens)
                </p>
                <p className="text-primary text-base font-bold">
                  {formatBRL(totalPrice())}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full">Finalizar Pedido</Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clear}
                >
                  Limpar Carrinho
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
