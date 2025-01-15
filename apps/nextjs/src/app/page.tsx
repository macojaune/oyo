"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Navigation, Share2 } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@oyo/ui/button"
import { Card } from "@oyo/ui/card"
import { ThemeToggle } from "@oyo/ui/theme"

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.post.all.prefetch()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  return (
    // <HydrateClient>
    <main className="min-h-screen">
      <div className="fixed bottom-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg.jpeg"
            alt="background"
            width={2048}
            height={1638}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 to-purple-900/80 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="mb-4 text-6xl font-bold text-white md:text-8xl">
            O Mas La ?
          </span>
          <h1 className="mb-6 text-5xl text-white md:text-7xl">
            Suivez votre carnaval en temps réel!
          </h1>
          <p className="mb-8 text-xl text-white/90 md:text-2xl">
            Ne manquez plus aucun groupe grâce à la géolocalisation en direct
          </p>
          <Link href="/map">
            <Button
              size="lg"
              variant={isDark ? "primary" : "secondary"}
              className="dark:text-white"
            >
              Voir la carte
            </Button>
          </Link>
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto flex flex-col items-center gap-16 px-4">
          <h2 className="text-center text-4xl font-bold">
            Comment ça marche ?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <MapPin className="h-12 w-12 text-purple-600" />,
                title: "Trouve tes groupes",
                description:
                  "Consulte la carte interactive pour localiser les groupes en temps réel",
              },
              {
                icon: <Navigation className="h-12 w-12 text-purple-600" />,
                title: "Suivez les déplacements",
                description:
                  "Sélectionne tes groupes préférés et suis leurs parcours en direct",
              },
              {
                icon: <Share2 className="h-12 w-12 text-purple-600" />,
                title: "Partage ta position",
                description:
                  "Collabore au projet en partageant la position des groupes à proximité",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </Card>
            ))}
          </div>
          <Link href="/map">
            <Button
              size="lg"
              variant={!isDark ? "primary" : "outline"}
              className="dark:text-white"
            >
              <MapPin className="mr-2 h-6 w-6" />
              Accède à la carte
            </Button>
          </Link>
        </div>
      </section>

      {/* Pour les Membres Section */}
      <section className="bg-secondary py-20 dark:bg-secondary-foreground">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-900/90 backdrop-blur-sm" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Carnavalier·e ?</h2>
            <p className="mb-8 text-xl text-gray-400">
              Télécharge l'application et partage la position de ton groupe en
              direct.
            </p>
            <div className="mb-8 flex flex-col items-center justify-center space-y-4">
              {[
                "Plus précis",
                "Plus facile à utiliser",
                "Plus de visibilité",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex w-1/3 items-center justify-start gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <p className="text-lg text-gray-500">{benefit}</p>
                </div>
              ))}
            </div>
            <Button size="lg" disabled className="bg-purple-500">
              Bientôt disponible
            </Button>
          </div>
        </div>
      </section>

      {/* {/* Features Section 
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-4xl font-bold">
              Fonctionnalités
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {[
                { icon: <Map />, title: "Carte interactive" },
                { icon: <Navigation />, title: "Positions en temps réel" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-purple-400 p-4">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <p className="mb-8 text-center font-mono text-lg">
          Tambouriné avec ❤️ par
          <a href="https://marvinl.com" target="_blank">
            <Button variant="link">MarvinL.com</Button>
          </a>
        </p>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <ul className="space-y-2">
                <li>contact@marvinl.com</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/mentions-legales">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/politique-de-confidentialite">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cgu">CGU</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Application Carnavalier·e (à venir)
              </h3>
              <ul className="space-y-2">
                <li>App Store</li>
                <li>Google Play</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 | O Mas La ? − Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
    // </HydrateClient>
  )
}
