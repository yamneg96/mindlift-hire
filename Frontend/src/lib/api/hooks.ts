import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"

import { apiRequest } from "@/lib/api/client"
import {
  adminLoginOtpResponseSchema,
  adminSendEmailResponseSchema,
  adminVerifyOtpResponseSchema,
  adminApplicationsSchema,
  adminStatsSchema,
  applicationItemSchema,
  roleSchema,
  type ApplicationItemApi,
} from "@/lib/api/schemas"
import type { Applicant } from "@/lib/mock-data"
import { useAppStore } from "@/store/app-store"

const roleListSchema = z.array(roleSchema)

export function useRolesQuery() {
  return useQuery({
    queryKey: ["roles", "open"],
    queryFn: () => apiRequest("/roles", roleListSchema),
  })
}

export function useAdminStatsQuery(enabled = true) {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiRequest("/admin/stats", adminStatsSchema),
    enabled,
  })
}

export function useAdminApplicationsQuery(params?: {
  page?: number
  limit?: number
  status?: string
}) {
  const search = new URLSearchParams()
  if (params?.page) search.set("page", String(params.page))
  if (params?.limit) search.set("limit", String(params.limit))
  if (params?.status) search.set("status", params.status)

  return useQuery({
    queryKey: ["admin", "applications", params],
    queryFn: () =>
      apiRequest(
        `/admin/applications${search.toString() ? `?${search.toString()}` : ""}`,
        adminApplicationsSchema
      ),
  })
}

export function useApplicationByIdQuery(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => apiRequest(`/applications/${id}`, applicationItemSchema),
    enabled: enabled && Boolean(id),
  })
}

export function useAdminLoginOtpMutation() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      apiRequest("/admin/login", adminLoginOtpResponseSchema, {
        method: "POST",
        body: payload,
      }),
  })
}

export function useAdminVerifyOtpMutation() {
  const setAuth = useAppStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      apiRequest("/admin/verify-otp", adminVerifyOtpResponseSchema, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (result) => {
      setAuth(result.token, result.user)
    },
  })
}

export function useApplyMutation() {
  return useMutation({
    mutationFn: (payload: {
      roleId: string
      fullName: string
      email: string
      motivationLetter: string
      linkedin?: string
      portfolioLink?: string
      skills?: string[]
      experienceLevel?: string
      availability?: string
      expectedContribution?: string
      cv: File
      portfolioFile?: File | null
    }) => {
      const formData = new FormData()
      formData.append("roleId", payload.roleId)
      formData.append("fullName", payload.fullName)
      formData.append("email", payload.email)
      formData.append("motivationLetter", payload.motivationLetter)
      formData.append("linkedin", payload.linkedin ?? "")
      formData.append("portfolio", payload.portfolioLink ?? "")
      formData.append("skills", (payload.skills ?? []).join(","))
      formData.append("experienceLevel", payload.experienceLevel ?? "")
      formData.append("availability", payload.availability ?? "")
      formData.append(
        "expectedContribution",
        payload.expectedContribution ?? ""
      )
      formData.append("cv", payload.cv)
      if (payload.portfolioFile) {
        formData.append("portfolio", payload.portfolioFile)
      }

      return apiRequest("/applications/apply", applicationItemSchema, {
        method: "POST",
        body: formData,
        isFormData: true,
      })
    },
  })
}

export function useAdminSendEmailMutation() {
  return useMutation({
    mutationFn: (payload: {
      recipients: string[]
      body: string
      subject?: string
      roleTitle?: string
    }) =>
      apiRequest("/admin/send-email", adminSendEmailResponseSchema, {
        method: "POST",
        body: payload,
      }),
  })
}

export function mapApplicationToApplicant(item: ApplicationItemApi): Applicant {
  const rawRole = item.roleId

  const roleObj =
    typeof rawRole === "string"
      ? { _id: rawRole, title: "Unknown Role" }
      : rawRole

  const statusMap: Record<ApplicationItemApi["status"], Applicant["status"]> = {
    pending: "reviewing",
    approved: "shortlisted",
    shortlisted: "shortlisted",
    rejected: "rejected",
  }

  const name = item.applicantName ?? "Unknown Applicant"

  return {
    id: item._id,
    name,
    email: item.applicantEmail ?? "unknown@example.com",
    initials: name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    role: roleObj.title ?? "Unknown Role",
    submittedAt: item.appliedAt
      ? String(item.appliedAt)
      : new Date().toISOString(),
    score:
      item.status === "approved"
        ? 90
        : item.status === "shortlisted"
          ? 82
          : item.status === "pending"
            ? 70
            : 45,
    status: statusMap[item.status],
    location: "Not provided",
    phone: "Not provided",
    linkedin: item.linkedin || "Not provided",
    experience: [
      item.experienceLevel ||
        item.additionalAnswers?.experienceLevel ||
        "Not provided",
    ],
    education: "Not provided",
    motivationLetter: item.motivationLetter,
    documents: [{ name: "CV", type: "PDF/DOCX", size: "Uploaded" }],
    notes: item.adminNotes ?? "",
    evaluation: {
      Experience: 3,
      Education: 3,
      Skills: 3,
      Motivation: 3,
      Leadership: 3,
    },
  }
}
