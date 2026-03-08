import { useMemo, useState } from "react"
import { Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  mapApplicationToApplicant,
  useAdminApplicationsQuery,
  useAdminSendEmailMutation,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"

export function AdminEmailPage({
  onNavigate,
}: {
  onNavigate: (
    target:
      | "admin-dashboard"
      | "admin-email"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => void
}) {
  const applicationsQuery = useAdminApplicationsQuery({ page: 1, limit: 100 })
  const sendEmailMutation = useAdminSendEmailMutation()

  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [subject, setSubject] = useState("MindLift Application Update")
  const [message, setMessage] = useState(
    "Thank you for applying to MindLift. We are currently reviewing applications and will contact shortlisted candidates shortly."
  )

  const applicants = useMemo(
    () => (applicationsQuery.data?.items ?? []).map(mapApplicationToApplicant),
    [applicationsQuery.data?.items]
  )

  const toggleEmail = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((item) => item !== email)
        : [...prev, email]
    )
  }

  const send = async () => {
    if (selectedEmails.length === 0 || message.trim().length < 10) {
      return
    }

    try {
      await sendEmailMutation.mutateAsync({
        recipients: selectedEmails,
        subject,
        body: message,
      })
    } catch {
      // no-op; message is displayed in the UI
    }
  }

  return (
    <AdminLayout current="email" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Email Applicants
          </h1>
          <p className="text-sm text-muted-foreground">
            Select candidates and send updates using the shared MindLift email
            template.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="border border-border py-0 xl:col-span-2">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="size-4" />
              Select Recipients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {applicationsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading applicants...
              </p>
            ) : applicants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No applicants available.
              </p>
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {applicants.map((applicant) => (
                  <label
                    key={`${applicant.id}-${applicant.email}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/30"
                  >
                    <input
                      checked={selectedEmails.includes(applicant.email)}
                      className="mt-1"
                      type="checkbox"
                      onChange={() => toggleEmail(applicant.email)}
                    />
                    <div>
                      <p className="font-semibold">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {applicant.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {applicant.role}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border py-0">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="text-lg">Compose Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input disabled value={`${selectedEmails.length} selected`} />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="MindLift Application Update"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                className="min-h-40"
                placeholder="Write your message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
            <Button
              className="w-full gap-2"
              disabled={
                sendEmailMutation.isPending || selectedEmails.length === 0
              }
              onClick={send}
            >
              <Send className="size-4" />
              {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
            </Button>
            {sendEmailMutation.isSuccess ? (
              <p className="text-sm text-primary">Email sent successfully.</p>
            ) : null}
            {sendEmailMutation.isError ? (
              <p className="text-sm text-destructive">
                {(sendEmailMutation.error as Error).message}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
