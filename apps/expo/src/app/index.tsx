import { useCallback } from "react"
import { Image, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { Redirect, Stack, useRouter } from "expo-router"
import logoDarkImg from "assets/logo-dark.png"
import logoImg from "assets/logo.png"

import { useGroupStore } from "~/lib/store"
import { useColorScheme } from "~/lib/useColorScheme"

export default function IntroScreen() {
  const router = useRouter()
  const { hasSeenIntro, setHasSeenIntro } = useGroupStore()

  const handleContinue = useCallback(async () => {
    setHasSeenIntro(true)
    router.replace("/home")
  }, [router, setHasSeenIntro])

  const { isDarkColorScheme } = useColorScheme()

  if (hasSeenIntro) return <Redirect href="/home" />

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex h-full w-full flex-col items-stretch justify-between gap-4 bg-background px-4">
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
        <ScrollView className="p-5" contentContainerClassName="pb-16">
          <Text className="mb-8 text-center text-xl font-bold text-foreground">
            Bienvenue sur l'appli O Mas La ?
          </Text>

          <View className="mb-8">
            <Text className="mb-3 text-2xl font-semibold text-foreground">
              Cette appli est destinée aux carnavalier·es qui déboulent !{" "}
            </Text>
            <Text className="text-base leading-6 text-foreground">
              Si tu veux juste suivre la position des groupes, rends toi sur le
              site directement{" "}
              <Text
                onPress={() => Linking.openURL("https://omasla.fr/map")}
                className="font-semibold text-foreground underline underline-offset-8 active:text-primary"
              >
                clique ici
              </Text>
            </Text>
            <Text className="text-sm italic text-muted-foreground">
              (Tu peux désinstaller l'application)
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Autorisations requises
            </Text>
            <Text className="mb-2 text-base leading-6 text-foreground">
              Pour fonctionner correctement, l'application a besoin d'accéder à
              ta position.
            </Text>
            <Text className="mb-2 ml-4 text-base leading-6 text-foreground">
              Pense à bien sélectionner{" "}
              <Text className="text-semibold">"Toujours"</Text> pour les deux
              autorisations, sinon l'application ne pourra pas fonctionner en
              arrière plan.
            </Text>
            <Text className="mb-1 ml-4 text-base leading-6 text-foreground">
              Rassure-toi on accède à ta localisation uniquement quand TU le
              décides ET pendant 3h max{" "}
              <Text className="text-sm italic">(durée d'un déboulé moyen)</Text>
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              Comment ça marche ?
            </Text>
            <Text className="mb-1 ml-2 text-base leading-6 text-foreground">
              • Sélectionnez un groupe dans la liste
            </Text>
            <Text className="mb-1 ml-2 text-base leading-6 text-foreground">
              • Appuyez sur le bouton de localisation pour partager ta position
            </Text>
            <Text className="mb-1 ml-2 text-base leading-6 text-foreground">
              • Profite de ton mas !
            </Text>
          </View>
          <Text className="text-center text-sm italic text-destructive">
            Lis bien, tu ne verras cet écran qu'une seule fois
          </Text>
        </ScrollView>
        <Pressable
          onPress={handleContinue}
          className="mt-auto w-full bg-primary px-4 py-8"
        >
          <Text className="text-center text-white dark:text-foreground">
            C'est parti !
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
