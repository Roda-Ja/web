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
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'

type AddCategoryDialogProps = {
  onCategoryAdded?: (categoryId: string, categoryName: string) => void
}

export function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const queryClient = useQueryClient()

  const { mutateAsync: createCategory, isPending } = useMutation({
    mutationFn: productsApi.createCategory,
    onSuccess: () => {
      toast.success('Categoria criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['product-metrics'] })
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Erro ao criar categoria'
      toast.error(message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      toast.error('Nome da categoria é obrigatório')
      return
    }

    try {
      const response = await createCategory({ name: categoryName.trim() })

      if (onCategoryAdded) {
        onCategoryAdded(response.id, response.name)
      }

      setCategoryName('')
      setOpen(false)
    } catch (error) {
      console.error(error)
    }
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

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Categoria</label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Pizzas, Saladas, etc."
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
