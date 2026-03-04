"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { api as convexApi } from "@oyo/convex"
import { Card, CardContent, CardHeader, CardTitle } from "@oyo/ui/card"

import type { HotspotMapRef } from "./hotspot-map"
import type { PeriodKey, UmamiDailyPoint, UmamiStats } from "~/lib/umami-server"
import { PERIODS } from "~/lib/umami-server"
import { HotspotMap } from "./hotspot-map"

interface PeriodRange {
  startAt: number
  endAt: number
}

interface OpenDataContentProps {
  currentPeriod: PeriodKey
  periodLabel: string
  range: PeriodRange
  umamiCurrent: UmamiStats | null
  umami2025: UmamiStats | null
  umami2026: UmamiStats | null
  pageviewsCurrent: UmamiDailyPoint[]
}

interface Chapter {
  id: string
  label: string
}

const chapters: Chapter[] = [
  { id: "chap-hero", label: "Intro" },
  { id: "chap-impact", label: "Impact" },
  { id: "chap-vs", label: "Vs 2025" },
  { id: "chap-fun", label: "Fun" },
]

function formatCompact(value: number | undefined) {
  if (value === undefined) return "..."
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatDateFR(value: string | undefined) {
  if (!value) return "n/a"
  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function growth(current = 0, previous = 0) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}

function KpiCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <Card className="border-primary/20 bg-background/90 shadow-sm backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black text-foreground">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export function OpenDataContent({
  currentPeriod,
  periodLabel,
  range,
  umamiCurrent,
  umami2025,
  umami2026,
  pageviewsCurrent,
}: OpenDataContentProps) {
  const stats = useQuery(convexApi.stats.getStats, range)
  const topGroups = useQuery(convexApi.stats.getTopGroups, {
    ...range,
    limit: 8,
  })
  const hotspots = useQuery(convexApi.stats.getHotspots, {
    ...range,
    limit: 30,
  })
  const hourly = useQuery(convexApi.stats.getActivityByHour, range)
  const positionsByDay = useQuery(convexApi.stats.getActivityByDay, range)
  const groupsByDay = useQuery(convexApi.stats.getGroupCreationsByDay, range)

  const stats2025 = useQuery(convexApi.stats.getStats, {
    startAt: PERIODS.annee2025.startAt,
    endAt: PERIODS.annee2025.endAt,
  })
  const stats2026 = useQuery(convexApi.stats.getStats, {
    startAt: PERIODS.saison2026.startAt,
    endAt: PERIODS.saison2026.endAt,
  })

  const mapRef = useRef<HotspotMapRef>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null)
  const [activeChapter, setActiveChapter] = useState(
    chapters[0]?.id ?? "chap-hero",
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible?.target.id) {
          setActiveChapter(visible.target.id)
        }
      },
      { threshold: 0.5 },
    )

    chapters.forEach((chapter) => {
      const node = document.getElementById(chapter.id)
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])

  const top3Hotspots = hotspots?.slice(0, 3) ?? []
  const topGroup = topGroups?.[0]

  const avgMinutes =
    umamiCurrent && umamiCurrent.visits.value > 0
      ? Math.max(
          1,
          Math.round(
            umamiCurrent.totaltime.value / umamiCurrent.visits.value / 60,
          ),
        )
      : null

  const visitorsGrowth = growth(
    umami2026?.visitors.value,
    umami2025?.visitors.value,
  )

  const improvements = useMemo(() => {
    const candidates = [
      {
        label: "visiteurs web",
        value: growth(umami2026?.visitors.value, umami2025?.visitors.value),
      },
      {
        label: "pages vues",
        value: growth(umami2026?.pageviews.value, umami2025?.pageviews.value),
      },
      {
        label: "positions partagées",
        value: growth(stats2026?.totalPositions, stats2025?.totalPositions),
      },
      {
        label: "trackeurs actifs",
        value: growth(stats2026?.uniqueTrackers, stats2025?.uniqueTrackers),
      },
    ]

    return candidates
      .filter(
        (candidate): candidate is { label: string; value: number } =>
          candidate.value !== null && candidate.value > 0,
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }, [stats2025, stats2026, umami2025, umami2026])

  const bestPositionsDay = useMemo(() => {
    if (!positionsByDay?.length) return null
    return [...positionsByDay].sort((a, b) => b.count - a.count)[0] ?? null
  }, [positionsByDay])

  const bestGroupsDay = useMemo(() => {
    if (!groupsByDay?.length) return null
    return [...groupsByDay].sort((a, b) => b.count - a.count)[0] ?? null
  }, [groupsByDay])

  const bestVisitsDay = useMemo(() => {
    if (!pageviewsCurrent.length) return null
    return [...pageviewsCurrent].sort((a, b) => b.count - a.count)[0] ?? null
  }, [pageviewsCurrent])

  const peakHour = useMemo(() => {
    if (!hourly?.length) return null
    return [...hourly].sort((a, b) => b.count - a.count)[0] ?? null
  }, [hourly])

  return (
    <main className="relative bg-gradient-to-b from-primary/15 via-background to-background pb-28 md:pb-12">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mb-4 hidden items-center justify-end gap-2 md:flex">
          <Link
            href="/opendata?period=saison2026"
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
              currentPeriod === "saison2026"
                ? "bg-primary text-white"
                : "bg-background"
            }`}
          >
            Saison 2026
          </Link>
          <Link
            href="/opendata?period=annee2025"
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
              currentPeriod === "annee2025"
                ? "bg-primary text-white"
                : "bg-background"
            }`}
          >
            Année 2025
          </Link>
          <Link
            href="/opendata1"
            className="rounded-md bg-muted px-3 py-1.5 text-sm font-semibold"
          >
            Voir ancienne version
          </Link>
        </div>

        <div className="snap-y snap-mandatory space-y-5 md:snap-none">
          <section
            id="chap-hero"
            className="min-h-[78svh] snap-start rounded-2xl border border-primary/20 bg-background/90 p-6 shadow-sm md:min-h-0"
          >
            <p className="text-xs uppercase tracking-widest text-primary">
              O Mas La Wrapped
            </p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">
              {periodLabel}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              En 2026: <strong>0 communication</strong>,{" "}
              <strong>0 grosse refonte produit</strong>. Et pourtant, la
              communauté a continué d'utiliser O Mas La massivement.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Visiteurs"
                value={formatCompact(umamiCurrent?.visitors.value)}
                subtitle="personnes touchées"
              />
              <KpiCard
                title="Positions"
                value={formatCompact(stats?.totalPositions)}
                subtitle="signalements terrain"
              />
              <KpiCard
                title="Trackeurs"
                value={formatCompact(stats?.uniqueTrackers)}
                subtitle="contributeurs actifs"
              />
              <KpiCard
                title="Temps moyen"
                value={avgMinutes ? `${avgMinutes} min` : "..."}
                subtitle="temps moyen passé sur le site"
              />
            </div>
          </section>

          <section
            id="chap-impact"
            className="min-h-[78svh] snap-start rounded-2xl border border-primary/20 bg-background/95 p-6 shadow-sm md:min-h-0"
          >
            <h2 className="text-2xl font-black">
              Impact qui parle aux partenaires
            </h2>
            <p className="mt-2 text-muted-foreground">
              Même sans campagne dédiée, l'audience continue de se mobiliser
              autour du service.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>Signal fort 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-black text-primary">
                    {visitorsGrowth !== null
                      ? `${visitorsGrowth > 0 ? "+" : ""}${visitorsGrowth}%`
                      : "n/a"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    d'évolution visiteurs vs 2025
                  </p>
                  <p className="mt-4 text-sm">
                    {umamiCurrent
                      ? `${formatCompact(umamiCurrent.pageviews.value)} pages vues et ${formatCompact(umamiCurrent.visits.value)} visites sur la période.`
                      : "Données audience indisponibles."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Le tempo terrain</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Heure la plus intense
                  </p>
                  <p className="text-3xl font-black">
                    {peakHour ? `${peakHour.hour}h` : "n/a"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {peakHour
                      ? `${peakHour.count} positions partagées`
                      : "Pas de données"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top groupes</CardTitle>
                </CardHeader>
                <CardContent>
                  {topGroups?.length ? (
                    <>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Groupe leader: <strong>{topGroup?.title}</strong> (
                        {topGroup?.count} positions)
                      </p>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                          data={topGroups}
                          layout="vertical"
                          margin={{ left: 12, right: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="title" type="category" width={110} />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            fill="hsl(var(--primary))"
                            radius={[0, 6, 6, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      Chargement...
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité horaire</CardTitle>
                </CardHeader>
                <CardContent>
                  {hourly?.length ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={hourly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => `${label}h`}
                          formatter={(value) => [value, "positions"]}
                        />
                        <Bar
                          dataKey="count"
                          fill="#ec4899"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      Chargement...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            id="chap-vs"
            className="min-h-[78svh] snap-start rounded-2xl border border-primary/20 bg-background/95 p-6 shadow-sm md:min-h-0"
          >
            <h2 className="text-2xl font-black">
              Comparé à 2025, qu'est-ce qui progresse ?
            </h2>
            <p className="mt-2 text-muted-foreground">
              On met en avant les métriques réellement meilleures.
            </p>

            <div className="mt-5 grid gap-3">
              {improvements.length ? (
                improvements.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border bg-primary/5 p-4"
                  >
                    <p className="text-sm uppercase text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-black text-primary">
                      +{item.value}%
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                  Pas de hausse claire sur la période sélectionnée (ou données
                  encore faibles).
                </div>
              )}
            </div>
          </section>

          <section
            id="chap-fun"
            className="min-h-[78svh] snap-start rounded-2xl border border-primary/20 bg-background/95 p-6 shadow-sm md:min-h-0"
          >
            <h2 className="text-2xl font-black">Les data fun 🎭</h2>
            <p className="mt-2 text-muted-foreground">
              Le top groupe, les endroits les plus chauds, et les jours records.
            </p>

            <div className="mt-5 grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Top 3 zones chaudes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {top3Hotspots.map((spot, index) => (
                    <button
                      key={`${spot.lat}-${spot.lng}`}
                      type="button"
                      onClick={() => {
                        setSelectedHotspot(index)
                        mapRef.current?.flyTo(spot.lat, spot.lng)
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedHotspot === index
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold">
                        #{index + 1} - {spot.count} positions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="overflow-hidden lg:col-span-2">
                <CardContent className="p-0">
                  <HotspotMap ref={mapRef} hotspots={hotspots ?? []} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Jour record positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">
                    {formatDateFR(bestPositionsDay?.date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bestPositionsDay?.count ?? 0} positions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Jour record visites web
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">
                    {formatDateFR(bestVisitsDay?.date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bestVisitsDay?.count ?? 0} visites
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Jour record créations groupes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black">
                    {formatDateFR(bestGroupsDay?.date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bestGroupsDay?.count ?? 0} groupes
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-7 text-center">
          <h2 className="text-2xl font-black">
            Saison 2027: on passe un cap ?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Ces chiffres montrent qu'O Mas La performe même avec peu de moyens.
            Avec un partenaire solide, on peut livrer une expérience encore plus
            forte l'an prochain.
          </p>
          <a
            href="https://tally.so/r/3EvMVo"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md bg-primary px-6 py-3 font-semibold text-white"
          >
            Devenir partenaire
          </a>
        </section>
      </div>

      <nav className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border bg-background/95 p-1 shadow-sm md:hidden">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => {
              document
                .getElementById(chapter.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeChapter === chapter.id
                ? "bg-primary text-white"
                : "text-muted-foreground"
            }`}
          >
            {chapter.label}
          </button>
        ))}
      </nav>
    </main>
  )
}
