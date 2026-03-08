import {
  BarChart3,
  ClipboardList,
  History,
  PlusCircle,
  Bolt,
  FileText,
  Clock3,
} from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mapApplicationToApplicant,
  useAdminApplicationsQuery,
  useAdminStatsQuery,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"
import { activityFeed } from "@/lib/mock-data"
import { useAppStore } from "@/store/app-store"

export function AdminDashboardPage({
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
  const setSelectedApplicationId = useAppStore(
    (state) => state.setSelectedApplicationId
  )
  const statsQuery = useAdminStatsQuery(true)
  const recentQuery = useAdminApplicationsQuery({ page: 1, limit: 4 })

  const dashboardStats = [
    {
      label: "Total Applications",
      value: String(statsQuery.data?.totalApplications ?? 0),
      trend: "Live",
    },
    {
      label: "Active Roles",
      value: String(statsQuery.data?.applicationsPerRole.length ?? 0),
      trend: "Live",
    },
    {
      label: "Pending Review",
      value: String(statsQuery.data?.pendingApplications ?? 0),
      trend: "Live",
    },
  ]

  const recentItems = (recentQuery.data?.items ?? []).map(
    mapApplicationToApplicant
  )

  return (
    <AdminLayout current="dashboard" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of applications and role activity.
          </p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="size-4" />
          New Posting
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Card key={stat.label} className="border border-border py-0">
            <CardContent className="space-y-2 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {index === 0 ? <FileText className="size-4" /> : null}
                  {index === 1 ? <Bolt className="size-4" /> : null}
                  {index === 2 ? <Clock3 className="size-4" /> : null}
                </div>
                <span className="text-xs font-semibold text-primary">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border border-border py-0 lg:col-span-2">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-4" />
              Applications by Role
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid h-52 grid-cols-5 items-end gap-3">
              {[
                ...(statsQuery.data?.applicationsPerRole.map(
                  (item) => item.count
                ) ?? []),
                0,
                0,
                0,
                0,
                0,
              ]
                .slice(0, 5)
                .map((count, _idx, arr) => {
                  const max = Math.max(...arr, 1)
                  return Math.round((count / max) * 100)
                })
                .map((value, index) => (
                  <div
                    key={value + index}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={
                        index === 1
                          ? "w-full rounded-t-md bg-primary"
                          : "w-full rounded-t-md bg-primary/20"
                      }
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {index === 0 ? "Mentors" : null}
                      {index === 1 ? "Counselors" : null}
                      {index === 2 ? "Tutors" : null}
                      {index === 3 ? "Admins" : null}
                      {index === 4 ? "Events" : null}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border py-0">
          <CardHeader className="border-b border-border py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="size-4" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {activityFeed.map((entry) => (
              <div
                key={entry}
                className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground"
              >
                {entry}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border border-border py-0">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="size-4" />
              Recent Submissions
            </CardTitle>
            <Button
              size="sm"
              variant="link"
              onClick={() => onNavigate("applicant-list")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentQuery.isLoading ? (
              <div className="p-5 text-sm text-muted-foreground">
                Loading recent submissions...
              </div>
            ) : recentItems.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No Applications Yet"
                  description="As users begin applying, recent submissions will appear here with status and review actions."
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">Applicant</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4">{item.name}</TableCell>
                      <TableCell>{item.role}</TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApplicationId(item.id)
                            onNavigate("applicant-details")
                          }}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </AdminLayout>
  )
}
