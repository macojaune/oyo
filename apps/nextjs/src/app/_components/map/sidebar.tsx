"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@oyo/ui/button";
import { ScrollArea } from "@oyo/ui/scroll-area";
// import { useGroups } from "@/hooks/useGroups";
import { GroupCard } from "./group-card";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedGroup: string | null;
  onGroupSelect: (groupId: string) => void;
}

export const groups = [
  {
    name: "test",
    id: "1",
    lastUpdate: new Date(),
    crowdSize: 10,
    photoUrl:
      "https://images.unsplash.com/photo-1581974944026-5d6ed762f617?auto=format&fit=crop&q=80",
    latitude: 16.325568111372014,
    longitude: -61.394983713823095,
  },
  {
    name: "test2",
    id: "2",
    lastUpdate: new Date(),
    crowdSize: 10,
    photoUrl:
      "https://images.unsplash.com/photo-1581974944026-5d6ed762f617?auto=format&fit=crop&q=80",
    longitude: -61.5293841,
    latitude: 16.2206865,
  },
];

export function Sidebar({
  isOpen,
  onToggle,
  selectedGroup,
  onGroupSelect,
}: SidebarProps) {
  //const { groups } = useGroups();
  return (
    <div
      className={`
      relative bg-background border-r
      ${isOpen ? "w-80" : "w-0"}
      transition-all duration-300
    `}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-10 top-2"
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      {isOpen && (
        <div className="p-4 h-full">
          <h2 className="text-xl font-bold mb-4">Groupes</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {groups?.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isSelected={group.id === selectedGroup}
                  onClick={() => onGroupSelect(group.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
