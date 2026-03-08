import type { PropsWithChildren } from "react"
import { ArrowRight } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"

type PublicLayoutProps = PropsWithChildren<{
  onNavigate: (
    target:
      | "application-form"
      | "minimal-application"
      | "contact"
      | "privacy"
      | "terms"
      | "admin-login"
      | "landing"
  ) => void
}>

export function PublicLayout({ children, onNavigate }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <BrandLogo />
          <nav className="hidden items-center gap-8 md:flex">
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("landing")}
            >
              About
            </button>
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("application-form")}
            >
              Roles
            </button>
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("admin-login")}
            >
              Admin Login
            </button>
          </nav>
          <Button
            className="gap-1"
            onClick={() => onNavigate("application-form")}
          >
            Apply Now
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <BrandLogo subtitle="MindLift NGO" />
            <p className="text-sm text-muted-foreground">
              © 2026 MindLift NGO. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground md:justify-start">
            <button onClick={() => onNavigate("privacy")}>
              Privacy Policy
            </button>
            <button onClick={() => onNavigate("terms")}>
              Terms of Service
            </button>
            <button onClick={() => onNavigate("contact")}>Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
