import { z } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  department: z.string().min(2),
  requiredSkills: z.array(z.string()).default([]),
  status: z.enum(["open", "closed"]).default("open"),
  maxApplicants: z.number().int().positive().default(100),
});

export const updateRoleSchema = createRoleSchema.partial();
