import { env } from "~/env"

export interface UmamiStats {
  pageviews: { value: number; prev: number }
  visitors: { value: number; prev: number }
  visits: { value: number; prev: number }
  bounces: { value: number; prev: number }
  totaltime: { value: number; prev: number }
}

export interface UmamiMetric {
  x: string
  y: number
}

export interface UmamiDailyPoint {
  date: string
  count: number
}

async function umamiFetch<T>(
  endpoint: string,
  params: Record<string, string | number>,
): Promise<T | null> {
  try {
    const url = new URL(
      `${env.UMAMI_API_CLIENT_ENDPOINT}/api/websites/${env.UMAMI_WEBSITE_ID}${endpoint}`,
    )

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${env.UMAMI_API_CLIENT_SECRET}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(
        `Umami fetch failed: ${response.status} ${response.statusText}`,
      )
      return null
    }

    return (await response.json()) as T
  } catch (error) {
    console.error("Umami error:", error)
    return null
  }
}

export async function getWebsiteStats(
  startAt: number,
  endAt: number,
): Promise<UmamiStats | null> {
  return umamiFetch<UmamiStats>("/stats", { startAt, endAt })
}

export async function getWebsiteMetrics(
  startAt: number,
  endAt: number,
  type: "url" | "country" | "event" | "browser" | "device" | "os",
  limit = 10,
): Promise<UmamiMetric[]> {
  const result = await umamiFetch<UmamiMetric[]>("/metrics", {
    startAt,
    endAt,
    type,
    limit,
  })
  return result ?? []
}

export async function getWebsitePageviews(
  startAt: number,
  endAt: number,
): Promise<UmamiDailyPoint[]> {
  const result = await umamiFetch<{
    pageviews?: { t?: string; x?: string; y: number }[]
  }>("/pageviews", {
    startAt,
    endAt,
    unit: "day",
    timezone: "America/Guadeloupe",
  })

  const points = result?.pageviews ?? []
  return points
    .map((point) => ({
      date: point.t ?? point.x ?? "",
      count: point.y,
    }))
    .filter((point) => point.date.length > 0)
}

export const PERIODS = {
  saison2026: {
    label: "Saison 2026",
    startAt: new Date("2026-01-01").getTime(),
    endAt: new Date("2026-02-18").getTime(),
  },
  annee2025: {
    label: "Année 2025",
    startAt: new Date("2025-01-01").getTime(),
    endAt: new Date("2025-12-31").getTime(),
  },
} as const

export type PeriodKey = keyof typeof PERIODS
