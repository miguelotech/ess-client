"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchRegionData } from "@/lib/api"

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444"]

export function RegionChart() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading } = useSWR(["region-data", period], () => fetchRegionData(period))

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-44" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxSales = Math.max(...(data?.map((d) => d.sales) ?? [1]))

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-card-foreground">
          Top 5 Regiones con Mejor Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((item, index) => {
            const percentage = (item.sales / maxSales) * 100
            return (
              <div key={item.region} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.region}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${percentage}%`, opacity: 1 - index * 0.12 }}
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
