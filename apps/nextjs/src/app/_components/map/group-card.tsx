import { useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { api as convexApi } from "@oyo/convex"
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
        <div className="flex flex-1 flex-row items-center justify-between lg:flex-col lg:items-start">
          <div className="flex w-full items-center justify-between gap-2 lg:flex-row">
            <h3 className="truncate font-semibold">{group.title}</h3>{" "}
            {group.isLive && (
              <span className="rounded-md border border-primary px-2 py-1 text-xs">
                Live
              </span>
            )}
          </div>
          {group.positions[0]?._creationTime && (
            <p className="text-xs text-muted-foreground lg:text-sm">
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
