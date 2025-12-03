"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCategoryData } from "@/lib/api"

const COLORS = ["#3b82f6", "#10b981", "#a855f7"]

export function CategoryChart() {
  const searchParams = useSearchParams()
  const period = searchParams.get("period") || "year"
  const { data, isLoading } = useSWR(["category-data", period], () => fetchCategoryData(period))

  const total = data?.reduce((sum, item) => sum + item.value, 0) ?? 0
  const formattedTotal = total >= 1000 ? `S/.${(total / 1000).toFixed(0)}K` : `S/.${total}`

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto h-[220px] w-[220px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  // Take top 3 categories for cleaner display
  const topCategories = data?.slice(0, 3) ?? []

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-card-foreground">Ventas por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="40%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {topCategories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xl font-bold text-card-foreground">{formattedTotal}</p>
            <p className="text-xs text-muted-foreground">Total Ventas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
