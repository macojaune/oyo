import "@bacons/text-decoder/install"

import Constants from "expo-constants"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useColorScheme } from "nativewind"

import { TRPCProvider } from "~/utils/api"

import "~/styles.css"

import { useNotifications } from "~/lib/useNotifications"

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
  const { expoPushToken } = useNotifications()

  return (
    <ConvexProvider client={convex}>
      <TRPCProvider>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
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
