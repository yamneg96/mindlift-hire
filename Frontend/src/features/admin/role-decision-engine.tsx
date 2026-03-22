import { useState, useMemo } from "react"
import { useAppStore } from "@/store/app-store"
import { useNavigate } from "react-router-dom"
import { pathFromRoute } from "@/lib/routes"
import { generateRoleSuggestions } from "@/lib/decision/roleMatcher"
import type { Applicant } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DocumentPreviewCard } from "@/components/document-preview-card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { useAdminStatsQuery } from "@/lib/api/hooks"

export type RoleDecisionEngineProps = {
  applicants: Applicant[]
  onAssignmentsChange?: (assignments: Record<string, string>) => void
}

export function RoleDecisionEngine({
  applicants,
  onAssignmentsChange,
}: RoleDecisionEngineProps) {
  const [selectedAssignments, setSelectedAssignments] = useState<
    Record<string, string>
  >({})
  const [remainingApplicants, setRemainingApplicants] =
    useState<Applicant[]>(applicants)
  const [conflictSelections, setConflictSelections] = useState<
    Record<string, string>
  >({})
  const [finalized, setFinalized] = useState(false)

  const suggestions = useMemo(
    () => generateRoleSuggestions(remainingApplicants, selectedAssignments),
    [remainingApplicants, selectedAssignments]
  )

  const statsQuery = useAdminStatsQuery(true)
  const totalRoles = statsQuery.data?.applicationsPerRole.length ?? 0
  const assignedCount = Object.keys(selectedAssignments).length
  const progress = Math.round((assignedCount / totalRoles) * 100)

  const setEmailIntent = useAppStore((state) => state.setEmailIntent)
  const navigate = useNavigate()

  function assignRole(role: string, applicantId: string) {
    const applicant = applicants.find((a) => a.id === applicantId)
    const newAssignments = { ...selectedAssignments, [role]: applicantId }
    const newApplicants = remainingApplicants.filter(
      (a) => a.id !== applicantId
    )

    for (const a of newApplicants) {
      if (a.roleChoices[0] === role) {
        a.roleChoices = a.roleChoices.slice(1)
      }
    }

    setSelectedAssignments(newAssignments)
    setRemainingApplicants(newApplicants)
    setConflictSelections((prev) => {
      const copy = { ...prev }
      delete copy[role]
      return copy
    })

    if (onAssignmentsChange) onAssignmentsChange(newAssignments)
    if (
      newApplicants.length === 0 ||
      Object.keys(newAssignments).length === totalRoles
    ) {
      setFinalized(true)
    }

    // Redirect to email page with congratulation message
    if (applicant) {
      setEmailIntent({
        recipient: applicant.email,
        subject: `Congratulations, ${applicant.name}! Your Role Assignment at MindLift`,
        message: `Dear ${applicant.name},\n\nCongratulations! We are pleased to inform you that you have been selected for the role of ${role} at MindLift.\n\nWelcome to the team!\n\nBest regards,\nMindLift Admin Team`,
      })
      navigate(pathFromRoute("admin-email"))
    }
  }

  function handleConflictSelect(role: string, applicantId: string) {
    setConflictSelections((prev) => ({ ...prev, [role]: applicantId }))
  }

  function confirmConflict(role: string) {
    const applicantId = conflictSelections[role]
    if (applicantId) assignRole(role, applicantId)
  }

  function resetDecision() {
    setSelectedAssignments({})
    setRemainingApplicants(
      applicants.map((a) => ({ ...a, roleChoices: [...a.roleChoices] }))
    )
    setConflictSelections({})
    setFinalized(false)
  }

  return (
    <div className="space-y-8 bg-background p-6 font-sans text-foreground">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Role Decision Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            Optimizing talent placement for PI-ERP
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="text-right">
            <span className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Progress
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {assignedCount} / {totalRoles} Assigned
            </span>
          </div>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <Button
            variant="outline"
            onClick={resetDecision}
            size="sm"
            className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            Reset
          </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {/* AUTO ASSIGNMENTS */}
        {suggestions.auto.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Auto Assignments
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.auto.map(({ role, applicant }) => (
                <motion.div
                  key={role}
                  layout
                  className="flex flex-col gap-3 rounded-xl border-2 border-primary bg-card p-5 shadow-lg shadow-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black tracking-tighter text-primary uppercase">
                      {role}
                    </span>
                    <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-base leading-none font-bold">
                      {applicant.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {applicant.email}
                    </div>
                  </div>
                  <Button
                    className="mt-2 w-full cursor-pointer font-bold shadow-md shadow-primary/20"
                    variant="default"
                    onClick={() => assignRole(role, applicant.id)}
                  >
                    Accept Recommendation & Email
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CONFLICTS */}
        {suggestions.conflict.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />
              Critical Conflicts
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.conflict.map(({ role, applicants }) => (
                <motion.div
                  key={role}
                  className="rounded-xl border border-border bg-accent/20 p-5 backdrop-blur-sm"
                >
                  <div className="mb-4 text-sm font-black tracking-tighter text-foreground/80 uppercase">
                    {role}
                  </div>
                  <div className="space-y-2">
                    {applicants.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center gap-3 rounded-lg border p-2.5 transition-all ${
                          conflictSelections[role] === a.id
                            ? "border-primary bg-card shadow-sm ring-1 ring-primary/50"
                            : "border-transparent bg-transparent opacity-80"
                        }`}
                      >
                        <Checkbox
                          checked={conflictSelections[role] === a.id}
                          onCheckedChange={() =>
                            handleConflictSelect(role, a.id)
                          }
                          id={`conflict-${role}-${a.id}`}
                          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                        <label
                          htmlFor={`conflict-${role}-${a.id}`}
                          className="min-w-0 flex-1 cursor-pointer"
                        >
                          <div className="truncate text-sm font-bold">
                            {a.name}
                          </div>
                          <div className="truncate text-[10px] text-muted-foreground">
                            {a.email}
                          </div>
                        </label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                            >
                              <EyeIcon />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg border-border bg-card">
                            <DocumentPreviewCard
                              name={a.documents[0]?.name || "CV"}
                              size={a.documents[0]?.size || ""}
                              type={a.documents[0]?.type || ""}
                              url={a.documents[0]?.url}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant={conflictSelections[role] ? "default" : "secondary"}
                    disabled={!conflictSelections[role]}
                    onClick={() => {
                      if (conflictSelections[role])
                        assignRole(role, conflictSelections[role]!)
                    }}
                  >
                    Resolve & Assign & Email
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* NEXT ROUND */}
        {suggestions.nextRound.length > 0 && !finalized && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              Queue for Next Round
            </h3>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
              <div className="mb-4 text-sm font-medium text-muted-foreground italic">
                The following applicants are being re-evaluated based on their
                alternative role choices:
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {suggestions.nextRound.map((a) => (
                  <span
                    key={a.id}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground shadow-sm"
                  >
                    {a.name}{" "}
                    <span className="ml-1 text-primary/60">
                      → {a.roleChoices[0] || "End of List"}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* FINALIZED */}
        {finalized && (
          <motion.section
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-widest text-foreground/50 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
              Finalized Deployment
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(selectedAssignments).map(
                ([role, applicantId]) => {
                  const applicant = applicants.find((a) => a.id === applicantId)
                  return (
                    <div
                      key={role}
                      className="rounded-xl border border-border bg-secondary/50 p-4 opacity-70 grayscale-[0.2]"
                    >
                      <div className="mb-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                        {role}
                      </div>
                      <div className="text-base font-bold">
                        {applicant?.name || "Unassigned"}
                      </div>
                      <div className="text-xs text-muted-foreground italic">
                        {applicant?.email}
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}
