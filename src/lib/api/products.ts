import { apiClient } from './client'
import type {
  PaginatedResponse,
  ProductResponse,
  CreateProductRequest,
} from './types'

export interface ListProductsParams {
  page?: number
  limit?: number
  search?: string
  sort?: 'name' | 'price' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  categoryId?: string
  isActive?: 'true' | 'false'
  minPrice?: number
  maxPrice?: number
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
}

export const productsApi = {
  async list(
    params: ListProductsParams = {},
  ): Promise<PaginatedResponse<ProductResponse>> {
    // garantir que apenas valores definidos sejam enviados e em tipos simples
    const cleaned: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (typeof value === 'number') cleaned[key] = value
      else cleaned[key] = String(value)
    })
    const response = await apiClient.get('/establishment/product/list', {
      params: cleaned,
    })
    return response.data
  },
  async create(payload: CreateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.post('/establishment/product/new', payload)
    return response.data
  },
}
