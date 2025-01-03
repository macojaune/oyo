"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

import type { Id } from "@oyo/convex"

import { NavigationBar } from "../_components/map/navigation-bar"
import { Sidebar } from "../_components/map/sidebar"
import { useGeolocation } from "../../hooks/useGeolocation"

const MapComponent = dynamic(() => import("../_components/map/map-component"), {
  loading: () => <div className="h-screen w-full animate-pulse bg-slate-100" />,
  ssr: false,
})

export default function MapPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const { position } = useGeolocation()
  const toggleSelectedGroup = (id: Id<"groups">) => {
    setSelectedGroup((prev) => (prev !== id ? id : null))
  }

  return (
    <div className="relative h-auto w-full lg:h-screen">
      <NavigationBar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

      <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
        <div className="order-2 lg:order-1">
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setSidebarOpen(!isSidebarOpen)}
            selectedGroup={selectedGroup}
            onGroupSelect={toggleSelectedGroup}
          />
        </div>

        <main className="relative order-1 flex-1 lg:order-2">
          <MapComponent
            userPosition={position}
            selectedGroup={selectedGroup}
            onGroupSelect={toggleSelectedGroup}
          />
        </main>
      </div>
    </div>
  )
}
