import { create } from 'zustand'
import type { Product } from '@/lib/data/establishments'

export type ManualCartItem = {
  product: Product
  quantity: number
}

type ManualOrderCartState = {
  items: ManualCartItem[]
  addItem: (product: Product, quantity?: number) => void
  increase: (productId: string) => void
  decrease: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useManualOrderCartStore = create<ManualOrderCartState>((set, get) => ({
  items: [],

  addItem: (product: Product, quantity: number = 1) => {
    set((state) => {
      const index = state.items.findIndex((it) => it.product.id === product.id)
      if (index >= 0) {
        const updated = [...state.items]
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
        }
        return { items: updated }
      }
      return { items: [...state.items, { product, quantity }] }
    })
  },

  increase: (productId: string) => {
    set((state) => ({
      items: state.items.map((it) =>
        it.product.id === productId ? { ...it, quantity: it.quantity + 1 } : it,
      ),
    }))
  },

  decrease: (productId: string) => {
    set((state) => ({
      items: state.items
        .map((it) =>
          it.product.id === productId
            ? { ...it, quantity: it.quantity - 1 }
            : it,
        )
        .filter((it) => it.quantity > 0),
    }))
  },

  remove: (productId: string) => {
    set((state) => ({
      items: state.items.filter((it) => it.product.id !== productId),
    }))
  },

  clear: () => set({ items: [] }),

  totalItems: () => get().items.reduce((acc, it) => acc + it.quantity, 0),
  totalPrice: () =>
    get().items.reduce((acc, it) => acc + it.quantity * it.product.price, 0),
}))

