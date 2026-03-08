import { MultiStepApplicationForm } from "@/features/application-form/multi-step-application-form"
import { PublicLayout } from "@/layouts/public-layout"

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

export function ApplicationFormPage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Role Application
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Tell us about your experience and how you can support MindLift's
          mission.
        </p>
        <div className="mt-6">
          <MultiStepApplicationForm />
        </div>
      </div>
    </PublicLayout>
  )
}
