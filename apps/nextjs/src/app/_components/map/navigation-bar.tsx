"use client";

import { Search, Menu } from "lucide-react";
import { Input } from "@oyo/ui/input";
import { Button } from "@oyo/ui/button";
import { ThemeToggle } from "@oyo/ui/theme";
import Link from "next/link";

export function NavigationBar() {
  return (
    <header className="h-16 border-b bg-background">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/">
            <h1 className="text-xl font-bold">O Mas La ? <small>- La carte</small></h1>
          </Link>
        </div>

        <div className="flex items-center gap-4 max-w-md flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un groupe..." className="pl-9" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
