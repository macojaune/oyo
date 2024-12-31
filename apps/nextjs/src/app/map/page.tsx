"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "../../hooks/useGeolocation";
            import { Sidebar } from "../_components/map/sidebar";
            import { NavigationBar } from "../_components/map/navigation-bar";
            import { AddPositionButton } from "../_components/map/add-position-button";

const MapComponent = dynamic(() => import("../_components/map/map-component"), {
  loading: () => <div className="h-screen w-full bg-slate-100 animate-pulse" />,
  ssr: false
});

export default function MapPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { position } = useGeolocation();

  return (
    <div className="h-screen w-full relative">
      <NavigationBar />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
        />

        <main className="flex-1 relative">
          <MapComponent
            userPosition={position}
            selectedGroup={selectedGroup}
            onGroupSelect={setSelectedGroup}
          />
          <AddPositionButton position={position} />
        </main>
      </div>
    </div>
  );
}
