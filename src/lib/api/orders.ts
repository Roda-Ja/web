import { apiClient } from './client'
import type {
  PaginatedResponse,
  OrderResponse,
  CreateOrderRequest,
  OrderDetailsResponse,
  UpdatePaymentStatusRequest,
  UpdateDeliveryStatusRequest,
} from './types'

export interface ListOrdersParams {
  page?: number
  limit?: number
  status?: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod?: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'MONEY'
  paymentStatus?: 'PENDING' | 'PAID' | 'CANCELLED'
  deliveryStatus?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  customerId?: string
  totalPriceFrom?: number
  totalPriceTo?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'totalPrice'
  sortOrder?: 'asc' | 'desc'
}

export const ordersApi = {
  async list(
    params: ListOrdersParams = {},
  ): Promise<PaginatedResponse<OrderResponse>> {
    const cleaned: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (typeof value === 'number') cleaned[key] = value
      else cleaned[key] = String(value)
    })
    const response = await apiClient.get('/establishment/order/list', {
      params: cleaned,
    })
    return response.data
  },
  async create(payload: CreateOrderRequest): Promise<OrderResponse> {
    const response = await apiClient.post('/establishment/order/new', payload)
    return response.data
  },

  async getDetails(id: string): Promise<OrderDetailsResponse> {
    const response = await apiClient.get(`/establishment/order/${id}/show`)
    return response.data
  },

  async updatePaymentStatus(
    id: string,
    data: UpdatePaymentStatusRequest,
  ): Promise<OrderDetailsResponse> {
    const response = await apiClient.patch(
      `/establishment/order/${id}/payment-status`,
      data,
    )
    return response.data
  },

  async updateDeliveryStatus(
    id: string,
    data: UpdateDeliveryStatusRequest,
  ): Promise<OrderDetailsResponse> {
    const response = await apiClient.patch(
      `/establishment/order/${id}/delivery-status`,
      data,
    )
    return response.data
  },
}
