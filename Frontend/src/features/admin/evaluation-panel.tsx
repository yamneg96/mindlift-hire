import { useMemo, useState } from "react"

import { EvaluationScoreInput } from "@/components/evaluation-score-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdminUpdateApplicationMutation } from "@/lib/api/hooks"
import type { Applicant } from "@/lib/mock-data"

const categories: Array<keyof Applicant["evaluation"]> = [
  "Experience",
  "Education",
  "Skills",
  "Motivation",
  "Leadership",
]

export function EvaluationPanel({
  applicant,
  applicationId,
  initialStatus,
}: {
  applicant: Applicant
  applicationId: string
  initialStatus: "pending" | "approved" | "rejected" | "shortlisted"
}) {
  const [scores, setScores] = useState(applicant.evaluation)
  const [notes, setNotes] = useState(applicant.notes)
  const updateMutation = useAdminUpdateApplicationMutation()

  const total = useMemo(
    () => categories.reduce((acc, category) => acc + scores[category], 0),
    [scores]
  )

  const saveEvaluation = async () => {
    const scoreSummary = categories
      .map((category) => `${category}: ${scores[category]}/5`)
      .join(" | ")

    const scoreLine = `Evaluation Scores -> ${scoreSummary} (Total: ${total}/25)`
    const mergedNotes = [notes.trim(), scoreLine].filter(Boolean).join("\n")

    try {
      await updateMutation.mutateAsync({
        id: applicationId,
        status: initialStatus,
        adminNotes: mergedNotes,
      })
      setNotes(mergedNotes)
    } catch {
      // no-op; error shown below
    }
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

        <Button
          className="w-full"
          disabled={updateMutation.isPending}
          onClick={saveEvaluation}
        >
          {updateMutation.isPending ? "Saving..." : "Save Evaluation"}
        </Button>
        {updateMutation.isSuccess ? (
          <p className="text-sm text-primary">Evaluation saved.</p>
        ) : null}
        {updateMutation.isError ? (
          <p className="text-sm text-destructive">
            {(updateMutation.error as Error).message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
