import { Eye, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function DocumentPreviewCard({
  name,
  type,
  size,
  url,
}: {
  name: string
  type: string
  size: string
  url?: string
}) {
  return (
    <Card className="border border-border bg-card py-0">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <FileText className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">
              {type} - {size}
            </p>
          </div>
        </div>
        <Button
          disabled={!url}
          size="icon-sm"
          variant="outline"
          onClick={() => {
            if (!url) {
              return
            }

            window.open(url, "_blank", "noopener,noreferrer")
          }}
        >
          <Eye className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
