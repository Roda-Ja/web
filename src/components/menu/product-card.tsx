'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  PencilLine,
  Trash2,
} from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useManualOrderCartStore } from '@/lib/stores/manual-order-cart-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'

import type { Product } from '@/lib/data/establishments'

export type Category =
  | 'todos'
  | 'brasileira'
  | 'lanches'
  | 'bebidas'
  | 'sobremesas'
  | 'pizzas'
  | 'pastéis'
  | 'caseira'

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
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  showAdminControls?: boolean
  useManualCart?: boolean
}

export function ProductCard({
  product,
  className,
  onEdit,
  onDelete,
  showAdminControls = false,
  useManualCart = false,
}: ProductCardProps) {
  const isAvailable = product.isAvailable
  
  // Escolhe o store baseado na prop useManualCart
  const publicCart = useCartStore()
  const manualCart = useManualOrderCartStore()
  
  const cart = useManualCart ? manualCart : publicCart
  const addItem = cart.addItem
  const increase = cart.increase
  const decrease = cart.decrease
  const items = cart.items
  
  const isMaster = useAuthStore((state) => state.isMaster())
  const isEstablishmentAdmin = useAuthStore((state) =>
    state.isEstablishmentAdmin(),
  )
  const isAdmin = showAdminControls && (isMaster || isEstablishmentAdmin)
  const queryClient = useQueryClient()

  const inCartQty =
    items.find((it) => it.product.id === product.id)?.quantity ?? 0
  const inCart = inCartQty > 0

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success(`${product.name} foi excluído com sucesso!`)
      queryClient.invalidateQueries({ queryKey: ['products'] })
      if (onDelete) {
        onDelete(product.id)
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao excluir produto'
      toast.error(message)
    },
  })

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product)
    } else {
      toast.info('Funcionalidade de edição em desenvolvimento')
    }
  }

  const handleDelete = async () => {
    await deleteProduct(product.id)
  }

  return (
    <Card className={cn('flex flex-col gap-0 overflow-hidden p-0', className)}>
      <div className="relative h-[220px] w-full flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />

        {product.tag && (
          <Badge
            className={`absolute top-2 ${isAdmin ? 'left-20' : 'left-2'}`}
            variant="secondary"
          >
            {product.tag}
          </Badge>
        )}

        {product.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm dark:bg-black/60">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
        )}

        {isAdmin && (
          <div className="absolute top-2 left-2 flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 shadow-sm hover:bg-white"
              onClick={handleEdit}
            >
              <PencilLine className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 bg-red-500/90 shadow-sm hover:bg-red-500"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o produto "{product.name}"?
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <CardContent className="flex-grow py-4 pb-2">
        <div className="text-foreground line-clamp-1 text-sm font-medium">
          {product.name}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-foreground text-base font-semibold">
            {formatBRL(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-xs line-through">
              {formatBRL(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-muted-foreground mt-2 text-justify text-xs leading-relaxed">
          {product.description}
        </p>
        {inCart && (
          <div className="bg-primary/10 text-primary mt-2 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-[11px] font-medium">
            {inCartQty} no carrinho
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-shrink-0 pt-2 pb-4">
        {isAdmin ? (
          <div className="w-full text-center">
            <div className="text-muted-foreground text-sm">
              {product.isAvailable ? (
                <span className="font-medium text-green-600">Disponível</span>
              ) : (
                <span className="font-medium text-red-600">Indisponível</span>
              )}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </CardFooter>
    </Card>
  )
}
