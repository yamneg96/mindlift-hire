import {
  BarChart3,
  ClipboardList,
  History,
  PlusCircle,
  Bolt,
  FileText,
  Clock3,
} from "lucide-react"

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
import { AdminLayout } from "@/layouts/admin-layout"
import { activityFeed, applicants, dashboardStats } from "@/lib/mock-data"

export function AdminDashboardPage({
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
              {[45, 78, 30, 62, 22].map((value, index) => (
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
                {applicants.slice(0, 4).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4">{item.name}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.score}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate("applicant-details")}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </AdminLayout>
  )
}
