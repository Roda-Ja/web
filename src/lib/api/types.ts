export interface SignUpRequest {
  name: string
  email: string
  password: string
  slug: string
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

export interface ProductResponse {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  imageUrl?: string
  categoryId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  categoryId: string
  description: string
  price: number
  oldPrice?: number
  imageUrl: string
  isActive: boolean
}

export interface UpdateProductRequest {
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

export interface ProductMetricsResponse {
  totalProducts: number
  activeProducts: number
  totalProductCategories: number
}

export interface CreateCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  name: string
}

export interface CategoryResponse {
  value: string
  label: string
  createdAt: string
  updatedAt?: string
}

export interface OrderCustomerResponse {
  id: string
  name: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface OrderAddressResponse {
  id: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  customerId?: string
  createdAt?: string
  updatedAt?: string
}

export interface BusinessHoursResponse {
  id: string
  establishmentId: string
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  openAt: string
  closeAt: string
  isOpen: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderEstablishmentResponse {
  id: string
  name: string
  slug: string
  imageUrl?: string
  businessHours?: BusinessHoursResponse[]
  addresses?: Array<{
    id: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isPrimary: boolean
    createdAt: string
    updatedAt: string
  }>
  createdAt?: string
}

export interface OrderResponse {
  id: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  totalPrice: number
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'MONEY'
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  deliveryStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  deliveredAt: string | null
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  establishmentId: string
  addressId: string
  customerId: string
  establishment?: OrderEstablishmentResponse
  customer?: OrderCustomerResponse
  address?: OrderAddressResponse
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  products: Array<{
    id: string
    quantity: number
  }>
  totalPrice: number
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'MONEY'
  address: {
    id?: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  customer: {
    id?: string
    name: string
    email: string
    phone: string
  }
}

export interface PublicEstablishmentResponse {
  id: string
  name: string
  slug: string
  imageUrl?: string
  addresses: Array<{
    id: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isPrimary: boolean
    createdAt: string
    updatedAt: string
  }>
  createdAt: string
}

export interface ListPublicEstablishmentsParams {
  page?: number
  limit?: number
  search?: string
  sort?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  slug?: string
  verified?: 'true' | 'false'
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
}

export interface EstablishmentMeResponse {
  id: string
  name: string
  email: string
  slug: string
  imageUrl?: string
  addresses: Array<{
    id: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isPrimary: boolean
    createdAt: string
    updatedAt: string
  }>
  createdAt: string
  updatedAt: string
  entity: 'ESTABLISHMENT'
}

export interface UpdateEstablishmentRequest {
  name: string
  slug: string
  imageUrl?: string
}

export interface EstablishmentAddressResponse {
  id: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
}

export interface UpdateDeliveryStatusRequest {
  deliveryStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

export interface UpdateApprovalStatusRequest {
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface OrderDetailsResponse {
  id: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  totalPrice: number
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'MONEY'
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  deliveryStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  deliveredAt: string | null
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  establishmentId?: string
  addressId?: string
  customerId?: string
  establishment: OrderEstablishmentResponse
  customer: OrderCustomerResponse
  address: OrderAddressResponse
  createdAt?: string
  updatedAt?: string
}
