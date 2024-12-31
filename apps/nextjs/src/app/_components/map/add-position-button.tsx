"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@oyo/ui/button";
import { AddPositionDialog } from "./add-position-dialog";
// import { useGroups } from "@/hooks/useGroups";
import { calculateDistance } from "~/lib/geo-utils";

interface AddPositionButtonProps {
  position?: GeolocationPosition;
}

export function AddPositionButton({ position }: AddPositionButtonProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [nearbyGroups, setNearbyGroups] = useState<any[]>([]);
  // const { groups } = useGroups();
                            const groups=[]

  useEffect(() => {
    if (!position || !groups) return;

    const nearby = groups.filter(group =>
      calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        group.latitude,
        group.longitude
      ) <= 100 // 100 meters
    );

    setNearbyGroups(nearby);
  }, [position, groups]);

  if (!nearbyGroups.length) return null;

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700"
        onClick={() => setDialogOpen(true)}
      >
        <MapPin className="mr-2 h-5 w-5" />
        Ajouter une position
      </Button>

      <AddPositionDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        position={position}
        nearbyGroups={nearbyGroups}
      />
    </>
  );
}
