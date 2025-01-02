"use client"

import { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { MapPin } from "lucide-react"

import { api as convexApi, Id } from "@oyo/convex"
import { Button } from "@oyo/ui/button"

import { calculateDistance } from "~/lib/geo-utils"
import { type Group } from "~/lib/map-utils"
import { AddPositionDialog } from "./add-position-dialog"

interface AddPositionButtonProps {
  position?: GeolocationPosition
}

export function AddPositionButton({ position }: AddPositionButtonProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [nearbyGroups, setNearbyGroups] = useState<any[]>([])
  const groups = useQuery(convexApi.groups.get)
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
        className="mt-auto bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => setDialogOpen(true)}
      >
        <MapPin className="mr-2 h-5 w-5" />
        Ajouter une position
      </Button>

      <AddPositionDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        position={position}
        groups={groups}
      />
    </>
  )
}
