"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"

import "mapbox-gl/dist/mapbox-gl.css"

import { useQuery } from "convex/react"
import { useTheme } from "next-themes"

import type { Doc, Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"

type Group = Doc<"groups"> & { positions: Doc<"positions">[] }

// Initialize Mapbox token
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

  useEffect(() => {
    if (!map.current || !groups) return
    map.current.on("style.load", () => {
      map.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png",
        (error, image) => {
          if (error) throw error

          map.current.addImage("pattern-dot", image)
        },
      )

      // Add markers for each group
      Object.values(groups).forEach((group: Group) => {
        const popup = new mapboxgl.Popup().setHTML(`
          <div class="p-2 bg-purple-500">
            <h3 class="font-bold">${group.title}</h3>
            <p class="text-sm">Dernière mise à jour: ${formatTime(new Date(group.positions[0]._creationTime))}</p>
          </div>
        `)
        popup.on("open", () => {
          onGroupSelect(group._id)
        })
        popup.on("close", () => {
          onGroupSelect(group._id)
        })
        const marker = new mapboxgl.Marker({
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
  }, [groups])

  useEffect(() => {
    if (!map.current || !groups) return

    // map.current.flyTo({
    //   center: [group.positions[0].latitude, group.positions[0].longitude],
    //   zoom: 19,
    // })
    if (selectedGroup === null) {
      try {
        console.log("remove all")
        map.current.getSource("route-data")
      } catch (e) {
        console.error(e)
        return
      }
    }
    const group = groups[selectedGroup]
    if (!group) {
      onGroupSelect(selectedGroup)
      return
    }

    map.current.addSource(`route-data`, {
      type: "geojson",
      lineMetrics: true,
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: group.positions.map((pos) => [
            pos.latitude,
            pos.longitude,
          ]),
          type: "LineString",
        },
      },
    })
    const lineBaseWidth = 14
    map.current.addLayer({
      id: `route-line`,
      type: "line",
      source: `route-data`,
      layout: {
        "line-join": "none",
      },
      paint: {
        "line-pattern": "pattern-dot",
        "line-width": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          0,
          lineBaseWidth * 1,
          0.9999,
          lineBaseWidth * 2,
          1,
          lineBaseWidth * 1,
          1.9999,
          lineBaseWidth * 2,
          2,
          lineBaseWidth * 1,
          2.9999,
          lineBaseWidth * 2,
          3,
          lineBaseWidth * 1,
          3.9999,
          lineBaseWidth * 2,
          4,
          lineBaseWidth * 1,
          4.9999,
          lineBaseWidth * 2,
          5,
          lineBaseWidth * 1,
          5.9999,
          lineBaseWidth * 2,
          6,
          lineBaseWidth * 1,
          6.9999,
          lineBaseWidth * 2,
          7,
          lineBaseWidth * 1,
          7.9999,
          lineBaseWidth * 2,
          8,
          lineBaseWidth * 1,
          8.9999,
          lineBaseWidth * 2,
          9,
          lineBaseWidth * 1,
          9.9999,
          lineBaseWidth * 2,
          10,
          lineBaseWidth * 1,
          10.9999,
          lineBaseWidth * 2,
          11,
          lineBaseWidth * 1,
          11.9999,
          lineBaseWidth * 2,
          12,
          lineBaseWidth * 1,
          12.9999,
          lineBaseWidth * 2,
          13,
          lineBaseWidth * 1,
          13.9999,
          lineBaseWidth * 2,
          14,
          lineBaseWidth * 1,
          14.9999,
          lineBaseWidth * 2,
          15,
          lineBaseWidth * 1,
          15.9999,
          lineBaseWidth * 2,
          16,
          lineBaseWidth * 1,
          16.9999,
          lineBaseWidth * 2,
          17,
          lineBaseWidth * 1,
          17.9999,
          lineBaseWidth * 2,
          18,
          lineBaseWidth * 1,
          18.9999,
          lineBaseWidth * 2,
          19,
          lineBaseWidth * 1,
          19.9999,
          lineBaseWidth * 2,
          20,
          lineBaseWidth * 1,
          20.9999,
          lineBaseWidth * 2,
          21,
          lineBaseWidth * 1,
          22,
          lineBaseWidth * 2,
        ],
      },
    })
  }, [selectedGroup, groups])

  return <div ref={mapContainer} className="z-5 h-full w-full" />
}

function getMarkerColor(group: Group): string {
  const minutes =
    (Date.now() - new Date(group.positions[0]?._creationTime).getTime()) /
    1000 /
    60
  if (minutes < 15) return "#22c55e" // green
  if (minutes < 30) return "#eab308" // yellow
  return "#ef4444" // red
}

function formatTime(time: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time))
}
