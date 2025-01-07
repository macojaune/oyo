import "@bacons/text-decoder/install"

import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useColorScheme } from "nativewind"

import { TRPCProvider } from "~/utils/api"

import "../styles.css"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme()
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
