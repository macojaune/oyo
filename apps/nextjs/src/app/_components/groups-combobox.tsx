"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Doc } from "@oyo/convex"
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
  selectedGroup: value,
  onValueChange,
}: {
  groups: Doc<"groups">[]
}) {
  const [open, setOpen] = React.useState(false)
  const [openAddDialog, setShowAddDialog] = React.useState(false)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? groups.find((d) => d._id === value)?.title
              : "Selectionne un groupe..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Trouver un groupe..." />
            <CommandList>
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
                      onValueChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === group._id ? "opacity-100" : "opacity-0",
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
        onSuccess={() => {
          setOpen(true)
        }}
      />
    </>
  )
}
