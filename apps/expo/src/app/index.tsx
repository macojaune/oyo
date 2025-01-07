import { useEffect, useState } from "react"
import { Button, Pressable, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link, Stack } from "expo-router"
import { useMutation, useQuery } from "convex/react"

import type { Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"
import { cn } from "@oyo/ui"

import { Picker, PickerItem } from "~/components/nativewindui/Picker"
import { useGroupStore } from "~/lib/store"
import { useLocationHandler } from "~/lib/useLocation"

export default function Index() {
  const { selectedGroup, setSelectedGroup, userId, setUserId } = useGroupStore()
  const [formVisible, toggleForm] = useState(false)
  const [groupTitle, setGroupTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const groups = useQuery(convexApi.groups.get)
  const createGroup = useMutation(convexApi.groups.create)

  const addUser = useMutation(convexApi.users.add)
  const deleteUser = useMutation(convexApi.users.remove)

  const {
    startBackgroundTracking,
    stopBackgroundTracking,
    isTracking,
    error,
    loading,
  } = useLocationHandler()
  useEffect(() => {
    if (!userId) {
      setUserId()
    }
  }, [])

  const handleTracking = () => {
    if (isTracking) {
      stopBackgroundTracking()
      deleteUser({ userId })
    } else {
      startBackgroundTracking()
      addUser({ userId, group: selectedGroup })
    }
  }
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page", headerShown: false }} />
      <View className="flex h-full w-full flex-col items-stretch justify-evenly gap-4 bg-background p-4">
        <View>
          <Text className="mb-0 text-center text-5xl font-bold text-foreground">
            O Mas La ?
          </Text>
          <Text className="text-center text-xl text-primary">
            L'appli carnavalier·es
          </Text>
        </View>

        {/* <MobileAuth /> */}

        {!isTracking && (
          <>
            <View className="">
              <Text className="text-xl font-semibold text-foreground">
                1 - Sélectionne ton groupe
              </Text>
              <View>
                <Picker
                  selectedValue={selectedGroup}
                  onValueChange={setSelectedGroup}
                  style={{ width: "100%", color: "white" }}
                >
                  {groups
                    ?.sort((a, b) => a.title.localeCompare(b.title))
                    .map((group) => (
                      <PickerItem
                        label={group.title.toUpperCase()}
                        value={group._id}
                        key={group._id}
                      />
                    ))}
                </Picker>
              </View>
              {!formVisible && (
                <Pressable onPress={() => toggleForm(true)} className="my-4">
                  <Text className="text-right text-lg text-foreground">
                    Pas dans la liste ?{" "}
                    <Text className="font-semibold text-primary">
                      Ajoute le
                    </Text>
                  </Text>
                </Pressable>
              )}
            </View>
            <View>
              {formVisible && (
                <View className="my-4 flex flex-col gap-2 rounded-lg bg-card-foreground p-4">
                  <Text className="mb-2 text-xl font-semibold text-primary">
                    Ajoute ton groupe
                  </Text>
                  <TextInput
                    className="items-center rounded-md border border-input px-3 py-4 text-lg leading-[1.25] placeholder:text-muted-foreground"
                    value={groupTitle}
                    onChangeText={setGroupTitle}
                    placeholder="Nom du groupe"
                  />
                  <Pressable
                    className="mt-4 rounded bg-primary px-3 py-4"
                    onPress={async () => {
                      setIsLoading(true)
                      const id = await createGroup({
                        title: groupTitle,
                      })
                      setGroupTitle("")
                      setSelectedGroup(id)
                      setIsLoading(false)
                      toggleForm(false)
                    }}
                  >
                    <Text className={"text-center text-foreground"}>
                      {isLoading ? "Ajout en cours…" : "Ajouter"}
                    </Text>
                  </Pressable>
                  <Pressable
                    className="px-3 py-4"
                    onPress={() => {
                      toggleForm(false)
                    }}
                  >
                    <Text className={"text-center text-background"}>
                      Annuler
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}
        {isTracking && (
          <View>
            <Text
              className={cn(
                "mt-4 text-center text-2xl font-semibold dark:text-foreground",
              )}
            >
              Partage de ta position en cours
            </Text>
            <Text className="mt-4 text-center text-xl font-semibold text-primary">
              Groupe :{" "}
              {groups
                .find((group) => group._id === selectedGroup)
                ?.title.toUpperCase()}{" "}
            </Text>
            <Text className="mt-4 text-center text-sm italic text-foreground">
              Tu peux réduire l'app sans soucis et profiter de ton Mas.
            </Text>
            {error && (
              <Text className="mt-4 text-center text-xl font-semibold text-destructive-foreground">
                {error}
              </Text>
            )}
          </View>
        )}
        <View>
          {!isTracking && (
            <Text className="mt-4 text-xl font-semibold text-foreground">
              2 - Partage ta localisation en direct
            </Text>
          )}
          <Pressable
            className={cn(
              "mt-4 rounded px-3 py-4",
              selectedGroup !== null ? "bg-primary" : "bg-primary/40",
              isTracking && "bg-foreground",
            )}
            onPress={handleTracking}
          >
            <Text
              className={cn(
                "text-center",
                selectedGroup === null
                  ? "text-muted-foreground"
                  : "text-foreground",
                isTracking && "text-background",
              )}
            >
              {selectedGroup !== null
                ? isTracking
                  ? "Arrêter le partage"
                  : "Partage ta localisation"
                : "Sélectionne ton groupe d'abord"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
