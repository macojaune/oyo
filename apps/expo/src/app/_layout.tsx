import "@bacons/text-decoder/install"

import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useColorScheme } from "nativewind"
import { useEffect } from "react"
import { useMutation } from "convex/react"

import { TRPCProvider } from "~/utils/api"

import "~/styles.css"

import { useNotifications } from "~/lib/useNotifications"
import { useGroupStore } from "~/lib/store"
import { api as convexApi } from "@oyo/convex"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

//Handle notifications when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})
// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme()

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
