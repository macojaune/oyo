import AsyncStorage from "@react-native-async-storage/async-storage"

import type { Id } from "@oyo/convex"

import "react-native-get-random-values"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useGroupStore = create<{
  selectedGroup: Id<"groups"> | null
  setSelectedGroup: (groupId: Id<"groups">) => void
  userId: Id<"users"> | null
  setUserId: (id: Id<"users">) => void
  hasSeenIntro: boolean
  setHasSeenIntro: (seen: boolean) => void
}>()(
  persist(
    (set) => ({
      selectedGroup: null,
      setSelectedGroup: (groupId) => set({ selectedGroup: groupId }),
      userId: null,
      setUserId: (id) => set({ userId: id }),
      hasSeenIntro: false,
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
    }),
    {
      name: "omasla-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
