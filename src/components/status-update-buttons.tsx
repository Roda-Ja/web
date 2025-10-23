'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  CreditCard,
  Truck,
  ChevronDown,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

interface StatusUpdateButtonsProps {
  orderId: string
  currentPaymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  currentDeliveryStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  establishmentId?: string
}

export function StatusUpdateButtons({
  orderId,
  currentPaymentStatus,
  currentDeliveryStatus,
  establishmentId,
}: StatusUpdateButtonsProps) {
  const queryClient = useQueryClient()
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false)

  const updatePaymentMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'PENDING' | 'PAID' | 'CANCELLED'
    }) => ordersApi.updatePaymentStatus(id, { paymentStatus: status }),
    onSuccess: () => {
      toast.success('Status de pagamento atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao atualizar status de pagamento: ' +
          (error.message || 'Erro desconhecido'),
      )
    },
  })

  const updateDeliveryMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    }) => ordersApi.updateDeliveryStatus(id, { deliveryStatus: status }),
    onSuccess: () => {
      toast.success('Status de entrega atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details'] })
    },
    onError: (error: any) => {
      toast.error(
        'Erro ao atualizar status de entrega: ' +
          (error.message || 'Erro desconhecido'),
      )
    },
  })

  const handlePaymentStatusUpdate = async (
    status: 'PENDING' | 'PAID' | 'CANCELLED',
  ) => {
    if (status === currentPaymentStatus) return

    setIsUpdatingPayment(true)
    try {
      await updatePaymentMutation.mutateAsync({ id: orderId, status })
    } finally {
      setIsUpdatingPayment(false)
    }
  }

  const handleDeliveryStatusUpdate = async (
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ) => {
    if (status === currentDeliveryStatus) return

    setIsUpdatingDelivery(true)
    try {
      await updateDeliveryMutation.mutateAsync({ id: orderId, status })
    } finally {
      setIsUpdatingDelivery(false)
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Entregue'
      case 'IN_PROGRESS':
        return 'Em Andamento'
      case 'PENDING':
        return 'Pendente'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdatingPayment || isUpdatingDelivery}
            className="flex items-center gap-2"
          >
            {isUpdatingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              getPaymentStatusIcon(currentPaymentStatus)
            )}
            <span className="hidden sm:inline">Pagamento</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => handlePaymentStatusUpdate('PENDING')}
            disabled={currentPaymentStatus === 'PENDING'}
          >
            <Clock className="mr-2 h-4 w-4 text-yellow-600" />
            Pendente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusUpdate('PAID')}
            disabled={currentPaymentStatus === 'PAID'}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Pago
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusUpdate('CANCELLED')}
            disabled={currentPaymentStatus === 'CANCELLED'}
          >
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Cancelado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isUpdatingPayment || isUpdatingDelivery}
            className="flex items-center gap-2"
          >
            {isUpdatingDelivery ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              getDeliveryStatusIcon(currentDeliveryStatus)
            )}
            <span className="hidden sm:inline">Entrega</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => handleDeliveryStatusUpdate('PENDING')}
            disabled={currentDeliveryStatus === 'PENDING'}
          >
            <Clock className="mr-2 h-4 w-4 text-yellow-600" />
            Pendente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeliveryStatusUpdate('IN_PROGRESS')}
            disabled={currentDeliveryStatus === 'IN_PROGRESS'}
          >
            <Truck className="mr-2 h-4 w-4 text-blue-600" />
            Em Andamento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeliveryStatusUpdate('COMPLETED')}
            disabled={currentDeliveryStatus === 'COMPLETED'}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Entregue
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeliveryStatusUpdate('CANCELLED')}
            disabled={currentDeliveryStatus === 'CANCELLED'}
          >
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Cancelado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
