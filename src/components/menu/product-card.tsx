'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { toast } from 'sonner'

export type Category =
  | 'todos'
  | 'brasileira'
  | 'lanches'
  | 'bebidas'
  | 'sobremesas'

export type Product = {
  id: string
  name: string
  price: number
  oldPrice?: number
  rating?: number
  category: Category
  image: string
  tag?: string
  available?: boolean
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

type ProductCardProps = {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const isAvailable = product.available ?? true
  const addItem = useCartStore((s) => s.addItem)
  const increase = useCartStore((s) => s.increase)
  const decrease = useCartStore((s) => s.decrease)
  const items = useCartStore((s) => s.items)

  const inCartQty =
    items.find((it) => it.product.id === product.id)?.quantity ?? 0
  const inCart = inCartQty > 0

  return (
    <Card className={cn('h-[360px] gap-0 overflow-hidden p-0', className)}>
      <div className="relative h-[220px] w-full">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />

        {product.tag && (
          <Badge
            className="absolute top-2 left-2"
            variant="secondary"
          >
            {product.tag}
          </Badge>
        )}

        {product.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm dark:bg-black/60">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
        )}
      </div>

      <CardContent className="py-4">
        <div className="text-foreground line-clamp-1 text-sm font-medium">
          {product.name}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-foreground text-base font-semibold">
            {formatBRL(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-muted-foreground text-xs line-through">
              {formatBRL(product.oldPrice)}
            </span>
          )}
        </div>
        {inCart && (
          <div className="bg-primary/10 text-primary mt-2 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-[11px] font-medium">
            {inCartQty} no carrinho
          </div>
        )}
      </CardContent>

      <CardFooter className="pb-4">
        {inCart ? (
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => decrease(product.id)}
              aria-label="Diminuir"
            >
              <Minus />
            </Button>
            <span className="text-sm font-medium tabular-nums select-none">
              {inCartQty}
            </span>
            <Button
              size="icon"
              onClick={() => increase(product.id)}
              aria-label="Aumentar"
            >
              <Plus />
            </Button>
          </div>
        ) : (
          <Button
            className={cn('w-full', !isAvailable && 'pointer-events-none')}
            variant={isAvailable ? 'default' : 'outline'}
            disabled={!isAvailable}
            onClick={() => {
              if (!isAvailable) return
              addItem(product, 1)
              toast.success(`${product.name} adicionado ao carrinho!`)
            }}
          >
            {isAvailable ? (
              <>
                <ShoppingCart /> Adicionar ao Pedido
              </>
            ) : (
              <>Indisponível</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
