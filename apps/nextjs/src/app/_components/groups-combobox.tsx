"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import type { Doc, Id } from "@oyo/convex"
import { cn } from "@oyo/ui"
import { Button } from "@oyo/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@oyo/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@oyo/ui/popover"

import { AddGroupDialog } from "./add-group-dialog"

export function GroupCombobox({
  groups,
  selectedGroup,
  onValueChange,
}: {
  groups: Doc<"groups">[]
  selectedGroup: Id<"groups"> | null
  onValueChange: (groupId: Id<"groups">) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const [openAddDialog, setShowAddDialog] = useState(false)

  return (
    <>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            {selectedGroup
              ? groups.find((d) => d._id === selectedGroup)?.title
              : "Selectionne un groupe..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0">
          <Command>
            <CommandInput placeholder="Trouver un groupe..." />

            <CommandList className="z-50">
              <CommandEmpty>
                Aucun groupe trouvé.
                <Button
                  variant="link"
                  onClick={() => {
                    setOpen(false)
                    setShowAddDialog(true)
                  }}
                >
                  Ajouter un groupe
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {groups.map((group) => (
                  <CommandItem
                    key={group._id}
                    value={group._id}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue as Id<"groups">)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedGroup === group._id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {group.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AddGroupDialog
        open={openAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={(groupId: Id<"groups">) => {
          onValueChange(groupId)
          setOpen(true)
        }}
      />
    </>
  )
}
