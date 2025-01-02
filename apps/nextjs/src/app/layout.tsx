import type { Metadata, Viewport } from "next";
import { cn } from "@oyo/ui";
import { ThemeProvider, ThemeToggle } from "@oyo/ui/theme";
import { Toaster } from "@oyo/ui/toast";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { ConvexClientProvider } from "./convex-client-provider";
import "~/app/globals.css";

import { env } from "~/env";

const title = "O Mas la? - Trouve tes groupes a po préférés sans effort";
const description =
  "La solution pour suivre tes groupes de caranaval préférés, fini les dimanches soirs à courir" +
  " inutilement dans Pointe-à-pitre";
export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "O Mas La ?",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@macojaune",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ConvexClientProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </ConvexClientProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
