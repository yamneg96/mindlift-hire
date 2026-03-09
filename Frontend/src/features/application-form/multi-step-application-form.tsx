import { useMemo, useState } from "react"
import {
  FileText,
  Link as LinkIcon,
  User,
  BriefcaseBusiness,
  ClipboardCheck,
} from "lucide-react"

import { FileUploadField } from "@/components/file-upload-field"
import { FormSection } from "@/components/form-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRolesQuery } from "@/lib/api/hooks"

const stepNames = [
  "Personal Info",
  "Professional Info",
  "Documents",
  "Links",
  "Review & Submit",
] as const

export function MultiStepApplicationForm() {
  const [step, setStep] = useState(0)
  const [roleId, setRoleId] = useState("")
  const rolesQuery = useRolesQuery()

  const progress = useMemo(() => ((step + 1) / stepNames.length) * 100, [step])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <p className="font-semibold">Application Progress</p>
          <p className="font-semibold text-primary">
            Step {step + 1} of {stepNames.length}
          </p>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground md:grid-cols-5">
          {stepNames.map((name, index) => (
            <span key={name} className={index === step ? "text-primary" : ""}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {step === 0 ? (
        <FormSection
          icon={<User className="size-4 text-primary" />}
          title="Personal Info"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name" placeholder="Jane Doe" />
            <Field label="Email" placeholder="jane@example.com" type="email" />
            <Field label="Phone" placeholder="+1 (555) 000 0000" />
            <Field label="Location" placeholder="San Francisco, CA" />
          </div>
        </FormSection>
      ) : null}

      {step === 1 ? (
        <FormSection
          icon={<BriefcaseBusiness className="size-4 text-primary" />}
          title="Professional Info"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Selection</Label>
              {rolesQuery.isLoading ? (
                <div className="h-10 animate-pulse rounded-lg border border-border bg-muted/40" />
              ) : (rolesQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open roles available yet.
                </p>
              ) : (
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rolesQuery.data ?? []).map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Field
              label="Core Skills"
              placeholder="Program design, Facilitation"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Years of Experience"
                placeholder="5"
                type="number"
              />
              <Field label="Highest Education" placeholder="MSc Psychology" />
            </div>
          </div>
        </FormSection>
      ) : null}

      {step === 2 ? (
        <FormSection
          icon={<FileText className="size-4 text-primary" />}
          title="Documents"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FileUploadField helper="Upload PDF or DOCX" label="CV" />
            <FileUploadField
              helper="Upload PDF or DOCX"
              label="Motivation Letter"
            />
            <FileUploadField
              helper="Optional supporting files"
              label="Additional Documents"
            />
          </div>
        </FormSection>
      ) : null}

      {step === 3 ? (
        <FormSection
          icon={<LinkIcon className="size-4 text-primary" />}
          title="Links"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="LinkedIn" placeholder="linkedin.com/in/username" />
            <Field
              label="Portfolio / GitHub"
              placeholder="https://portfolio.com"
            />
          </div>
        </FormSection>
      ) : null}

      {step === 4 ? (
        <FormSection
          icon={<ClipboardCheck className="size-4 text-primary" />}
          title="Review & Submit"
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Review all details before final submission.</p>
            <Textarea
              className="min-h-32"
              placeholder="Final note to the MindLift hiring team"
            />
            <p className="text-xs">
              By submitting, you agree to the Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </FormSection>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <Button
          disabled={step === 0}
          type="button"
          variant="outline"
          onClick={() => setStep((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary">
            Save Draft
          </Button>
          {step === stepNames.length - 1 ? (
            <Button type="button">Submit Application</Button>
          ) : (
            <Button
              type="button"
              onClick={() =>
                setStep((p) => Math.min(stepNames.length - 1, p + 1))
              }
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input className="h-10" placeholder={placeholder} type={type} />
    </div>
  )
}
