export interface Establishment {
  id: string
  slug: string
  name: string
  description: string
  logo: string
  coverImage: string
  address: string
  phone: string
  email: string
  workingHours: string
  deliveryFee: number
  minOrderValue: number
  categories: string[]
  products: Product[]
  isActive: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  tag?: string
  rating: number
  isAvailable: boolean
  establishmentId: string
}

export const establishments: Establishment[] = [
  {
    id: '1',
    slug: 'roda-ja',
    name: 'Roda Ja',
    description: 'Comida brasileira autêntica com sabor caseiro',
    logo: '/logo-roda-ja.png',
    coverImage: '/cover-roda-ja.jpg',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    email: 'contato@rodaja.com',
    workingHours: 'Seg-Dom: 11h às 23h',
    deliveryFee: 5.9,
    minOrderValue: 25.0,
    categories: ['Brasileira', 'Lanches', 'Bebidas', 'Sobremesas'],
    isActive: true,
    products: [
      {
        id: '1',
        name: 'Feijoada Completa',
        description:
          'Tradicional feijoada brasileira com feijão preto, carnes suínas, linguiça, acompanhada de arroz, couve refogada, farofa e laranja.',
        price: 32.9,
        originalPrice: 39.9,
        image:
          'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400',
        category: 'Brasileira',
        tag: 'Oferta Especial',
        rating: 4.8,
        isAvailable: true,
        establishmentId: '1',
      },
      {
        id: '2',
        name: 'Prato Feito',
        description:
          'Arroz, feijão, carne bovina grelhada, batata frita crocante e salada fresca. O clássico prato brasileiro.',
        price: 18.9,
        originalPrice: 23.9,
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Brasileira',
        tag: '20% Off',
        rating: 4.5,
        isAvailable: true,
        establishmentId: '1',
      },
      {
        id: '3',
        name: 'Moqueca de Peixe',
        description:
          'Deliciosa moqueca de peixe branco, cozida no leite de coco, dendê, tomate, cebola e pimentão. Servida com arroz e pirão.',
        price: 28.5,
        originalPrice: 35.6,
        image:
          'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
        category: 'Brasileira',
        tag: 'Desconto Membro',
        rating: 4.7,
        isAvailable: true,
        establishmentId: '1',
      },
      {
        id: '4',
        name: 'Picanha na Chapa',
        description:
          'Suculenta picanha grelhada na chapa, temperada com sal grosso e ervas. Acompanha arroz, feijão tropeiro e farofa.',
        price: 42.9,
        image:
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Brasileira',
        rating: 4.9,
        isAvailable: false,
        establishmentId: '1',
      },
      {
        id: '5',
        name: 'Burger Clássico',
        description:
          'Hambúrguer artesanal com carne bovina, queijo, alface, tomate e molho especial. Acompanha batata frita.',
        price: 24.9,
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Lanches',
        rating: 4.6,
        isAvailable: true,
        establishmentId: '1',
      },
      {
        id: '6',
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante gelado para acompanhar seu pedido.',
        price: 4.5,
        image:
          'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        category: 'Bebidas',
        rating: 4.2,
        isAvailable: true,
        establishmentId: '1',
      },
    ],
  },
  {
    id: '2',
    slug: 'pastelaria-fulano-de-tal',
    name: 'Pastelaria Fulano de Tal',
    description: 'Os melhores pastéis da região, feitos na hora',
    logo: '/logo-pastelaria.png',
    coverImage: '/cover-pastelaria.jpg',
    address: 'Av. Comercial, 456 - Bairro Novo',
    phone: '(11) 88888-8888',
    email: 'contato@pastelariafulano.com',
    workingHours: 'Ter-Dom: 16h às 22h',
    deliveryFee: 4.9,
    minOrderValue: 20.0,
    categories: ['Pastéis', 'Bebidas', 'Sobremesas'],
    isActive: true,
    products: [
      {
        id: '7',
        name: 'Pastel de Carne',
        description:
          'Pastel crocante recheado com carne moída temperada, cebola e azeitona.',
        price: 8.5,
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Pastéis',
        rating: 4.6,
        isAvailable: true,
        establishmentId: '2',
      },
      {
        id: '8',
        name: 'Pastel de Frango',
        description:
          'Pastel delicioso com frango desfiado, catupiry e milho.',
        price: 9.5,
        image:
          'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400',
        category: 'Pastéis',
        rating: 4.8,
        isAvailable: true,
        establishmentId: '2',
      },
      {
        id: '9',
        name: 'Pastel de Queijo',
        description:
          'Pastel simples e saboroso com queijo mussarela derretido.',
        price: 6.5,
        image:
          'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
        category: 'Pastéis',
        rating: 4.4,
        isAvailable: true,
        establishmentId: '2',
      },
      {
        id: '10',
        name: 'Pastel de Pizza',
        description:
          'Pastel com molho de tomate, mussarela, presunto e orégano.',
        price: 10.5,
        image:
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Pastéis',
        rating: 4.7,
        isAvailable: true,
        establishmentId: '2',
      },
      {
        id: '11',
        name: 'Refrigerante Lata',
        description: 'Refrigerante gelado 350ml - Coca, Pepsi, Guaraná.',
        price: 4.0,
        image:
          'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        category: 'Bebidas',
        rating: 4.0,
        isAvailable: true,
        establishmentId: '2',
      },
    ],
  },
  {
    id: '3',
    slug: 'restaurante-da-ana',
    name: 'Restaurante da Ana',
    description: 'Comida caseira feita com carinho pela Ana',
    logo: '/logo-restaurante-ana.png',
    coverImage: '/cover-restaurante-ana.jpg',
    address: 'Rua da Paz, 789 - Vila Esperança',
    phone: '(11) 77777-7777',
    email: 'contato@restaurantedaana.com',
    workingHours: 'Seg-Sab: 11h às 21h',
    deliveryFee: 6.9,
    minOrderValue: 30.0,
    categories: ['Caseira', 'Brasileira', 'Bebidas', 'Sobremesas'],
    isActive: true,
    products: [
      {
        id: '12',
        name: 'Frango à Parmegiana',
        description:
          'Filé de frango empanado, coberto com molho de tomate e queijo mussarela. Acompanha arroz e batata frita.',
        price: 26.9,
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Caseira',
        rating: 4.9,
        isAvailable: true,
        establishmentId: '3',
      },
      {
        id: '13',
        name: 'Lasanha Bolonhesa',
        description:
          'Lasanha tradicional com molho bolonhesa, queijo e molho branco.',
        price: 24.9,
        image:
          'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
        category: 'Caseira',
        rating: 4.8,
        isAvailable: true,
        establishmentId: '3',
      },
      {
        id: '14',
        name: 'Strogonoff de Frango',
        description:
          'Cremoso strogonoff de frango com champignon, servido com arroz e batata palha.',
        price: 22.9,
        image:
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
        category: 'Caseira',
        rating: 4.7,
        isAvailable: true,
        establishmentId: '3',
      },
      {
        id: '15',
        name: 'Bife à Rolê',
        description:
          'Bife enrolado com bacon e queijo, grelhado e servido com arroz e feijão.',
        price: 28.9,
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Brasileira',
        rating: 4.6,
        isAvailable: true,
        establishmentId: '3',
      },
      {
        id: '16',
        name: 'Suco Natural',
        description: 'Suco natural de frutas da estação - Laranja, Maracujá, Limão.',
        price: 7.9,
        image:
          'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        category: 'Bebidas',
        rating: 4.5,
        isAvailable: true,
        establishmentId: '3',
      },
    ],
  },
  {
    id: '4',
    slug: 'pizza-mama',
    name: 'Pizza Mama',
    description: 'As melhores pizzas artesanais da cidade',
    logo: '/logo-pizza-mama.png',
    coverImage: '/cover-pizza-mama.jpg',
    address: 'Rua da Pizza, 456 - Centro',
    phone: '(11) 66666-6666',
    email: 'contato@pizzamama.com',
    workingHours: 'Ter-Dom: 18h às 01h',
    deliveryFee: 8.9,
    minOrderValue: 35.0,
    categories: ['Pizzas', 'Bebidas', 'Sobremesas'],
    isActive: true,
    products: [
      {
        id: '17',
        name: 'Pizza Margherita',
        description:
          'Pizza clássica com molho de tomate, mussarela fresca e manjericão.',
        price: 28.9,
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'Pizzas',
        rating: 4.7,
        isAvailable: true,
        establishmentId: '4',
      },
      {
        id: '18',
        name: 'Pizza Quatro Queijos',
        description: 'Pizza com mussarela, gorgonzola, parmesão e catupiry.',
        price: 32.9,
        image:
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizzas',
        rating: 4.8,
        isAvailable: true,
        establishmentId: '4',
      },
      {
        id: '19',
        name: 'Pizza Portuguesa',
        description:
          'Pizza com presunto, ovos, cebola, azeitona, ervilha e mussarela.',
        price: 34.9,
        image:
          'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400',
        category: 'Pizzas',
        rating: 4.6,
        isAvailable: true,
        establishmentId: '4',
      },
      {
        id: '20',
        name: 'Pizza Calabresa',
        description:
          'Pizza com linguiça calabresa, cebola e mussarela.',
        price: 30.9,
        image:
          'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
        category: 'Pizzas',
        rating: 4.5,
        isAvailable: true,
        establishmentId: '4',
      },
      {
        id: '21',
        name: 'Refrigerante 2L',
        description: 'Refrigerante 2 litros - Coca, Pepsi, Guaraná.',
        price: 8.9,
        image:
          'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
        category: 'Bebidas',
        rating: 4.0,
        isAvailable: true,
        establishmentId: '4',
      },
    ],
  },
]

export function getEstablishmentBySlug(
  slug: string,
): Establishment | undefined {
  return establishments.find((est) => est.slug === slug && est.isActive)
}

export function getAllEstablishments(): Establishment[] {
  return establishments.filter((est) => est.isActive)
}

