'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { establishmentApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Building2,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function AccountPage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    imageUrl: '',
  })

  const [addressFormData, setAddressFormData] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isPrimary: false,
  })

  const {
    data: establishment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['establishment-me'],
    queryFn: establishmentApi.getMe,
  })

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['establishment-addresses'],
    queryFn: establishmentApi.getAddresses,
  })

  const updateMutation = useMutation({
    mutationFn: establishmentApi.update,
    onSuccess: () => {
      toast.success('Estabelecimento atualizado com sucesso!')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['establishment-me'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao atualizar estabelecimento: ' +
          (error.message || 'Erro desconhecido'),
      )
    },
  })

  const createAddressMutation = useMutation({
    mutationFn: establishmentApi.createAddress,
    onSuccess: () => {
      toast.success('Endereço criado com sucesso!')
      setIsAddressDialogOpen(false)
      setAddressFormData({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isPrimary: false,
      })
      queryClient.invalidateQueries({ queryKey: ['establishment-addresses'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao criar endereço: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      establishmentApi.updateAddress(id, data),
    onSuccess: () => {
      toast.success('Endereço atualizado com sucesso!')
      setEditingAddress(null)
      queryClient.invalidateQueries({ queryKey: ['establishment-addresses'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao atualizar endereço: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  const deleteAddressMutation = useMutation({
    mutationFn: establishmentApi.deleteAddress,
    onSuccess: () => {
      toast.success('Endereço removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['establishment-addresses'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao remover endereço: ' + (error.message || 'Erro desconhecido'),
      )
    },
  })

  useEffect(() => {
    if (establishment) {
      setFormData({
        name: establishment.name || '',
        slug: establishment.slug || '',
        imageUrl: establishment.imageUrl || '',
      })
    }
  }, [establishment])

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  const handleCreateAddress = () => {
    createAddressMutation.mutate(addressFormData)
  }

  const handleUpdateAddress = () => {
    if (editingAddress) {
      updateAddressMutation.mutate({
        id: editingAddress.id,
        data: addressFormData,
      })
    }
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    setAddressFormData({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isPrimary: address.isPrimary,
    })
  }

  const handleDeleteAddress = (id: string) => {
    if (confirm('Tem certeza que deseja remover este endereço?')) {
      deleteAddressMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Erro ao carregar dados
          </h1>
          <p className="text-gray-600">
            Não foi possível carregar as informações do estabelecimento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações da Conta</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as informações do seu estabelecimento
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informações do Estabelecimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações do Estabelecimento
            </CardTitle>
            <CardDescription>
              Dados básicos do seu estabelecimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Estabelecimento</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                disabled={!isEditing}
                placeholder="meu-estabelecimento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                disabled={!isEditing}
                placeholder="https://exemplo.com/logo.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={establishment?.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Criação</Label>
              <Input
                value={
                  establishment
                    ? new Date(establishment.createdAt).toLocaleDateString(
                        'pt-BR',
                      )
                    : ''
                }
                disabled
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Endereços */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereços
                </CardTitle>
                <CardDescription>
                  Gerencie os endereços do seu estabelecimento
                </CardDescription>
              </div>
              <Dialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={addressFormData.street}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              street: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={addressFormData.number}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              number: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={addressFormData.complement}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            complement: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={addressFormData.neighborhood}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            neighborhood: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={addressFormData.city}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={addressFormData.state}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              state: e.target.value,
                            })
                          }
                          maxLength={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={addressFormData.zipCode}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={addressFormData.isPrimary}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            isPrimary: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="isPrimary">Endereço principal</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={
                          editingAddress
                            ? handleUpdateAddress
                            : handleCreateAddress
                        }
                        disabled={
                          createAddressMutation.isPending ||
                          updateAddressMutation.isPending
                        }
                        className="flex-1"
                      >
                        {createAddressMutation.isPending ||
                        updateAddressMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {editingAddress ? 'Atualizar' : 'Criar'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddressDialogOpen(false)
                          setEditingAddress(null)
                          setAddressFormData({
                            street: '',
                            number: '',
                            complement: '',
                            neighborhood: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            isPrimary: false,
                          })
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {addressesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-20"
                  />
                ))}
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-medium">
                            {address.street}, {address.number}
                          </h4>
                          {address.isPrimary && (
                            <Badge variant="secondary">Principal</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {address.complement && `${address.complement}, `}
                          {address.neighborhood}, {address.city} -{' '}
                          {address.state}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          CEP: {address.zipCode}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={deleteAddressMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhum endereço cadastrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Adicione um endereço para começar
                </p>
                <Button onClick={() => setIsAddressDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Endereço
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
