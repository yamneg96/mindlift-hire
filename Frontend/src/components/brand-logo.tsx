import { Brain } from "lucide-react"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  subtitle?: string
}

export function BrandLogo({ className, subtitle }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Brain className="size-5" />
      </div>
      <div>
        <p className="text-lg font-bold tracking-tight">MindLift</p>
        {subtitle ? (
          <p className="text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  )
}
