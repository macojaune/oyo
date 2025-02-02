import { useEffect, useRef } from "react"
import { Animated, Text, View } from "react-native"
import { Path, Svg } from "react-native-svg"

import type { Doc, Id } from "@oyo/convex"
import { cn } from "@oyo/ui"

import { useColorScheme } from "~/lib/useColorScheme"

interface ActiveTrackingProps {
  selectedGroup: Id<"groups"> | null
  groups: Doc<"groups">[] | undefined
  error?: string
}

export function ActiveTracking({
  selectedGroup,
  groups,
  error,
}: ActiveTrackingProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const { colors } = useColorScheme()
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <View className="px-4">
      <View className="items-center">
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Svg
            width="160"
            height="160"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
            color={colors.primary}
          >
            <Path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              fill="currentColor"
            />
            <Path
              d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </View>
      <Text
        className={cn(
          "mt-4 text-center text-2xl font-semibold dark:text-foreground",
        )}
      >
        Partage de ta position en cours
      </Text>
      <Text className="mt-4 text-center text-xl font-semibold text-primary dark:text-foreground">
        Groupe :{" "}
        {groups
          ?.find((group) => group._id === selectedGroup)
          ?.title.toUpperCase()}{" "}
      </Text>
      <Text className="mt-4 text-center text-sm italic text-foreground">
        Tu peux réduire l'app sans soucis et profiter de ton Mas.
      </Text>
      {error && (
        <Text className="mt-4 text-center text-xl font-semibold text-destructive">
          {error}
        </Text>
      )}
    </View>
  )
}
