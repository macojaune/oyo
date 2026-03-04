import { Suspense } from "react"

import type { PeriodKey } from "~/lib/umami-server"
import {
  getWebsitePageviews,
  getWebsiteStats,
  PERIODS,
} from "~/lib/umami-server"
import { NavigationBar } from "../_components/map/navigation-bar"
import { OpenDataContent } from "./_components/open-data-content"

interface OpenDataPageProps {
  searchParams: Promise<{ period?: PeriodKey }>
}

export default async function OpenDataPage({
  searchParams,
}: OpenDataPageProps) {
  const { period = "saison2026" } = await searchParams
  const selectedPeriodKey: PeriodKey =
    period === "annee2025" ? "annee2025" : "saison2026"
  const selectedPeriod = PERIODS[selectedPeriodKey]

  const [umamiCurrent, umami2025, umami2026, pageviewsCurrent] =
    await Promise.all([
      getWebsiteStats(selectedPeriod.startAt, selectedPeriod.endAt),
      getWebsiteStats(PERIODS.annee2025.startAt, PERIODS.annee2025.endAt),
      getWebsiteStats(PERIODS.saison2026.startAt, PERIODS.saison2026.endAt),
      getWebsitePageviews(selectedPeriod.startAt, selectedPeriod.endAt),
    ])

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
          currentPeriod={selectedPeriodKey}
          periodLabel={selectedPeriod.label}
          range={{
            startAt: selectedPeriod.startAt,
            endAt: selectedPeriod.endAt,
          }}
          umamiCurrent={umamiCurrent}
          umami2025={umami2025}
          umami2026={umami2026}
          pageviewsCurrent={pageviewsCurrent}
        />
      </Suspense>
    </div>
  )
}
