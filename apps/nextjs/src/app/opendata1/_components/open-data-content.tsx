"use client"

import { useRef, useState } from "react"
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
import type { UmamiStats } from "~/lib/umami-server"
import { HotspotMap } from "./hotspot-map"

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string | number
  subtitle?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10" />
    </Card>
  )
}

interface OpenDataContentProps {
  umamiStats: UmamiStats | null
  periodLabel: string
}

export function OpenDataContent({
  umamiStats,
  periodLabel,
}: OpenDataContentProps) {
  const convexStats = useQuery(convexApi.stats.getStats)
  const topGroups = useQuery(convexApi.stats.getTopGroups, { limit: 10 })
  const hotspots = useQuery(convexApi.stats.getHotspots, { limit: 20 })
  const activityByHour = useQuery(convexApi.stats.getActivityByHour)
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null)
  const mapRef = useRef<HotspotMapRef>(null)

  const formatNumber = (n: number | undefined) => {
    if (n === undefined || n === null) return "..."
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return n.toString()
  }

  const safeStats = umamiStats
    ? {
        visitors: umamiStats.visitors?.value ?? 0,
        visitorsPrev: umamiStats.visitors?.prev ?? 0,
        pageviews: umamiStats.pageviews?.value ?? 0,
        pageviewsPrev: umamiStats.pageviews?.prev ?? 0,
        visits: umamiStats.visits?.value ?? 0,
        totaltime: umamiStats.totaltime?.value ?? 0,
      }
    : null

  const top3Hotspots = hotspots?.slice(0, 3) ?? []

  const handleHotspotClick = (index: number, lat: number, lng: number) => {
    setSelectedHotspot(index)
    mapRef.current?.flyTo(lat, lng)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          O Mas La? <span className="text-primary">OpenData</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Retrouvez toutes les statistiques publiques du projet pour{" "}
          <span className="font-semibold text-primary">{periodLabel}</span>.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Audience web</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Visiteurs uniques"
            value={safeStats ? formatNumber(safeStats.visitors) : "..."}
            subtitle={
              safeStats && safeStats.visitorsPrev > 0
                ? `${safeStats.visitorsPrev} période prec.`
                : undefined
            }
          />
          <StatCard
            title="Pages vues"
            value={safeStats ? formatNumber(safeStats.pageviews) : "..."}
            subtitle={
              safeStats && safeStats.pageviewsPrev > 0
                ? `${safeStats.pageviewsPrev} période prec.`
                : undefined
            }
          />
          <StatCard
            title="Visites"
            value={safeStats ? formatNumber(safeStats.visits) : "..."}
            subtitle="Sessions totales"
          />
          <StatCard
            title="Temps moyen"
            value={
              safeStats && safeStats.visits > 0
                ? `${Math.round(safeStats.totaltime / safeStats.visits / 60)}min`
                : "..."
            }
            subtitle="Temps passé sur le site"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Contributeurs & Données</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Groupes créés"
            value={convexStats?.totalGroups ?? "..."}
            subtitle="Groupes de carnaval enregistrés"
          />
          <StatCard
            title="Positions partagées"
            value={convexStats?.totalPositions ?? "..."}
            subtitle="Points de localisation"
          />
          <StatCard
            title="Trackeurs actifs"
            value={convexStats?.uniqueTrackers ?? "..."}
            subtitle="Contributeurs uniques"
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold">Top 10 des groupes</h2>
          <Card>
            <CardContent className="pt-6">
              {topGroups && topGroups.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topGroups}
                    layout="vertical"
                    margin={{ left: 20, right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="title" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a78bfa" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Chargement...
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold">Activité par heure</h2>
          <Card>
            <CardContent className="pt-6">
              {activityByHour && activityByHour.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `${label}h`}
                      formatter={(value) => [value, "Positions"]}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Chargement...
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {hotspots && hotspots.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">
            Zones les plus actives
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Top 3 des zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {top3Hotspots.map((spot, index) => (
                    <button
                      type="button"
                      key={`${spot.lat}-${spot.lng}`}
                      onClick={() =>
                        handleHotspotClick(index, spot.lat, spot.lng)
                      }
                      className={`flex w-full items-center gap-4 rounded-lg p-4 text-left transition-all ${
                        selectedHotspot === index
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                          index === 0
                            ? "bg-amber-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : "bg-amber-700 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">
                          {spot.count.toLocaleString()} positions
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                        </p>
                      </div>
                    </button>
                  ))}
                  <p className="pt-2 text-xs text-muted-foreground">
                    Cliquez sur une zone pour la localiser sur la carte
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-0">
                  <HotspotMap ref={mapRef} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-lg bg-primary/10 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Devenez sponsor</h2>
        <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
          Soutenez le développement de O Mas La? et gagnez en visibilité auprès
          de la communauté carnaval de Guadeloupe.
        </p>
        <a
          href="https://tally.so/r/3EvMVo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          En savoir plus
        </a>
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Données mises à jour en temps réel depuis{" "}
          <a
            href="https://convex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Convex
          </a>{" "}
          • Stats analytics via{" "}
          <a
            href="https://umami.is"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Umami
          </a>
        </p>
      </footer>
    </main>
  )
}
