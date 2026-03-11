import { useMemo, useState } from "react"
import { BriefcaseBusiness, PlusCircle, Trash2 } from "lucide-react"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  useAdminRolesQuery,
  useCreateRoleMutation,
  useCreateRolesBulkMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "@/lib/api/hooks"
import type { RoleApi } from "@/lib/api/schemas"
import { AdminLayout } from "@/layouts/admin-layout"

type AdminNavigate = (
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

type RoleFormState = {
  title: string
  department: string
  description: string
  requiredSkills: string
  maxApplicants: string
  status: "open" | "closed"
  imageFile: File | null
}

const emptyRoleForm: RoleFormState = {
  title: "",
  department: "",
  description: "",
  requiredSkills: "",
  maxApplicants: "100",
  status: "open",
  imageFile: null,
}

function parseSkills(input: string): string[] {
  return input
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
}

export function AdminRolesPage({ onNavigate }: { onNavigate: AdminNavigate }) {
  const rolesQuery = useAdminRolesQuery(true)
  const createRoleMutation = useCreateRoleMutation()
  const createRolesBulkMutation = useCreateRolesBulkMutation()
  const updateRoleMutation = useUpdateRoleMutation()
  const deleteRoleMutation = useDeleteRoleMutation()

  const [createForm, setCreateForm] = useState<RoleFormState>(emptyRoleForm)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleApi | null>(null)
  const [editForm, setEditForm] = useState<RoleFormState>(emptyRoleForm)
  const [bulkJsonInput, setBulkJsonInput] = useState("")
  const [bulkError, setBulkError] = useState("")
  const [isBulkOpen, setIsBulkOpen] = useState(false)

  const totalOpenRoles = useMemo(
    () =>
      (rolesQuery.data ?? []).filter((role) => role.status === "open").length,
    [rolesQuery.data]
  )

  const submitCreate = async () => {
    const maxApplicants = Number(createForm.maxApplicants)
    if (
      !createForm.title.trim() ||
      !createForm.department.trim() ||
      createForm.description.trim().length < 10 ||
      !Number.isFinite(maxApplicants) ||
      maxApplicants <= 0
    ) {
      return
    }

    await createRoleMutation.mutateAsync({
      title: createForm.title.trim(),
      department: createForm.department.trim(),
      description: createForm.description.trim(),
      imageFile: createForm.imageFile,
      requiredSkills: parseSkills(createForm.requiredSkills),
      maxApplicants: Math.round(maxApplicants),
      status: createForm.status,
    })

    setCreateForm(emptyRoleForm)
    setIsCreateOpen(false)
  }

  const startEdit = (role: RoleApi) => {
    setEditingRole(role)
    setEditForm({
      title: role.title,
      department: role.department,
      description: role.description,
      requiredSkills: (role.requiredSkills ?? []).join(", "),
      maxApplicants: String(role.maxApplicants),
      status: role.status,
      imageFile: null,
    })
  }

  const submitEdit = async () => {
    if (!editingRole) {
      return
    }

    const maxApplicants = Number(editForm.maxApplicants)
    if (
      !editForm.title.trim() ||
      !editForm.department.trim() ||
      editForm.description.trim().length < 10 ||
      !Number.isFinite(maxApplicants) ||
      maxApplicants <= 0
    ) {
      return
    }

    await updateRoleMutation.mutateAsync({
      id: editingRole._id,
      title: editForm.title.trim(),
      department: editForm.department.trim(),
      description: editForm.description.trim(),
      imageFile: editForm.imageFile,
      requiredSkills: parseSkills(editForm.requiredSkills),
      maxApplicants: Math.round(maxApplicants),
      status: editForm.status,
    })

    setEditingRole(null)
  }

  const removeRole = async (role: RoleApi) => {
    const confirmed = window.confirm(
      `Delete role \"${role.title}\"? This action cannot be undone.`
    )
    if (!confirmed) {
      return
    }

    await deleteRoleMutation.mutateAsync({ id: role._id })
    if (editingRole?._id === role._id) {
      setEditingRole(null)
    }
  }

  const submitBulkCreate = async () => {
    setBulkError("")

    let parsed: unknown
    try {
      parsed = JSON.parse(bulkJsonInput)
    } catch {
      setBulkError("Invalid JSON format. Please provide a JSON array.")
      return
    }

    if (!Array.isArray(parsed)) {
      setBulkError("Bulk payload must be a JSON array of roles.")
      return
    }

    try {
      await createRolesBulkMutation.mutateAsync(
        parsed as Array<{
          title: string
          description: string
          department: string
          imageUrl?: string
          requiredSkills?: string[]
          status?: "open" | "closed"
          maxApplicants?: number
        }>
      )
      setBulkJsonInput("")
      setIsBulkOpen(false)
    } catch (error) {
      setBulkError((error as Error).message)
    }
  }

  return (
    <AdminLayout current="roles" onNavigate={onNavigate}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Manage posted roles, details, capacity, status, and preview image
            URL.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsBulkOpen(true)}>
            Bulk JSON Import
          </Button>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="size-4" />
            New Role
          </Button>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border border-border py-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Posted Roles</p>
            <p className="mt-2 text-3xl font-bold">
              {rolesQuery.data?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border py-0">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Open Roles</p>
            <p className="mt-2 text-3xl font-bold">{totalOpenRoles}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border border-border py-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BriefcaseBusiness className="size-4" />
            Posted Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rolesQuery.isLoading ? (
            <div className="p-5 text-sm text-muted-foreground">
              Loading roles...
            </div>
          ) : (rolesQuery.data ?? []).length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">
              No roles posted yet. Create your first role.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rolesQuery.data ?? []).map((role) => (
                  <TableRow key={role._id}>
                    <TableCell className="px-4">{role.title}</TableCell>
                    <TableCell>{role.department}</TableCell>
                    <TableCell>{role.status}</TableCell>
                    <TableCell>{role.maxApplicants}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteRoleMutation.isPending}
                          onClick={() => void removeRole(role)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {deleteRoleMutation.isError ? (
            <p className="p-5 text-sm text-destructive">
              {(deleteRoleMutation.error as Error).message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Preview image is optional. Upload one image file for this role.
            </DialogDescription>
          </DialogHeader>
          <RoleFormFields value={createForm} onChange={setCreateForm} />
          {createRoleMutation.isError ? (
            <p className="text-sm text-destructive">
              {(createRoleMutation.error as Error).message}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createRoleMutation.isPending}
              onClick={submitCreate}
            >
              {createRoleMutation.isPending ? "Publishing..." : "Publish Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle>Bulk Create Roles (JSON)</DialogTitle>
            <DialogDescription>
              Paste a JSON array of roles. Example fields: title, description,
              department, requiredSkills, status, maxApplicants.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Textarea
              className="min-h-56 font-mono text-xs"
              placeholder={`[\n  {\n    \"title\": \"Frontend Developer\",\n    \"description\": \"Build accessible UI components\",\n    \"department\": \"Engineering\",\n    \"requiredSkills\": [\"React\", \"TypeScript\"],\n    \"status\": \"open\",\n    \"maxApplicants\": 100\n  }\n]`}
              value={bulkJsonInput}
              onChange={(event) => setBulkJsonInput(event.target.value)}
            />
            {bulkError ? (
              <p className="mt-2 text-sm text-destructive">{bulkError}</p>
            ) : null}
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => setIsBulkOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createRolesBulkMutation.isPending}
              onClick={submitBulkCreate}
            >
              {createRolesBulkMutation.isPending
                ? "Importing..."
                : "Import Roles"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingRole)}
        onOpenChange={(open) => !open && setEditingRole(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update title, description, capacity, image URL, and status.
            </DialogDescription>
          </DialogHeader>
          <RoleFormFields
            value={editForm}
            onChange={setEditForm}
            existingImageUrl={editingRole?.imageUrl}
          />
          {updateRoleMutation.isError ? (
            <p className="text-sm text-destructive">
              {(updateRoleMutation.error as Error).message}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button
              disabled={updateRoleMutation.isPending}
              onClick={submitEdit}
            >
              {updateRoleMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function RoleFormFields({
  value,
  onChange,
  existingImageUrl,
}: {
  value: RoleFormState
  onChange: (next: RoleFormState) => void
  existingImageUrl?: string
}) {
  const setField = <K extends keyof RoleFormState>(
    key: K,
    fieldValue: RoleFormState[K]
  ) => {
    onChange({ ...value, [key]: fieldValue })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Role Title</Label>
        <Input
          placeholder="Community Program Manager"
          value={value.title}
          onChange={(event) => setField("title", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Department</Label>
        <Input
          placeholder="Operations"
          value={value.department}
          onChange={(event) => setField("department", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          className="min-h-24"
          placeholder="Describe the role and responsibilities"
          value={value.description}
          onChange={(event) => setField("description", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Preview Image (Optional)</Label>
        <Input
          accept="image/*"
          type="file"
          onChange={(event) =>
            setField("imageFile", event.target.files?.[0] ?? null)
          }
        />
        {existingImageUrl ? (
          <p className="text-xs text-muted-foreground">
            Current image: {existingImageUrl}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Required Skills (comma separated)</Label>
          <Input
            placeholder="Counseling, Program Design"
            value={value.requiredSkills}
            onChange={(event) => setField("requiredSkills", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Applicants</Label>
          <Input
            type="number"
            min={1}
            value={value.maxApplicants}
            onChange={(event) => setField("maxApplicants", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={value.status}
          onValueChange={(next) =>
            setField("status", next as "open" | "closed")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
