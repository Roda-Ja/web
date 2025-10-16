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
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, PencilLine, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import type { CategoryResponse } from '@/lib/api/types'

type AddCategoryDialogProps = {
  onCategoryAdded?: (categoryId: string) => void
}

export function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null)
  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.listCategories({ limit: 100 }),
    enabled: open,
  })

  const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
    mutationFn: productsApi.createCategory,
    onSuccess: () => {
      toast.success('Categoria criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['product-metrics'] })
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao criar categoria'
      toast.error(message)
    },
  })

  const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      productsApi.updateCategory(id, { name }),
    onSuccess: () => {
      toast.success('Categoria atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['product-metrics'] })
      setEditingCategory(null)
      setCategoryName('')
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao atualizar categoria'
      toast.error(message)
    },
  })

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: productsApi.deleteCategory,
    onSuccess: () => {
      toast.success('Categoria excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['product-metrics'] })
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao excluir categoria'
      toast.error(message)
    },
  })

  const isPending = isCreating || isUpdating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      toast.error('Nome da categoria é obrigatório')
      return
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.value,
          name: categoryName.trim(),
        })
      } else {
        const response = await createCategory({ name: categoryName.trim() })

        if (onCategoryAdded) {
          onCategoryAdded(response.value)
        }

        setCategoryName('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (category: CategoryResponse) => {
    setEditingCategory(category)
    setCategoryName(category.label)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setCategoryName('')
  }

  const handleDelete = async (categoryId: string) => {
    await deleteCategory(categoryId)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-6 w-6 rounded-full"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Editar Categoria' : 'Gerenciar Categorias'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Formulário de criação/edição */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {editingCategory ? 'Editar Nome' : 'Nome da Nova Categoria'}
              </label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ex: Pizzas, Saladas, etc."
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
              {editingCategory && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                >
                  Cancelar Edição
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? editingCategory
                    ? 'Atualizando...'
                    : 'Criando...'
                  : editingCategory
                    ? 'Atualizar Categoria'
                    : 'Criar Categoria'}
              </Button>
            </div>
          </form>

          {/* Lista de categorias */}
          <div className="border-t pt-4">
            <h3 className="mb-3 text-sm font-semibold">
              Categorias Existentes
            </h3>

            {isLoading ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Carregando categorias...
              </div>
            ) : categoriesData?.data && categoriesData.data.length > 0 ? (
              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
                {categoriesData.data.map((category) => (
                  <Card
                    key={category.value}
                    className={`transition-colors ${
                      editingCategory?.value === category.value
                        ? 'border-primary bg-primary/5'
                        : ''
                    }`}
                  >
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex-1">
                        <p className="font-medium">{category.label}</p>
                        <p className="text-muted-foreground text-xs">
                          Criada em{' '}
                          {new Date(category.createdAt).toLocaleDateString(
                            'pt-BR',
                          )}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleEdit(category)}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a categoria "
                                {category.label}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.value)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Nenhuma categoria criada ainda.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
