import { useEffect, useMemo, useState } from "react"

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
import { ROLE_APPLICATIONS_ENABLED } from "@/lib/feature-flags"

export function MultiStepApplicationForm({
  initialRoleId,
  onRoleChange,
}: {
  initialRoleId?: string
  onRoleChange?: (roleId: string) => void
}) {
  const [roleId, setRoleId] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [motivationLetter, setMotivationLetter] = useState("")
  const [cv, setCv] = useState<File | null>(null)
  const [localError, setLocalError] = useState("")

  const rolesQuery = useRolesQuery()
  const applyMutation = useApplyMutation()

  const selectedRole = useMemo(
    () => (rolesQuery.data ?? []).find((role) => role._id === roleId),
    [roleId, rolesQuery.data]
  )

  useEffect(() => {
    if (!initialRoleId) {
      return
    }
    setRoleId(initialRoleId)
  }, [initialRoleId])

  useEffect(() => {
    onRoleChange?.(roleId)
  }, [onRoleChange, roleId])

  const canSubmit = Boolean(
    ROLE_APPLICATIONS_ENABLED && fullName && email && roleId && cv
  )

  const submit = async () => {
    if (!canSubmit || !cv) {
      setLocalError("Please complete full name, email, role selection, and CV.")
      return
    }

    if (
      cv.type !== "application/pdf" &&
      cv.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setLocalError("CV must be a PDF or DOCX file.")
      return
    }

    setLocalError("")

    await applyMutation.mutateAsync({
      applicationType: "role",
      roleId,
      fullName,
      email,
      phone,
      motivationLetter,
      cv,
    })
  }

  return (
    <Card className="border border-border py-0 text-left">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-xl font-extrabold tracking-tight">
          Role Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {!ROLE_APPLICATIONS_ENABLED ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            Role applications are currently turned off by admin. Please check
            again later.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              className="h-10"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              className="h-10"
              placeholder="jane@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phone Number (Optional)</Label>
          <Input
            className="h-10"
            placeholder="+251..."
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Role Selection</Label>
          {rolesQuery.isLoading ? (
            <div className="h-10 animate-pulse rounded-lg border border-border bg-muted/40" />
          ) : (rolesQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No open roles available yet.
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
          {selectedRole ? (
            <p className="text-xs text-muted-foreground">
              Selected:{" "}
              <span className="font-semibold">{selectedRole.title}</span>
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>CV Upload</Label>
          <Input
            accept=".pdf,.docx"
            className="h-10"
            type="file"
            onChange={(event) => setCv(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Required (PDF or DOCX)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Motivation / Interest (Optional)</Label>
          <Textarea
            className="min-h-24"
            placeholder="Tell us briefly why this role fits you."
            value={motivationLetter}
            onChange={(event) => setMotivationLetter(event.target.value)}
          />
        </div>

        {applyMutation.isError ? (
          <p className="text-sm text-destructive">
            {(applyMutation.error as Error).message}
          </p>
        ) : null}
        {localError ? (
          <p className="text-sm text-destructive">{localError}</p>
        ) : null}
        {applyMutation.isSuccess ? (
          <p className="text-sm text-primary">
            Application submitted successfully.
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={applyMutation.isPending || !canSubmit}
          onClick={submit}
        >
          {applyMutation.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </CardContent>
    </Card>
  )
}
