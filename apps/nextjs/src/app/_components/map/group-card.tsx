import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Users } from "lucide-react";
import { Card } from "@oyo/ui/card";
import { Doc } from "@oyo/convex/types";

interface GroupCardProps {
  group: Doc<"groups">;
  isSelected: boolean;
  onClick: () => void;
}

export function GroupCard({ group, isSelected, onClick }: GroupCardProps) {
  return (
    <Card
      className={`
        p-4 cursor-pointer transition-all
        hover:shadow-md
        ${isSelected ? "ring-2 ring-purple-500" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {group?.photoUrl && (
          <img
            src={group?.photoUrl}
            alt={group.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{group.title}</h3>
          {group?.lastUpdate && (
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(group.lastUpdate), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          )}
          {/*<div className="flex items-center gap-1 mt-1">*/}
          {/*  <Users className="h-4 w-4 text-muted-foreground" />*/}
          {/*  <span className="text-sm text-muted-foreground">*/}
          {/*    ~{group.crowdSize} personnes*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      </div>
    </Card>
  );
}
