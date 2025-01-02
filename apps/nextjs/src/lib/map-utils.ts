import type { GeoJSONSource, Map } from "mapbox-gl"

import type { Doc, Id } from "@oyo/convex"

export type Group = Doc<"groups"> & { positions: Doc<"positions">[] }

export function createRouteSource(group: Group) {
  return {
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
  }
}

export function addRouteLine(map: Map, lineBaseWidth: number = 14) {
  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route-data",
    layout: {
      "line-join": "none",
    },
    paint: {
      "line-pattern": "pattern-dot",
      "line-width": generateLineWidthSteps(lineBaseWidth),
    },
  })
}

function generateLineWidthSteps(baseWidth: number) {
  const steps = []
  for (let zoom = 0; zoom <= 22; zoom++) {
    steps.push(zoom)
    steps.push(baseWidth * (zoom % 2 === 0 ? 1 : 2))
  }
  return ["interpolate", ["exponential", 2], ["zoom"], ...steps]
}

export function getMarkerColor(group: Group): string {
  const minutes =
    (Date.now() - new Date(group.positions[0]?._creationTime).getTime()) /
    1000 /
    60
  if (minutes < 15) return "#22c55e" // green
  if (minutes < 30) return "#eab308" // yellow
  return "#ef4444" // red
}

export function formatTime(time: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time))
}
