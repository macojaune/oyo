import { View ,Text} from "react-native"

import type { Doc, Id } from "@oyo/convex"
import { cn } from "@oyo/ui"

interface PendingTrackingProps {
  selectedGroup: Id<"groups"> | null
  groups: Doc<"groups">[] | undefined
}

export function PendingTracking({
  selectedGroup,
  groups,
}: PendingTrackingProps) {
  return (
    <View className="px-4">
      <Text
        className={cn(
          "mt-4 text-center text-2xl font-semibold dark:text-foreground",
        )}
      >
        Une personne partage déjà sa position pour{" "}
        <Text className="text-center text-xl font-semibold text-primary">
          {groups
            ?.find((group) => group._id === selectedGroup)
            ?.title.toUpperCase()}
        </Text>
      </Text>
      <Text className="text-center text-lg text-foreground">
        Tu peux réduire l'app sans soucis et profiter de ton Mas.
      </Text>
      <Text className="text-center text-base text-foreground">
        On te met dans la file et on t'enverra une notif si besoin. Woulé!
      </Text>
    </View>
  )
}
