import { Mail } from "lucide-react"

import { PublicLayout } from "@/layouts/public-layout"
import { legalSections } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export function TermsOfServicePage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
            Legal Documentation
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: March 8, 2026
          </p>
        </div>

        <Card className="border border-border py-0">
          <CardContent className="space-y-6 p-6 md:p-8">
            <p className="text-sm leading-7 text-muted-foreground">
              Welcome to MindLift. These terms govern your access and use of our
              platform, including role applications, admin review tools, and
              communication features.
            </p>

            {legalSections.terms.map((section, index) => (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <p className="pl-11 text-sm leading-7 text-muted-foreground">
                  {section.body}
                </p>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <h3 className="mb-2 font-bold">Questions about these terms?</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Reach out to our support team for clarifications regarding
                eligibility, data, or moderation.
              </p>
              <Button className="gap-2">
                <Mail className="size-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
          <button onClick={() => onNavigate("privacy")}>Privacy Policy</button>
          <button onClick={() => onNavigate("contact")}>Contact</button>
        </div>
      </div>
    </PublicLayout>
  )
}
