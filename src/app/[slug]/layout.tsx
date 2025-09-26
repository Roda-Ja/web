import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import '../globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  // Importação dinâmica para evitar problemas de SSR
  const { getEstablishmentBySlug } = await import('@/lib/data/establishments')
  const { slug } = await params
  const establishment = getEstablishmentBySlug(slug)

  if (!establishment) {
    return {
      title: 'Estabelecimento não encontrado',
      description: 'O estabelecimento solicitado não foi encontrado.',
    }
  }

  return {
    title: `${establishment.name} - Cardápio`,
    description: establishment.description,
  }
}

export default function EstablishmentLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
