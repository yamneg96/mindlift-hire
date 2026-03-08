import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
});

export const adminVerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});
