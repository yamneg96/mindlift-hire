import { Upload } from "lucide-react"

import { Label } from "@/components/ui/label"

export function FileUploadField({
  label,
  helper,
}: {
  label: string
  helper: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background p-4 text-center hover:bg-muted/50">
        <Upload className="size-4 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground">{helper}</p>
        <input className="hidden" type="file" />
      </label>
    </div>
  )
}
