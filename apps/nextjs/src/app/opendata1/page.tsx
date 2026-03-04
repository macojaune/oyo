import { Suspense } from "react"

import type { PeriodKey } from "~/lib/umami-server"
import { getWebsiteStats, PERIODS } from "~/lib/umami-server"
import { NavigationBar } from "../_components/map/navigation-bar"
import { OpenDataContent } from "./_components/open-data-content"

interface OpenDataPageProps {
  searchParams: Promise<{ period?: PeriodKey }>
}

export default async function OpenDataPage({
  searchParams,
}: OpenDataPageProps) {
  const { period = "saison2026" } = await searchParams
  const selectedPeriod = PERIODS[period] ?? PERIODS.saison2026

  const umamiStats = await getWebsiteStats(
    selectedPeriod.startAt,
    selectedPeriod.endAt,
  )

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <OpenDataContent
          umamiStats={umamiStats}
          periodLabel={selectedPeriod.label}
        />
      </Suspense>
    </div>
  )
}
