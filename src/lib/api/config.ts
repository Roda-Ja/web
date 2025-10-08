/* eslint-env node */
/* global process */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const API_URLS = {
  LOCAL_5432: 'http://localhost:5432/api/v1',
  LOCAL_3001: 'http://localhost:3001/api/v1',
  LOCAL_8000: 'http://localhost:8000/api/v1',
  LOCAL_8080: 'http://localhost:8080/api/v1',
  LOCAL_5000: 'http://localhost:5000/api/v1',
  LOCAL_4000: 'http://localhost:4000/api/v1',
  PRODUCTION: 'https://api.seudominio.com/api/v1',
}
