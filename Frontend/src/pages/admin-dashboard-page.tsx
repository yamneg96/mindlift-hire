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
  useCreateJobMutation,
} from "@/lib/api/hooks"
import { AdminLayout } from "@/layouts/admin-layout"
import { useAppStore } from "@/store/app-store"

export function AdminDashboardPage({
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
  const setSelectedApplicationId = useAppStore(
    (state) => state.setSelectedApplicationId
  )
  const statsQuery = useAdminStatsQuery(true)
  const recentQuery = useAdminApplicationsQuery({ page: 1, limit: 4 })
  const createJobMutation = useCreateJobMutation()

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
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
  const roleChartItems = (statsQuery.data?.applicationsPerRole ?? []).slice(
    0,
    5
  )
  const roleChartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]
  const totalRoleApplications = roleChartItems.reduce(
    (sum, item) => sum + item.count,
    0
  )
  const rolePieGradient =
    totalRoleApplications > 0
      ? `conic-gradient(${roleChartItems
          .map((item, index) => {
            const startDeg = roleChartItems
              .slice(0, index)
              .reduce((sum, segment) => sum + segment.count, 0)
            const endDeg = startDeg + item.count

            return `${roleChartColors[index % roleChartColors.length]} ${(startDeg / totalRoleApplications) * 360}deg ${(endDeg / totalRoleApplications) * 360}deg`
          })
          .join(", ")})`
      : ""

  const activityItems = (recentQuery.data?.items ?? [])
    .slice(0, 5)
    .map((item) => {
      const role = item.roleId
      const roleTitle =
        !role || typeof role === "string"
          ? "Unknown Role"
          : (role.title ?? "Unknown Role")

      const statusLabel =
        item.status === "pending"
          ? "pending review"
          : item.status === "shortlisted"
            ? "shortlisted"
            : item.status === "approved"
              ? "approved"
              : "rejected"

      const appliedAt = item.appliedAt ? new Date(String(item.appliedAt)) : null
      const appliedAtLabel =
        appliedAt && !Number.isNaN(appliedAt.getTime())
          ? appliedAt.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "an unknown date"

      return `${item.applicantName ?? "Unknown Applicant"} submitted for ${roleTitle} (${statusLabel}) on ${appliedAtLabel}.`
    })

  const submitNewPosting = async () => {
    const parsedMax = Number(maxApplicants)
    if (!title.trim() || !department.trim() || description.trim().length < 10) {
      return
    }

    if (!Number.isFinite(parsedMax) || parsedMax <= 0) {
      return
    }

    try {
      await createJobMutation.mutateAsync({
        title: title.trim(),
        department: department.trim(),
        description: description.trim(),
        imageFile,
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
      setImageFile(null)
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
              Publish a job posting for the job application pipeline.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
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
            <div className="space-y-2">
              <Label>Preview Image (Optional)</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
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
            {createJobMutation.isError ? (
              <p className="text-sm text-destructive">
                {(createJobMutation.error as Error).message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={createJobMutation.isPending}
              onClick={submitNewPosting}
            >
              {createJobMutation.isPending ? "Publishing..." : "Publish Job"}
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
            {statsQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading role application data...
              </div>
            ) : roleChartItems.length === 0 ? (
              <EmptyState
                title="No Role Application Data"
                description="Role-level application counts will appear here as applicants submit forms."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="flex justify-center">
                  <div
                    className="relative size-44 rounded-full border border-border"
                    style={{ backgroundImage: rolePieGradient }}
                  >
                    <div className="absolute inset-7 flex items-center justify-center rounded-full border border-border bg-card text-center">
                      <div>
                        <p className="text-xl font-bold">
                          {totalRoleApplications}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Applications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {roleChartItems.map((item, index) => {
                    const percentage = Math.round(
                      (item.count / totalRoleApplications) * 100
                    )

                    return (
                      <div
                        key={item.roleId}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                roleChartColors[index % roleChartColors.length],
                            }}
                          />
                          <span className="truncate text-sm font-medium">
                            {item.roleTitle}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
            {recentQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading recent activity...
              </div>
            ) : activityItems.length === 0 ? (
              <EmptyState
                title="No Activity Yet"
                description="Recent admin-relevant activity will show up here as applications come in."
              />
            ) : (
              activityItems.map((entry) => (
                <div
                  key={entry}
                  className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground"
                >
                  {entry}
                </div>
              ))
            )}
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
