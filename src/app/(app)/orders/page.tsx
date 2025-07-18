'use client'

import { DataTable } from '@/components/ui/data-table'
import { columns, Order } from './history/columns'

const sampleData: Order[] = [
  {
    id: '1',
    code: 'PED-001',
    nickname: 'João Silva',
    price: 45.9,
    date: '2024-01-15T10:30:00',
    status: 'completed',
  },
  {
    id: '2',
    code: 'PED-002',
    nickname: 'Maria Santos',
    price: 32.5,
    date: '2024-01-15T11:15:00',
    status: 'processing',
  },
  {
    id: '3',
    code: 'PED-003',
    nickname: 'Pedro Costa',
    price: 78.25,
    date: '2024-01-15T12:00:00',
    status: 'pending',
  },
  {
    id: '4',
    code: 'PED-004',
    nickname: 'Ana Oliveira',
    price: 120.0,
    date: '2024-01-15T13:45:00',
    status: 'completed',
  },
  {
    id: '5',
    code: 'PED-005',
    nickname: 'Carlos Ferreira',
    price: 55.75,
    date: '2024-01-15T14:20:00',
    status: 'cancelled',
  },
  {
    id: '6',
    code: 'PED-006',
    nickname: 'Lucia Martins',
    price: 89.9,
    date: '2024-01-15T15:10:00',
    status: 'processing',
  },
  {
    id: '7',
    code: 'PED-007',
    nickname: 'Roberto Lima',
    price: 67.3,
    date: '2024-01-15T16:00:00',
    status: 'completed',
  },
  {
    id: '8',
    code: 'PED-008',
    nickname: 'Fernanda Rocha',
    price: 42.8,
    date: '2024-01-15T16:45:00',
    status: 'pending',
  },
  {
    id: '9',
    code: 'PED-009',
    nickname: 'Ricardo Alves',
    price: 95.5,
    date: '2024-01-15T17:30:00',
    status: 'processing',
  },
  {
    id: '10',
    code: 'PED-010',
    nickname: 'Patricia Souza',
    price: 38.9,
    date: '2024-01-15T18:15:00',
    status: 'completed',
  },
  {
    id: '11',
    code: 'PED-011',
    nickname: 'Marcelo Dias',
    price: 125.75,
    date: '2024-01-15T19:00:00',
    status: 'pending',
  },
  {
    id: '12',
    code: 'PED-012',
    nickname: 'Juliana Costa',
    price: 73.2,
    date: '2024-01-15T19:45:00',
    status: 'processing',
  },
  {
    id: '13',
    code: 'PED-013',
    nickname: 'Fernando Lima',
    price: 88.5,
    date: '2024-01-15T20:30:00',
    status: 'completed',
  },
  {
    id: '14',
    code: 'PED-014',
    nickname: 'Camila Santos',
    price: 156.8,
    date: '2024-01-15T21:15:00',
    status: 'processing',
  },
  {
    id: '15',
    code: 'PED-015',
    nickname: 'Rafael Costa',
    price: 92.3,
    date: '2024-01-15T22:00:00',
    status: 'pending',
  },
]

const fetchOrdersData = async (
  pageIndex: number,
  pageSize: number,
): Promise<{
  data: Order[]
  totalCount: number
}> => {
  // Simular delay de rede
  await new Promise((resolve) => globalThis.setTimeout(resolve, 1000))

  // Calcular índices para paginação
  const startIndex = pageIndex * pageSize
  const endIndex = startIndex + pageSize

  // Simular filtros ou busca (aqui você pode adicionar lógica de busca)
  const filteredData = sampleData

  // Retornar dados paginados
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    totalCount: filteredData.length,
  }
}

export default function OrdersPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-700">Todos os Pedidos</h1>
        <p className="text-sm text-gray-500">
          Visualize todos os pedidos do sistema
        </p>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} fetchData={fetchOrdersData} />
      </div>
    </>
  )
}
