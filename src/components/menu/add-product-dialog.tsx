'use client'

import React, { useState, useEffect } from 'react'
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
import { Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Product } from '@/lib/data/establishments'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import { toast } from 'sonner'
import { AddCategoryDialog } from '@/components/menu/add-category-dialog'
import { CategorySelect } from '@/components/menu/category-select'

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

export function AddProductDialog({
  editingProduct,
  onClose,
  showTrigger = true,
  showAddCategory = true,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
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

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      productsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao atualizar produto'
      toast.error(message)
    },
  })

  const isPending = isCreating || isUpdating

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

    if (isEditing && editingProduct) {
      await updateProduct({ id: editingProduct.id, payload })
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
