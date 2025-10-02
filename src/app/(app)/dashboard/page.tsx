'use client'

import { NavigationDebug } from '@/components/navigation-debug'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getAllEstablishments } from '@/lib/data/establishments'
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const earningsData = [
  { name: '1', Ganhos: 1200 },
  { name: '2', Ganhos: 1900 },
  { name: '3', Ganhos: 3000 },
  { name: '4', Ganhos: 500 },
  { name: '5', Ganhos: 2000 },
  { name: '6', Ganhos: 3000 },
  { name: '7', Ganhos: 4000 },
  { name: '8', Ganhos: 3200 },
  { name: '9', Ganhos: 2800 },
  { name: '10', Ganhos: 3500 },
  { name: '11', Ganhos: 2200 },
  { name: '12', Ganhos: 1800 },
  { name: '13', Ganhos: 2500 },
  { name: '14', Ganhos: 2700 },
  { name: '15', Ganhos: 3100 },
  { name: '16', Ganhos: 2900 },
  { name: '17', Ganhos: 3300 },
  { name: '18', Ganhos: 3600 },
]

const userOverviewData = [
  { name: '1', Ativos: 65, Total: 100 },
  { name: '2', Ativos: 59, Total: 120 },
  { name: '3', Ativos: 80, Total: 140 },
  { name: '4', Ativos: 81, Total: 160 },
  { name: '5', Ativos: 56, Total: 180 },
  { name: '6', Ativos: 55, Total: 200 },
  { name: '7', Ativos: 40, Total: 220 },
  { name: '8', Ativos: 65, Total: 240 },
  { name: '9', Ativos: 59, Total: 260 },
  { name: '10', Ativos: 80, Total: 280 },
  { name: '11', Ativos: 81, Total: 300 },
  { name: '12', Ativos: 56, Total: 320 },
  { name: '13', Ativos: 55, Total: 340 },
  { name: '14', Ativos: 40, Total: 360 },
]

export default function Page() {
  const setUser = useAuthStore((state) => state.setUser)
  const establishments = getAllEstablishments()

  const handleTestEstablishmentAdmin = (
    establishmentId: string,
    establishmentName: string,
  ) => {
    const establishment = establishments.find((e) => e.id === establishmentId)
    setUser({
      id: establishmentId,
      name: `Admin ${establishmentName}`,
      email: `admin@${establishmentName.toLowerCase().replace(/\s+/g, '')}.com`,
      role: 'establishment_admin',
      establishmentId: establishmentId,
    })
    // Redirecionar para o cardápio do estabelecimento
    window.location.href = `/establishment/${establishment?.slug}/cardapio`
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-700 sm:text-2xl">
            Bem vindo de volta, Raphael!!
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Mar 01, 2025 - Mar 30, 2025
          </p>
        </div>

        {/* Botões de Teste para Admin de Estabelecimento */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleTestEstablishmentAdmin('2', 'Pastelaria Fulano de Tal')
            }
            className="text-xs"
          >
            <span className="hidden sm:inline">Testar: Admin Pastelaria</span>
            <span className="sm:hidden">Admin Pastelaria</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleTestEstablishmentAdmin('3', 'Restaurante da Ana')
            }
            className="text-xs"
          >
            <span className="hidden sm:inline">Testar: Admin Ana</span>
            <span className="sm:hidden">Admin Ana</span>
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 xl:flex-row">
        <div className="grid min-w-0 flex-1 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base font-bold text-slate-800 sm:text-lg">
                Ganhos de Roda Ja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full sm:h-56 md:h-64 lg:h-72 xl:h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={earningsData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      interval="preserveStartEnd"
                      minTickGap={4}
                      fontSize={12}
                    />
                    <YAxis
                      domain={[0, 4000]}
                      tickCount={6}
                      fontSize={12}
                    />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Legend />
                    <Bar
                      dataKey="Ganhos"
                      fill="#2B7FFF"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base font-bold text-slate-800 sm:text-lg">
                Overview de Entregas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-3 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold sm:text-4xl">635</p>
                  <p className="text-xs text-gray-500 sm:text-sm">DIA</p>
                </div>
                <div className="border-r border-l border-gray-300 px-2 text-center sm:px-4">
                  <p className="text-2xl font-bold sm:text-4xl">4.560</p>
                  <p className="text-xs text-gray-500 sm:text-sm">SEMANA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold sm:text-4xl">20.578</p>
                  <p className="text-xs text-gray-500 sm:text-sm">MÊS</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base font-bold text-slate-800 sm:text-lg">
                Overview de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full sm:h-56 md:h-64 lg:h-72 xl:h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={userOverviewData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      interval="preserveStartEnd"
                      minTickGap={4}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Ativos"
                      fill="#2B7FFF"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="Total"
                      fill="#FE9A00"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full flex-col gap-4 xl:w-[400px]">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 sm:text-xl">
                Motorista Destaque do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-between gap-4">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Antônio Reis"
                  className="h-20 w-20 rounded-full object-cover sm:h-28 sm:w-28"
                />
                <div className="text-center">
                  <p className="text-xl font-bold sm:text-2xl">Antônio Reis</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <p className="sm:text-md flex flex-col p-2 text-sm sm:p-4">
                      <span className="text-lg font-bold sm:text-xl">220</span>
                      <span className="text-xs sm:text-sm">Corridas</span>
                    </p>
                    <p className="sm:text-md flex flex-col border-t border-zinc-200 p-2 text-sm sm:border-x sm:border-t-0 sm:p-4">
                      <span className="text-lg font-bold sm:text-xl">
                        R$ 4.840,00
                      </span>
                      <span className="text-xs sm:text-sm">Renda</span>
                    </p>
                    <p className="sm:text-md flex flex-col p-2 text-sm sm:p-4">
                      <span className="text-lg font-bold sm:text-xl">4.8</span>
                      <span className="text-xs sm:text-sm">Avaliação</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 sm:text-xl">
                Lista de Estabelecimentos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {Array(6)
                  .fill({})
                  .map((_, index) => (
                    <li
                      key={index}
                      className="mb-3 flex items-center sm:mb-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white sm:h-14 sm:w-14 sm:text-lg">
                        HP
                      </div>
                      <p className="ml-2 text-sm sm:ml-3 sm:text-xl">
                        Hambúrguer Pele
                      </p>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <NavigationDebug />
        </div>
      </div>
    </>
  )
}
