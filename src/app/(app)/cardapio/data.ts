import type { Product } from '@/components/menu/product-card'

export const products: Product[] = [
  {
    id: 'feijoada',
    name: 'Feijoada Completa',
    price: 32.9,
    oldPrice: 39.9,
    rating: 4.8,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1604908176997-431656c2f1a4?q=80&w=1200&auto=format&fit=crop',
    tag: 'Oferta Especial',
  },
  {
    id: 'prato-feito',
    name: 'Prato Feito',
    price: 18.9,
    oldPrice: 23.9,
    rating: 4.5,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1604908554027-6f7f2f7dc8f0?q=80&w=1200&auto=format&fit=crop',
    tag: '20% Off',
  },
  {
    id: 'moqueca',
    name: 'Moqueca de Peixe',
    price: 28.5,
    oldPrice: 35.6,
    rating: 4.7,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1596280019551-318837a5d5a8?q=80&w=1200&auto=format&fit=crop',
    tag: 'Desconto Membro',
  },
  {
    id: 'picanha',
    name: 'Picanha na Chapa',
    price: 42.9,
    rating: 4.9,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=1200&auto=format&fit=crop',
    available: false,
  },
  {
    id: 'xburger',
    name: 'X-Burger Especial',
    price: 18.5,
    oldPrice: 22.9,
    rating: 4.6,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop',
    tag: '15% Off',
  },
  {
    id: 'xtudo',
    name: 'X-Tudo',
    price: 22.9,
    rating: 4.4,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'sanduba',
    name: 'Sanduíche Natural',
    price: 12.5,
    oldPrice: 15.9,
    rating: 4.2,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=1200&auto=format&fit=crop',
    tag: 'Oferta Especial',
  },
  {
    id: 'hotdog',
    name: 'Hot Dog Completo',
    price: 15.9,
    rating: 4.3,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante Lata',
    price: 6.5,
    rating: 4.1,
    category: 'bebidas',
    image:
      'https://images.unsplash.com/photo-1613478223719-2a8ddb997ef8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'suco',
    name: 'Suco Natural',
    price: 9.9,
    rating: 4.4,
    category: 'bebidas',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
    tag: 'Fresco',
  },
  {
    id: 'pudim',
    name: 'Pudim de Leite',
    price: 12.9,
    rating: 4.8,
    category: 'sobremesas',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'brownie',
    name: 'Brownie com Sorvete',
    price: 16.9,
    rating: 4.7,
    category: 'sobremesas',
    image:
      'https://images.unsplash.com/photo-1606313564200-1154a59dbf45?q=80&w=1200&auto=format&fit=crop',
  },
]

export const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Brasileira', value: 'brasileira' },
  { label: 'Lanches', value: 'lanches' },
  { label: 'Bebidas', value: 'bebidas' },
  { label: 'Sobremesas', value: 'sobremesas' },
] as const
