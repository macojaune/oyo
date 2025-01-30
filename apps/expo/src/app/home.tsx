import { useEffect, useState } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import logoDarkImg from "assets/logo-dark.png"
import logoImg from "assets/logo.png"
import { useMutation, useQuery } from "convex/react"

import type { Doc, Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"
import { cn } from "@oyo/ui"

import { ActiveTracking } from "~/components/active-tracking"
import { Picker, PickerItem } from "~/components/nativewindui/Picker"
import { NewGroupForm } from "~/components/new-group-form"
import { PendingTracking } from "~/components/pending-tracking"
import { useGroupStore } from "~/lib/store"
import { useColorScheme } from "~/lib/useColorScheme"
import { useLocationHandler } from "~/lib/useLocation"
import { useNotifications } from "~/lib/useNotifications"

interface TrackingStatusProps {
  isTracking: boolean
  isPendingTracking: boolean
  selectedGroup: Id<"groups"> | null
  groups: Doc<"groups">[] | undefined
  error?: string
}

export function TrackingStatus({
  isTracking,
  isPendingTracking,
  selectedGroup,
  groups,
  error,
}: TrackingStatusProps) {
  if (isTracking) {
    return (
      <ActiveTracking
        selectedGroup={selectedGroup}
        groups={groups}
        error={error}
      />
    )
  }

  if (isPendingTracking) {
    return <PendingTracking selectedGroup={selectedGroup} groups={groups} />
  }

  return null
}

export default function HomeScreen() {
  const [formVisible, toggleForm] = useState(false)
  const { isDarkColorScheme } = useColorScheme()

  const { selectedGroup, setSelectedGroup, userId, setUserId } = useGroupStore()
  const { expoPushToken } = useNotifications()

  const groups = useQuery(convexApi.groups.get)

  const createUser = useMutation(convexApi.users.create)

  const {
    startTrackingWithRetry,
    stopBackgroundTracking,
    isTracking,
    isPendingTracking,
    error,
  } = useLocationHandler()

  useEffect(() => {
    if (!userId && expoPushToken) {
      createUser({ pushToken: expoPushToken })
        .then((newUserId) => {
          setUserId(newUserId)
        })
        .catch(console.error)
    }
  }, [userId, expoPushToken])

  const handleTracking = async () => {
    if (isTracking || isPendingTracking) {
      await stopBackgroundTracking()
    } else {
      await startTrackingWithRetry()
    }
  }

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page", headerShown: false }} />
      <View className="flex h-full w-full flex-col items-stretch justify-between gap-4 bg-background">
        <View>
          <Image
            source={isDarkColorScheme ? logoDarkImg : logoImg}
            className="mx-auto w-full"
            resizeMode="contain"
          />
          <Text className="text-center text-xl font-semibold text-foreground">
            L'appli carnavalier·es
          </Text>
        </View>

        {!isTracking && !isPendingTracking && (
          <>
            <View className="px-4">
              <Text className="mb-2 text-xl font-semibold text-foreground">
                1 - Sélectionne ton groupe
              </Text>
              <View>
                <Picker
                  selectedValue={selectedGroup ?? undefined}
                  onValueChange={setSelectedGroup}
                >
                  {groups
                    ?.sort((a, b) => a.title.localeCompare(b.title))
                    .map((group) => (
                      <PickerItem
                        label={group.title.toUpperCase()}
                        value={group._id}
                        key={group._id}
                        className="text-background"
                      />
                    ))}
                </Picker>
              </View>
              {!formVisible && (
                <Pressable
                  onPress={() => toggleForm(true)}
                  className="group my-4"
                >
                  <Text className="text-right text-lg text-foreground group-active:text-primary">
                    Pas dans la liste ?{" "}
                    <Text className="font-semibold text-primary group-active:text-primary-foreground dark:text-primary-foreground">
                      Ajoute le
                    </Text>
                  </Text>
                </Pressable>
              )}
            </View>
            <View className="px-4">
              {formVisible && (
                <NewGroupForm
                  groups={groups}
                  setGroup={setSelectedGroup}
                  toggleForm={() => toggleForm(false)}
                />
              )}
            </View>
          </>
        )}
        <TrackingStatus
          isTracking={isTracking}
          isPendingTracking={isPendingTracking}
          selectedGroup={selectedGroup}
          groups={groups}
          error={error}
        />
        {!formVisible && (
          <View className="p-4">
            {error && (
              <Text className="my-4 text-center text-sm font-semibold text-destructive">
                {error}
              </Text>
            )}
            {!isTracking && !isPendingTracking && (
              <Text className="mx-4 text-xl font-semibold text-foreground">
                2 - Partage ta localisation en direct
              </Text>
            )}
            <Pressable
              className={cn(
                "transform-all mt-4 rounded px-3 py-8 active:bg-primary-foreground",
                selectedGroup !== null ? "bg-primary" : "bg-primary/40",
                (isTracking || isPendingTracking) &&
                  "border border-destructive bg-transparent active:bg-destructive",
              )}
              onPress={handleTracking}
            >
              <Text
                className={cn(
                  "text-center",
                  selectedGroup === null
                    ? "text-muted-foreground"
                    : "text-white",
                  (isPendingTracking || isTracking) && "text-destructive",
                )}
              >
                {selectedGroup !== null
                  ? isTracking || isPendingTracking
                    ? "Arrêter le partage"
                    : "Partage ta localisation"
                  : "Sélectionne ton groupe d'abord"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
