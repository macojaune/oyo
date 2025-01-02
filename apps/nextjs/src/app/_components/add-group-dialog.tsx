"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { Loader2 } from "lucide-react"

import { api } from "@oyo/convex"
import { Button } from "@oyo/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@oyo/ui/dialog"
import { Input } from "@oyo/ui/input"
import { Label } from "@oyo/ui/label"
import { toast } from "@oyo/ui/toast"

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddGroupDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddGroupDialogProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const createGroup = useMutation(api.groups.create)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      await createGroup({ title: title.trim() })
      toast.success("Groupe créé avec succès")
      onSuccess?.()
      onOpenChange(false)
      setTitle("")
    } catch (error) {
      toast.error("Erreur lors de la création du groupe")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau groupe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nom du groupe</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Les Matadors"
            />
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
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
