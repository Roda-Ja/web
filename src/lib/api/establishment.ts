import { apiClient } from './client'
import type {
  EstablishmentMeResponse,
  UpdateEstablishmentRequest,
  EstablishmentAddressResponse,
  CreateEstablishmentAddressRequest,
} from './types'

export const establishmentApi = {
  async getMe(): Promise<EstablishmentMeResponse> {
    const response = await apiClient.get('/establishment/me')
    return response.data
  },

  async update(
    data: UpdateEstablishmentRequest,
  ): Promise<EstablishmentMeResponse> {
    const response = await apiClient.patch('/establishment/update', data)
    return response.data
  },

  async getAddresses(): Promise<EstablishmentAddressResponse[]> {
    const response = await apiClient.get('/establishment/address')
    return response.data
  },

  async createAddress(
    data: CreateEstablishmentAddressRequest,
  ): Promise<EstablishmentAddressResponse> {
    const response = await apiClient.post('/establishment/address', data)
    return response.data
  },

  async updateAddress(
    id: string,
    data: Partial<CreateEstablishmentAddressRequest>,
  ): Promise<EstablishmentAddressResponse> {
    const response = await apiClient.patch(`/establishment/address/${id}`, data)
    return response.data
  },

  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete(`/establishment/address/${id}`)
  },
}
