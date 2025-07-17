'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AllOrdersPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-700">Todos os Pedidos</h1>
        <p className="text-sm text-gray-500">
          Visualize todos os pedidos do sistema
        </p>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista Completa de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de todos os pedidos será exibido aqui.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
