import { z } from "zod";

export const createRoleSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  department: z.string().min(2),
  imageUrl: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().url().optional()),
  requiredSkills: z
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
  status: z.enum(["open", "closed"]).default("open"),
  maxApplicants: z.coerce.number().int().positive().default(100),
});

export const updateRoleSchema = createRoleSchema.partial();

export const createRoleBulkSchema = z.array(createRoleSchema).min(1).max(100);
