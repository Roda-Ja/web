import type { Product } from '@/lib/data/establishments'

export const products: Product[] = [
  {
    id: 'feijoada',
    name: 'Feijoada Completa',
    description:
      'Tradicional feijoada brasileira com feijão preto, carnes suínas, linguiça, acompanhada de arroz, couve refogada, farofa e laranja.',
    price: 32.9,
    originalPrice: 39.9,
    rating: 4.8,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1604908176997-431656c2f1a4?q=80&w=1200&auto=format&fit=crop',
    tag: 'Oferta Especial',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'prato-feito',
    name: 'Prato Feito',
    description:
      'Arroz, feijão, carne bovina grelhada, batata frita crocante e salada fresca. O clássico prato brasileiro.',
    price: 18.9,
    originalPrice: 23.9,
    rating: 4.5,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1604908554027-6f7f2f7dc8f0?q=80&w=1200&auto=format&fit=crop',
    tag: '20% Off',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'moqueca',
    name: 'Moqueca de Peixe',
    description:
      'Deliciosa moqueca de peixe branco, cozida no leite de coco, dendê, tomate, cebola e pimentão. Servida com arroz e pirão.',
    price: 28.5,
    originalPrice: 35.6,
    rating: 4.7,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1596280019551-318837a5d5a8?q=80&w=1200&auto=format&fit=crop',
    tag: 'Desconto Membro',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'picanha',
    name: 'Picanha na Chapa',
    description:
      'Suculenta picanha grelhada na chapa, temperada com sal grosso e ervas. Acompanha arroz, feijão tropeiro e farofa.',
    price: 42.9,
    rating: 4.9,
    category: 'brasileira',
    image:
      'https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=1200&auto=format&fit=crop',
    isAvailable: false,
    establishmentId: '1',
  },
  {
    id: 'xburger',
    name: 'X-Burger Especial',
    description:
      'Hambúrguer artesanal com carne 180g, queijo cheddar, bacon crocante, alface, tomate, cebola roxa e molho especial.',
    price: 18.5,
    originalPrice: 22.9,
    rating: 4.6,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1200&auto=format&fit=crop',
    tag: '15% Off',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'xtudo',
    name: 'X-Tudo',
    description:
      'O hambúrguer mais completo: carne, queijo, presunto, bacon, ovo, batata palha, alface, tomate, cebola e maionese.',
    price: 22.9,
    rating: 4.4,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'sanduba',
    name: 'Sanduíche Natural',
    description:
      'Pão integral, peito de peru, queijo branco, alface, tomate, cenoura ralada e maionese light. Opção saudável e saborosa.',
    price: 12.5,
    originalPrice: 15.9,
    rating: 4.2,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=1200&auto=format&fit=crop',
    tag: 'Oferta Especial',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'hotdog',
    name: 'Hot Dog Completo',
    description:
      'Salsicha artesanal, pão especial, purê de batata, vinagrete, milho, ervilha, batata palha e molhos especiais.',
    price: 15.9,
    rating: 4.3,
    category: 'lanches',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante Lata',
    description:
      'Refrigerante gelado em lata de 350ml. Disponível nos sabores: Coca-Cola, Pepsi, Guaraná Antarctica e Fanta Laranja.',
    price: 6.5,
    rating: 4.1,
    category: 'bebidas',
    image:
      'https://images.unsplash.com/photo-1613478223719-2a8ddb997ef8?q=80&w=1200&auto=format&fit=crop',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'suco',
    name: 'Suco Natural',
    description:
      'Suco natural de frutas frescas, sem conservantes. Opções: laranja, maracujá, abacaxi, limão e morango.',
    price: 9.9,
    rating: 4.4,
    category: 'bebidas',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
    tag: 'Fresco',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'pudim',
    name: 'Pudim de Leite',
    description:
      'Tradicional pudim de leite condensado com calda de caramelo. Cremoso, doce e irresistível sobremesa brasileira.',
    price: 12.9,
    rating: 4.8,
    category: 'sobremesas',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=1200&auto=format&fit=crop',
    isAvailable: true,
    establishmentId: '1',
  },
  {
    id: 'brownie',
    name: 'Brownie com Sorvete',
    description:
      'Brownie de chocolate quente, coberto com sorvete de baunilha, calda de chocolate e granulado. Perfeito para finalizar a refeição.',
    price: 16.9,
    rating: 4.7,
    category: 'sobremesas',
    image:
      'https://images.unsplash.com/photo-1606313564200-1154a59dbf45?q=80&w=1200&auto=format&fit=crop',
    isAvailable: true,
    establishmentId: '1',
  },
]

export const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Brasileira', value: 'brasileira' },
  { label: 'Lanches', value: 'lanches' },
  { label: 'Bebidas', value: 'bebidas' },
  { label: 'Sobremesas', value: 'sobremesas' },
] as const
