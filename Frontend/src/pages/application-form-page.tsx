import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { MultiStepApplicationForm } from "@/features/application-form/multi-step-application-form"
import { ROLE_APPLICATIONS_ENABLED } from "@/lib/feature-flags"
import { useRolesQuery } from "@/lib/api/hooks"
import { PublicLayout } from "@/layouts/public-layout"
import { useAppStore } from "@/store/app-store"

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

export function ApplicationFormPage({ onNavigate }: { onNavigate: Navigate }) {
  const selectedRoleId = useAppStore((state) => state.selectedRoleId)
  const { data: roles } = useRolesQuery()
  const [activeRoleId, setActiveRoleId] = useState(selectedRoleId ?? "")

  const roleIdForPreview = activeRoleId || selectedRoleId || ""

  const selectedRole = useMemo(
    () => (roles ?? []).find((role) => role._id === roleIdForPreview),
    [roles, roleIdForPreview]
  )

  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center-safe px-4 py-8 text-center md:px-6 md:py-10">
        {selectedRole ? (
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card text-left">
            <div
              className="h-44 w-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.55)), url("${selectedRole.imageUrl?.trim() || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"}")`,
              }}
            />
            <div className="space-y-3 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {selectedRole.department}
                </Badge>
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {selectedRole.status}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                {selectedRole.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {selectedRole.description}
              </p>
            </div>
          </div>
        ) : null}
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          {selectedRole ? "Apply For This Role" : "Role Application"}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {selectedRole
            ? "Complete the questions below to submit your application for this role."
            : "Tell us about your experience and how you can support MindLift's mission."}
        </p>
        {!ROLE_APPLICATIONS_ENABLED ? (
          <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">
            Role applications are currently switched off by admin.
          </p>
        ) : null}
        <div className="mt-6">
          <MultiStepApplicationForm
            initialRoleId={selectedRole?._id}
            onRoleChange={setActiveRoleId}
          />
        </div>
      </div>
    </PublicLayout>
  )
}
