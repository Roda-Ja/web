import { Suspense } from 'react'
import { LoadingBar } from '@/components/loading-bar'

export default function Loading() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoadingBar />
    </Suspense>
  )
}
