import { apiClient } from './client'
import type {
  PaginatedResponse,
  PublicEstablishmentResponse,
  ListPublicEstablishmentsParams,
} from './types'

export const publicEstablishmentsApi = {
  async list(
    params: ListPublicEstablishmentsParams = {},
  ): Promise<PaginatedResponse<PublicEstablishmentResponse>> {
    const cleaned: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      if (typeof value === 'number') cleaned[key] = value
      else cleaned[key] = String(value)
    })

    const response = await apiClient.get('/public/establishment/list', {
      params: cleaned,
    })
    return response.data
  },
}
