import { useMemo, useState } from "react"

import { EvaluationScoreInput } from "@/components/evaluation-score-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Applicant } from "@/lib/mock-data"

const categories: Array<keyof Applicant["evaluation"]> = [
  "Experience",
  "Education",
  "Skills",
  "Motivation",
  "Leadership",
]

export function EvaluationPanel({ applicant }: { applicant: Applicant }) {
  const [scores, setScores] = useState(applicant.evaluation)

  const total = useMemo(
    () => categories.reduce((acc, category) => acc + scores[category], 0),
    [scores]
  )

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
          <Textarea className="min-h-28" defaultValue={applicant.notes} />
        </div>

        <Button className="w-full">Save Evaluation</Button>
      </CardContent>
    </Card>
  )
}
