"use client"

import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { Check, ChevronsUpDown } from "lucide-react"

import { api as convexApi } from "@oyo/convex"
import type { Doc, Id } from "@oyo/convex"
import { Button } from "@oyo/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@oyo/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@oyo/ui/dialog"
import { Label } from "@oyo/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@oyo/ui/popover"
import { toast } from "@oyo/ui/toast"
import { cn } from "@oyo/ui"

import { useGeolocation } from "~/hooks/useGeolocation"

interface AddPositionDialogProps {
  isOpen: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  openAddGroupDialog: () => void
  selectedGroup: Id<"groups"> | null
  setSelectedGroup: Dispatch<SetStateAction<Id<"groups"> | null>>
}

export function AddPositionDialog({
  isOpen,
  onOpenChange,
  openAddGroupDialog,
  selectedGroup,
  setSelectedGroup,
}: AddPositionDialogProps) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const groups = useQuery(convexApi.groups.get)
  const doSendPosition = useMutation(convexApi.positions.sendPosition)
  const { position } = useGeolocation()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!position || !selectedGroup) return

    setSubmitting(true)
    try {
      await doSendPosition({
        groupId: selectedGroup,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        fromApp: false,
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95dvw] sm:max-w-[425px]">
        <DialogHeader className="mb-4 text-left sm:mb-8 sm:text-center">
          <DialogTitle>Mettre à jour la position d'un groupe</DialogTitle>
          <DialogDescription>
            Sélectionne le groupe à proximité pour partager sa position sur la
            carte.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="group">Groupe</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedGroup
                  ? groups?.find((group) => group._id === selectedGroup)?.title.toUpperCase()
                  : "Sélectionner un groupe"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="overflow-scroll max-h-[330px]">
                <CommandInput placeholder="Rechercher un groupe..." />
                <CommandEmpty> <p className=" text-sm">
            Pas dans la liste ?{" "}
            <Button
              onClick={() => openAddGroupDialog()}
              variant="link"
              className="ml-2 p-0"
            >
              Ajoute-le
            </Button>
          </p> </CommandEmpty>
                <CommandGroup className="overflow-scroll">
                  {groups
                    ?.filter((group) => !group.isLive)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((group) => (
                      <CommandItem
                        key={group._id}
                        value={group.title}
                        onSelect={() => {
                          setSelectedGroup(group._id)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedGroup === group._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {group.title.toUpperCase()}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {/* */}
        </div>

        <DialogFooter className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mettre à jour
          </Button>
        </DialogFooter>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  )
}
