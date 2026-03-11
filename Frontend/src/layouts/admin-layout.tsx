import { useState, type PropsWithChildren } from "react"
import {
  Bell,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
  BriefcaseBusiness,
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { adminSidebarItems } from "@/lib/mock-data"
import { useAppStore } from "@/store/app-store"
import { cn } from "@/lib/utils"

type AdminPage =
  | "dashboard"
  | "roles"
  | "applicants"
  | "details"
  | "email"
  | "settings"

type AdminLayoutProps = PropsWithChildren<{
  current: AdminPage
  onNavigate: (
    target:
      | "admin-login"
      | "admin-dashboard"
      | "admin-roles"
      | "admin-settings"
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
  const clearAuth = useAppStore((state) => state.clearAuth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    setIsSidebarOpen(false)
    clearAuth()
    onNavigate("admin-login")
  }

  const navigateFromSidebar = (
    target:
      | "admin-login"
      | "admin-dashboard"
      | "admin-roles"
      | "admin-settings"
      | "admin-email"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => {
    setIsSidebarOpen(false)
    onNavigate(target)
  }

  const sidebarContent = (
    <>
      <div className="p-5">
        <BrandLogo
          subtitle="Admin Portal"
          onClick={() => navigateFromSidebar("landing")}
        />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {adminSidebarItems.map((item) => {
          const Icon = itemIcons[item]
          const active =
            (item === "Dashboard" && current === "dashboard") ||
            (item === "Roles" && current === "roles") ||
            (item === "Applicants" &&
              (current === "applicants" || current === "details")) ||
            (item === "Notifications" && current === "email") ||
            (item === "Settings" && current === "settings")
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
                if (item === "Dashboard") navigateFromSidebar("admin-dashboard")
                if (item === "Roles") navigateFromSidebar("admin-roles")
                if (item === "Applicants") navigateFromSidebar("applicant-list")
                if (item === "Notifications") navigateFromSidebar("admin-email")
                if (item === "Settings") navigateFromSidebar("admin-settings")
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
        <Button className="w-full" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className="w-72 p-0 lg:hidden" side="left">
          <div className="flex h-full flex-col bg-card">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <Button
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="lg:hidden"
              size="icon"
              type="button"
              variant="outline"
              onClick={() => setIsSidebarOpen((open) => !open)}
            >
              {isSidebarOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </Button>
            <p className="text-sm font-semibold">MindLift Role Portal</p>
          </div>
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
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
