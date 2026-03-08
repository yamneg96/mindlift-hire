import { MessageSquareText, User, BriefcaseBusiness } from "lucide-react"

import { DocumentPreviewCard } from "@/components/document-preview-card"
import { EmptyState } from "@/components/empty-state"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EvaluationPanel } from "@/features/admin/evaluation-panel"
import {
  mapApplicationToApplicant,
  useApplicationByIdQuery,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"
import { useAppStore } from "@/store/app-store"

export function ApplicantDetailsPage({
  onNavigate,
}: {
  onNavigate: (
    target:
      | "admin-dashboard"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => void
}) {
  const selectedApplicationId = useAppStore(
    (state) => state.selectedApplicationId
  )
  const detailsQuery = useApplicationByIdQuery(selectedApplicationId, true)
  const applicant = detailsQuery.data
    ? mapApplicationToApplicant(detailsQuery.data)
    : null

  return (
    <AdminLayout current="details" onNavigate={onNavigate}>
      {!selectedApplicationId ? (
        <EmptyState
          title="No Applicant Selected"
          description="Open an applicant from the Applicants page to view full details and evaluation controls."
          actionLabel="Go to Applicants"
          onAction={() => onNavigate("applicant-list")}
        />
      ) : detailsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading applicant details...
        </div>
      ) : !applicant ? (
        <EmptyState
          title="Applicant Data Unavailable"
          description="The selected applicant could not be loaded from the backend."
        />
      ) : (
        <>
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Applicant Details
              </h1>
              <p className="text-sm text-muted-foreground">
                Candidate profile and evaluation workflow.
              </p>
            </div>
            <StatusBadge status={applicant.status} />
          </header>

          <Card className="mb-5 border border-border py-0">
            <CardContent className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {applicant.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {applicant.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <BriefcaseBusiness className="size-4" />
                    {applicant.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Applied on{" "}
                    {new Date(applicant.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <Card className="border border-border py-0">
                <CardHeader className="border-b border-border py-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-4" />
                    Candidate Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 p-5 text-sm md:grid-cols-2">
                  <Info label="Name" value={applicant.name} />
                  <Info label="Role" value={applicant.role} />
                  <Info label="Email" value={applicant.email} />
                  <Info label="Phone" value={applicant.phone} />
                  <Info label="Location" value={applicant.location} />
                  <Info label="LinkedIn" value={applicant.linkedin} />
                </CardContent>
              </Card>

              <Card className="border border-border py-0">
                <CardHeader className="border-b border-border py-4">
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
                  {applicant.documents.map((doc) => (
                    <DocumentPreviewCard
                      key={doc.name}
                      name={doc.name}
                      size={doc.size}
                      type={doc.type}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-border py-0">
                <CardHeader className="border-b border-border py-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquareText className="size-4" />
                    Motivation Letter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-sm leading-7 text-muted-foreground">
                  {applicant.motivationLetter}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5 lg:col-span-5">
              <EvaluationPanel applicant={applicant} />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
