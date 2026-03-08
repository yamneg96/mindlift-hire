import { Gavel, ShieldCheck, Workflow, Database } from "lucide-react"

import { PublicLayout } from "@/layouts/public-layout"
import { legalSections } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export function PrivacyPolicyPage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">
            Legal Center
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Last updated: March 8, 2026
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                On this page
              </p>
              <nav className="space-y-2 text-sm">
                <a
                  className="block border-l-2 border-primary pl-3 font-semibold text-primary"
                  href="#collect"
                >
                  Information We Collect
                </a>
                <a
                  className="block border-l-2 border-transparent pl-3 text-muted-foreground hover:text-foreground"
                  href="#use"
                >
                  How We Use Data
                </a>
                <a
                  className="block border-l-2 border-transparent pl-3 text-muted-foreground hover:text-foreground"
                  href="#rights"
                >
                  Your Rights
                </a>
              </nav>
            </div>
          </aside>

          <div className="space-y-5 lg:col-span-9">
            <Card id="collect" className="border border-border py-0">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-4 text-primary" />
                  {legalSections.privacy[0].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 text-sm leading-7 text-muted-foreground">
                <p>{legalSections.privacy[0].body}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Personal identifiers and account details</li>
                  <li>Wellness and usage records relevant to services</li>
                  <li>Communication preferences and support requests</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="use" className="border border-border py-0">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="size-4 text-primary" />
                  {legalSections.privacy[1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
                <Mini title="Personalization" />
                <Mini title="Communication" />
                <Mini title="Research" />
                <Mini title="Service Safety" />
              </CardContent>
            </Card>

            <Card id="rights" className="border border-border py-0">
              <CardHeader className="border-b border-border py-4">
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="size-4 text-primary" />
                  {legalSections.privacy[2].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-5 text-sm leading-7 text-muted-foreground">
                <p>{legalSections.privacy[2].body}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Access and export your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion where applicable</li>
                  <li>Restrict processing based on regional law</li>
                </ul>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <ShieldCheck className="size-4" />
                <p className="text-sm font-bold">
                  Questions about this policy?
                </p>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Our privacy team can clarify data handling, retention, and
                request workflows.
              </p>
              <Button>Contact Privacy Team</Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

function Mini({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="mb-1 font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">
        Data is processed only for this operational purpose and monitored for
        security.
      </p>
    </div>
  )
}
