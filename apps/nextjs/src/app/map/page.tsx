"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

import { Id } from "@oyo/convex"

import { AddPositionButton } from "../_components/map/add-position-button"
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
    <div className="relative h-screen w-full">
      <NavigationBar />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
          selectedGroup={selectedGroup}
          onGroupSelect={toggleSelectedGroup}
        />

        <main className="relative flex-1">
          <MapComponent
            userPosition={position}
            selectedGroup={selectedGroup}
            onGroupSelect={toggleSelectedGroup}
          />
          <AddPositionButton position={position} />
        </main>
      </div>
    </div>
  )
}
