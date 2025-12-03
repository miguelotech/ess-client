"use client"

import type React from "react"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { fetchSummary, fetchCategoryData, fetchRegionData, fetchChartData } from "@/lib/api"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  ComposedChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Percent, Info } from "lucide-react"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = "number",
  text,
}: {
  title: string
  value: number
  change: number
  icon: React.ElementType
  format?: "number" | "currency" | "percent"
  text?: string
}) {
  const formattedValue =
    format === "currency"
      ? new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value)
      : format === "percent"
        ? `${value.toFixed(1)}%`
        : new Intl.NumberFormat("es-PE").format(value)

  const isPositive = change >= 0

  return (
    <Card className="border-card-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate">{title}</p>
              {text && (
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{text}</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground truncate" title={formattedValue}>
              {formattedValue}
            </p>
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <span className={isPositive ? "text-sm text-emerald-500" : "text-sm text-red-500"}>
                {isPositive ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground whitespace-nowrap">vs mes anterior</span>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 p-3 shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-card-border bg-card">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ComparisonChart() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data: chartData } = useSWR(["chart-data", period], () => fetchChartData(period))

  return (
    <Card className="border-card-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Tendencia de Ventas</CardTitle>
        <p className="text-sm text-muted-foreground">Ventas en el periodo seleccionado</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `S/.${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number) =>
                  new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(value)
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name="Ventas"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyPerformanceChart() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data: chartData } = useSWR(["chart-data", period], () => fetchChartData(period))

  return (
    <Card className="border-card-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Rendimiento</CardTitle>
        <p className="text-sm text-muted-foreground">Ventas por periodo</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="value" name="Ventas (S/.)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryPerformance() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading, error } = useSWR(["category-analytics", period], () => fetchCategoryData(period))

  if (isLoading) {
    return (
      <Card className="border-card-border bg-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-card-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Rendimiento por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-red-500">
          Error al cargar datos
        </CardContent>
      </Card>
    )
  }

  const colors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

  // Filter top 5 categories
  const topCategories = data?.sort((a, b) => b.value - a.value).slice(0, 5) || []

  return (
    <Card className="border-card-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Rendimiento por Categoría</CardTitle>
        <p className="text-sm text-muted-foreground">Top 5 categorías por ventas</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => `S/.${v / 1000}k`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number) =>
                  new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(value)
                }
              />
              <Bar dataKey="value" name="Ventas" radius={[0, 4, 4, 0]}>
                {topCategories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function RegionPerformance() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading, error } = useSWR(["region-analytics", period], () => fetchRegionData(period))

  if (isLoading) {
    return (
      <Card className="border-card-border bg-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-card-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Rendimiento por Región</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-red-500">
          Error al cargar datos
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...(data?.map((d) => d.sales) || [1]))

  return (
    <Card className="border-card-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Rendimiento por Región</CardTitle>
        <p className="text-sm text-muted-foreground">Top 5 regiones por ventas</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((item, index) => {
            const percentage = (item.sales / maxValue) * 100
            return (
              <div key={item.region} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.region}</span>
                  <span className="text-muted-foreground">
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(item.sales)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data: summary, isLoading: loadingSummary } = useSWR(["summary-analytics", period], () => fetchSummary(period))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Analíticas</h1>
            <p className="text-muted-foreground">Análisis detallado del rendimiento de ventas</p>
          </div>

          {/* Métricas KPI */}
          {loadingSummary ? (
            <MetricsSkeleton />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Ingresos Totales"
                value={summary?.totalRevenue || 0}
                change={12.5}
                icon={DollarSign}
                format="currency"
              />
              <MetricCard
                title="Transacciones"
                value={summary?.transactionCount || 0}
                change={8.2}
                icon={ShoppingCart}
              />
              <MetricCard
                title="Tasa de Conversión"
                text="personas que compraron después de visitar el negocio"
                value={
                  summary?.visitCount
                    ? (summary.transactionCount / summary.visitCount) * 100
                    : 0
                }
                change={0}
                icon={Percent}
                format="percent"
              />
              <MetricCard
                title="Ventas Promedio"
                value={summary ? summary.totalRevenue / (summary.transactionCount || 1) : 0}
                change={0}
                icon={Users}
                format="currency"
              />
            </div>
          )}

          {/* Comparativa Anual */}
          <div className="mt-6">
            <ComparisonChart />
          </div>

          {/* Gráficos secundarios */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WeeklyPerformanceChart />
            <CategoryPerformance />
          </div>

          {/* Rendimiento por Región */}
          <div className="mt-6">
            <RegionPerformance />
          </div>
        </main>
      </div>
    </div>
  )
}
