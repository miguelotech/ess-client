const API_BASE = "http://localhost:8080/api/dashboard"

// Types
export interface SummaryData {
  totalRevenue: number
  transactionCount: number
  visitCount?: number
}

export interface ChartData {
  [month: string]: number
}

export interface CategoryData {
  [category: string]: number
}

export interface RegionData {
  [region: string]: number
}

export interface RecentSale {
  id: number
  date: string
  amount: number
  category: string
  region: string
}

// Month order for sorting
const MONTH_ORDER = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
]

// Helper for direct fetching
async function fetchData<T>(endpoint: string, params?: string): Promise<T> {
  const url = params ? `${API_BASE}${endpoint}?${params}` : `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

export async function fetchSummary(period?: string): Promise<SummaryData> {
  const params = period ? `period=${period}` : undefined
  return fetchData<SummaryData>("/summary", params)
}

export async function fetchChartData(period?: string): Promise<{ name: string; value: number }[]> {
  const params = period ? `period=${period}` : undefined
  const data = await fetchData<ChartData>("/chart-data", params)

  // If data keys are months, sort them. Otherwise (e.g., dates), keep as is or sort by date.
  const keys = Object.keys(data)
  const isMonthly = keys.some((k) => MONTH_ORDER.includes(k.toUpperCase()))

  if (isMonthly) {
    return MONTH_ORDER.filter((month) => month in data).map((month) => ({
      name: month.charAt(0) + month.slice(1).toLowerCase(),
      value: data[month],
    }))
  }

  // For daily data or other formats, return as is (assuming backend returns sorted or we sort by key)
  return Object.entries(data).map(([name, value]) => ({ name, value }))
}

export async function fetchCategoryData(period?: string): Promise<{ name: string; value: number }[]> {
  const params = period ? `period=${period}` : undefined
  const data = await fetchData<CategoryData>("/sales-by-category", params)
  return Object.entries(data).map(([name, value]) => ({ name, value }))
}

export async function fetchRegionData(period?: string): Promise<{ region: string; sales: number }[]> {
  const params = period ? `period=${period}` : undefined
  const data = await fetchData<RegionData>("/top-regions", params)
  return Object.entries(data)
    .map(([region, sales]) => ({ region, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
}

export async function fetchRecentSales(period?: string): Promise<RecentSale[]> {
  const params = period ? `period=${period}` : undefined
  const data = await fetchData<RecentSale[]>("/recent-sales", params)
  return data.slice(0, 5)
}
