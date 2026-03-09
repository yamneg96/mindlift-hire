import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  mapApplicationToApplicant,
  useAdminApplicationsQuery,
  useAdminStatsQuery,
  useCreateRoleMutation,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"
import { activityFeed } from "@/lib/mock-data"
import { useAppStore } from "@/store/app-store"

export function AdminDashboardPage({
  onNavigate,
}: {
  onNavigate: (
    target:
      | "admin-login"
      | "admin-dashboard"
      | "admin-settings"
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
  const createRoleMutation = useCreateRoleMutation()

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [description, setDescription] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [maxApplicants, setMaxApplicants] = useState("100")

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

  const submitNewPosting = async () => {
    const parsedMax = Number(maxApplicants)
    if (!title.trim() || !department.trim() || description.trim().length < 10) {
      return
    }

    if (!Number.isFinite(parsedMax) || parsedMax <= 0) {
      return
    }

    try {
      await createRoleMutation.mutateAsync({
        title: title.trim(),
        department: department.trim(),
        description: description.trim(),
        requiredSkills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        status: "open",
        maxApplicants: Math.round(parsedMax),
      })

      setTitle("")
      setDepartment("")
      setDescription("")
      setSkillsInput("")
      setMaxApplicants("100")
      setIsRoleDialogOpen(false)
    } catch {
      // no-op; error is shown in modal
    }
  }

  return (
    <AdminLayout current="dashboard" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of applications and role activity.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsRoleDialogOpen(true)}>
          <PlusCircle className="size-4" />
          New Posting
        </Button>
      </header>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Posting</DialogTitle>
            <DialogDescription>
              Publish a role so it appears in the landing and application pages.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Title</Label>
              <Input
                placeholder="Community Program Manager"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="Operations"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className="min-h-24"
                placeholder="Describe the role and responsibilities"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Required Skills (comma separated)</Label>
                <Input
                  placeholder="Counseling, Program Design"
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Applicants</Label>
                <Input
                  inputMode="numeric"
                  min={1}
                  placeholder="100"
                  type="number"
                  value={maxApplicants}
                  onChange={(event) => setMaxApplicants(event.target.value)}
                />
              </div>
            </div>
            {createRoleMutation.isError ? (
              <p className="text-sm text-destructive">
                {(createRoleMutation.error as Error).message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createRoleMutation.isPending}
              onClick={submitNewPosting}
            >
              {createRoleMutation.isPending ? "Publishing..." : "Publish Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
