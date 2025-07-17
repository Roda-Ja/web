/* eslint-disable no-unused-vars */
import type { ComponentType } from 'react'
import { create } from 'zustand'

export interface NavigationItem {
  title: string
  path: string
  icon?: ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

export interface BreadcrumbItem {
  title: string
  path: string
}

interface NavigationStore {
  // Todos os caminhos disponíveis na aplicação
  routes: NavigationItem[]

  // Caminho atual
  currentPath: string

  // Breadcrumb atual baseado no caminho
  currentBreadcrumb: BreadcrumbItem[]

  // Ações
  setCurrentPath: (path: string) => void
  getBreadcrumbForPath: (_path: string) => BreadcrumbItem[]
  isActiveRoute: (_path: string) => boolean
}

// Configuração de todas as rotas da aplicação
const allRoutes: NavigationItem[] = [
  {
    title: 'Painel Administrativo',
    path: '/dashboard',
    icon: undefined, // Será importado dinamicamente
  },
  {
    title: 'Histórico de Pedidos',
    path: '/orders/history',
    icon: undefined,
  },
  {
    title: 'Pedidos',
    path: '/orders',
    icon: undefined,
    children: [
      {
        title: 'Todos os Pedidos',
        path: '/orders/all',
      },
      {
        title: 'Pedidos Pendentes',
        path: '/orders/pending',
      },
      {
        title: 'Pedidos Concluídos',
        path: '/orders/completed',
      },
    ],
  },
  {
    title: 'Produtos',
    path: '/products',
    icon: undefined,
    children: [
      {
        title: 'Todos os Produtos',
        path: '/products/all',
      },
      {
        title: 'Adicionar Produto',
        path: '/products/add',
      },
      {
        title: 'Categorias',
        path: '/products/categories',
      },
    ],
  },
  {
    title: 'Relatórios',
    path: '/reports',
    icon: undefined,
    children: [
      {
        title: 'Relatório de Vendas',
        path: '/reports/sales',
      },
      {
        title: 'Relatório de Entregas',
        path: '/reports/deliveries',
      },
      {
        title: 'Relatório de Motoristas',
        path: '/reports/drivers',
      },
    ],
  },
  {
    title: 'Motoristas',
    path: '/drivers',
    icon: undefined,
    children: [
      {
        title: 'Todos os Motoristas',
        path: '/drivers/all',
      },
      {
        title: 'Adicionar Motorista',
        path: '/drivers/add',
      },
      {
        title: 'Avaliações',
        path: '/drivers/ratings',
      },
    ],
  },
  {
    title: 'Estabelecimentos',
    path: '/establishments',
    icon: undefined,
    children: [
      {
        title: 'Todos os Estabelecimentos',
        path: '/establishments/all',
      },
      {
        title: 'Adicionar Estabelecimento',
        path: '/establishments/add',
      },
      {
        title: 'Configurações',
        path: '/establishments/settings',
      },
    ],
  },
]

// Função para gerar breadcrumb baseado no caminho
const generateBreadcrumb = (
  routes: NavigationItem[],
  targetPath: string,
): BreadcrumbItem[] => {
  const breadcrumb: BreadcrumbItem[] = []

  // Se for a página inicial, retornar breadcrumb vazio
  if (targetPath === '/') {
    return breadcrumb
  }

  // Procurar o caminho nas rotas
  const findPath = (items: NavigationItem[], path: string): boolean => {
    for (const item of items) {
      if (item.path === path) {
        breadcrumb.push({ title: item.title, path: item.path })
        return true
      }
      if (item.children) {
        if (findPath(item.children, path)) {
          breadcrumb.unshift({ title: item.title, path: item.path })
          return true
        }
      }
    }
    return false
  }

  findPath(routes, targetPath)

  return breadcrumb
}

// Função para verificar se uma rota está ativa
const isRouteActive = (
  routes: NavigationItem[],
  currentPath: string,
  routePath: string,
): boolean => {
  // Verificação exata
  if (currentPath === routePath) {
    return true
  }

  // Verificar se é um pai de uma rota ativa
  const findActiveParent = (items: NavigationItem[]): boolean => {
    for (const item of items) {
      if (item.path === routePath && item.children) {
        return item.children.some(
          (child) => currentPath === child.path || findActiveParent([child]),
        )
      }
      if (item.children && findActiveParent(item.children)) {
        return true
      }
    }
    return false
  }

  return findActiveParent(routes)
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  routes: allRoutes,
  currentPath: '/',
  currentBreadcrumb: [{ title: 'Início', path: '/' }],

  setCurrentPath: (path: string) => {
    const breadcrumb = generateBreadcrumb(get().routes, path)
    set({ currentPath: path, currentBreadcrumb: breadcrumb })
  },

  getBreadcrumbForPath: (_path: string) => {
    return generateBreadcrumb(get().routes, _path)
  },

  isActiveRoute: (_path: string) => {
    return isRouteActive(get().routes, get().currentPath, _path)
  },
}))
