"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

import "mapbox-gl/dist/mapbox-gl.css"

import { useQuery } from "convex/react"
import { useTheme } from "next-themes"

import type { Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"

import type { Group } from "~/lib/map-utils"
import { useMapRoute } from "~/hooks/useMapRoute"
import { formatTime, getMarkerColor } from "~/lib/map-utils"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

interface MapComponentProps {
  userPosition?: GeolocationPosition
  selectedGroup?: Id<"groups"> | null
  onGroupSelect: (groupId: Id<"groups">) => void
}

export default function MapComponent({
  userPosition,
  selectedGroup,
  onGroupSelect,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { theme } = useTheme()
  const groups = useQuery(convexApi.positions.byGroups) as Record<
    Id<"groups">,
    Group
  >

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        theme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
      center: [-61.533329, 16.241935], // P-a-p coordinates
      zoom: 14,
    })

    return () => {
      map.current?.remove()
    }
  }, [theme])

  // Add markers and pattern
  useEffect(() => {
    if (!map.current || !groups) return

    map.current.on("style.load", () => {
      map.current?.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png",
        (error, image) => {
          if (error) throw error
          map.current?.addImage("pattern-dot", image)
        },
      )

      Object.values(groups).forEach((group: Group) => {
        const popup = new mapboxgl.Popup().setHTML(`
          <div class="p-2 bg-purple-500">
            <h3 class="font-bold">${group.title}</h3>
            <p class="text-sm">Dernière mise à jour: ${formatTime(group.positions[0]._creationTime)}</p>
          </div>
        `)

        popup.on("open", () => onGroupSelect(group._id))
        popup.on("close", () => onGroupSelect(group._id))

        new mapboxgl.Marker({
          color: getMarkerColor(group),
        })
          .setLngLat([
            group.positions[0].latitude,
            group.positions[0].longitude,
          ])
          .setPopup(popup)
          .addTo(map.current!)
      })
    })
  }, [groups, onGroupSelect])

  // Handle route display
  useMapRoute(map.current, selectedGroup, groups)

  return <div ref={mapContainer} className="h-full w-full" />
}
