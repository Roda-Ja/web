import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <span className="text-2xl">🍽️</span>
          </div>
          <CardTitle className="text-2xl">
            Estabelecimento não encontrado
          </CardTitle>
          <CardDescription>
            O estabelecimento que você está procurando não existe ou foi
            removido.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Que tal explorar nossos outros estabelecimentos disponíveis?
          </p>
          <Link href="/">
            <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
              Ver Estabelecimentos
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

