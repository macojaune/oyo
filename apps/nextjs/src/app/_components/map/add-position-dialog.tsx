"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@oyo/ui/dialog";
import { Button } from "@oyo/ui/button";
import { Input } from "@oyo/ui/input";
import { Label } from "@oyo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@oyo/ui/select";
import { Textarea } from "@oyo/ui/textarea";
import { toast } from "@oyo/ui/toast";

interface AddPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: GeolocationPosition;
  nearbyGroups: any[];
}

export function AddPositionDialog({
  open,
  onOpenChange,
  position,
  nearbyGroups
}: AddPositionDialogProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [crowdSize, setCrowdSize] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position || !selectedGroup) return;

    setSubmitting(true);
    try {
      // TODO: Implement position update logic with Supabase
      toast.success("La position du groupe a été mise à jour avec succès."
      );
      onOpenChange(false);
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour."
      );
    } finally {
      setSubmitting(false);
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
            <Select
              value={selectedGroup}
              onValueChange={setSelectedGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un groupe" />
              </SelectTrigger>
              <SelectContent>
                {nearbyGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crowdSize">Nombre de personnes (estimation)</Label>
            <Input
              id="crowdSize"
              type="number"
              value={crowdSize}
              onChange={e => setCrowdSize(e.target.value)}
              placeholder="Ex: 50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut (optionnel)</Label>
            <Textarea
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              placeholder="Ex: En déplacement vers la place centrale"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo (optionnel)</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Ajouter une photo
              </Button>
            </div>
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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
