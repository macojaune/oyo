"use client"

import { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { MapPin } from "lucide-react"

import { api as convexApi, Id } from "@oyo/convex"
import { Button } from "@oyo/ui/button"

import { calculateDistance } from "~/lib/geo-utils"
import { type Group } from "~/lib/map-utils"
import { AddGroupDialog } from "../add-group-dialog"
import { AddPositionDialog } from "./add-position-dialog"

export function AddPositionButton() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isGroupDialogOpen, setGroupDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Id<"groups"> | null>(null)

  // const [nearbyGroups, setNearbyGroups] = useState<any[]>([])
  // const groups = useQuery(convexApi.positions.byGroups) as Record<
  //   Id<"groups">,
  //   Group
  // >
  // useEffect(() => {
  //   if (!position || !groups) return

  //   const nearby = Object.values(groups).filter(
  //     (group) =>
  //       calculateDistance(
  //         position.coords.latitude,
  //         position.coords.longitude,
  //         group.positions[0].latitude,
  //         group.positions[0].longitude,
  //       ) <= 100, // 100 meters
  //   )

  //   setNearbyGroups(nearby)
  // }, [position, groups])

  // if (!nearbyGroups.length) return null

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-0 left-0 w-full rounded-none bg-purple-600 py-8 text-white hover:bg-purple-700 lg:relative lg:mt-auto lg:w-auto lg:rounded-sm lg:py-0"
        onClick={() => setDialogOpen(true)}
      >
        <MapPin className="mr-2 h-5 w-5" />
        Ajouter une position
      </Button>

      <AddPositionDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        openAddGroupDialog={() => {
          setGroupDialogOpen(true)
        }}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <AddGroupDialog
        isOpen={isGroupDialogOpen}
        onOpenChange={setGroupDialogOpen}
        onSuccess={(groupId: Id<"groups">) => {
          setSelectedGroup(groupId)
          setDialogOpen(true)
          setGroupDialogOpen(false)
        }}
      />
    </>
  )
}
