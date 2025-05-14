'use client'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { File, FileText } from 'lucide-react'
import { useRef } from 'react'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'

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
  const chartContainerRef = useRef(null)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
          <div className="ml-auto flex gap-2 px-4">
            <Button variant="outline">
              <FileText className="h-4 w-4" /> Excel
            </Button>
            <Button variant="outline">
              <File className="h-4 w-4" /> PDF
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex gap-4">
            <div
              className="grid flex-1 gap-4"
              style={{
                gridTemplateAreas: `
                  "welcome"
                  "earnings"
                  "overview"
                  "users"
                `,
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'auto auto auto auto',
              }}
            >
              <div style={{ gridArea: 'welcome' }}>
                <h1 className="text-2xl font-bold text-slate-700">
                  Bem vindo de volta, Raphael!!
                </h1>
                <p className="text-sm text-gray-500">
                  Mar 01, 2025 - Mar 30, 2025
                </p>
              </div>
              <div
                className="rounded-lg bg-white p-2 shadow"
                style={{ gridArea: 'earnings' }}
              >
                <h2 className="mb-1 text-lg font-bold text-slate-800">
                  Ganhos de Roda Ja
                </h2>
                <div ref={chartContainerRef} className="w-full overflow-hidden">
                  <BarChart width={1000} height={291} data={earningsData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 4000]} tickCount={11} />
                    <Tooltip formatter={(value) => `davizende: ${value}`} />
                    <Legend />
                    <Bar dataKey="Ganhos" fill="#2B7FFF" />
                  </BarChart>
                </div>
              </div>
              <div
                className="rounded-lg bg-white p-2 shadow"
                style={{ gridArea: 'overview' }}
              >
                <h2 className="mb-1 text-lg font-bold text-slate-800">
                  Overview de Entregas
                </h2>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold">635</p>
                    <p className="text-sm text-gray-500">DIA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">4.560</p>
                    <p className="text-sm text-gray-500">SEMANA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">20.578</p>
                    <p className="text-sm text-gray-500">MÊS</p>
                  </div>
                </div>
              </div>
              <div
                className="rounded-lg bg-white p-2 shadow"
                style={{ gridArea: 'users' }}
              >
                <h2 className="mb-1 text-lg font-bold text-slate-800">
                  Overview de Usuários
                </h2>
                <div ref={chartContainerRef} className="w-full overflow-hidden">
                  <BarChart width={1000} height={260} data={userOverviewData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Ativos" fill="#2B7FFF" />
                    <Bar dataKey="Total" fill="#FE9A00" />
                  </BarChart>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="mb-4 rounded-lg bg-white p-4 shadow">
                <h2 className="mb-2 text-lg font-bold text-slate-800">
                  Motorista Destaque do Mês
                </h2>
                <div className="flex flex-col items-center justify-between gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Antônio Reis"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-3xl font-bold">Antônio Reis</p>
                    <div className="flex gap-1">
                      <p className="text-md flex flex-col p-4">
                        <span className="text-2xl font-bold">220</span> Corridas
                      </p>
                      <p className="text-md flex flex-col border-x border-zinc-200 p-4">
                        <span className="text-2xl font-bold">R$ 4.840,00</span>
                        Total de Renda
                      </p>
                      <p className="text-md flex flex-col p-4">
                        <span className="text-2xl font-bold">4.8</span>
                        Avaliação
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Lista de estabelecimentos ativos
                </h2>
                <ul>
                  {Array(6)
                    .fill({})
                    .map((_, index) => (
                      <li key={index} className="mb-4 flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                          HP
                        </div>
                        <p className="ml-2 text-lg">Hambúrguer Pele</p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
