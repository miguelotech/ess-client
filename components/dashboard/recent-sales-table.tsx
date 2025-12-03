"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchRecentSales } from "@/lib/api"

export function RecentSalesTable() {
  const { data, isLoading } = useSWR("recent-sales", fetchRecentSales)

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value)

  const formatDate = (dateStr: string) => dateStr

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-card-foreground">Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID Transacción
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categoría
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Fecha
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monto
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Región
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((sale) => (
              <TableRow key={sale.id} className="border-border">
                <TableCell className="pl-6 font-mono text-sm text-muted-foreground">
                  {`#${sale.id.toString().padStart(6, "0")}`}
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {sale.category}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(sale.date)}</TableCell>
                <TableCell className="font-medium text-card-foreground">{formatCurrency(sale.amount)}</TableCell>
                <TableCell className="pr-6 text-muted-foreground">
                  {sale.region}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
