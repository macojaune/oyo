import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { useMutation } from "convex/react"

import type { Doc, Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"

export function NewGroupForm({
  groups,
  toggleForm,
  setGroup,
}: {
  groups: Doc<"groups">[]
  setGroup: Dispatch<SetStateAction<Id<"groups">>>
  toggleForm: () => void
}) {
  const [groupTitle, setGroupTitle] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const createGroup = useMutation(convexApi.groups.create)

  const handleSubmit = async () => {
    if (groupTitle === '') return
    if (groups.find(g => g.title.toLowerCase() === groupTitle.toLowerCase())) {
      setError('Ce groupe existe déjà.')
      return
    }
    setIsLoading(true)
    const id = await createGroup({
      title: groupTitle,
    })
    setGroupTitle("")
    setGroup(id)
    setIsLoading(false)
    toggleForm()
  }

  return (
    <View className="my-4 flex flex-col gap-2 rounded-lg bg-card-foreground p-4">
      <Text className="mb-2 text-xl font-semibold text-primary">
        Ajoute ton groupe
      </Text>
      <TextInput
        className="items-center rounded-md border border-input px-3 py-4 text-lg leading-[1.25] placeholder:text-muted-foreground text-white"
        value={groupTitle}
        onChangeText={setGroupTitle}
        placeholder="Nom du groupe"
      />
      <Pressable
        className="mt-4 rounded bg-primary px-3 py-4"
        onPress={handleSubmit}
      >
        <Text className="text-center text-white">
          {isLoading ? "Ajout en cours…" : "Ajouter"}
        </Text>
      </Pressable>
      <Pressable
        className="px-3 py-4 group"
        onPress={toggleForm}
      >
        <Text className="text-center text-background group-active:text-muted-foreground">Annuler</Text>
      </Pressable>
    </View>
  )
}
