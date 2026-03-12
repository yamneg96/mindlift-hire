import { useMemo, useState } from "react"

import { EvaluationScoreInput } from "@/components/evaluation-score-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  useAdminSendEmailMutation,
  useAdminUpdateApplicationMutation,
} from "@/lib/api/hooks"
import type { Applicant } from "@/lib/mock-data"
import { useFeedbackModal } from "@/components/feedback-modal-provider"

const categories: Array<keyof Applicant["evaluation"]> = [
  "Experience",
  "Education",
  "Skills",
  "Motivation",
  "Leadership",
]

const statusActions = [
  {
    label: "Mark Reviewing",
    value: "pending",
    className: "border-border bg-muted text-foreground hover:bg-muted/80",
  },
  {
    label: "Accept",
    value: "approved",
    className:
      "border-primary/30 bg-primary/15 text-primary hover:bg-primary/25",
  },
  {
    label: "Shortlist",
    value: "shortlisted",
    className:
      "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300",
  },
  {
    label: "Reject",
    value: "rejected",
    className:
      "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
] as const

export function EvaluationPanel({
  applicant,
  applicationId,
  initialStatus,
}: {
  applicant: Applicant
  applicationId: string
  initialStatus: "pending" | "approved" | "rejected" | "shortlisted"
}) {
  const { showError, showSuccess } = useFeedbackModal()
  const [scores, setScores] = useState(applicant.evaluation)
  const [notes, setNotes] = useState(applicant.notes)
  const [currentStatus, setCurrentStatus] = useState(initialStatus)
  const [activeTab, setActiveTab] = useState<"job" | "role">("job")
  const [selectedRole, setSelectedRole] = useState("")
  const [roleNote, setRoleNote] = useState("")
  const updateMutation = useAdminUpdateApplicationMutation()
  const sendEmailMutation = useAdminSendEmailMutation()

  const roleChoices = applicant.roleChoices?.length
    ? applicant.roleChoices
    : [applicant.role]

  const total = useMemo(
    () => categories.reduce((acc, category) => acc + scores[category], 0),
    [scores]
  )

  const persistEvaluation = async (
    status: "pending" | "approved" | "rejected" | "shortlisted"
  ) => {
    const scoreSummary = categories
      .map((category) => `${category}: ${scores[category]}/5`)
      .join(" | ")

    const scoreLine = `Evaluation Scores -> ${scoreSummary} (Total: ${total}/25)`
    const mergedNotes = [notes.trim(), scoreLine].filter(Boolean).join("\n")

    try {
      await updateMutation.mutateAsync({
        id: applicationId,
        status,
        adminNotes: mergedNotes,
      })
      setCurrentStatus(status)
      setNotes(mergedNotes)
      showSuccess({
        title: "Evaluation Saved",
        description: `Application status updated to ${status}.`,
      })
    } catch (error) {
      showError({
        title: "Save Failed",
        description: (error as Error).message,
      })
    }
  }

  const saveEvaluation = async () => {
    await persistEvaluation(currentStatus)
  }

  const saveWithStatus = async (
    status: "pending" | "approved" | "rejected" | "shortlisted"
  ) => {
    await persistEvaluation(status)
  }

  const sendRoleSelection = async () => {
    if (!selectedRole.trim()) {
      showError({
        title: "Role Required",
        description: "Select one role before sending the message.",
      })
      return
    }

    const customNote = roleNote.trim()
    const message = [
      `Congratulations! You have been selected for the ${selectedRole} role at MindLift.`,
      "We are excited to welcome you and look forward to your contribution.",
      "Our team will follow up with next steps shortly.",
      customNote ? `Admin note: ${customNote}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")

    try {
      await sendEmailMutation.mutateAsync({
        recipients: [applicant.email],
        subject: `Congratulations - Selected for ${selectedRole}`,
        roleTitle: selectedRole,
        body: message,
      })

      showSuccess({
        title: "Selection Email Sent",
        description: `Selection message sent to ${applicant.email}.`,
      })
      setRoleNote("")
    } catch (error) {
      showError({
        title: "Send Failed",
        description: (error as Error).message,
      })
    }
  }

  return (
    <Card className="border border-border py-0">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-lg">Evaluation Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-4">
        <Tabs
          className="flex w-full flex-col"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "job" | "role")}
        >
          <TabsList className="grid max-h-40 w-full max-w-40 grid-cols-2 rounded-2xl border border-border bg-muted/50 p-1 shadow-sm">
            <TabsTrigger
              value="role"
              className={`${activeTab === "role" ? "border-primary" : ""} h-10 cursor-pointer rounded-xl border-2 text-sm font-semibold text-muted-foreground transition-all duration-200 focus:text-primary active:border-primary data-active:bg-background data-active:text-foreground data-active:shadow-sm`}
            >
              Role
            </TabsTrigger>
            <TabsTrigger
              value="job"
              className={`${activeTab === "job" ? "border-primary" : ""} h-10 cursor-pointer rounded-xl border-2 text-sm font-semibold text-muted-foreground transition-all duration-200 focus:text-primary active:border-primary data-active:bg-background data-active:text-foreground data-active:shadow-sm`}
            >
              Job
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-5" value="role">
            <div className="space-y-2">
              <Label>Role Choice</Label>
              <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
                {roleChoices.map((roleChoice, index) => {
                  const roleId = `role-choice-${index}`
                  return (
                    <label
                      key={`${roleChoice}-${index}`}
                      htmlFor={roleId}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border/50 bg-background px-3 py-2"
                    >
                      <input
                        id={roleId}
                        type="radio"
                        name="selected-role-choice"
                        value={roleChoice}
                        checked={selectedRole === roleChoice}
                        onChange={() => setSelectedRole(roleChoice)}
                      />
                      <span className="text-sm font-medium">{roleChoice}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                className="min-h-24"
                placeholder="Add an optional message to include in the congratulations email"
                value={roleNote}
                onChange={(event) => setRoleNote(event.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={sendEmailMutation.isPending}
              onClick={sendRoleSelection}
            >
              {sendEmailMutation.isPending
                ? "Sending..."
                : "Send Role Selection Message"}
            </Button>
          </TabsContent>

          <TabsContent className="space-y-5" value="job">
            {categories.map((category) => (
              <EvaluationScoreInput
                key={category}
                label={category}
                value={scores[category]}
                onChange={(value) =>
                  setScores((prev) => ({
                    ...prev,
                    [category]: value,
                  }))
                }
              />
            ))}

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Total Score
              </p>
              <p className="text-3xl font-bold text-primary">{total} / 25</p>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                className="min-h-28"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                {statusActions.map((action) => (
                  <Button
                    key={action.value}
                    className={action.className}
                    disabled={updateMutation.isPending}
                    variant="outline"
                    onClick={() => saveWithStatus(action.value)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Current status:{" "}
                <span className="font-semibold">{currentStatus}</span>
              </p>
            </div>

            <Button
              className="w-full"
              disabled={updateMutation.isPending}
              onClick={saveEvaluation}
            >
              {updateMutation.isPending ? "Saving..." : "Save Evaluation"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
