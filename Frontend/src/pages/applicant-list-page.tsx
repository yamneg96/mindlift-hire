import { Download } from "lucide-react"

import { ApplicantTable } from "@/features/admin/applicant-table"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/layouts/admin-layout"
import { applicants } from "@/lib/mock-data"

export function ApplicantListPage({
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
  return (
    <AdminLayout current="applicants" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Applicants</h1>
          <p className="text-sm text-muted-foreground">
            1,284 total candidates processed this month
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="size-4" />
          Export CSV
        </Button>
      </header>

      <ApplicantTable
        items={applicants}
        onViewDetails={() => onNavigate("applicant-details")}
      />
    </AdminLayout>
  )
}
