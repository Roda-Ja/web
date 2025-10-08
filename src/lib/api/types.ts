// Tipos para autenticação
export interface SignUpRequest {
  name: string
  email: string
  password: string
}

export interface SignUpResponse {
  id: string
  name: string
  email: string
  entity?: 'establishment'
  createdAt: string
  updatedAt?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  token: {
    accessToken: string
    refreshToken: string
  }
  user: {
    id: string
    name: string
    email: string
    entity?: 'establishment'
    role?: 'master' | 'establishment_admin' | 'user'
    establishmentId?: string
    createdAt: string
  }
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}

// Tipos para produtos (para referência futura)
export interface ProductResponse {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Criação de produto
export interface CreateProductRequest {
  name: string
  categoryId: string
  description: string
  price: number
  oldPrice?: number
  imageUrl: string
  isActive: boolean
}

export interface ProductCategoryResponse {
  id: string
  name: string
  createdAt: string
}

export interface EstablishmentResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

// Tipos para paginação
export interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
