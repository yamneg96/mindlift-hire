import { useState } from "react"

import { PublicLayout } from "@/layouts/public-layout"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useApplyMutation, useRolesQuery } from "@/lib/api/hooks"
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

export function MinimalApplicationPage({
  onNavigate,
}: {
  onNavigate: Navigate
}) {
  const token = useAppStore((state) => state.token)
  const rolesQuery = useRolesQuery()
  const applyMutation = useApplyMutation()

  const [roleId, setRoleId] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [availability, setAvailability] = useState("")
  const [motivationLetter, setMotivationLetter] = useState("")
  const [expectedContribution, setExpectedContribution] = useState("")
  const [cv, setCv] = useState<File | null>(null)
  const [portfolio, setPortfolio] = useState<File | null>(null)

  const submit = async () => {
    if (
      !roleId ||
      !motivationLetter ||
      !experienceLevel ||
      !availability ||
      !cv
    ) {
      return
    }
    await applyMutation.mutateAsync({
      roleId,
      motivationLetter,
      experienceLevel,
      availability,
      expectedContribution,
      cv,
      portfolio,
    })
  }

  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="text-4xl font-black tracking-tight">Join MindLift</h1>
        <p className="mt-2 text-muted-foreground">
          Fast track application for high-intent candidates.
        </p>

        <Card className="mt-6 border border-border py-0">
          <CardHeader className="border-b border-border py-4">
            <CardTitle>Minimal Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {!token ? (
              <EmptyState
                title="Sign in Required"
                description="Applications are now live to backend APIs. Sign in first so your submission can be linked to your account."
                actionLabel="Go to Admin Login"
                onAction={() => onNavigate("admin-login")}
              />
            ) : null}

            <div className="space-y-2">
              <Label>Role Selection</Label>
              {rolesQuery.isLoading ? (
                <div className="h-10 animate-pulse rounded-lg border border-border bg-muted/40" />
              ) : (rolesQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open roles yet. Please check back soon.
                </p>
              ) : (
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rolesQuery.data ?? []).map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Input
                className="h-10"
                placeholder="Mid-level"
                value={experienceLevel}
                onChange={(event) => setExperienceLevel(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Input
                className="h-10"
                placeholder="20 hours/week"
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>CV Upload</Label>
              <Input
                className="h-10"
                type="file"
                onChange={(event) => setCv(event.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Portfolio (Optional)</Label>
              <Input
                className="h-10"
                type="file"
                onChange={(event) =>
                  setPortfolio(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Motivation Letter</Label>
              <Textarea
                className="min-h-28"
                placeholder="Tell us why you want to join MindLift."
                value={motivationLetter}
                onChange={(event) => setMotivationLetter(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Contribution</Label>
              <Textarea
                className="min-h-20"
                placeholder="What impact do you expect to make in this role?"
                value={expectedContribution}
                onChange={(event) =>
                  setExpectedContribution(event.target.value)
                }
              />
            </div>
            {applyMutation.isError ? (
              <p className="text-sm text-destructive">
                {(applyMutation.error as Error).message}
              </p>
            ) : null}
            {applyMutation.isSuccess ? (
              <p className="text-sm text-primary">
                Application submitted successfully.
              </p>
            ) : null}
            <Button
              className="w-full"
              disabled={!token || applyMutation.isPending}
              onClick={submit}
            >
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
