'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Category } from '@/components/menu/product-card'
import { ProductCard } from '@/components/menu/product-card'
import { categories, products } from './data'

export default function Cardapio() {
  const tabs = categories as unknown as { label: string; value: Category }[]

  const renderGrid = (cat: Category) => {
    const list =
      cat === 'todos' ? products : products.filter((p) => p.category === cat)
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-3 py-3">
      <Tabs
        defaultValue="todos"
        className="w-full"
      >
        <TabsList className="max-w-full overflow-auto">
          {tabs.map((c) => (
            <TabsTrigger
              key={c.value}
              value={c.value}
              className="min-w-24"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((c) => (
          <TabsContent
            key={c.value}
            value={c.value}
          >
            {renderGrid(c.value)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
