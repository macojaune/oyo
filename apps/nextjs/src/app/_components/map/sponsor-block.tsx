import { Card } from "@oyo/ui/card"
import { Button } from "@oyo/ui/button"

export function SponsorBlock() {
  return (
    <Card className="cursor-pointer border-none bg-primary/10 p-2 md:p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 lg:items-center justify-between flex-col items-start">
          <h3 className="truncate font-semibold">🤝 Deviens Sponsor</h3>
          <p className="text-muted-foreground text-xs  md:text-sm">
            Soutiens le projet et valorise ta marque
          </p>
          
        </div>
        <a
            href="https://tally.so/r/3EvMVo"
            target="_blank"
            className="w-fit"
          >
            <Button variant="link" className="p-0">En savoir plus</Button>
          </a>
      </div>
    </Card>
  )
}
