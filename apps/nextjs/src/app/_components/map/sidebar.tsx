"use client"

import { useQuery } from "convex/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"
import { Button } from "@oyo/ui/button"
import { ScrollArea } from "@oyo/ui/scroll-area"

import { useGeolocation } from "~/hooks/useGeolocation"
import { AddPositionButton } from "./add-position-button"
import { GroupCard } from "./group-card"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  selectedGroup: string | null
  onGroupSelect: (groupId: Id<"groups">) => void
}

export function Sidebar({
  isOpen,
  onToggle,
  selectedGroup,
  onGroupSelect,
}: SidebarProps) {
  const groups = useQuery(convexApi.positions.byGroups)
  const { position } = useGeolocation()

  return (
    <div
      className={`relative border-r bg-background ${isOpen ? "w-80" : "w-0"} transition-all duration-300`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="z-100 absolute -right-10 top-2"
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      {isOpen && (
        <div className="flex h-full flex-col p-4">
          <h2 className="mb-4 text-xl font-bold">Groupes</h2>
          <ScrollArea className="h-30">
            <div className="space-y-2">
              {groups &&
                Object.values(groups).map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                    isSelected={group._id === selectedGroup}
                    onClick={() => onGroupSelect(group._id)}
                  />
                ))}
            </div>
          </ScrollArea>
          <AddPositionButton position={position} />
        </div>
      )}
    </div>
  )
}
