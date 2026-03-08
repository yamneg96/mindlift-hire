import { ArrowRight } from "lucide-react"

import { RoleCard } from "@/components/role-card"
import { Button } from "@/components/ui/button"
import { PublicLayout } from "@/layouts/public-layout"
import { roleCards } from "@/lib/mock-data"

type Navigate = (
  target:
    | "application-form"
    | "minimal-application"
    | "contact"
    | "privacy"
    | "terms"
    | "admin-login"
    | "landing"
) => void

export function LandingPage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-muted/40" />
          <div className="relative">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Empower Change with MindLift
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Join our mission to transform mental healthcare accessibility with
              leadership, technical, and operations opportunities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="gap-1"
                onClick={() => onNavigate("application-form")}
              >
                View Open Roles
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" onClick={() => onNavigate("contact")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Available Roles
            </h2>
            <p className="text-sm text-muted-foreground">
              Help us make a lasting impact.
            </p>
          </div>
          <button
            className="text-sm font-semibold text-primary"
            onClick={() => onNavigate("minimal-application")}
          >
            Quick Apply
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {roleCards.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto w-full max-w-6xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-black tracking-tight">
            Don't see a role that fits?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Submit a general application and our team will contact you when a
            matching role opens.
          </p>
          <Button
            className="mt-5"
            onClick={() => onNavigate("minimal-application")}
          >
            General Application
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
