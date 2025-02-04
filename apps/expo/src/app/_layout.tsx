import "@bacons/text-decoder/install"

import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import * as TaskManager from "expo-task-manager"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useColorScheme } from "nativewind"

import { TRPCProvider } from "~/utils/api"

import "~/styles.css"

import { useEffect } from "react"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  useEffect(() => {
    return () => {
      console.log("kill bg tasks")
      void TaskManager.unregisterAllTasksAsync()
    }
  }, [])

  return (
    <ConvexProvider client={convex}>
      <TRPCProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />
        <StatusBar />
      </TRPCProvider>
    </ConvexProvider>
  )
}
