"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analíticas", href: "/analytics", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 border-r border-sidebar-border bg-sidebar lg:flex flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
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
          <span className="text-sm font-semibold text-sidebar-foreground">Agropecuaria Chimú </span>
          <span className="text-xs text-sidebar-muted">S.R.L.</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
