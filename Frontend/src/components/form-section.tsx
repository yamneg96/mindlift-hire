import type { PropsWithChildren, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FormSection({
  title,
  icon,
  children,
}: PropsWithChildren<{ title: string; icon?: ReactNode }>) {
  return (
    <Card className="border border-border bg-card py-0">
      <CardHeader className="border-b border-border bg-muted/40 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}
