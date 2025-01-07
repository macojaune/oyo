import AsyncStorage from "@react-native-async-storage/async-storage"

import "react-native-get-random-values"

import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useGroupStore = create(
  persist(
    (set) => ({
      selectedGroup: null,
      setSelectedGroup: (groupId) => set({ selectedGroup: groupId }),
      userId: null,
      setUserId: () => set({ userId: uuidv4() }),
    }),
    {
      name: "omasla-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
