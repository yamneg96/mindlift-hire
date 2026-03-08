import type { PropsWithChildren } from "react"
import {
  Bell,
  LayoutDashboard,
  Settings,
  Users,
  BriefcaseBusiness,
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { adminSidebarItems } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type AdminPage = "dashboard" | "applicants" | "details" | "email"

type AdminLayoutProps = PropsWithChildren<{
  current: AdminPage
  onNavigate: (
    target:
      | "admin-dashboard"
      | "admin-email"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => void
}>

const itemIcons = {
  Dashboard: LayoutDashboard,
  Applicants: Users,
  Roles: BriefcaseBusiness,
  Notifications: Bell,
  Settings: Settings,
}

export function AdminLayout({
  children,
  current,
  onNavigate,
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="p-5">
          <BrandLogo
            subtitle="Admin Portal"
            onClick={() => onNavigate("landing")}
          />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {adminSidebarItems.map((item) => {
            const Icon = itemIcons[item]
            const active =
              (item === "Dashboard" && current === "dashboard") ||
              (item === "Applicants" &&
                (current === "applicants" || current === "details")) ||
              (item === "Notifications" && current === "email")
            return (
              <button
                key={item}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => {
                  if (item === "Dashboard") onNavigate("admin-dashboard")
                  if (item === "Applicants") onNavigate("applicant-list")
                  if (item === "Notifications") onNavigate("admin-email")
                }}
              >
                <Icon className="size-4" />
                {item}
              </button>
            )
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            Signed in as Admin Recruiter
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onNavigate("landing")}
          >
            Exit Admin
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
          <p className="text-sm font-semibold">MindLift Role Portal</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("applicant-list")}
            >
              Applicants
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("landing")}
            >
              Public Site
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
