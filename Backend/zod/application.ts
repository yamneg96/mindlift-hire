import { z } from "zod";

export const applySchema = z.object({
  applicationType: z.enum(["role", "job"]).default("role"),
  roleId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  motivationLetter: z.string().min(5).optional().or(z.literal("")),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  skills: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }),
  experienceLevel: z.string().optional(),
  availability: z.string().optional(),
  expectedContribution: z.string().optional(),
});

export const updateApplicationDecisionSchema = z.object({
  status: z.enum(["approved", "rejected", "shortlisted", "pending"]),
  adminNotes: z.string().optional(),
  pipelineStage: z
    .enum(["Applied", "Screening", "Interview", "Final Decision"])
    .optional(),
});

export const adminFilterSchema = z.object({
  role: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "shortlisted"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  skill: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  export: z.enum(["csv"]).optional(),
});
