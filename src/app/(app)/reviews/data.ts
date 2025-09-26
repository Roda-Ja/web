export type Review = {
  id: string
  customerName: string
  customerAvatar: string
  productId: string
  productName: string
  productImage: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export type ReviewStats = {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  recentReviews: number
}

export const reviewStats: ReviewStats = {
  totalReviews: 247,
  averageRating: 4.6,
  ratingDistribution: {
    5: 156,
    4: 67,
    3: 18,
    2: 4,
    1: 2,
  },
  recentReviews: 23,
}

export const reviews: Review[] = [
  {
    id: '1',
    customerName: 'Maria Silva',
    customerAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop',
    productId: 'feijoada',
    productName: 'Feijoada Completa',
    productImage:
      'https://images.unsplash.com/photo-1604908176997-431656c2f1a4?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Excelente feijoada! Muito saborosa e bem temperada. A couve estava perfeita e o arroz bem soltinho. Recomendo!',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    customerName: 'João Santos',
    customerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    productId: 'xburger',
    productName: 'X-Burger Especial',
    productImage:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=120&auto=format&fit=crop',
    rating: 4,
    comment:
      'Hambúrguer muito bom, carne suculenta e ingredientes frescos. Só achei o pão um pouco seco, mas no geral está ótimo.',
    date: '2024-01-14',
    verified: true,
  },
  {
    id: '3',
    customerName: 'Ana Costa',
    customerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    productId: 'moqueca',
    productName: 'Moqueca de Peixe',
    productImage:
      'https://images.unsplash.com/photo-1596280019551-318837a5d5a8?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Moqueca deliciosa! Peixe fresco, tempero perfeito e o leite de coco deu um toque especial. Voltarei com certeza!',
    date: '2024-01-13',
    verified: true,
  },
  {
    id: '4',
    customerName: 'Pedro Oliveira',
    customerAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    productId: 'prato-feito',
    productName: 'Prato Feito',
    productImage:
      'https://images.unsplash.com/photo-1604908554027-6f7f2f7dc8f0?q=80&w=120&auto=format&fit=crop',
    rating: 3,
    comment:
      'Prato feito básico, nada excepcional. A carne estava um pouco dura, mas o preço é justo.',
    date: '2024-01-12',
    verified: false,
  },
  {
    id: '5',
    customerName: 'Carla Mendes',
    customerAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    productId: 'sanduba',
    productName: 'Sanduíche Natural',
    productImage:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Perfeito para quem quer uma opção saudável! Ingredientes frescos e saborosos. Ótima quantidade e preço justo.',
    date: '2024-01-11',
    verified: true,
  },
  {
    id: '6',
    customerName: 'Rafael Ferreira',
    customerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    productId: 'xtudo',
    productName: 'X-Tudo',
    productImage:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=120&auto=format&fit=crop',
    rating: 4,
    comment:
      'Hambúrguer bem recheado e saboroso! A única coisa é que fica um pouco difícil de comer por causa do tamanho, mas vale a pena.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '7',
    customerName: 'Fernanda Lima',
    customerAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    productId: 'pudim',
    productName: 'Pudim de Leite',
    productImage:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Pudim incrível! Cremoso, doce no ponto certo e a calda de caramelo está perfeita. Melhor sobremesa da região!',
    date: '2024-01-09',
    verified: true,
  },
  {
    id: '8',
    customerName: 'Lucas Rodrigues',
    customerAvatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=100&auto=format&fit=crop',
    productId: 'hotdog',
    productName: 'Hot Dog Completo',
    productImage:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=120&auto=format&fit=crop',
    rating: 4,
    comment:
      'Hot dog bem recheado e gostoso! Os acompanhamentos estavam frescos e a salsicha tinha um bom sabor.',
    date: '2024-01-08',
    verified: true,
  },
  {
    id: '9',
    customerName: 'Juliana Alves',
    customerAvatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=100&auto=format&fit=crop',
    productId: 'brownie',
    productName: 'Brownie com Sorvete',
    productImage:
      'https://images.unsplash.com/photo-1606313564200-1154a59dbf45?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Combinação perfeita! Brownie quentinho com sorvete gelado. O chocolate é de qualidade e o sorvete bem cremoso.',
    date: '2024-01-07',
    verified: true,
  },
  {
    id: '10',
    customerName: 'Marcos Pereira',
    customerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    productId: 'suco',
    productName: 'Suco Natural',
    productImage:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=120&auto=format&fit=crop',
    rating: 4,
    comment:
      'Suco natural e refrescante! Escolhi de laranja e estava bem doce e saboroso. Preço justo para um suco natural.',
    date: '2024-01-06',
    verified: true,
  },
  {
    id: '11',
    customerName: 'Patrícia Souza',
    customerAvatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&auto=format&fit=crop',
    productId: 'refrigerante',
    productName: 'Refrigerante Lata',
    productImage:
      'https://images.unsplash.com/photo-1613478223719-2a8ddb997ef8?q=80&w=120&auto=format&fit=crop',
    rating: 3,
    comment:
      'Refrigerante normal, bem gelado. Nada de especial, mas atendeu o que precisava.',
    date: '2024-01-05',
    verified: false,
  },
  {
    id: '12',
    customerName: 'Diego Martins',
    customerAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    productId: 'feijoada',
    productName: 'Feijoada Completa',
    productImage:
      'https://images.unsplash.com/photo-1604908176997-431656c2f1a4?q=80&w=120&auto=format&fit=crop',
    rating: 5,
    comment:
      'Segunda vez pedindo a feijoada e continua excelente! Ingredientes de qualidade e preparo impecável. Recomendo!',
    date: '2024-01-04',
    verified: true,
  },
]
