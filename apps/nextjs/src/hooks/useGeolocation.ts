"use client"

import { useEffect, useState } from "react"

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => setPosition(position),
      (error) => setError(error.message),
      {
        enableHighAccuracy: true,
        timeout: 0,
        maximumAge: 50000,
      },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { position, error }
}
