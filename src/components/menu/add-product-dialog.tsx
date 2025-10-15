'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormProvider } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, ChevronDown, Search } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Product } from '@/lib/data/establishments'
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import { toast } from 'sonner'
import { AddCategoryDialog } from '@/components/menu/add-category-dialog'
import { cn } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Preço deve ser um número válido',
    ),
  oldPrice: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: z.string().url('URL da imagem deve ser válida'),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

type AddProductDialogProps = {
  editingProduct?: Product | null
  onClose?: () => void
  showTrigger?: boolean
  showAddCategory?: boolean
}

type CategorySelectProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Componente de Select Customizado com Infinite Scroll
function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchCategory, setSearchCategory] = useState('')
  const containerRef = useRef<React.ElementRef<'div'>>(null)

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['categories', searchCategory],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.listCategories({
        page: pageParam,
        limit: 10,
        search: searchCategory,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  const categories = categoriesData?.pages.flatMap((page) => page.data) || []
  const selectedCategory = categories.find((cat) => cat.value === value)

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    /* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
    if (typeof window !== 'undefined') {
      ;(window.document as any).addEventListener(
        'mousedown',
        handleClickOutside,
      )
      return () => {
        ;(window.document as any).removeEventListener(
          'mousedown',
          handleClickOutside,
        )
      }
    }
    /* eslint-enable no-undef, @typescript-eslint/no-explicit-any */
  }, [open])

  const handleScroll = useCallback(
    (e: React.UIEvent<React.ElementRef<'div'>>) => {
      const target = e.currentTarget
      const scrollPercentage =
        (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100

      if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  const handleSelect = (categoryValue: string) => {
    onChange(categoryValue)
    setOpen(false)
    setSearchCategory('')
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span className={cn(!value && 'text-muted-foreground')}>
          {selectedCategory?.label || 'Selecione uma categoria'}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 opacity-50 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full rounded-md border shadow-md">
          <div className="flex flex-col">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-2 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar categoria..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-8 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              onScroll={handleScroll}
              className="max-h-[200px] overflow-y-auto"
            >
              {isLoadingCategories && categories.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  Carregando...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  Nenhuma categoria encontrada
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() => handleSelect(category.value)}
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors outline-none',
                      value === category.value && 'bg-accent',
                    )}
                  >
                    {category.label}
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className="text-muted-foreground p-2 text-center text-xs">
                  Carregando mais...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AddProductDialog({
  editingProduct,
  onClose,
  showTrigger = true,
  showAddCategory = true,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: createProduct, isPending } = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success('Produto criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao criar produto'
      toast.error(message)
    },
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      categoryId: '',
      imageUrl: '',
      isActive: true,
    } as ProductFormData,
  })

  const isEditing = !!editingProduct

  useEffect(() => {
    if (editingProduct) {
      setOpen(true)
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        oldPrice: editingProduct.originalPrice?.toString() || '',
        categoryId: editingProduct.categoryId || '',
        imageUrl: editingProduct.image,
        isActive: editingProduct.isAvailable ?? true,
      })
    }
  }, [editingProduct, form])

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      price: parseFloat(data.price),
      oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : undefined,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
    }

    if (isEditing) {
      toast.info('Edição de produto será implementada em seguida.')
    } else {
      await createProduct(payload)
    }

    form.reset()
    setOpen(false)
    if (onClose) onClose()
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && !isEditing) {
      form.reset()
    }
  }

  const handleCategoryAdded = (categoryId: string) => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    form.setValue('categoryId', categoryId)
  }

  if (isEditing) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Produto</label>
                  <Input
                    {...form.register('name')}
                    placeholder="Ex: X-Burger Especial"
                  />
                  {form.formState.errors.name && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Categoria</label>
                  </div>
                  <CategorySelect
                    value={form.watch('categoryId')}
                    onChange={(value) => form.setValue('categoryId', value)}
                    disabled={isPending}
                  />
                  {form.formState.errors.categoryId && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.categoryId.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  {...form.register('description')}
                  placeholder="Descreva o produto, ingredientes, etc..."
                  className="min-h-[100px]"
                />
                {form.formState.errors.description && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register('price')}
                  />
                  {form.formState.errors.price && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.price.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Preço Anterior (R$) - Opcional
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register('oldPrice')}
                  />
                  {form.formState.errors.oldPrice && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.oldPrice.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL da Imagem</label>
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  {...form.register('imageUrl')}
                />
                {form.formState.errors.imageUrl && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.imageUrl.message}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('isActive')}
                  className="border-input h-4 w-4 rounded border"
                />
                <label className="text-sm font-normal">
                  Produto disponível
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Produto</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto</label>
                <Input
                  {...form.register('name')}
                  placeholder="Ex: X-Burger Especial"
                />
                {form.formState.errors.name && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Categoria</label>
                  {showAddCategory && (
                    <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
                  )}
                </div>
                <CategorySelect
                  value={form.watch('categoryId')}
                  onChange={(value) => form.setValue('categoryId', value)}
                  disabled={isPending}
                />
                {form.formState.errors.categoryId && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.categoryId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                {...form.register('description')}
                placeholder="Descreva o produto, ingredientes, etc..."
                className="min-h-[100px]"
              />
              {form.formState.errors.description && (
                <span className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('price')}
                />
                {form.formState.errors.price && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.price.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Preço Anterior (R$) - Opcional
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('oldPrice')}
                />
                {form.formState.errors.oldPrice && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.oldPrice.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL da Imagem</label>
              <Input
                placeholder="https://exemplo.com/imagem.jpg"
                {...form.register('imageUrl')}
              />
              {form.formState.errors.imageUrl && (
                <span className="text-xs text-red-500">
                  {form.formState.errors.imageUrl.message}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register('isActive')}
                className="border-input h-4 w-4 rounded border"
              />
              <label className="text-sm font-normal">Produto disponível</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isPending
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar Alterações'
                    : 'Cadastrar Produto'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
