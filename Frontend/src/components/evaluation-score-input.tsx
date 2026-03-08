import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function EvaluationScoreInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (score: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <Button
            key={score}
            className={cn(
              "size-8 rounded-md border border-border px-0",
              value === score && "bg-primary/10 text-primary"
            )}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => onChange(score)}
          >
            {score}
          </Button>
        ))}
      </div>
    </div>
  )
}
