import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { SalesTrendChart } from "@/components/dashboard/sales-trend-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { RegionChart } from "@/components/dashboard/region-chart"
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table"

import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-56">
        <Suspense fallback={<div className="p-6">Cargando...</div>}>
          <Header />
          <main className="p-4 lg:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Bienvenido al dashboard</p>
            </div>
            <div className="space-y-6">
              <KPICards />

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <SalesTrendChart />
                </div>
                <CategoryChart />
              </div>

              <RegionChart />

              <RecentSalesTable />
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  )
}
