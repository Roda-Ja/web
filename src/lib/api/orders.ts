import { apiClient } from './client'
import type { PaginatedResponse, OrderResponse } from './types'

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
}
