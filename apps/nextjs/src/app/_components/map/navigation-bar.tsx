"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@oyo/ui/button"
import { ThemeToggle } from "@oyo/ui/theme"

export function NavigationBar({
  toggleSidebar,
}: {
  toggleSidebar?: () => void
}) {
  return (
    <header className="h-16 border-b bg-background">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button> */}
          <Link href="/">
            <h1 className="text-xl font-bold hover:opacity-70">
              O Mas La ? <small className="text-sm">- La carte</small>
            </h1>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:max-w-md">
          {/* <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un groupe..." className="pl-9" />
          </div>*/}
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  )
}
