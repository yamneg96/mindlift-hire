import type { PropsWithChildren } from "react"
import { ArrowRight, Menu } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ROLE_APPLICATIONS_ENABLED } from "@/lib/feature-flags"

type PublicLayoutProps = PropsWithChildren<{
  onNavigate: (
    target:
      | "about"
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
          <BrandLogo onClick={() => onNavigate("landing")} />
          <nav className="hidden items-center gap-8 md:flex">
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("landing")}
            >
              Home
            </button>
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("about")}
            >
              About Us
            </button>
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("application-form")}
            >
              Roles
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  aria-label="Open navigation menu"
                  className="md:hidden"
                  size="icon"
                  variant="outline"
                >
                  <Menu className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm p-6">
                <DialogHeader>
                  <DialogTitle>Menu</DialogTitle>
                  <DialogDescription>
                    Quick navigation for MindLift Role Portal.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2 grid gap-2">
                  <DialogClose asChild>
                    <Button
                      className="justify-start"
                      variant="ghost"
                      onClick={() => onNavigate("landing")}
                    >
                      Home
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="justify-start"
                      variant="ghost"
                      onClick={() => onNavigate("about")}
                    >
                      About Us
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="justify-start"
                      variant="ghost"
                      onClick={() => onNavigate("application-form")}
                    >
                      Roles
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="mt-2"
                      disabled={!ROLE_APPLICATIONS_ENABLED}
                      onClick={() => onNavigate("application-form")}
                    >
                      Apply Now
                      <ArrowRight className="size-4" />
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              className="hidden gap-1 md:inline-flex"
              disabled={!ROLE_APPLICATIONS_ENABLED}
              onClick={() => onNavigate("application-form")}
            >
              Apply Now
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <BrandLogo
              subtitle="MindLift NGO"
              onClick={() => onNavigate("landing")}
            />
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
