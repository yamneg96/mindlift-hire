import { z } from "zod"

export const apiEnvelopeSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  })

export const roleSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  department: z.string(),
  imageUrl: z.string().optional().default(""),
  requiredSkills: z.array(z.string()).default([]),
  status: z.enum(["open", "closed"]),
  maxApplicants: z.number(),
  createdAt: z.string().optional(),
})

export const jobSchema = roleSchema

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
})

export const loginResponseSchema = z.object({
  token: z.string(),
  user: authUserSchema,
})

export const googleAuthResponseSchema = loginResponseSchema

export const adminLoginOtpResponseSchema = z.object({
  email: z.string().email(),
  otpSent: z.boolean(),
})

export const adminVerifyOtpResponseSchema = loginResponseSchema

export const adminSendEmailResponseSchema = z.object({
  sent: z.number(),
  recipients: z.array(z.string().email()),
})

export const applicationsPerRoleSchema = z.object({
  roleId: z.string(),
  roleTitle: z.string(),
  count: z.number(),
})

export const adminStatsSchema = z.object({
  totalUsers: z.number(),
  totalApplications: z.number(),
  pendingApplications: z.number(),
  approvedApplications: z.number(),
  applicationsPerRole: z.array(applicationsPerRoleSchema),
})

export const populatedUserSchema = z
  .object({
    _id: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    profile: z
      .object({
        skills: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .passthrough()

export const populatedRoleSchema = z
  .object({
    _id: z.string(),
    title: z.string().optional(),
    department: z.string().optional(),
    status: z.string().optional(),
  })
  .passthrough()

export const applicationItemSchema = z.object({
  _id: z.string(),
  applicationType: z.enum(["role", "job"]).optional().default("role"),
  applicantName: z.string().optional().default("Unknown Applicant"),
  applicantEmail: z.string().email().optional().default("unknown@example.com"),
  phone: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  portfolio: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  experienceLevel: z.string().optional().default(""),
  availability: z.string().optional().default(""),
  userId: z.union([z.string(), populatedUserSchema]).optional(),
  roleId: z.union([z.string(), populatedRoleSchema]).optional(),
  secondRoleId: z.union([z.string(), populatedRoleSchema]).optional(),
  thirdRoleId: z.union([z.string(), populatedRoleSchema]).optional(),
  cvUrl: z.string(),
  portfolioUrl: z.string().optional().default(""),
  motivationLetter: z.string(),
  additionalAnswers: z
    .object({
      experienceLevel: z.string().optional().default(""),
      availability: z.string().optional().default(""),
      expectedContribution: z.string().optional().default(""),
    })
    .optional(),
  status: z.enum(["pending", "approved", "rejected", "shortlisted"]),
  adminNotes: z.string().optional().default(""),
  appliedAt: z.string().or(z.date()).optional(),
  reviewedAt: z.string().or(z.date()).optional().nullable(),
})

export const adminApplicationsSchema = z.object({
  items: z.array(applicationItemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

export type RoleApi = z.infer<typeof roleSchema>
export type JobApi = z.infer<typeof jobSchema>
export type AdminStatsApi = z.infer<typeof adminStatsSchema>
export type ApplicationItemApi = z.infer<typeof applicationItemSchema>
