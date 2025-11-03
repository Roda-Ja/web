'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { User, MapPin, CreditCard, Loader2, Store, Truck } from 'lucide-react'

interface CheckoutFormProps {
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    paymentMethod: '',
    deliveryType: 'delivery' as 'delivery' | 'pickup',
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleDeliveryTypeChange = (type: 'delivery' | 'pickup') => {
    setDeliveryType(type)
    setFormData((prev) => ({
      ...prev,
      deliveryType: type,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid = () => {
    const customerValid =
      formData.customer.name &&
      formData.customer.email &&
      formData.customer.phone

    const paymentValid = formData.paymentMethod

    // Se for retirada, endereço não é obrigatório
    if (deliveryType === 'pickup') {
      return customerValid && paymentValid
    }

    // Se for entrega, endereço é obrigatório
    const addressValid =
      formData.address.street &&
      formData.address.number &&
      formData.address.neighborhood &&
      formData.address.city &&
      formData.address.state &&
      formData.address.zipCode

    return customerValid && addressValid && paymentValid
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer.name">Nome completo *</Label>
              <Input
                id="customer.name"
                value={formData.customer.name}
                onChange={(e) =>
                  handleInputChange('customer.name', e.target.value)
                }
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer.email">E-mail *</Label>
              <Input
                id="customer.email"
                type="email"
                value={formData.customer.email}
                onChange={(e) =>
                  handleInputChange('customer.email', e.target.value)
                }
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer.phone">Telefone *</Label>
            <Input
              id="customer.phone"
              value={formData.customer.phone}
              onChange={(e) =>
                handleInputChange('customer.phone', e.target.value)
              }
              placeholder="(11) 99999-9999"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Tipo de Recebimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              type="button"
              onClick={() => handleDeliveryTypeChange('delivery')}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all sm:gap-3 sm:p-6 ${
                deliveryType === 'delivery'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <Truck className={`h-8 w-8 sm:h-10 sm:w-10 ${
                deliveryType === 'delivery' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-center">
                <h3 className="text-sm font-semibold sm:text-base">Entrega</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Receba em seu endereço
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDeliveryTypeChange('pickup')}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all sm:gap-3 sm:p-6 ${
                deliveryType === 'pickup'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <Store className={`h-8 w-8 sm:h-10 sm:w-10 ${
                deliveryType === 'pickup' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-center">
                <h3 className="text-sm font-semibold sm:text-base">Retirada</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Retire no estabelecimento
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {deliveryType === 'delivery' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço de Entrega
            </CardTitle>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address.street">Rua/Avenida *</Label>
              <Input
                id="address.street"
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange('address.street', e.target.value)
                }
                placeholder="Nome da rua"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.number">Número *</Label>
              <Input
                id="address.number"
                value={formData.address.number}
                onChange={(e) =>
                  handleInputChange('address.number', e.target.value)
                }
                placeholder="123"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address.complement">Complemento</Label>
            <Input
              id="address.complement"
              value={formData.address.complement}
              onChange={(e) =>
                handleInputChange('address.complement', e.target.value)
              }
              placeholder="Apto 45, Bloco A"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address.neighborhood">Bairro *</Label>
              <Input
                id="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={(e) =>
                  handleInputChange('address.neighborhood', e.target.value)
                }
                placeholder="Centro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">Cidade *</Label>
              <Input
                id="address.city"
                value={formData.address.city}
                onChange={(e) =>
                  handleInputChange('address.city', e.target.value)
                }
                placeholder="São Paulo"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address.state">Estado *</Label>
              <Input
                id="address.state"
                value={formData.address.state}
                onChange={(e) =>
                  handleInputChange('address.state', e.target.value)
                }
                placeholder="SP"
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.zipCode">CEP *</Label>
              <Input
                id="address.zipCode"
                value={formData.address.zipCode}
                onChange={(e) =>
                  handleInputChange('address.zipCode', e.target.value)
                }
                placeholder="01234-567"
                required
              />
            </div>
          </div>
        </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de pagamento *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange('paymentMethod', value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                <SelectItem value="MONEY">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid() || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Finalizar Pedido'
          )}
        </Button>
      </div>
    </form>
  )
}
