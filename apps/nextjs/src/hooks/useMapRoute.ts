"use client"

import type { Map } from "mapbox-gl"
import { useEffect } from "react"

import { addRouteLine, createRouteSource, Group } from "~/lib/map-utils"

export function useMapRoute(
  map: Map | null,
  selectedGroup: string | null,
  groups: Record<string, Group>,
) {
  useEffect(() => {
    if (!map || !groups) return

    if (selectedGroup === null) {
      try {
        const source = map.getSource("route-data")
        if (source) {
          map.removeLayer("route-line")
          map.removeSource("route-data")
        }
      } catch (e) {
        console.error("Error removing route:", e)
      }
      return
    }

    const group = groups[selectedGroup]
    if (!group) return

    const source = map.getSource("route-data")
    const routeSource = createRouteSource(group)

    if (source) {
      source.setData(routeSource.data)
    } else {
      map.addSource("route-data", routeSource)
      addRouteLine(map)
    }

    // Optional: Center map on route
    // const coordinates = group.positions.map(pos => [pos.latitude, pos.longitude])
    // map.fitBounds(coordinates, { padding: 50 })
  }, [map, selectedGroup, groups])
}
