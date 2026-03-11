import { useMemo, useState } from "react"

import { EvaluationScoreInput } from "@/components/evaluation-score-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminUpdateApplicationMutation } from "@/lib/api/hooks"
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
  const updateMutation = useAdminUpdateApplicationMutation()

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

  return (
    <Card className="border border-border py-0">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-lg">Evaluation Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-4">
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
      </CardContent>
    </Card>
  )
}
