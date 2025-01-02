"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { Camera, Loader2 } from "lucide-react"

import { api as convexApi, Doc, Id } from "@oyo/convex"
import { Button } from "@oyo/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@oyo/ui/dialog"
import { Input } from "@oyo/ui/input"
import { Label } from "@oyo/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@oyo/ui/select"
import { Textarea } from "@oyo/ui/textarea"
import { toast } from "@oyo/ui/toast"

interface AddPositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position?: GeolocationPosition
  groups: Doc<"groups">[]
}

export function AddPositionDialog({
  open,
  onOpenChange,
  position,
  groups,
}: AddPositionDialogProps) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Id<"groups"> | null>(null)
  const doSendPosition = useMutation(convexApi.positions.sendPosition)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!position || !selectedGroup) return

    setSubmitting(true)
    try {
      await doSendPosition({
        groupId: selectedGroup,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      toast.success("La position du groupe a été mise à jour avec succès.")
      onOpenChange(false)
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mettre à jour la position</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group">Groupe</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un groupe" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map((group) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
