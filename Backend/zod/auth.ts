import { z } from "zod";

export const registerSchema = z.never();

export const loginSchema = z.never();

export const googleAuthSchema = z.object({
  credential: z.string().min(1),
});
