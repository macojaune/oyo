"use client"

import { useQuery } from "convex/react"

import type { Id } from "@oyo/convex"
import { api as convexApi } from "@oyo/convex"
import { ScrollArea } from "@oyo/ui/scroll-area"

import { AddPositionButton } from "./add-position-button"
import { GroupCard } from "./group-card"
import { SponsorBlock } from "./sponsor-block"

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

  return (
    <div
      className={`w-full border-r bg-background lg:relative ${isOpen ? "h-[45dvh] lg:w-80" : "h-0 lg:w-0"} transition-all duration-300 lg:h-full`}
    >
      {isOpen && (
        <div className="flex h-full flex-col p-4 pb-20 lg:pb-4">
          <div className="flex flex-row justify-between">
            <h2 className="mb-4 text-xl font-bold">Groupes</h2>
            {/* <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={onToggle}
            >
              {isOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button> */}
          </div>
          <ScrollArea className="">
            <div className="space-y-2">
              {groups &&
                Object.values(groups)
                  .sort(
                    (a, b) =>
                      b.positions[0]?._creationTime -
                      a.positions[0]?._creationTime,
                  )
                  .map((group) => (
                    <GroupCard
                      key={group._id}
                      group={group}
                      isSelected={group._id === selectedGroup}
                      onClick={() => onGroupSelect(group._id)}
                    />
                  ))}
              {groups && Object.values(groups).length === 0 && (
                <div className="text-center text-sm text-purple-400">
                  Aucune position ajoutée récemment.
                </div>
              )}
            </div>
          </ScrollArea>
          {/* <SponsorBlock/> */}
          <AddPositionButton />
        </div>
      )}
    </div>
  )
}
