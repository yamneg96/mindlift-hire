import { ArrowRight } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { RoleCard } from "@/components/role-card"
import { Button } from "@/components/ui/button"
import { useRolesQuery } from "@/lib/api/hooks"
import { PublicLayout } from "@/layouts/public-layout"
import type { RoleCardItem } from "@/lib/mock-data"

type Navigate = (
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

export function LandingPage({ onNavigate }: { onNavigate: Navigate }) {
  const { data: roles, isLoading } = useRolesQuery()

  const resolvedRoles: RoleCardItem[] =
    roles && roles.length > 0
      ? roles.map((role) => ({
          id: role._id,
          title: role.title,
          category: role.department,
          mode: role.status === "open" ? "Open" : "Closed",
          description: role.description,
          openings: role.maxApplicants,
          image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
        }))
      : []

  return (
    <PublicLayout onNavigate={onNavigate}>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div
          className="relative min-h-[460px] overflow-hidden rounded-2xl border border-border bg-card bg-cover bg-center p-8 md:p-12"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.72)), url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-transparent to-background/10" />
          <div className="relative flex min-h-[380px] flex-col items-center justify-center text-center">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Empower Change with MindLift
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
              Join our mission to transform mental healthcare accessibility with
              leadership, technical, and operations opportunities.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                className="gap-1"
                onClick={() => onNavigate("application-form")}
              >
                View Open Roles
                <ArrowRight className="size-4" />
              </Button>
              <Button
                className="border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                variant="outline"
                onClick={() => onNavigate("about")}
              >
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
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : resolvedRoles.length === 0 ? (
          <EmptyState
            title="No Open Roles Yet"
            description="Your backend is connected. Once admin publishes open roles, they will appear here instantly."
            actionLabel="Preview Sample Roles"
            onAction={() => onNavigate("minimal-application")}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {resolvedRoles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        )}
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
