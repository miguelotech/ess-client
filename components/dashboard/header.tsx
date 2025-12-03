"use client"

import Link from "next/link"
import { Bell, Calendar, Menu, LayoutDashboard, BarChart3 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const periodFilters = [
  { label: "Últimos 7 Días", value: "7d" },
  { label: "Últimos 30 Días", value: "30d" },
  { label: "Este Trimestre", value: "quarter" },
  { label: "Este Año", value: "year" },
]

export function Header() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // Default to "year" if no param is present
  const activePeriod = searchParams.get("period") || "year"

  const handlePeriodChange = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("period", term)
    } else {
      params.delete("period")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="flex h-16 items-center gap-2.5 border-b px-5">
              <div className="flex h-8 w-8 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 141 137"
                  fill="none"
                  className="h-full w-full"
                >
                  <path d="M36.5 102.067C28.2936 94.1745 26.5 74.5668 26.5 74.5668C26.5 74.5668 46.0662 76.6828 53.5 85.0668C60.5479 93.0156 61 111.567 61 111.567C61 111.567 43.6887 108.98 36.5 102.067Z" fill="#9DCD2C" />
                  <path d="M74.0002 86.5669C82.0181 76.545 100.501 75.0668 100.501 75.0668C100.501 75.0668 99.1519 90.4408 92.0004 99.0669C85.2202 107.245 65.266 111.809 65.266 111.809C65.266 111.809 65.9999 96.5668 74.0002 86.5669Z" fill="#9DCD2C" />
                  <path d="M15 32.5668L25.4996 42.5668C18 50.5668 15 58.0668 14.4996 71.0668L0 71.0668C0 56.5668 3.5 42.5668 15 32.5668Z" fill="#00ADF6" />
                  <path d="M106 25.5668L95.9999 35.0669C86.9999 29.0669 81.9999 25.0669 69.4999 24.0669L69.4999 9.56686C83 10.5668 95.9999 15.0668 106 25.5668Z" fill="#00ADF6" />
                  <path d="M128.5 71.067L113.5 71.5668L113.469 71.2737C112.345 60.6767 111.571 53.3822 104.413 43.2254L115.561 33.9539C122.5 42.5668 128.5 56.5668 128.5 71.067Z" fill="#00ADF6" />
                  <path d="M58.5 10.0669L58.5 24.0793C47.5 25.5668 43 27.0668 33.5 34.5668L23.0001 24.0793C34 15.0669 44 10.5669 58.5 10.0669Z" fill="#00ADF6" />
                  <circle cx="64" cy="56.0668" r="20" fill="#FF313A" />
                  <path d="M15 84.5668H0C0 84.5668 10 136.567 64 136.567C117.537 136.567 126.5 84.5668 126.5 84.5668H112C112 84.5668 104.5 120.567 64 122.567C25.5 124.468 15 84.5668 15 84.5668Z" fill="#9DCD2C" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Agropecuaria Chimú </span>
                <span className="text-xs text-muted-foreground">S.R.L.</span>
              </div>
            </div>
            <nav className="flex flex-col gap-1 px-3 pt-4">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/analytics"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/analytics"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Analíticas
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Period filters */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 overflow-x-auto no-scrollbar max-w-[calc(100vw-80px)] md:max-w-none">
          {periodFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handlePeriodChange(filter.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                activePeriod === filter.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
