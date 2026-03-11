import { Download } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { ApplicantTable } from "@/features/admin/applicant-table"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api/client"
import {
  useAdminDeleteApplicationMutation,
  mapApplicationToApplicant,
  useAdminApplicationsQuery,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"
import { useAppStore } from "@/store/app-store"
import { useFeedbackModal } from "@/components/feedback-modal-provider"

export function ApplicantListPage({
  onNavigate,
}: {
  onNavigate: (
    target:
      | "admin-login"
      | "admin-dashboard"
      | "admin-roles"
      | "admin-settings"
      | "admin-email"
      | "applicant-list"
      | "applicant-details"
      | "landing"
  ) => void
}) {
  const { confirmDelete, showError, showSuccess } = useFeedbackModal()
  const setSelectedApplicationId = useAppStore(
    (state) => state.setSelectedApplicationId
  )
  const token = useAppStore((state) => state.token)
  const applicationsQuery = useAdminApplicationsQuery({ page: 1, limit: 50 })
  const deleteApplicationMutation = useAdminDeleteApplicationMutation()
  const applicants = (applicationsQuery.data?.items ?? []).map(
    mapApplicationToApplicant
  )

  return (
    <AdminLayout current="applicants" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Applicants</h1>
          <p className="text-sm text-muted-foreground">
            {applicants.length} candidates available for review
          </p>
        </div>
        <Button
          className="gap-2"
          variant="outline"
          onClick={() => {
            const url = `${API_BASE}/admin/applications?export=csv`
            if (!token) {
              return
            }
            fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.blob())
              .then((blob) => {
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = "applications.csv"
                link.click()
                URL.revokeObjectURL(link.href)
              })
              .catch(() => {
                // no-op; list still usable if export fails
              })
          }}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </header>

      {applicationsQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading applicants...
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          title="No Applicants Yet"
          description="This workspace is connected to live backend data. Applications will appear here once candidates submit forms."
        />
      ) : (
        <ApplicantTable
          items={applicants}
          onViewDetails={(item) => {
            setSelectedApplicationId(item.id)
            onNavigate("applicant-details")
          }}
          onDelete={(item) => {
            void (async () => {
              const confirmed = await confirmDelete({
                title: "Delete Applicant",
                description: `Delete applicant "${item.name}"? This cannot be undone.`,
                confirmLabel: "Delete Applicant",
              })
              if (!confirmed) {
                return
              }

              try {
                await deleteApplicationMutation.mutateAsync({ id: item.id })
                showSuccess({
                  title: "Applicant Deleted",
                  description: "The applicant has been removed.",
                })
              } catch (error) {
                showError({
                  title: "Delete Failed",
                  description: (error as Error).message,
                })
              }
            })()
          }}
        />
      )}
    </AdminLayout>
  )
}
