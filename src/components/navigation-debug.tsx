'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigationStore } from '@/lib/stores/navigation-store'

export function NavigationDebug() {
  const { currentPath, currentBreadcrumb, isActiveRoute } = useNavigationStore()

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug da Navegação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>Caminho Atual:</strong> {currentPath}
          </div>
          <div>
            <strong>Breadcrumb:</strong>
            {currentBreadcrumb.length === 0 ? (
              <p className="text-muted-foreground mt-1 ml-4">
                Nenhum breadcrumb (página inicial)
              </p>
            ) : (
              <ul className="mt-1 ml-4">
                {currentBreadcrumb.map((item, index) => (
                  <li key={item.path}>
                    {index + 1}. {item.title} ({item.path})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <strong>Rotas Ativas:</strong>
            <ul className="mt-1 ml-4">
              <li>Dashboard: {isActiveRoute('/dashboard') ? '✅' : '❌'}</li>
              <li>Pedidos: {isActiveRoute('/orders') ? '✅' : '❌'}</li>
              <li>Produtos: {isActiveRoute('/products') ? '✅' : '❌'}</li>
              <li>Relatórios: {isActiveRoute('/reports') ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
