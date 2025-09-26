'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

// Exemplo de tipo de dados
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: string
}

// Exemplo de colunas
const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Função',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const roleConfig = {
        admin: { label: 'Administrador', variant: 'destructive' as const },
        user: { label: 'Usuário', variant: 'default' as const },
        moderator: { label: 'Moderador', variant: 'secondary' as const },
      }
      const config = roleConfig[role as keyof typeof roleConfig]
      return <Badge variant={config.variant}>{config.label}</Badge>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString('pt-BR')
    },
  },
]

// Exemplo de função para buscar dados da API
const fetchUsersData = async (
  pageIndex: number,
  pageSize: number,
): Promise<{
  data: User[]
  totalCount: number
}> => {
  // Aqui você faria a chamada real para sua API
  // Exemplo:
  // const response = await fetch(`/api/users?page=${pageIndex}&pageSize=${pageSize}`)
  // return response.json()

  // Simulação de dados
  const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Usuário ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['admin', 'user', 'moderator'][i % 3] as User['role'],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }))

  const startIndex = pageIndex * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = mockUsers.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    totalCount: mockUsers.length,
  }
}

// Exemplo de componente que usa o DataTable
export function UsersTableExample() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Lista de Usuários</h2>
        <p className="text-sm text-gray-500">
          Exemplo de uso do DataTable com paginação do backend
        </p>
      </div>

      <DataTable
        columns={userColumns}
        fetchData={fetchUsersData}
        pageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
      />
    </div>
  )
}

// Exemplo de como usar com diferentes tipos de dados
interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nome do Produto',
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
  {
    accessorKey: 'inStock',
    header: 'Em Estoque',
    cell: ({ row }) => {
      const inStock = row.getValue('inStock')
      return (
        <Badge variant={inStock ? 'success' : 'destructive'}>
          {inStock ? 'Sim' : 'Não'}
        </Badge>
      )
    },
  },
]

const fetchProductsData = async (
  pageIndex: number,
  pageSize: number,
): Promise<{
  data: Product[]
  totalCount: number
}> => {
  // Simulação de dados de produtos
  const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Produto ${i + 1}`,
    price: Math.random() * 1000,
    category: ['Eletrônicos', 'Roupas', 'Livros', 'Casa'][i % 4],
    inStock: Math.random() > 0.3,
  }))

  const startIndex = pageIndex * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = mockProducts.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    totalCount: mockProducts.length,
  }
}

export function ProductsTableExample() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Lista de Produtos</h2>
        <p className="text-sm text-gray-500">
          Outro exemplo com diferentes tipos de dados
        </p>
      </div>

      <DataTable
        columns={productColumns}
        fetchData={fetchProductsData}
        pageSize={8}
        pageSizeOptions={[5, 8, 15, 25]}
      />
    </div>
  )
}
