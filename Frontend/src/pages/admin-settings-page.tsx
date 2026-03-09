import { Palette } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/layouts/admin-layout"

export function AdminSettingsPage({
  onNavigate,
}: {
  onNavigate: (
    target:
      | "admin-login"
      | "admin-dashboard"
      | "admin-settings"
      | "admin-email"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => void
}) {
  return (
    <AdminLayout current="settings" onNavigate={onNavigate}>
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure administrator preferences.
        </p>
      </header>

      <Card className="max-w-3xl border border-border py-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="size-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-semibold">Theme</p>
            <p className="text-xs text-muted-foreground">
              Toggle between light and dark mode for the admin workspace.
            </p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
