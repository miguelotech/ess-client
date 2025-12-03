"use client"

import { Bell, Calendar } from "lucide-react"
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
        {/* Period filters */}
        <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 md:flex">
          {periodFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handlePeriodChange(filter.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
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
