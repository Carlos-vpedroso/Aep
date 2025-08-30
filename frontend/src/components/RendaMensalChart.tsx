"use client"

import * as React from "react"
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"


// Dados mockados de renda mensal (últimos 6 meses)
const rendaMensal = [
  { mes: "Mar", renda: 12000 },
  { mes: "Abr", renda: 15000 },
  { mes: "Mai", renda: 18000 },
  { mes: "Jun", renda: 20000 },
  { mes: "Jul", renda: 17000 },
  { mes: "Ago", renda: 22000 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function RendaMensalChart() {
  const totalRenda = React.useMemo(
    () => rendaMensal.reduce((acc, curr) => acc + curr.renda, 0),
    []
  )

  return (
    <Card className="lg:col-span-2 border-none shadow-md">
      <CardContent>
        <div className="mb-4 text-gray-700">
          <span className="font-bold text-lg">Total: </span> R$ {totalRenda.toLocaleString()}
        </div>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart
            width={600}
            height={250}
            data={rendaMensal}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
            <Bar dataKey="renda" fill="#0057D9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
