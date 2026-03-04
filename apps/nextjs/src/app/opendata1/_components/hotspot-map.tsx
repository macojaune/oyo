"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { useQuery } from "convex/react"
import mapboxgl from "mapbox-gl"

import "mapbox-gl/dist/mapbox-gl.css"

import { api as convexApi } from "@oyo/convex"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export interface HotspotMapRef {
  flyTo: (lat: number, lng: number) => void
}

interface HotspotMapProps {
  onHotspotsLoad?: (
    hotspots: { lat: number; lng: number; count: number }[],
  ) => void
}

export const HotspotMap = forwardRef<HotspotMapRef, HotspotMapProps>(
  function HotspotMap({ onHotspotsLoad }, ref) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const markersRef = useRef<mapboxgl.Marker[]>([])
    const hotspots = useQuery(convexApi.stats.getHotspots, { limit: 50 })

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number) => {
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1000,
          })
        }
      },
    }))

    useEffect(() => {
      if (!mapContainer.current || !mapboxgl.accessToken) return

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-61.533329, 16.241935],
        zoom: 12,
      })

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      return () => {
        map.current?.remove()
      }
    }, [])

    useEffect(() => {
      if (!map.current || !hotspots || hotspots.length === 0) return

      if (onHotspotsLoad) {
        onHotspotsLoad(hotspots)
      }

      markersRef.current.forEach((marker) => {
        marker.remove()
      })
      markersRef.current = []

      const maxCount = Math.max(...hotspots.map((h) => h.count))

      hotspots.forEach((spot) => {
        const intensity = spot.count / maxCount
        const radius = 8 + intensity * 20
        const opacity = 0.4 + intensity * 0.6

        const el = document.createElement("div")
        el.className = "hotspot-marker"
        el.style.cssText = `
          width: ${radius}px;
          height: ${radius}px;
          background: radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, rgba(139, 92, 246, 0) 70%);
          border-radius: 50%;
          cursor: pointer;
        `

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2"><strong>${spot.count}</strong> positions partagées</div>`,
            ),
          )
          .addTo(map.current!)

        markersRef.current.push(marker)
      })
    }, [hotspots, onHotspotsLoad])

    return (
      <div
        ref={mapContainer}
        className="h-[400px] w-full overflow-hidden rounded-lg"
      />
    )
  },
)
