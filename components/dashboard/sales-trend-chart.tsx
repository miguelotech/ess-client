"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchChartData } from "@/lib/api"

export function SalesTrendChart() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading } = useSWR(["chart-data", period], () => fetchChartData(period))

  // Calculate total revenue
  const totalRevenue = data?.reduce((sum, item) => sum + item.value, 0) ?? 0
  const formattedTotal =
    totalRevenue >= 1000000 ? `S/.${(totalRevenue / 1000000).toFixed(1)}M` : `S/.${(totalRevenue / 1000).toFixed(0)}K`

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-4 h-10 w-24" />
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-card-foreground">Tendencia de Ventas del Año</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-1">
          <span className="text-3xl font-bold text-card-foreground">{formattedTotal}</span>
        </div>
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Ene - Dic</span>
          <span className="font-medium text-emerald-500">+15.2%</span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/.${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`S/. ${value.toLocaleString("es-PE")}`, "Ingresos"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
