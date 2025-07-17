'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProductsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-700">
          Gerenciamento de Produtos
        </h1>
        <p className="text-sm text-gray-500">
          Visualize e gerencie todos os produtos
        </p>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da página de produtos será exibido aqui.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
