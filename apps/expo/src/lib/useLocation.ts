import { useEffect, useState } from "react"
import * as Location from "expo-location"
import * as Notifications from "expo-notifications"
import * as TaskManager from "expo-task-manager"
import { useMutation, useQuery } from "convex/react"

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
    const userId = useGroupStore.getState().userId

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
  const [error, setError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isPendingTracking, setIsPendingTracking] = useState(false)

  const startTracking = useMutation(convexApi.users.startTracking)
  const stopTracking = useMutation(convexApi.users.stopTracking)
  const { selectedGroup, userId } = useGroupStore()

  // Add this query to check for active users
  const activeUsers = useQuery(
    convexApi.users.getActiveUsers,
    selectedGroup ? { group: selectedGroup } : "skip",
  )

  // Cleanup function
  useEffect(() => {
    return () => {
      void stopBackgroundTracking()
    }
  }, [])
  // Watch for changes in activeUsers
  useEffect(() => {
    if (isPendingTracking && (!activeUsers || activeUsers.length === 0)) {
      void startTrackingWithRetry()
      void Notifications.scheduleNotificationAsync({
        content: {
          title: "Sé tou a'w !",
          body: "Tu es à présent notre porteur de drapeau",
        },
        trigger: null,
      })
    }
  }, [activeUsers])

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

  const startTrackingWithRetry = async () => {
    if (!userId || !selectedGroup) return

    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return

    // If group is already being tracked, set pending state and wait
    if (activeUsers && activeUsers.length > 0) {
      setIsPendingTracking(true)
      return
    }

    // If group is available, try to start tracking immediately
    try {
      const success = await startTracking({ userId, group: selectedGroup })
      if (success) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 60 * 1000,
          distanceInterval: 50,
          foregroundService: {
            notificationTitle: "O Mas La ? - Partage de position",
            notificationBody: "Partage de ta position en arrière-plan",
          },
          android: {
            notification: {
              title: "O Mas La ? - Partage de position",
              body: "Partage de ta position en arrière-plan",
              sticky: true,
            },
          },
          ios: {
            activityType: Location.ActivityType.Fitness,
            allowsBackgroundLocationUpdates: true,
            showsBackgroundLocationIndicator: true,
          },
        })
        setIsTracking(true)
        setIsPendingTracking(false)
      } else {
        // Someone might have started tracking just now, set pending
        setIsPendingTracking(true)
      }
    } catch (err) {
      setError(err.message)
      setIsPendingTracking(false) // Clear pending state on error
    }
  }

  const stopBackgroundTracking = async () => {
    if (!userId) return

    if (isPendingTracking) {
      setIsPendingTracking(false)
      setError(null)
      return
    }

    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
      await stopTracking({ userId })
      setIsTracking(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    startTrackingWithRetry,
    stopBackgroundTracking,
    isTracking,
    error,
    isGroupBeingTracked: activeUsers && activeUsers.length > 0,
    isPendingTracking,
  }
}
