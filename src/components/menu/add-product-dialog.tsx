'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { AddCategoryDialog } from './add-category-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Category } from '@/components/menu/product-card'
import type { Product } from '@/lib/data/establishments'
import { useEffect } from 'react'

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
  category: z.string().min(1, 'Categoria é obrigatória'),
  image: z.string().url('URL da imagem deve ser válida'),
  tag: z.string().optional(),
  available: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

const categories: { label: string; value: Category }[] = [
  { label: 'Brasileira', value: 'brasileira' },
  { label: 'Lanches', value: 'lanches' },
  { label: 'Bebidas', value: 'bebidas' },
  { label: 'Sobremesas', value: 'sobremesas' },
]

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
  const [tags, setTags] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState(categories)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: 'brasileira',
      image: '',
      tag: '',
      available: true,
    } as ProductFormData,
  })

  const isEditing = !!editingProduct

  // Preencher formulário quando editando
  useEffect(() => {
    if (editingProduct) {
      setOpen(true)
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        oldPrice: editingProduct.originalPrice?.toString() || '',
        category: editingProduct.category,
        image: editingProduct.image,
        tag: editingProduct.tag || '',
        available: editingProduct.isAvailable ?? true,
      })

      // Configurar tags se existirem
      if (editingProduct.tag) {
        setTags([editingProduct.tag])
      }
    }
  }, [editingProduct, form])

  const onSubmit = (data: ProductFormData) => {
    // Aqui você faria a chamada para a API
    const productData = {
      ...data,
      price: parseFloat(data.price),
      oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : undefined,
      tag: tags.length > 0 ? tags[0] : undefined,
    }

    if (isEditing) {
      console.log('Produto editado:', {
        id: editingProduct?.id,
        ...productData,
      })
    } else {
      console.log('Novo produto:', productData)
    }

    // Reset form
    form.reset()
    setTags([])
    setOpen(false)

    // Chamar callback de fechamento se fornecido
    if (onClose) {
      onClose()
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    // Se está fechando e não é modo de edição, limpar dados
    if (!newOpen && !isEditing) {
      form.reset()
      setTags([])
    }
  }

  const handleCategoryAdded = (categoryName: string) => {
    const newCategory = {
      label: categoryName,
      value: categoryName.toLowerCase().replace(/\s+/g, '-') as Category,
    }
    setAvailableCategories((prev) => [...prev, newCategory])
  }

  const addTag = () => {
    const tag = form.getValues('tag')
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      form.setValue('tag', '')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Se está em modo de edição, renderizar apenas o Dialog sem trigger
  if (isEditing) {
    return (
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
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
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Categoria</label>
                    {showAddCategory && (
                      <AddCategoryDialog
                        onCategoryAdded={handleCategoryAdded}
                      />
                    )}
                  </div>
                  <select
                    {...form.register('category')}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {availableCategories.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.category && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.category.message}
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
                  {...form.register('image')}
                />
                {form.formState.errors.image && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.image.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags/Promoções</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 15% Off, Oferta Especial"
                    {...form.register('tag')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('available')}
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
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Produto
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    )
  }

  // Modal normal para criação de produto
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
                  {showAddCategory && (
                    <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
                  )}
                </div>
                <select
                  {...form.register('category')}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {availableCategories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.category.message}
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
                {...form.register('image')}
              />
              {form.formState.errors.image && (
                <span className="text-xs text-red-500">
                  {form.formState.errors.image.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags/Promoções</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 15% Off, Oferta Especial"
                  {...form.register('tag')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register('available')}
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
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
