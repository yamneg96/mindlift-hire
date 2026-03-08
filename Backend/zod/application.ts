import { z } from "zod";

export const applySchema = z.object({
  roleId: z.string().min(1),
  motivationLetter: z.string().min(20),
  experienceLevel: z.string().min(1),
  availability: z.string().min(1),
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
