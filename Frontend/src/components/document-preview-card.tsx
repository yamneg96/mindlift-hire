import { Eye, FileText, ArrowDownToLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { API_BASE } from "@/lib/api/client"

function resolveDocumentUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  const normalized = url.startsWith("/") ? url : `/${url}`
  const normalizedApiBase = API_BASE.replace(/\/+$/, "")

  if (/^https?:\/\//i.test(normalizedApiBase)) {
    const backendOrigin = normalizedApiBase.replace(/\/api$/i, "")
    return `${backendOrigin}${normalized}`
  }

  return `${window.location.origin}${normalized}`
}

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
        <div className="flex gap-2">
          <Button
            disabled={!url}
            size="icon-sm"
            variant="outline"
            onClick={() => {
              if (!url) {
                return
              }
              const resolvedUrl = resolveDocumentUrl(url)
              window.open(resolvedUrl, "_blank", "noopener,noreferrer")
            }}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            disabled={!url}
            size="icon-sm"
            variant="outline"
            onClick={() => {
              if (!url) {
                return
              }
              // Add fl_attachment transformation for download
              let downloadUrl = url
              if (url && url.includes("cloudinary.com")) {
                downloadUrl = url.replace("/upload/", "/upload/fl_attachment/")
              }
              const resolvedUrl = resolveDocumentUrl(downloadUrl)
              window.open(resolvedUrl, "_blank", "noopener,noreferrer")
            }}
          >
            <ArrowDownToLine className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
