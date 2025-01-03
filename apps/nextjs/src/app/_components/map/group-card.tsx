import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { Card } from "@oyo/ui/card"

import type { Group } from "~/lib/map-utils"

interface GroupCardProps {
  group: Group
  isSelected: boolean
  onClick: () => void
}

export function GroupCard({ group, isSelected, onClick }: GroupCardProps) {
  return (
    <Card
      className={`cursor-pointer p-4 transition-all hover:shadow-md ${isSelected ? "bg-purple-500/25" : "bg-dark"} `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* {group?.photoUrl && (
          <img
            src={group?.photoUrl}
            alt={group.title}
            className="h-16 w-16 rounded-lg object-cover"
          />
        )} */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{group.title}</h3>
          {group.positions[0]?._creationTime && (
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(
                new Date(group.positions[0]?._creationTime),
                {
                  addSuffix: true,
                  locale: fr,
                },
              )}
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
  )
}
