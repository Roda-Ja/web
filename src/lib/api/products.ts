import { apiClient } from './client'
import type {
  PaginatedResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductMetricsResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
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

export interface ListCategoriesParams {
  page?: number
  limit?: number
  search?: string
}

export const productsApi = {
  async list(
    params: ListProductsParams = {},
  ): Promise<PaginatedResponse<ProductResponse>> {
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
  async update(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const response = await apiClient.put(
      `/establishment/product/update/${id}`,
      payload,
    )
    return response.data
  },
  async getMetrics(): Promise<ProductMetricsResponse> {
    const response = await apiClient.get('/establishment/product/metrics')
    return response.data
  },
  async createCategory(
    payload: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    const response = await apiClient.post(
      '/establishment/product/category/new',
      payload,
    )
    return response.data
  },
  async listCategories(
    params: ListCategoriesParams = {},
  ): Promise<PaginatedResponse<CategoryResponse>> {
    const cleaned: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (typeof value === 'number') cleaned[key] = value
      else cleaned[key] = String(value)
    })
    const response = await apiClient.get(
      '/establishment/product/category/list',
      {
        params: cleaned,
      },
    )
    return response.data
  },
  async updateCategory(
    id: string,
    payload: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const response = await apiClient.post(
      `/establishment/product/category/update/${id}`,
      payload,
    )
    return response.data
  },
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/establishment/product/category/delete/${id}`)
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/establishment/product/delete/${id}`)
  },
}
