import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

type Status = "new" | "reviewing" | "shortlisted" | "rejected"

const statusClassMap: Record<Status, string> = {
  new: "bg-secondary text-secondary-foreground",
  reviewing: "bg-primary/10 text-primary",
  shortlisted: "bg-primary text-primary-foreground",
  rejected: "bg-destructive/10 text-destructive",
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      className={cn(
        "rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold uppercase",
        statusClassMap[status]
      )}
      variant="secondary"
    >
      {status}
    </Badge>
  )
}
