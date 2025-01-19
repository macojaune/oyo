import { Button } from "@oyo/ui/button"

export function SponsorBlock() {
  return (
    <div className="my-4 mt-auto flex w-full flex-col justify-evenly rounded-md bg-primary/15 p-4 dark:bg-accent">
      <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-primary">
        🤝 Deviens Sponsor
      </h3>

      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
        Soutiens le projet et valorise ta marque ou ton entreprise sur{" "}
        <span className="font-semibold">O Mas La ?</span>.
      </p>

      <a
        href="https://tally.so/r/3EvMVo"
        target="_blank"
        className="w-fit self-end"
      >
        <Button variant="link">En savoir plus</Button>
      </a>
    </div>
  )
}
