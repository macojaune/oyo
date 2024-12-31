"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
// import { useGroups } from "@/hooks/useGroups";
import { groups } from "./sidebar";

// Initialize Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapComponentProps {
  userPosition?: GeolocationPosition;
  selectedGroup?: string | null;
  onGroupSelect: (groupId: string) => void;
}

export default function MapComponent({
  userPosition,
  selectedGroup,
  onGroupSelect
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { theme } = useTheme();
  // const { groups } = useGroups();

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      center: [-61.533329,16.241935], // P-a-p coordinates
      zoom: 14
    });

    map.current.on('style.load', () => {
          map.current.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png',
            (error, image) => {
              if (error) throw error;

              map.current.addImage('pattern-dot', image);

              map.current.addSource('route-data', {
                type: 'geojson',
                lineMetrics: true,
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    coordinates: [
                      [ -61.547374,16.251738],
                      // [13.39042, 52.518201],
                      // [13.390322, 52.518754],
                      // [13.388698, 52.518654],
                      // [13.388707, 52.518714],
                      // [13.3887, 52.518762],
                      // [13.388707, 52.518824],
                      // [13.388574, 52.519737],
                      // [13.388518, 52.519735],
                      // [13.388459, 52.519845],
                      // [13.388546, 52.519848],
                      // [13.388638, 52.51987],
                      // [13.389079, 52.519895],
                      [-61.531034,16.243158]
                    ],
                    type: 'LineString'
                  }
                }
              });

              const lineBaseWidth = 14;

              map.current.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route-data',
                layout: {
                  'line-join': 'none'
                },
                paint: {
                  'line-pattern': 'pattern-dot',
                  'line-width': [
                    'interpolate',
                    ['exponential', 2],
                    ['zoom'],
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
                    lineBaseWidth * 2
                  ]
                }
              });
            }
          );
        });

    return () => {
      map.current?.remove();
    };
  }, [theme]);

  useEffect(() => {
    if (!map.current || !groups) return;


    // Add markers for each group
    groups.forEach(group => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(group.lastUpdate),
      })
      .setLngLat([group.longitude, group.latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${group.name}</h3>
            <p class="text-sm">Dernière mise à jour: ${formatTime(group.lastUpdate)}</p>
          </div>
        `)
      )
      .addTo(map.current!);
    });
  }, [groups]);

  useEffect(() => {
    if (!map.current|| groups.length === 0) return;
    const group = groups.find(group => group.id === selectedGroup);
    if(!group) return;
    map.current.flyTo({center:[group.longitude, group.latitude], zoom: 19});

  }, [selectedGroup,map.current]);
  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}

function getMarkerColor(lastUpdate: Date): string {
  const minutes = (Date.now() - new Date(lastUpdate).getTime()) / 1000 / 60;
  if (minutes < 15) return "#22c55e"; // green
  if (minutes < 30) return "#eab308"; // yellow
  return "#ef4444"; // red
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}
