import { v } from "convex/values"

import { query } from "./_generated/server"

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const groups = await ctx.db.query("groups").collect()
    const positions = await ctx.db.query("positions").collect()

    const appPositions = positions.filter((p) => p.fromApp).length
    const webPositions = positions.length - appPositions

    const owners = positions.map((p) => p.owner).filter((o) => o !== undefined)
    const uniqueOwners = new Set(owners.map(String)).size

    return {
      totalGroups: groups.length,
      totalPositions: positions.length,
      appPositions,
      webPositions,
      uniqueTrackers: uniqueOwners,
    }
  },
})

export const getTopGroups = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    const positions = await ctx.db.query("positions").collect()

    const groupCounts: Record<string, { count: number; title: string }> = {}

    for (const pos of positions) {
      const groupId = pos.group
      if (!groupCounts[groupId]) {
        const group = await ctx.db.get(groupId)
        groupCounts[groupId] = {
          count: 0,
          title: group?.title ?? "Unknown",
        }
      }
      groupCounts[groupId].count++
    }

    return Object.entries(groupCounts)
      .map(([id, data]) => ({
        id,
        title: data.title,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  },
})

export const getHotspots = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const positions = await ctx.db.query("positions").collect()

    const gridCounts: Record<
      string,
      { lat: number; lng: number; count: number }
    > = {}

    const gridSize = 0.001

    for (const pos of positions) {
      const gridLat = Math.round(pos.latitude / gridSize) * gridSize
      const gridLng = Math.round(pos.longitude / gridSize) * gridSize
      const key = `${gridLat},${gridLng}`

      if (!gridCounts[key]) {
        gridCounts[key] = { lat: gridLat, lng: gridLng, count: 0 }
      }
      gridCounts[key].count++
    }

    return Object.values(gridCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((h) => ({
        lat: h.lat,
        lng: h.lng,
        count: h.count,
      }))
  },
})

export const getActivityByHour = query({
  args: {},
  handler: async (ctx) => {
    const positions = await ctx.db.query("positions").collect()

    const hourCounts: Record<number, number> = {}
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0
    }

    for (const pos of positions) {
      const hour = new Date(pos._creationTime).getHours()
      hourCounts[hour]++
    }

    return Object.entries(hourCounts).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }))
  },
})

export const getActivityByDay = query({
  args: {},
  handler: async (ctx) => {
    const positions = await ctx.db.query("positions").collect()

    const dayCounts: Record<string, number> = {}

    for (const pos of positions) {
      const day = new Date(pos._creationTime).toISOString().split("T")[0]
      dayCounts[day] = (dayCounts[day] ?? 0) + 1
    }

    return Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },
})
