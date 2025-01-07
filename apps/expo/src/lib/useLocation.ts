import { useEffect, useState } from "react"
import * as Location from "expo-location"
import * as TaskManager from "expo-task-manager"
import { useMutation } from "convex/react"

import { api as convexApi } from "@oyo/convex"

import { useGroupStore } from "./store"

const LOCATION_TASK_NAME = "omasla-background-location-task"

// Define the background task
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error(error)
      return
    }

    // Get the Convex client - Note: You'll need to configure this separately for background tasks
    // as the React hooks won't be available here
    const { ConvexHttpClient } = require("convex/browser")
    const client = new ConvexHttpClient(process.env.EXPO_PUBLIC_CONVEX_URL)
    const useGroupStore = require("./store").useGroupStore

    const groupId = useGroupStore.getState().selectedGroup
    let userId = useGroupStore.getState().userId

    try {
      // Process each location update
      for (const location of locations) {
        const positionData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          // timestamp: new Date().toISOString(),
          // accuracy: location.coords.accuracy,
          // altitude: location.coords.altitude,
          // speed: location.coords.speed,
          // heading: location.coords.heading,
          // isBackground: true,
          groupId,
          owner: userId,
          fromApp: true,
        }

        // Save to Convex using the HTTP client
        await client.mutation(convexApi.positions.sendPosition, positionData)
      }
    } catch (err) {
      console.error("Error saving background location:", err)
    }
  },
)

export const useLocationHandler = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isTracking, setIsTracking] = useState(false)

  const createPosition = useMutation(convexApi.positions.sendPosition)
  const { selectedGroup, userId } = useGroupStore()

  // Cleanup function
  useEffect(() => {
    return () => {
      stopBackgroundTracking()
    }
  }, [])

  const requestPermissions = async () => {
    try {
      const foreground = await Location.requestForegroundPermissionsAsync()
      if (foreground.status !== "granted") {
        setError("Permission to access location was denied")
        return false
      }

      const background = await Location.requestBackgroundPermissionsAsync()
      if (background.status !== "granted") {
        setError("Permission to access background location was denied")
        return false
      }

      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const startBackgroundTracking = async () => {
    setLoading(true)
    try {
      const hasPermissions = await requestPermissions()
      if (!hasPermissions) {
        return
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 60 * 1000, // Update every 1 minute
        distanceInterval: 50, // Update every 10 meters
        // This prevents iOS from suspending your app
        foregroundService: {
          notificationTitle: "O Mas La ? - Partage de position",
          notificationBody: "Partage de ta position en arrière-plan",
        },
        // Android-specific
        android: {
          notification: {
            title: "O Mas La ? - Partage de position",
            body: "Partage de ta position en arrière-plan",
            sticky: true,
          },
        },
        // iOS-specific
        ios: {
          activityType: Location.ActivityType.Fitness,
          allowsBackgroundLocationUpdates: true,
          showsBackgroundLocationIndicator: true,
        },
      })

      setIsTracking(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stopBackgroundTracking = async () => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
      setIsTracking(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const getCurrentPositionAndSave = async () => {
    setLoading(true)
    try {
      const hasPermissions = await requestPermissions()
      if (!hasPermissions) {
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const positionData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // timestamp: new Date().toISOString(),
        // accuracy: location.coords.accuracy,
        // altitude: location.coords.altitude,
        // speed: location.coords.speed,
        // heading: location.coords.heading,
        // isBackground: false,
        groupId: selectedGroup,
        owner: userId,
        fromApp: true,
      }

      return await createPosition(positionData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    getCurrentPositionAndSave,
    startBackgroundTracking,
    stopBackgroundTracking,
    isTracking,
    error,
    loading,
  }
}
