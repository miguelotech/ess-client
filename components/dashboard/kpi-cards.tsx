"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { DollarSign, CreditCard, Activity, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchSummary } from "@/lib/api"

export function KPICards() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading, error } = useSWR(["summary", period], () => fetchSummary(period))

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-6">
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="mb-2 h-9 w-40" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4 border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-6 text-red-500">
            Error al cargar métricas. Por favor verifique la conexión con el servidor.
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(value)

  const formatNumber = (value: number) => new Intl.NumberFormat("es-MX").format(value)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-card-foreground">
            {formatCurrency(data?.totalRevenue ?? 0)}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">+12.5%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Transacciones Totales</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-card-foreground">
            {formatNumber(data?.transactionCount ?? 0)}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">+8.2%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
