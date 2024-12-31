import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";
import { Button } from "@oyo/ui/button";
import { Card } from "@oyo/ui/card";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Share2,
  Map,
  Bell,
  Wifi,
  Camera,
  Clock,
} from "lucide-react";

// export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  void api.post.all.prefetch();

  return (
    <HydrateClient>
      <main className=" min-h-screen">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 to-purple-900/90 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="text-6xl md:text-8xl font-bold text-white mb-4">
              O Mas La ?
            </span>
            <h1 className="text-5xl md:text-7xl text-white mb-6">
              Suivez votre carnaval en temps réel!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Ne manquez plus aucun groupe grâce à la géolocalisation en direct
            </p>
            <Link href="/map"><Button size="lg" >Voir la carte</Button></Link>
          </div>
        </section>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <AuthShowcase />
          <CreatePostForm />
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
            >
              <PostList />
            </Suspense>
          </div>
        </div>
        {/* Hero Section */}

        {/* How it Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MapPin className="h-12 w-12 text-purple-600" />,
                  title: "Trouvez vos groupes",
                  description:
                    "Consultez la carte interactive pour localiser tous les groupes du carnaval en temps réel",
                },
                {
                  icon: <Navigation className="h-12 w-12 text-purple-600" />,
                  title: "Suivez les déplacements",
                  description:
                    "Sélectionnez vos groupes préférés et suivez leurs parcours en direct",
                },
                {
                  icon: <Share2 className="h-12 w-12 text-purple-600" />,
                  title: "Partagez votre position",
                  description:
                    "Vous êtes membre d'un groupe ? Partagez votre position pour que vos fans puissent vous suivre",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pour les Membres Section */}
        <section className="py-20">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1581974944026-5d6ed762f617?auto=format&fit=crop&q=80")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-900/90 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4">Carvanavalier·e ?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Télécharge l'application et partage la position de ton groupe en
                direct.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Plus précis",
                  "Plus facile à utiliser",
                  "Plus de visibilité",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button size="lg">Télécharger l'application</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              Fonctionnalités
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { icon: <Map />, title: "Carte interactive" },
                { icon: <Navigation />, title: "Positions en temps réel" },
                { icon: <Clock />, title: "Historique des parcours" },
                { icon: <Camera />, title: "Photos des groupes" },
                { icon: <Bell />, title: "Notifications de proximité" },
                { icon: <Wifi />, title: "Mode hors connexion" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-purple-100">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <p className="text-center mb-8 text-lg font-mono">
            Tambouriné avec ❤️ par{" "}
            <a href="https://marvinl.com" target="_blank">
              MarvinL.com
            </a>
          </p>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>contact@marvinl.com</li>
                  <li>+33 1 23 45 67 89</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Légal</h3>
                <ul className="space-y-2">
                  <li>Mentions légales</li>
                  <li>Politique de confidentialité</li>
                  <li>CGU</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Réseaux sociaux</h3>
                <ul className="space-y-2">
                  <li>Facebook</li>
                  <li>Twitter</li>
                  <li>Instagram</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Application Carnavalier·e
                </h3>
                <ul className="space-y-2">
                  <li>App Store</li>
                  <li>Google Play</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 | O Mas La ? − Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
