import { ArrowRight, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RoleCardItem } from "@/lib/mock-data"

export function RoleCard({
  role,
  onApply,
  applyDisabled,
}: {
  role: RoleCardItem
  onApply?: (role: RoleCardItem) => void
  applyDisabled?: boolean
}) {
  return (
    <Card className="overflow-hidden border border-border bg-card py-0 lg:flex-row">
      <div
        className="h-52 w-full bg-muted bg-cover bg-center lg:h-auto lg:w-1/3"
        style={{ backgroundImage: `url(${role.image})` }}
      />
      <div className="flex flex-1 flex-col">
        <CardHeader className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <Badge
              className="rounded-full bg-primary/10 text-primary"
              variant="secondary"
            >
              {role.category}
            </Badge>
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {role.mode}
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 text-sm leading-6 text-muted-foreground">
          {role.description}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-border bg-background">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="size-4" />
            <span>{role.openings} openings</span>
          </div>
          <Button
            className="gap-1 rounded-lg"
            size="sm"
            disabled={applyDisabled}
            onClick={() => onApply?.(role)}
          >
            Apply Now
            <ArrowRight className="size-4" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
