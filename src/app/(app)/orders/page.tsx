'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OrdersPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-700">
          Gerenciamento de Pedidos
        </h1>
        <p className="text-sm text-gray-500">
          Visualize e gerencie todos os pedidos
        </p>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de pedidos será exibido aqui.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
