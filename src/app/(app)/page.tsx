'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { File, FileText } from 'lucide-react'
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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-full flex-col overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Painel Administrativo
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="outline">
              <FileText className="h-4 w-4" /> Excel
            </Button>
            <Button variant="outline">
              <File className="h-4 w-4" /> PDF
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-2 pt-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-700">
              Bem vindo de volta, Raphael!!
            </h1>
            <p className="text-sm text-gray-500">Mar 01, 2025 - Mar 30, 2025</p>
          </div>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
            <div className="grid min-w-0 flex-1 gap-4">
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Ganhos de Roda Ja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[270px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={earningsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 4000]} tickCount={11} />
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
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Overview de Entregas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold">635</p>
                      <p className="text-sm text-gray-500">DIA</p>
                    </div>
                    <div className="border-r border-l border-gray-300 px-4 text-center">
                      <p className="text-4xl font-bold">4.560</p>
                      <p className="text-sm text-gray-500">SEMANA</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold">20.578</p>
                      <p className="text-sm text-gray-500">MÊS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Overview de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userOverviewData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
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
            <div className="flex w-full flex-col gap-4 lg:w-[400px]">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Motorista Destaque do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-between gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Antônio Reis"
                      className="h-28 w-28 rounded-full object-cover"
                    />
                    <div className="text-center">
                      <p className="text-2xl font-bold">Antônio Reis</p>
                      <div className="flex gap-2">
                        <p className="text-md flex flex-col p-4">
                          <span className="text-xl font-bold">220</span>{' '}
                          Corridas
                        </p>
                        <p className="text-md flex flex-col border-x border-zinc-200 p-4">
                          <span className="text-xl font-bold">R$ 4.840,00</span>
                          Renda
                        </p>
                        <p className="text-md flex flex-col p-4">
                          <span className="text-xl font-bold">4.8</span>{' '}
                          Avaliação
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Lista de Estabelecimentos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {Array(6)
                      .fill({})
                      .map((_, index) => (
                        <li key={index} className="mb-4 flex items-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
                            HP
                          </div>
                          <p className="ml-3 text-xl">Hambúrguer Pele</p>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
